export interface LegalSource {
  slug: string;
  title: string;
  type: string;
  description: string;
  file: string;
}

export const legalSources: LegalSource[] = [
  { slug: "constitution-2011", title: "دستور المملكة المغربية (2011)", type: "دستور", description: "نص دستور 2011 مع الخطاب السامي وقرار المجلس الدستوري.", file: "/legal/constitution-2011.txt" },
  { slug: "obligations-contrats", title: "قانون الالتزامات والعقود (صيغة محينة)", type: "قانون", description: "صيغة محينة لقانون الالتزامات والعقود.", file: "/legal/obligations-contrats.txt" },
  { slug: "droits-reels-2025", title: "مدونة الحقوق العينية (صيغة موطدة 2025)", type: "مدونة", description: "صيغة موطدة (2025) لمدونة الحقوق العينية.", file: "/legal/droits-reels-2025.txt" },
  { slug: "droits-reels-2018", title: "مدونة الحقوق العينية (صيغة محينة 2018)", type: "مدونة", description: "صيغة محينة (2018).", file: "/legal/droits-reels-2018.txt" },
  { slug: "tahfidh-immobilier", title: "ظهير التحفيظ العقاري (كما وقع تغييره وتتميمه)", type: "ظهير", description: "ظهير التحفيظ العقاري.", file: "/legal/tahfidh-immobilier.txt" },
  { slug: "code-penal", title: "مجموعة القانون الجنائي (صيغة محينة)", type: "مجموعة", description: "مجموعة القانون الجنائي.", file: "/legal/code-penal.txt" },
  { slug: "bulletin-officiel-7437", title: "الجريدة الرسمية عدد 7437", type: "جريدة رسمية", description: "عدد من الجريدة الرسمية.", file: "/legal/bulletin-officiel-7437.txt" },
];
