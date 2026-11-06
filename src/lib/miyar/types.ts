export type HeirRelation =
  | "husband" | "wife" | "son" | "daughter" | "father" | "mother"
  | "grandfather" | "grandmother" | "brother" | "sister" | "nephew" | "uncle"
  | "grandson" | "granddaughter";

export interface HeirInput {
  id: string;
  relation: HeirRelation;
  gender: "male" | "female";
  count: number;
  alive: boolean;
  notes?: string;
}

export interface EstateInput {
  totalValue: number;
  debts: number;
  funeral: number;
  wasiyya: number; // within 1/3
  currency: string;
}

export interface FamilyNode {
  id: string;
  name: string;
  relation: HeirRelation;
  gender: "male" | "female";
  parentId?: string;
  children?: string[];
  deceased?: boolean;
}

export interface FamilyTree {
  root: string;
  nodes: Record<string, FamilyNode>;
}

export type ShareRole = "fard" | "asaba" | "radd" | "mahjub" | "wasiyya";

export interface ShareLine {
  heirId: string;
  relation: HeirRelation;
  count: number;
  fraction: number; // of net estate
  amount: number;
  role: ShareRole;
  note?: string;
}

export interface ComputationStep {
  order: number;
  title: string;
  description: string;
  result?: string;
}

export interface MiyarResult {
  estate: EstateInput;
  netEstate: number;
  heirs: HeirInput[];
  shares: ShareLine[];
  totalFraction: number;
  remainder: number;
  asl: number; // أصل المسألة
  sawahim: number; // سهام
  steps: ComputationStep[];
  warnings: string[];
  errors: string[];
  needsExpert: boolean;
  reportMarkdown: string;
}