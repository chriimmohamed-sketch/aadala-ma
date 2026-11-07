export interface AICitation {
  sourceSlug: string;
  sourceTitle: string;
  excerpt: string;
  location?: string;
}

export interface AIAnswer {
  factsAssumed: string;
  legalIssue: string;
  legalBasis: string;
  analysis: string;
  possibleApplications: string;
  references: AICitation[];
  certainty: "high" | "medium" | "low" | "insufficient_sources";
  missingInfo: string[];
  disclaimer: string;
}