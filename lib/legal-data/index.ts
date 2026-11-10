/**
 * AADALA.MA — Registry of structured legal documents.
 * كل قانون مُضاف هنا يُعرض عبر LegalArticleView + SourceCard + LegalTreeView.
 * القوانين غير المُضافة تُعرض عبر fallback (raw text) — لا حذف.
 */

import type { LegalDocument } from "./types";
import { TAHFIDH_DOCUMENT } from "./tahfidh";
import { OBLIGATIONS_DOCUMENT } from "./obligations";
import { PENAL_DOCUMENT } from "./penal";
import { REAL_RIGHTS_DOCUMENT } from "./real-rights";
import { FAMILY_DOCUMENT } from "./family";
import { COMMERCIAL_DOCUMENT } from "./commercial";
import { CIVIL_PROCEDURE_DOCUMENT } from "./civil-procedure";
import { CRIMINAL_PROCEDURE_DOCUMENT } from "./criminal-procedure";

export const STRUCTURED_DOCUMENTS: Record<string, LegalDocument> = {
  "tahfidh-immobilier": TAHFIDH_DOCUMENT,
  "obligations-contrats": OBLIGATIONS_DOCUMENT,
  "code-penal": PENAL_DOCUMENT,
  "droits-reels-2025": REAL_RIGHTS_DOCUMENT,
  "family-code": FAMILY_DOCUMENT,
  "commercial-code": COMMERCIAL_DOCUMENT,
  "civil-procedure": CIVIL_PROCEDURE_DOCUMENT,
  "criminal-procedure": CRIMINAL_PROCEDURE_DOCUMENT,
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
