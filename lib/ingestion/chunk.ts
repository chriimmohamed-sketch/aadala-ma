/**
 * Pure article chunking for ingestion (no DB, no embeddings, no network).
 * Mirrors the retrieval notion (الفصل/المادة) without publishing anything —
 * approve/publish + embeddings need a real `legal_documents` table + pgvector + provider decision.
 */
export interface ArticleChunk {
  articleNumber?: string;
  content: string;
}

const ARTICLE_RE = /(?:المادة|الفصل|Article)\s+(\d+(?:[-\s]?\d*)?)/gi;

export function chunkByArticles(text: string): ArticleChunk[] {
  const clean = String(text ?? "").trim();
  if (clean.length <= 50) return [];
  const matches = [...clean.matchAll(ARTICLE_RE)];
  if (matches.length === 0) {
    return [{ content: clean.slice(0, 8000) }];
  }
  return matches.map((m, i) => {
    const start = m.index ?? 0;
    const end = matches[i + 1]?.index ?? clean.length;
    return {
      articleNumber: (m[1] ?? "").trim().replace(/\s+/g, " "),
      content: clean.slice(start, end).trim().slice(0, 8000),
    };
  });
}
