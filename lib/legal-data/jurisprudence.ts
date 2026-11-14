/**
 * AADALA.MA — jurisprudence (اجتهاد قضائي) layer.
 *
 * مقتطفات من قرارات محاكم تجارية مغربية، مستخرجة من PDF بعد تطبيق بوابة
 * جودة صارمة (scripts/ingest-jurisprudence.py). ليست نصوصًا قانونية ملزمة،
 * ولم تُراجع بشريًا: `verified: false` في كل مكان.
 *
 * الموضع […] داخل النص يعني أن المصدر نفسه تالف في تلك النقطة (خطأ خط/OCR)،
 * وليس حذفًا من المحرر.
 */

import type { LegalDocument, LegalArticle } from "./types";
import data from "@/data/jurisprudence.json";

export interface JurisprudenceDecision {
  id: string;
  sourceFile: string;
  court: string;
  date: string;
  caseNo: string;
  appealNo: string;
  topic: string;
  pages: number;
  wordsBefore: number;
  wordsAfter: number;
  sentencesDropped: number;
  elisions: number;
  text: string;
  chunks: string[];
  verified: false;
}

interface JurisprudenceFile {
  meta: {
    kind: string;
    verified: boolean;
    note: string;
    gate: Record<string, number | string>;
  };
  decisions: JurisprudenceDecision[];
  skipped: { file: string; reason: string }[];
}

const file = data as unknown as JurisprudenceFile;

export const JURISPRUDENCE_SLUG = "jurisprudence-commerciale";
export const JURISPRUDENCE_TITLE = "الاجتهاد القضائي التجاري (مقتطفات)";
export const JURISPRUDENCE_NOTE =
  "اجتهاد قضائي — مقتطفات من قرارات محاكم تجارية (2003–2012). ليست نصوصًا قانونية ملزمة، ولم تُراجع بشريًا. الموضع […] يعني أن المصدر تالف في تلك النقطة.";

export const JURISPRUDENCE_DECISIONS: JurisprudenceDecision[] = file.decisions;
export const JURISPRUDENCE_SKIPPED = file.skipped;
export const JURISPRUDENCE_GATE = file.meta.gate;

function decisionTitle(d: JurisprudenceDecision): string {
  const bits = [d.court, d.date];
  if (d.caseNo) bits.push(`ملف ${d.caseNo}`);
  return bits.join(" — ");
}

export const JURISPRUDENCE_DOCUMENT: LegalDocument = {
  metadata: {
    slug: JURISPRUDENCE_SLUG,
    title: JURISPRUDENCE_TITLE,
    type: "اجتهاد قضائي",
    lawNumber: null,
    promulgated: null,
    published: null,
    version: "مقتطفات 2003–2012 — بوابة جودة",
    status: "active",
    sha256: null,
    bytes: null,
    sourceNote: JURISPRUDENCE_NOTE,
    verified: false,
  },
  sections: [
    {
      id: "decisions",
      title: `القرارات (${JURISPRUDENCE_DECISIONS.length})`,
      articles: file.decisions.map(
        (d): LegalArticle => ({
          number: d.id,
          title: decisionTitle(d),
          officialText: d.text,
          keywords: [d.topic],
          note: d.elisions
            ? `مواضع غير مقروءة في المصدر: ${d.elisions}. الكلمات المقروءة: ${d.wordsAfter}.`
            : `الكلمات المقروءة: ${d.wordsAfter}.`,
        }),
      ),
    },
  ],
};
