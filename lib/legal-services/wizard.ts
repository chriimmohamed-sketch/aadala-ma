import type { ProcedureInfo } from "./types";

export type PartyRole = "plaintiff" | "defendant" | "spouse" | "parent" | "other" | "";
export type EvidenceState = "yes" | "partial" | "no" | "";

export interface WizardAnswers {
  role: PartyRole;
  evidence: EvidenceState;
  hasChildren: boolean;
}

export interface Timeline {
  procedureId: string;
  title: string;
  authority: string;
  steps: string[];
  documents: string[];
  deadlines?: string;
  lastReviewed?: string;
  draftSubjectHint: string;
  draftFactsHint: string;
  note: string;
}

export const ROLE_LABELS: Record<Exclude<PartyRole, "">, string> = {
  plaintiff: "طالب (مدّعٍ)",
  defendant: "مدّعى عليه",
  spouse: "زوج/زوجة",
  parent: "أب/أم",
  other: "صفة أخرى",
};

export const EVIDENCE_LABELS: Record<Exclude<EvidenceState, "">, string> = {
  yes: "نعم، عندي سند/دليل",
  partial: "جزئيًا",
  no: "ليس لديّ سند",
};

/** Build a neutral timeline from the existing procedure entry — never invents deadlines or courts. */
export function buildTimeline(proc: ProcedureInfo, ans: WizardAnswers): Timeline {
  const role = ans.role ? ROLE_LABELS[ans.role] : "صفة غير محددة";
  const docs = [...proc.documents];
  if (ans.evidence === "no") docs.unshift("ملاحظة: لا تملك سندًا — أضف العقد/السند أو اعتمد على الشهادة/الخبرة إن وجدت");
  if (ans.evidence === "partial") docs.unshift("استكمال: أضف ما ينقص من السندات");
  return {
    procedureId: proc.id,
    title: proc.title,
    authority: proc.authority,
    steps: [...proc.stages],
    documents: docs,
    deadlines: proc.deadlines,
    lastReviewed: proc.lastReviewed,
    draftSubjectHint: `${proc.title} — ${role}`,
    draftFactsHint: `الصفة: ${role}. السند: ${ans.evidence ? EVIDENCE_LABELS[ans.evidence] : "غير محدد"}. الأطفال: ${ans.hasChildren ? "نعم" : "لا/غير واضح"}. راجع الخطوات والأجل مع مختص.`,
    note: "مسودة أولية قابلة للتعديل — لا تُعتمد دون مراجعة مختص.",
  };
}
