export interface CourtDecision {
  id: string;
  court: string;
  chamber?: string;
  decisionNumber: string;
  fileNumber?: string;
  date: string; // ISO
  legalDomain: string;
  keywords: string[];
  relatedArticles: string[]; // e.g. "مدونة الأسرة - م 49"
  trend?: "تثبيت" | "نقض" | "إلغاء" | "تأييد" | "أخرى";
  facts?: string;
  issue?: string;
  reasoning?: string;
  holding?: string;
  extractedRule?: string;
  references?: { type: "text" | "decision" | "article"; ref: string }[];
  source: { type: "official_gazette" | "court_website" | "licensed" | "other"; ref: string; verifiedAt?: string };
  status: "draft" | "verified" | "published";
}

export interface DecisionSearchFilters {
  court?: string;
  chamber?: string;
  decisionNumber?: string;
  fileNumber?: string;
  dateFrom?: string;
  dateTo?: string;
  legalDomain?: string;
  keyword?: string;
  relatedArticle?: string;
  trend?: string;
}