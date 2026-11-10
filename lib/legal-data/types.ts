/**
 * AADALA.MA — Unified Legal Data Model (additive).
 *
 * كل نص قانوني يُمثَّل كـ `LegalDocument` (بيانات + هيكل)،
 * والمواد كـ `LegalArticle` (نص أصلي + metadata + سياق + مصادر).
 * النص الأصلي (official_text) لا يمر через AI — يُنقل كما هو.
 */

export type LegalStatus = "active" | "amended" | "abrogated" | "pending";

export interface LegalMetadata {
  slug: string;
  title: string;
  type: string; // دستور / قانون / مدونة / ظهير / مجموعة / ...
  lawNumber: string | null;
  promulgated: string | null; // تاريخ الظهير
  published: string | null; // الجريدة الرسمية
  version: string;
  status: LegalStatus;
  sha256: string | null;
  bytes: number | null;
  sourceNote: string;
  /** false until a human reviewer confirms metadata */
  verified: boolean;
}

export interface LegalArticle {
  /** رقم الفصل/المادة (كما في النص) */
  number: string;
  /** عنوان الفصل/المادة (إن وُجد) */
  title?: string;
  /** النص الأصلي — لا يُعاد كتابته */
  officialText: string;
  /** صفحة الوثيقة الأصلية (إن عُرفت) */
  sourcePage?: number | null;
  /** تعديلات (أرقام قوانين) */
  amendments?: string[];
  /** مواد مترابطة (أرقام) */
  relatedArticles?: string[];
  /** كلمات مفتاحية */
  keywords?: string[];
  /** ملاحظات/هوامش */
  note?: string;
}

export interface LegalBranch {
  id: string;
  title: string;
  articles?: LegalArticle[];
}

export interface LegalChapter {
  id: string;
  title: string;
  branches?: LegalBranch[];
  articles?: LegalArticle[];
}

export interface LegalSection {
  id: string;
  title: string;
  chapters?: LegalChapter[];
  articles?: LegalArticle[];
}

export interface LegalDocument {
  metadata: LegalMetadata;
  sections: LegalSection[];
  /** AI-generated explanation (separate from official text) */
  aiExplanation?: string;
}

/** Flatten all articles in document order (depth-first). */
export function flattenArticles(doc: LegalDocument): LegalArticle[] {
  const out: LegalArticle[] = [];
  for (const s of doc.sections) {
    if (s.articles) out.push(...s.articles);
    for (const c of s.chapters ?? []) {
      if (c.articles) out.push(...c.articles);
      for (const b of c.branches ?? []) {
        if (b.articles) out.push(...b.articles);
      }
    }
  }
  return out;
}

/** Find article by number (string match). */
export function findArticle(doc: LegalDocument, number: string): LegalArticle | undefined {
  return flattenArticles(doc).find((a) => a.number === number);
}

/** Previous/next article in document order. */
export function neighbors(doc: LegalDocument, number: string): { prev?: LegalArticle; next?: LegalArticle } {
  const flat = flattenArticles(doc);
  const idx = flat.findIndex((a) => a.number === number);
  if (idx < 0) return {};
  return { prev: flat[idx - 1], next: flat[idx + 1] };
}
