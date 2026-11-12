export type ProcedureDocType = "طلب" | "شكاية" | "إنذار" | "مراسلة" | "مذكرة" | "تصريح";

export interface ProcedureInfo {
  id: string;
  title: string;
  authority: string;
  stages: string[];
  documents: string[];
  deadlines?: string; // verified only
  fees?: string; // verified only
  remedies: string[];
  legalAid: string;
  sources: string[];
}

export interface DraftInput {
  docType: ProcedureDocType;
  partyName: string;
  subject: string;
  facts: string;
  request: string;
}