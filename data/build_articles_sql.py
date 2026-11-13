# -*- coding: utf-8 -*-
"""Generate Supabase SQL for extracted articles.

Creates:
  supabase/migrations/20261113000300_legal_articles_extracted.sql
  supabase/seed/articles_<doc-id>.sql        (one file per document)
  supabase/apply_articles.sql                 (migration + every seed)
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
ART = ROOT / "data" / "legal-sources" / "articles"
MIG = ROOT / "supabase" / "migrations" / "20261113000300_legal_articles_extracted.sql"
SEED = ROOT / "supabase" / "seed"
SEED.mkdir(parents=True, exist_ok=True)

MIGRATION = """-- 20261113000300_legal_articles_extracted.sql
-- Adds provenance/status metadata to extracted article text and exposes
-- machine-extracted articles for reference documents (clearly labelled in UI).

alter table if exists public.legal_articles
  add column if not exists status text not null default 'extracted',
  add column if not exists extraction_method text,
  add column if not exists confidence numeric(4,3),
  add column if not exists page_from integer,
  add column if not exists page_to integer,
  add column if not exists section text,
  add column if not exists language text not null default 'ar',
  add column if not exists updated_at timestamptz not null default now();

alter table if exists public.legal_articles
  drop constraint if exists legal_articles_status_check;
alter table if exists public.legal_articles
  add constraint legal_articles_status_check
  check (status in ('extracted', 'verified', 'archived'));

create index if not exists legal_articles_document_order_idx
  on public.legal_articles (document_id, order_index);
create index if not exists legal_articles_document_number_idx
  on public.legal_articles (document_id, article_number);

drop policy if exists legal_articles_public_read on public.legal_articles;
create policy legal_articles_public_read on public.legal_articles
for select using (
  status in ('extracted', 'verified')
  and exists (
    select 1 from public.legal_documents d
    where d.id = legal_articles.document_id
      and d.status in ('reference', 'published')
  )
);
"""


def sql_text(value):
    if value is None:
        return "null"
    return "$art$" + str(value).replace("$art$", "$ art $") + "$art$"


def seed_for(doc):
    did = doc["document_id"]
    arts = doc["articles"]
    lines = [
        f"-- Articles extracted from {doc['source_file']} ({doc['extraction_method']}).",
        "-- Machine extraction: NOT human-verified. See document.html disclaimer.",
        "begin;",
        f"delete from public.legal_articles where document_id = (select id from public.legal_documents where slug = {sql_text(did)}) and status = 'extracted';",
        "insert into public.legal_articles",
        "  (document_id, article_number, title, content, order_index, status,",
        "   extraction_method, confidence, page_from, page_to, section, language)",
        "select d.id, v.article_number, v.title, v.content, v.order_index, 'extracted',",
        "       v.extraction_method, v.confidence, v.page_from, v.page_to, v.section, 'ar'",
        "from public.legal_documents d",
        "cross join (values",
    ]
    rows = []
    for a in arts:
        title = f"{a.get('label') or 'المادة'} {a.get('article_number')}"
        rows.append(
            "  ("
            + ", ".join(
                [
                    sql_text(str(a["article_number"])),
                    sql_text(title),
                    sql_text(a["text"]),
                    str(a["order_index"]),
                    sql_text(doc["extraction_method"]),
                    str(round(float(a.get("confidence") or 0), 3)),
                    str(a.get("page_from") or 0),
                    str(a.get("page_to") or 0),
                    sql_text(a.get("section")),
                ]
            )
            + ")"
        )
    lines.append(",\n".join(rows))
    lines.append(
        ") as v(article_number, title, content, order_index, extraction_method, confidence, page_from, page_to, section)"
    )
    lines.append(f"where d.slug = {sql_text(did)};")
    lines.append(
        "update public.legal_documents set updated_at = now() where slug = " + sql_text(did) + ";"
    )
    lines.append("commit;")
    return "\n".join(lines) + "\n"


def main():
    MIG.write_text(MIGRATION, encoding="utf-8")
    manifest = json.loads((ART / "index.json").read_text(encoding="utf-8"))
    combined = [MIGRATION, "\n-- ===== Seeds =====\n"]
    for entry in manifest["documents"]:
        data = json.loads((ART / f"{entry['document_id']}.json").read_text(encoding="utf-8"))
        seed = seed_for(data)
        target = SEED / f"articles_{entry['document_id']}.sql"
        target.write_text(seed, encoding="utf-8")
        combined.append(f"\n-- Source: {entry['document_id']} ({entry['article_count']} articles)\n")
        combined.append(seed)
        print(f"{target.name:52s} {entry['article_count']:5d} articles  {len(seed)/1024:8.1f} KB")
    (ROOT / "supabase" / "apply_articles.sql").write_text("".join(combined), encoding="utf-8")
    print("migration:", MIG.name)


if __name__ == "__main__":
    main()
