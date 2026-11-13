/**
 * Source registry & ethical crawling rules (NO crawler — config only).
 *
 * DB row `sources` (0004) is the mutable record; this file is the code default.
 * ⚠️ Selectors / startUrls below are UNVERIFIED placeholders.
 *    Verify each selector in the browser against the live site before any crawl,
 *    and re-check terms/robots.txt — official sites may forbid automated fetching.
 *    The only sanctioned ingestion today is manual `scripts/ingest-pdfs.mjs`.
 */
export interface CrawlRules {
  /** Minimum delay between requests to same host (ms). */
  minDelayMs: number;
  /** Max concurrent requests to same host. */
  maxConcurrency: number;
  /** Respect robots.txt */
  respectRobotsTxt: boolean;
  /** Allowed URL patterns (regex) — empty = all */
  allowedPatterns?: RegExp[];
  /** Blocked URL patterns */
  blockedPatterns?: RegExp[];
  /** User-Agent identifier (public contact page, not a personal email). */
  userAgent: string;
  /** Shown in UA / abuse footer (site page, since no published email). */
  contactEmail: string;
}

export const CRAWL_RULES: CrawlRules = {
  minDelayMs: 2500,
  maxConcurrency: 1, // serially, per host
  respectRobotsTxt: true,
  allowedPatterns: [
    /\.(html?|pdf|xml)$/i,
    /\/(law|code|decret|loi|arret|decision|bulletin)\//i,
  ],
  blockedPatterns: [
    /\/(login|admin|register|wp-admin|private)\//i,
    /\.(zip|exe|docx?|xlsx?|pptx?|jpg|png|gif)$/i,
  ],
  userAgent: "AADALA-LegalBot/1.0 (+https://aadala-ma.cheraimmohamed20.workers.dev/)",
  contactEmail: "https://aadala-ma.cheraimmohamed20.workers.dev/privacy",
};

export interface OfficialSource {
  id: string;
  name: string;
  baseUrl: string;
  sourceType: "code" | "decree" | "law" | "constitution" | "case_law" | "circular";
  discovery: {
    startUrls: string[];
    linkSelector?: string;
    pdfLinkSelector?: string;
    paginationSelector?: string;
    maxPages?: number;
  };
  extraction: {
    titleSelector: string;
    contentSelector: string;
    dateSelector?: string;
    referenceSelector?: string;
    pdfTextExtraction?: boolean;
  };
  language: "ar" | "fr";
  legalNote: string;
  /** False until a human has verified selectors against the live site. */
  verified: boolean;
}

export const OFFICIAL_SOURCES: OfficialSource[] = [
  {
    id: "sgg",
    name: "الجريدة الرسمية — الأمانة العامة للحكومة",
    baseUrl: "https://www.sgg.gov.ma",
    sourceType: "law",
    language: "ar",
    discovery: {
      startUrls: ["https://www.sgg.gov.ma/BulletinOfficiel.aspx"],
      linkSelector: "a.bulletin-link",
      pdfLinkSelector: 'a[href$=".pdf"]',
      maxPages: 30,
    },
    extraction: {
      titleSelector: "h2.bulletin-title",
      contentSelector: "div.bulletin-content",
      dateSelector: "span.publication-date",
      referenceSelector: "span.bulletin-number",
      pdfTextExtraction: true,
    },
    legalNote: "الجريدة الرسمية وثيقة عمومية. يُستشهد بالمصدر دائماً مع رقم العدد وتاريخ النشر.",
    verified: false,
  },
  {
    id: "adala",
    name: "البوابة القانونية — وزارة العدل",
    baseUrl: "https://adala.justice.gov.ma",
    sourceType: "code",
    language: "ar",
    discovery: {
      startUrls: [
        "https://adala.justice.gov.ma/laws",
        "https://adala.justice.gov.ma/legislation",
      ],
      linkSelector: "a.law-link",
      maxPages: 100,
    },
    extraction: {
      titleSelector: "h1.law-title",
      contentSelector: "div.law-articles",
      dateSelector: "time.promulgation-date",
      referenceSelector: "span.dahir-number",
    },
    legalNote: "نصوص رسمية منشورة للعموم. التحقق من آخر تعديل إلزامي قبل النشر.",
    verified: false,
  },
  {
    id: "juriscassation",
    name: "الاجتهاد القضائي — محكمة النقض",
    baseUrl: "https://juriscassation.cspj.ma",
    sourceType: "case_law",
    language: "ar",
    discovery: {
      startUrls: ["https://juriscassation.cspj.ma/arrets"],
      linkSelector: "a.decision-link",
      paginationSelector: "a.next-page",
      maxPages: 50,
    },
    extraction: {
      titleSelector: "h1.case-title",
      contentSelector: "div.decision-body",
      dateSelector: "span.decision-date",
      referenceSelector: "span.case-number",
    },
    legalNote: "قرارات قضائية منشورة رسمياً. يُنشر ملخصها مع رقم الملف والغرفة.",
    verified: false,
  },
  {
    id: "cndp",
    name: "الهيئة الوطنية لحماية المعطيات الشخصية",
    baseUrl: "https://www.cndp.ma",
    sourceType: "circular",
    language: "ar",
    discovery: {
      startUrls: ["https://www.cndp.ma/documents"],
      linkSelector: "a.doc-link",
      maxPages: 20,
    },
    extraction: {
      titleSelector: "h1.title",
      contentSelector: "article.post",
      dateSelector: "time.published",
      pdfTextExtraction: true,
    },
    legalNote: "منشورات هيئة رسمية. الاستشهاد إلزامي.",
    verified: false,
  },
];
