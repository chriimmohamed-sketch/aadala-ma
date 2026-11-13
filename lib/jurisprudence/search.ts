import type { CourtDecision, DecisionSearchFilters } from "./types";
import { courtDecisions } from "@/data/jurisprudence";

export function searchDecisions(filters: DecisionSearchFilters): CourtDecision[] {
  return courtDecisions.filter((d) => {
    if (filters.court && !d.court.includes(filters.court)) return false;
    if (filters.chamber && !d.chamber?.includes(filters.chamber)) return false;
    if (filters.decisionNumber && !d.decisionNumber.includes(filters.decisionNumber)) return false;
    if (filters.fileNumber && !d.fileNumber?.includes(filters.fileNumber)) return false;
    if (filters.legalDomain && !d.legalDomain.includes(filters.legalDomain)) return false;
    if (filters.keyword && !d.keywords.some((k) => k.includes(filters.keyword!)) && !d.facts?.includes(filters.keyword!)) return false;
    if (filters.relatedArticle && !d.relatedArticles.some((a) => a.includes(filters.relatedArticle!))) return false;
    if (filters.trend && d.trend !== filters.trend) return false;
    if (filters.dateFrom && d.date < filters.dateFrom) return false;
    if (filters.dateTo && d.date > filters.dateTo) return false;
    return true;
  });
}