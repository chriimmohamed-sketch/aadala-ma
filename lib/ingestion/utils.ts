/**
 * Pure ingestion helpers (no network, no DB) — safe subset of the pasted crawler.
 * - hashContent: dedupe key (SHA-256 hex)
 * - extractLinks: same-origin hrefs from HTML
 * - parseRobotsDisallow: robots.txt Disallow lines → path prefixes
 * - isPathAllowed: combines robots + CRAWL_RULES patterns
 *
 * Deliberately NOT included: fetch/robots-download/throttle/retry/crawl —
 * auto-fetching official sites (sgg.gov.ma, ...) requires verified terms + selectors
 * and a Node runtime (Workers edge lacks pdf-parse/Buffer). Manual ingestion stays the only path.
 */
import { createHash } from "node:crypto";

export function hashContent(text: string): string {
  return createHash("sha256").update(text).digest("hex");
}

export function extractLinks(html: string, origin: string): string[] {
  const rx = /href=["']([^"']+)["']/gi;
  const out: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = rx.exec(html))) {
    try {
      const abs = new URL(m[1], origin).toString();
      if (abs.startsWith(origin)) out.push(abs);
    } catch {
      /* ignore invalid */
    }
  }
  return [...new Set(out)];
}

export function parseRobotsDisallow(body: string): string[] {
  const out: string[] = [];
  for (const line of body.split("\n")) {
    const l = line.trim();
    if (/^disallow:/i.test(l)) {
      const p = l.split(":")[1]?.trim();
      if (p && p !== "/") out.push(p);
      else if (p === "/") out.push("/");
    }
  }
  return out;
}

export function isPathAllowed(pathname: string, disallowedPrefixes: string[]): boolean {
  return !disallowedPrefixes.some((p) => pathname.startsWith(p));
}
