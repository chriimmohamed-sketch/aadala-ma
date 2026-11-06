export type HeirType = "husband" | "wife" | "son" | "daughter" | "father" | "mother" | "grandfather" | "grandmother";

export interface Heir {
  type: HeirType;
  count: number;
}

export interface Estate {
  netValue: number; // after debts/wasiyya within 1/3
}

export interface ShareResult {
  type: HeirType;
  count: number;
  shareFraction: number; // of estate
  amount: number;
  role: "fard" | "asaba" | "radd" | "mahjub";
  note?: string;
}

export interface InheritanceResult {
  estate: Estate;
  shares: ShareResult[];
  totalFraction: number;
  remainder: number;
  warnings: string[];
}