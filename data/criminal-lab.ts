import type { CrimeTopic } from "@/lib/criminal-lab/types";

export const crimeTopics: CrimeTopic[] = [
  {
    id: "theft",
    title: "السرقة (مثال تعليمي)",
    category: "جنح",
    elements: { legal: "نص قانوني (يُتحقق)", material: "أخذ مال الغير", moral: "القصد الجنائي" },
    penalties: "عقوبة (يُتحقق من النص الساري)",
    defenses: ["إنكار", "مغفرة", "عدم توفر الركن"],
    sources: ["القانون الجنائي (مصدر موثق)"],
  },
  {
    id: "assault",
    title: "الضرب والجرح (مثال تعليمي)",
    category: "جنح",
    elements: { legal: "نص", material: "فعل مادي", moral: "قصد" },
    penalties: "عقوبة (يُتحقق)",
    defenses: [" legitimate defense", "absence of intent"],
    sources: ["القانون الجنائي"],
  },
];