/**
 * AADALA.MA — Registry of structured legal documents.
 * كل قانون مُضاف هنا يُعرض عبر LegalArticleView + SourceCard + LegalTreeView.
 * القوانين غير المُضافة تُعرض عبر fallback (raw text) — لا حذف.
 */

import type { LegalDocument, LegalArticle } from "./types";
import { TAHFIDH_DOCUMENT } from "./tahfidh";
import { OBLIGATIONS_DOCUMENT } from "./obligations";
import { PENAL_DOCUMENT } from "./penal";
import { REAL_RIGHTS_DOCUMENT } from "./real-rights";
import { FAMILY_DOCUMENT } from "./family";
import { COMMERCIAL_DOCUMENT } from "./commercial";
import { CIVIL_PROCEDURE_DOCUMENT } from "./civil-procedure";
import { CRIMINAL_PROCEDURE_DOCUMENT } from "./criminal-procedure";
import { LABOR_DOCUMENT } from "./labor";
import { flattenArticles } from "./types";

export const STRUCTURED_DOCUMENTS: Record<string, LegalDocument> = {
  "tahfidh-immobilier": TAHFIDH_DOCUMENT,
  "obligations-contrats": OBLIGATIONS_DOCUMENT,
  "code-penal": PENAL_DOCUMENT,
  "droits-reels-2025": REAL_RIGHTS_DOCUMENT,
  "family-code": FAMILY_DOCUMENT,
  "commercial-code": COMMERCIAL_DOCUMENT,
  "civil-procedure": CIVIL_PROCEDURE_DOCUMENT,
  "criminal-procedure": CRIMINAL_PROCEDURE_DOCUMENT,
  "labor-code": LABOR_DOCUMENT,
};

export function getStructuredDocument(slug: string): LegalDocument | undefined {
  return STRUCTURED_DOCUMENTS[slug];
}

export function isStructured(slug: string): boolean {
  return slug in STRUCTURED_DOCUMENTS;
}

export function structuredSlugs(): string[] {
  return Object.keys(STRUCTURED_DOCUMENTS);
}

/** Global search across all structured legal documents. */
export function globalSearch(query: string): { lawTitle: string; category: string; matches: LegalArticle[] }[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const results: { lawTitle: string; category: string; matches: LegalArticle[] }[] = [];
  for (const doc of Object.values(STRUCTURED_DOCUMENTS)) {
    const matches = flattenArticles(doc).filter(
      (a) =>
        a.officialText.toLowerCase().includes(q) ||
        String(a.number).includes(q) ||
        (a.title ?? "").toLowerCase().includes(q),
    );
    if (matches.length > 0) {
      results.push({
        lawTitle: doc.metadata.title,
        category: doc.metadata.type,
        matches,
      });
    }
  }
  return results;
}
