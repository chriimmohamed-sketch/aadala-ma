export type LegalDocType =
  | "constitution" | "organic_law" | "ordinary_law" | "decree" | "dahir"
  | "regulation" | "code" | "convention" | "other";

export type LegalDocStatus = "draft" | "in_review" | "approved" | "published" | "archived";

export interface LegalDocument {
  id: string;
  slug: string;
  officialTitle: string;
  docType: LegalDocType;
  number?: string; // e.g. "1.11.178" or "39.08"
  issueDate?: string; // ISO
  publicationDate?: string; // ISO
  publicationSource?: string; // e.g. "الجريدة الرسمية عدد X"
  effectiveDate?: string; // ISO
  status: LegalDocStatus;
  currentVersionId?: string;
  sourceUrl?: string;
  usageRights?: string;
  lastVerifiedAt?: string;
  verifiedBy?: string;
}

export interface LegalArticle {
  id: string;
  documentId: string;
  versionId: string;
  articleNumber: string; // "المادة 1" etc
  title?: string;
  content: string;
  orderIndex: number;
}

export interface LegalDocumentVersion {
  id: string;
  documentId: string;
  versionLabel: string; // "أصلية" | "محينة 2025"
  isOriginal: boolean;
  publishedAt?: string;
  notes?: string;
  sourceFile?: string;
  createdAt: string;
}

export interface LegalAmendment {
  id: string;
  documentId: string;
  amendingDocId?: string;
  amendedArticleIds: string[];
  summary: string;
  effectiveDate?: string;
  createdAt: string;
}

export interface LegalAbrogation {
  id: string;
  documentId: string;
  abrogatingDocId?: string;
  scope: "full" | "partial";
  affectedArticleIds?: string[];
  effectiveDate?: string;
  notes?: string;
}

export interface LegalSourceRecord {
  id: string;
  documentId?: string;
  sourceType: "pdf" | "url" | "official_gazette" | "book" | "other";
  sourceRef: string; // path/URL
  retrievedAt: string;
  retrievedBy?: string;
  checksum?: string;
  license?: string;
  notes?: string;
}

export interface ReviewRecord {
  id: string;
  entityType: "document" | "article" | "translation";
  entityId: string;
  reviewerId: string;
  action: "submitted" | "approved" | "rejected" | "changes_requested";
  comment?: string;
  createdAt: string;
}