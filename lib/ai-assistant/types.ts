export type CitationConfidence = "direct" | "inference" | "no_text";

export interface AICitation {
  sourceSlug: string;
  sourceTitle: string;
  excerpt: string;
  location?: string;
  score?: number;
  confidence?: CitationConfidence;
}

export interface AIAnswer {
  factsAssumed: string;
  legalIssue: string;
  legalBasis: string;
  analysis: string;
  possibleApplications: string;
  references: AICitation[];
  /** Nearest topics/sources when references is empty — suggested, never presented as found text. */
  suggestions: AICitation[];
  certainty: "high" | "medium" | "low" | "insufficient_sources";
  missingInfo: string[];
  disclaimer: string;
  textInterpretation: string;
  oldVsNewComparison: string;
  procedurePath: string[];
  documentList: string[];
  legalSummary: string;
  draftTemplate: string;
}

export function confidenceFor(score: number): CitationConfidence {
  if (score >= 1000 || score >= 6.5) return "direct";
  if (score > 0) return "inference";
  return "no_text";
}

export const CONFIDENCE_LABELS: Record<CitationConfidence, string> = {
  direct: "مصدر مباشر",
  inference: "استنتاج",
  no_text: "لا يوجد نص",
};