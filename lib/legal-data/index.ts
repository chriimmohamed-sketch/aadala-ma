/**
 * AADALA.MA — Registry of structured legal documents.
 * كل قانون مُضاف هنا يُعرض عبر LegalArticleView + SourceCard + LegalTreeView.
 * القوانين غير المُضافة تُعرض عبر fallback (raw text) — لا حذف.
 */

import type { LegalDocument } from "./types";
import { TAHFIDH_DOCUMENT } from "./tahfidh";
import { OBLIGATIONS_DOCUMENT } from "./obligations";

export const STRUCTURED_DOCUMENTS: Record<string, LegalDocument> = {
  "tahfidh-immobilier": TAHFIDH_DOCUMENT,
  "obligations-contrats": OBLIGATIONS_DOCUMENT,
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
