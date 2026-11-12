export type CrimeCategory = "جنح" | "جنايات" | "مخالفات" | "أخرى";

export interface CrimeTopic {
  id: string;
  title: string;
  category: CrimeCategory;
  elements: { legal: string; material: string; moral: string };
  penalties: string;
  defenses: string[];
  sources: string[];
}

export interface CriminalAnalysisInput {
  facts: string;
  parties: string;
  documents: string[];
}

export interface CriminalAnalysisReport {
  possibleQualifications: string[];
  elementsCheck: { element: string; present: "محتمل" | "غير محدد" | "غير موجود" }[];
  proceduralStage: string[];
  rights: string[];
  warnings: string[];
  disclaimer: string;
}