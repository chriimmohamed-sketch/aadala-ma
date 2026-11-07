export type PropertyType = "محفظ" | "غير محفظ" | "مشاع" | "وقف" | "أحباس" | "أخرى";
export type TitleSource = "رسم عقاري" | "عقد" | "إرث" | "حيازة" | "قرار إداري" | "أخرى";

export interface Party { id: string; name: string; role: string; }

export interface PropertyConflict {
  parties: Party[];
  propertyType: PropertyType;
  titleSource: TitleSource;
  titleRef?: string;
  facts: string;
  documents: string[];
  claims: string[];
  priorProceedings: string[];
}

export interface PropertyReport {
  parties: Party[];
  propertyType: PropertyType;
  titleSource: TitleSource;
  legalIssues: string[];
  possibleSources: string[];
  missingDocuments: string[];
  proceduralOptions: string[];
  warnings: string[];
  disclaimer: string;
}