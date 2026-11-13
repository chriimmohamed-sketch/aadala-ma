# -*- coding: utf-8 -*-
"""Build embeddings for extracted legal_articles (Phase 1 - BAA).

Reads per-document article JSON, builds embedding text per article
(title + content), calls the configured embedding provider in batches,
and writes JSONL rows for the user to load into Supabase `legal_articles.embedding`.

Idempotent: output file per document is fully rewritten on each run.

Env:
  EMBEDDING_PROVIDER  - "openai" (default) | "cohere" | "local"
  EMBEDDING_API_KEY   - provider key (never hardcode; set in env only)
  EMBEDDING_BASE_URL  - provider base URL (default openai: https://api.openai.com/v1)
  EMBEDDING_MODEL     - model id (default text-embedding-3-small / embed-english-v3.0...)
"""
import json
import os
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
ART = ROOT / "data" / "legal-sources" / "articles"
OUT = ART / "embeddings"

DEFAULTS = {
    "openai": {"model": "text-embedding-3-small", "dim": 1536},
    "cohere": {"model": "embed-english-v3.0", "dim": 1024},
}


def embed(texts, provider_cfg):
    if provider_cfg["provider"] == "openai":
        url = f"{provider_cfg.get('base_url') or 'https://api.openai.com/v1'}/embeddings"
        body = json.dumps({
            "model": provider_cfg["model"],
            "input": texts,
        }).encode("utf-8")
        req = urllib.request.Request(url, data=body, headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {os.environ.get('EMBEDDING_API_KEY', '')}",
        }, method="POST")
        with urllib.request.urlopen(req, timeout=60) as r:
            data = json.loads(r.read().decode("utf-8"))
        return [d["embedding"] for d in data["data"]]
    if provider_cfg["provider"] == "cohere":
        url = f"{provider_cfg.get('base_url') or 'https://api.cohere.com/v2'}/embeddings"
        body = json.dumps({
            "model": provider_cfg["model"],
            "texts": texts,
            "input_type": "search_query",
        }).encode("utf-8")
        req = urllib.request.Request(url, data=body, headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {os.environ.get('EMBEDDING_API_KEY', '')}",
        }, method="POST")
        with urllib.request.urlopen(req, timeout=60) as r:
            data = json.loads(r.read().decode("utf-8"))
        return [d["embedding"] for d in data["embeddings"]]
    raise ValueError(f"unsupported embedding provider: {provider_cfg['provider']}")


def main():
    provider = os.environ.get("EMBEDDING_PROVIDER", "openai")
    cfg = {"provider": provider, "model": os.environ.get("EMBEDDING_MODEL") or DEFAULTS.get(provider, {}).get("model"), "base_url": os.environ.get("EMBEDDING_BASE_URL")}
    OUT.mkdir(parents=True, exist_ok=True)
    manifest = json.loads((ART / "index.json").read_text(encoding="utf-8"))
    for entry in manifest["documents"]:
        did = entry["document_id"]
        data = json.loads((ART / f"{did}.json").read_text(encoding="utf-8"))
        rows = []
        texts = []
        for a in data.get("articles") or []:
            content = (a.get("title") or "") + " " + (a.get("text") or "")
            if not content.strip():
                continue
            texts.append(content)
            rows.append({
                "document_id": did,
                "article_number": str(a.get("article_number") or ""),
                "title": a.get("title") or "",
                "content": a.get("text") or "",
                "order_index": int(a.get("order_index") or 0),
                "extraction_method": data.get("extraction_method") or "",
                "confidence": float(a.get("confidence") or 0),
                "embedding": None,
            })
        if not texts:
            print(f"{did}: no texts")
            continue
        # batch embed
        vectors = []
        B = 25
        for i in range(0, len(texts), B):
            batch = texts[i:i + B]
            vectors.extend(embed(batch, cfg))
        for r, v in zip(rows, vectors):
            r["embedding"] = v
        out = OUT / f"embeddings_{did}.jsonl"
        with out.open("w", encoding="utf-8") as f:
            for r in rows:
                f.write(json.dumps(r, ensure_ascii=False) + "\n")
        print(f"{did}: {len(rows)} articles -> {out.name}")


if __name__ == "__main__":
    main()
