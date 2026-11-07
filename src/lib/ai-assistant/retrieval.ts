import index from "@/data/legal-index.json";
import { legalSources } from "@/data/legal-sources";

export interface RetrievedChunk { slug: string; title: string; excerpt: string; score: number; location?: string }

const titles = new Map(legalSources.map((s) => [s.slug, s.title]));

export function normalize(s: string): string {
  return s
    .replace(/[\u064B-\u065F\u0670\u0640]/g, "") // diacritics + tatweel
    .replace(/[إأآٱ]/g, "ا").replace(/ى/g, "ي").replace(/ة/g, "ه")
    .toLowerCase();
}

export function tokenize(s: string): string[] {
  return normalize(s)
    .split(/[^a-z\u0621-\u064A]+/)
    .map((t) => (t.length > 4 && t.startsWith("ال") ? t.slice(2) : t))
    .filter((t) => t.length > 2);
}

type Raw = { s: string; x: string; l?: string; n?: number };
type Entry = { slug: string; excerpt: string; location?: string; n?: number; tokens: Set<string> };
let entries: Entry[] | null = null;
let df: Map<string, number> | null = null;

function load() {
  if (entries && df) return;
  entries = (index as Raw[]).map((c) => ({ slug: c.s, excerpt: c.x, location: c.l, n: c.n, tokens: new Set(tokenize(c.x)) }));
  df = new Map();
  for (const e of entries) for (const t of e.tokens) df.set(t, (df.get(t) ?? 0) + 1);
}

const toChunk = (e: Entry, score: number): RetrievedChunk => ({ slug: e.slug, title: titles.get(e.slug) ?? e.slug, excerpt: e.excerpt, score, location: e.location });

/** Exact article lookups: "الفصل 230" / "المادة 12" (the article word is interchangeable; matches every source that has that number). */
export function lookupArticles(question: string, max = 4): RetrievedChunk[] {
  load();
  const nums = [...new Set([...question.matchAll(/(?:الفصل|المادة|فصل|مادة)\s*(\d{1,4})(?!\d)/g)].map((m) => Number(m[1])))];
  if (!nums.length) return [];
  const out: RetrievedChunk[] = [];
  for (const n of nums) for (const e of entries!) if (e.location && e.n === n) out.push(toChunk(e, 1000));
  return out.slice(0, max);
}

export function retrieve(question: string, topK = 5): RetrievedChunk[] {
  load();
  const q = [...new Set(tokenize(question))];
  const n = entries!.length;
  const out: RetrievedChunk[] = [];
  for (const e of entries!) {
    let score = 0;
    for (const t of q) if (e.tokens.has(t)) score += Math.log(1 + n / (df!.get(t) ?? 1));
    if (score > 0) out.push(toChunk(e, score));
  }
  return out.sort((a, b) => b.score - a.score).slice(0, topK);
}

/** Exact article lookups first, then ranked search, de-duplicated. */
export function retrieveWithRefs(question: string, topK = 6): RetrievedChunk[] {
  const seen = new Set<string>();
  const key = (c: RetrievedChunk) => `${c.slug}|${c.location ?? c.excerpt.slice(0, 40)}`;
  return [...lookupArticles(question), ...retrieve(question, topK)].filter((c) => !seen.has(key(c)) && seen.add(key(c))).slice(0, topK);
}

/** Article numbers the answer cites that were NOT in the retrieved context (possible hallucination). */
export function unverifiedCitations(answerText: string, chunks: RetrievedChunk[]): string[] {
  const allowed = new Set(chunks.map((c) => c.location?.match(/\d+/)?.[0]).filter(Boolean) as string[]);
  const cited = [...answerText.matchAll(/(?:الفصل|المادة|فصل|مادة)\s*(\d{1,4})(?!\d)/g)].map((m) => m[1]);
  return [...new Set(cited.filter((n) => !allowed.has(n)))];
}
