export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://aadala-ma.cheraimmohamed20.workers.dev").replace(/\/$/, "");
export const siteName = "AADALA.MA";
export const siteDescription = "منصة العدالة والذكاء القانوني المغربي: النصوص القانونية، مساعد قانوني موثّق المصادر، وأدوات عملية.";

/** Public, indexable sections (path after the locale). */
export const publicRoutes = [
  "", "/legal", "/search", "/ai", "/miyar", "/property", "/case-law", "/procedures",
  "/criminal", "/academic", "/sharia", "/legal-aid", "/updates", "/founder", "/student", "/privacy", "/terms",
] as const;
