export type HeirRelation =
  | "husband" | "wife" | "son" | "daughter" | "father" | "mother"
  | "grandfather" | "grandmother" | "brother" | "sister" | "nephew" | "uncle"
  | "grandson" | "granddaughter"
  | "full_brother" | "full_sister" | "paternal_brother" | "paternal_sister" | "maternal_brother" | "maternal_sister";

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
  /** Confirms no uncles / nephews / other agnates exist; required before any undistributed remainder is returned (radd). */
  noOtherRelatives?: boolean;
  /** Include spouses in radd (disputed; default false). */
  raddIncludesSpouse?: boolean;
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
  fractionText?: string; // of the distributable estate, e.g. "1/4"
  sahm?: number; // shares out of asl
  perHeirAmount?: number;
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