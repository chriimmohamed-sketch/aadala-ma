import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n/config";
import { legalSources } from "@/data/legal-sources";
import { publicRoutes, siteUrl } from "@/lib/site/config";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const paths = [...publicRoutes, ...legalSources.map((s) => `/legal/${s.slug}`)];
  return locales.flatMap((locale) =>
    paths.map((p) => ({
      url: `${siteUrl}/${locale}${p}`,
      lastModified: now,
      changeFrequency: p === "" ? ("weekly" as const) : ("monthly" as const),
      priority: p === "" ? 1 : p.startsWith("/legal/") ? 0.8 : 0.6,
      alternates: { languages: Object.fromEntries(locales.map((l) => [l, `${siteUrl}/${l}${p}`])) },
    })),
  );
}
