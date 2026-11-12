import index from "@/data/legal-index.json";
import { legalSources } from "@/data/legal-sources";
import { STRUCTURED_DOCUMENTS } from "@/lib/legal-data";
import { flattenArticles } from "@/lib/legal-data/types";
import { JURISPRUDENCE_DECISIONS, JURISPRUDENCE_SLUG, JURISPRUDENCE_TITLE } from "@/lib/legal-data/jurisprudence";

export interface RetrievedChunk {
  slug: string;
  title: string;
  excerpt: string;
  score: number;
  location?: string;
  /** false = source text is not human-reviewed yet (shown as "قيد المراجعة"). */
  verified?: boolean;
  /** "statute" (نص قانوني) or "jurisprudence" (اجتهاد قضائي — غير ملزم). */
  kind?: "statute" | "jurisprudence";
}

const titles = new Map(legalSources.map((s) => [s.slug, s.title]));

/** Arabic normalisation: diacritics, tatweel, alef/ya/ta-marbuta/hamza variants. */
export function normalize(s: string): string {
  return s
    .replace(/[\u064B-\u065F\u0670\u0640]/g, "") // diacritics + tatweel
    .replace(/[إأآٱ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ئ/g, "ي")
    .replace(/ؤ/g, "و")
    .replace(/ة/g, "ه")
    .toLowerCase();
}

/**
 * Function words kept out of the index: they make unrelated texts look related,
 * which is how a divorce question used to retrieve the constitution.
 * "المغرب" is jurisdiction, not subject matter, so it is filtered too.
 */
const STOPWORDS = new Set(
  [
    "من","في","على","عن","الى","إلى","ما","هي","هو","هل","ان","أن","إن","اذا","إذا",
    "كان","كانت","يكون","تكون","هذا","هذه","ذلك","تلك","التي","الذي","الذين",
    "مع","او","أو","ثم","قد","كل","بعض","بعد","قبل","بين","حيث","كما","لكن",
    "لم","لن","ليس","عند","عندما","حتى","اي","أي","كيف","متى","اين","أين","لماذا",
    "كم","أيضا","ايضا","هناك","هنا","فيه","فيها","منه","منها","له","لها","به","بها",
    "انها","أنها","انه","أنه","يا","حول","دون","غير","سوى","بشان","بشأن","ماذا",
    "انواع","أنواع","نوع","مغرب","المغرب","مغربية","المغربية","قانون","القانون",
    "the","and","for","with","from","that","this","what","how","legal","law","are","is",
  ].map((w) => normalize(w).replace(/^ال/, "")),
);

/**
 * Strips Arabic conjunction/preposition clitics (و ف ب ك ل) and the article,
 * so "بالاستئناف" and "الاستئناف" both resolve to "استئناف".
 */
function canon(raw: string): string {
  let n = normalize(raw);
  if (n.length > 4 && n.startsWith("لل")) n = "ال" + n.slice(2); // للمحكمة → المحكمة
  else if (n.length > 4 && "وفبكل".includes(n[0]) && n.slice(1).startsWith("ال")) n = n.slice(1);
  // Bare conjunction و/ف: "وشروطها" → "شروطها".
  if (n.length > 4 && (n[0] === "و" || n[0] === "ف") && !n.slice(1).startsWith("ا")) n = n.slice(1);
  if (n.length > 4 && n.startsWith("ال")) n = n.slice(2);
  return n;
}

const SUFFIXES = ["هما", "هم", "ها", "ات", "ون", "ين", "ي", "ه"];
function stripSuffix(t: string): string | null {
  for (const suf of SUFFIXES) {
    if (t.length - suf.length >= 3 && t.endsWith(suf)) return t.slice(0, -suf.length);
  }
  return null;
}

/**
 * Retrieval aid only — never used to assert law. It lets a question phrased with
 * one legal register find the text written in another (الطلاق/التطليق,
 * مدة/أجل). Every mapping is reported in docs/GENESIS/05_EXECUTION_LOG.md.
 */
const SYNONYMS: Record<string, string[]> = {
  طلاق: ["تطليق"],
  تطليق: ["طلاق"],
  مده: ["اجل"],
  اجل: ["مده"],
  كراء: ["ايجار"],
  ايجار: ["كراء"],
};

/** Canonical tokens of a question; each token may expand to variants for matching. */
export function tokenize(s: string): string[] {
  return [
    ...new Set(
      normalize(s)
        .split(/[^a-z\u0621-\u064A]+/)
        .map(canon)
        .filter((t) => t.length > 2 && !STOPWORDS.has(t)),
    ),
  ];
}

function variants(t: string): Set<string> {
  const out = new Set<string>([t]);
  const stripped = stripSuffix(t);
  if (stripped) out.add(stripped);
  for (const syn of SYNONYMS[t] ?? []) out.add(syn);
  return out;
}

type Raw = { s: string; x: string; l?: string; n?: number };
type Entry = {
  slug: string;
  title: string;
  excerpt: string;
  location?: string;
  n?: number;
  verified?: boolean;
  kind?: "statute" | "jurisprudence";
  tokens: Set<string>;
};

let entries: Entry[] | null = null;
let df: Map<string, number> | null = null;

const CONTROL = /[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g;

/** Strips PDF control bytes and collapses whitespace — never rewrites legal wording. */
function clean(text: string): string {
  return text.replace(CONTROL, " ").replace(/\s+/g, " ").trim();
}

/** Rejects chunks whose letters are mostly Latin: those are broken PDF/OCR extractions. */
function isUsableArabic(text: string): boolean {
  const arabic = (text.match(/[\u0621-\u064A]/g) ?? []).length;
  const latin = (text.match(/[A-Za-z\u00C0-\u00FF]/g) ?? []).length;
  if (arabic + latin < 20) return false;
  return arabic / (arabic + latin) >= 0.55;
}

function tokenSet(text: string): Set<string> {
  const out = new Set<string>();
  for (const t of normalize(text).split(/[^a-z\u0621-\u064A]+/)) {
    const c = canon(t);
    if (c.length <= 2 || STOPWORDS.has(c)) continue;
    for (const v of variants(c)) out.add(v);
  }
  return out;
}

function load() {
  if (entries && df) return;
  const list: Entry[] = [];
  const seen = new Set<string>();

  const push = (e: Entry) => {
    const key = `${e.slug}|${normalize(e.excerpt).slice(0, 180)}`;
    if (seen.has(key)) return;
    seen.add(key);
    list.push(e);
  };

  // 1) Extracted full texts (data/legal-index.json) — cleaned, unusable chunks dropped.
  for (const c of index as Raw[]) {
    const excerpt = clean(c.x ?? "");
    if (!excerpt || !isUsableArabic(excerpt)) continue;
    push({
      slug: c.s,
      title: titles.get(c.s) ?? c.s,
      excerpt,
      location: c.l,
      n: c.n,
      tokens: tokenSet(excerpt),
      kind: "statute",
    });
  }

  // 2) Structured articles (lib/legal-data) — covers family, commercial, labour
  //    and both procedure codes, which the extracted index does not include.
  //    Additive: the JSON index is left untouched.
  for (const doc of Object.values(STRUCTURED_DOCUMENTS)) {
    const meta = doc.metadata;
    if (meta.slug === JURISPRUDENCE_SLUG) continue; // handled below with its own labels
    for (const art of flattenArticles(doc)) {
      const excerpt = clean([art.title, art.officialText].filter(Boolean).join(". "));
      if (excerpt.length < 20) continue;
      push({
        slug: meta.slug,
        title: meta.title,
        excerpt,
        location: `المادة ${art.number}`,
        n: Number(art.number) || undefined,
        verified: meta.verified,
        kind: "statute",
        tokens: tokenSet(excerpt),
      });
    }
  }

  // 3) Jurisprudence (data/jurisprudence.json) — separate layer, never presented
  //    as binding statute. Every chunk stays verified:false and is retrieved by
  //    its own resolved text, so damaged passages were already removed upstream.
  for (const decision of JURISPRUDENCE_DECISIONS) {
    const meta = [decision.court, decision.date, decision.caseNo && `ملف ${decision.caseNo}`, decision.topic]
      .filter(Boolean)
      .join(" — ");
    for (const chunk of decision.chunks) {
      const excerpt = clean(chunk);
      if (excerpt.length < 40) continue;
      push({
        slug: JURISPRUDENCE_SLUG,
        title: JURISPRUDENCE_TITLE,
        excerpt,
        location: `القرار ${decision.id} — ${meta}`,
        verified: false,
        kind: "jurisprudence",
        tokens: tokenSet(excerpt),
      });
    }
  }

  entries = list;
  df = new Map<string, number>();
  for (const e of entries) for (const t of e.tokens) df.set(t, (df.get(t) ?? 0) + 1);
}

const toChunk = (e: Entry, score: number): RetrievedChunk => ({
  slug: e.slug,
  title: e.title,
  excerpt: e.excerpt,
  score,
  location: e.location,
  verified: e.verified,
  kind: e.kind,
});

/** Exact article lookups: "الفصل 230" / "المادة 12" (the article word is interchangeable). */
export function lookupArticles(question: string, max = 4): RetrievedChunk[] {
  load();
  const nums = [...new Set([...question.matchAll(/(?:الفصل|المادة|فصل|مادة)\s*(\d{1,4})(?!\d)/g)].map((m) => Number(m[1])))];
  if (!nums.length) return [];
  const out: RetrievedChunk[] = [];
  for (const n of nums) {
    let hits = 0;
    for (const e of entries!) {
      if (e.n !== n) continue;
      out.push(toChunk(e, 1000));
      if (++hits >= max) break;
    }
  }
  return out;
}

type Query = {
  weights: Map<string, number>;
  total: number;
  variantsOf: Map<string, Set<string>>;
  distinctive: Set<string>;
  /** Rarest term — it names the subject matter of the question. */
  topToken: string | null;
};

/**
 * IDF weight per canonical question token. A token is "distinctive" when it is
 * rare in the corpus: those carry the legal subject matter, not the framing.
 */
function analyseQuery(question: string): Query {
  load();
  const n = entries!.length;
  const weights = new Map<string, number>();
  const variantsOf = new Map<string, Set<string>>();
  const distinctive = new Set<string>();
  const rare = Math.max(3, Math.floor(n * 0.05));
  for (const t of tokenize(question)) {
    const v = variants(t);
    variantsOf.set(t, v);
    let lowest = Infinity;
    for (const x of v) lowest = Math.min(lowest, df!.get(x) ?? 1);
    weights.set(t, Math.log(1 + n / Math.max(1, lowest)));
    if (lowest <= rare) distinctive.add(t);
  }
  let total = 0;
  let topToken: string | null = null;
  let topWeight = -1;
  for (const [t, w] of weights) {
    total += w;
    if (w > topWeight) {
      topWeight = w;
      topToken = t;
    }
  }
  return { weights, total, variantsOf, distinctive, topToken };
}

/** Minimum share of the question's IDF-weighted meaning a passage must contain. */
const MIN_COVERAGE = 0.4;
/** When no distinctive term exists, require a stronger overall overlap. */
const MIN_COVERAGE_COMMON = 0.6;

/**
 * Ranked retrieval. A passage is returned only when it covers at least
 * MIN_COVERAGE of the question AND matches a distinctive (rare) term —
 * so a single generic word can no longer pull in an unrelated law.
 */
/**
 * الاجتهاد القضائي مكمل لا بديل: إذا وجد نص قانوني مطابق، يتقدّمه في القائمة،
 * ولا يُدرج من قرارات المحاكم إلا ما بقي من المواضع. هكذا لا يطغى حكم
 * محكمةٍ على المادة التشريعية في جواب المستخدم.
 */
function blend(ranked: RetrievedChunk[], topK: number): RetrievedChunk[] {
  const statutes = ranked.filter((c) => c.kind !== "jurisprudence");
  const juris = ranked.filter((c) => c.kind === "jurisprudence");
  if (!statutes.length || !juris.length) return ranked.slice(0, topK);
  const out = statutes.slice(0, Math.max(1, topK - 1));
  for (const c of juris) {
    if (out.length >= topK) break;
    out.push(c);
  }
  return out;
}

export function retrieve(question: string, topK = 5): RetrievedChunk[] {
  load();
  const { weights, total, variantsOf, distinctive, topToken } = analyseQuery(question);
  if (!weights.size || total <= 0) return [];
  const threshold = distinctive.size ? MIN_COVERAGE : MIN_COVERAGE_COMMON;
  const scored: { chunk: RetrievedChunk; coverage: number }[] = [];
  for (const e of entries!) {
    let matched = 0;
    let anchor = false;
    let topHit = false;
    for (const [t, w] of weights) {
      let hit = false;
      for (const v of variantsOf.get(t)!) if (e.tokens.has(v)) { hit = true; break; }
      if (!hit) continue;
      matched += w;
      if (distinctive.has(t)) anchor = true;
      if (t === topToken) topHit = true;
    }
    if (matched <= 0) continue;
    const coverage = matched / total;
    if (coverage < threshold) continue;
    if (distinctive.size && !anchor) continue;
    // The subject term must be present in the passage (or coverage must be clearly dominant);
    // otherwise a shared generic word would pull in a different branch of law.
    if (!topHit && coverage < 0.55) continue;
    scored.push({ chunk: toChunk(e, matched), coverage });
  }
  const ranked = scored
    .sort((a, b) => b.chunk.score - a.chunk.score || b.coverage - a.coverage)
    .map((x) => x.chunk);
  return blend(ranked, topK);
}

export function retrieveWithRefs(question: string, topK = 6): RetrievedChunk[] {
  const seen = new Set<string>();
  const key = (c: RetrievedChunk) => `${c.slug}|${normalize(c.excerpt).slice(0, 180)}`;
  return [...lookupArticles(question), ...retrieve(question, topK)]
    .filter((c) => !seen.has(key(c)) && seen.add(key(c)))
    .slice(0, topK);
}

/**
 * How well the retrieved passages actually cover the question.
 * RAG-only answers are never "high": the underlying text is not human-verified.
 */
export function retrievalQuality(
  question: string,
  chunks: RetrievedChunk[],
): "high" | "medium" | "low" | "insufficient_sources" {
  if (!chunks.length) return "insufficient_sources";
  const { variantsOf } = analyseQuery(question);
  const questionTokens = tokenize(question);
  if (!questionTokens.length) return "low";
  const top = chunks[0];
  // Verbatim article hit, not a guess.
  if (top.score >= 1000) return "medium";
  // الاجتهاد القضائي: نص تالف جزئيًا وغير مُراجع — لا يرتفع اليقين عن "منخفض"
  // مهما بدا التطابق قويًا.
  if (top.kind === "jurisprudence") return "low";
  // Unweighted recall of the question's terms, deliberately not IDF-weighted:
  // adding texts to the corpus shifts IDF and would otherwise inflate the
  // relevance score of an unchanged, weak match.
  const topTokens = tokenSet(top.excerpt);
  let matched = 0;
  for (const t of questionTokens) {
    const variants = variantsOf.get(t) ?? new Set([t]);
    for (const v of variants) {
      if (topTokens.has(v)) {
        matched++;
        break;
      }
    }
  }
  const coverage = matched / questionTokens.length;
  if (coverage >= 0.75 && chunks.length >= 2) return "high";
  if (coverage >= 0.55) return "medium";
  return "low";
}

/**
 * Article numbers the answer cites that are not present in the retrieved sources.
 * Numbers inside a retrieved passage count as present: that passage is the source.
 */
export function unverifiedCitations(answerText: string, chunks: RetrievedChunk[]): string[] {
  const allowed = new Set<string>();
  for (const c of chunks) {
    const loc = c.location?.match(/\d+/)?.[0];
    if (loc) allowed.add(loc);
    for (const m of c.excerpt.matchAll(/(?:الفصل|المادة|فصل|مادة)\s*(\d{1,4})(?!\d)/g)) allowed.add(m[1]);
  }
  const cited = [...answerText.matchAll(/(?:الفصل|المادة|فصل|مادة)\s*(\d{1,4})(?!\d)/g)].map((m) => m[1]);
  return [...new Set(cited.filter((n) => !allowed.has(n)))];
}

/**
 * Nearest topics when retrieval finds nothing (P0-2: never hallucinate text).
 * Ranks sources by title/description overlap; returns source cards with description
 * as excerpt and confidence "no_text" so the UI can present them as suggestions.
 */
export function suggestNearest(question: string, topK = 3): RetrievedChunk[] {
  const q = new Set(tokenize(question));
  const scored = legalSources.map((s) => {
    const toks = new Set(tokenize(`${s.title} ${s.type} ${s.description}`));
    let score = 0;
    for (const t of q) if (toks.has(t)) score += 1;
    return { s, score };
  });
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, topK).map(({ s, score }) => ({
    slug: s.slug,
    title: s.title,
    excerpt: s.description,
    score,
    location: s.type,
  }));
}
