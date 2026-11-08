import { NextRequest, NextResponse } from "next/server";

/**
 * Cron ingest is intentionally DISABLED by policy:
 * auto-fetching official sites (sgg.gov.ma, adala.justice.gov.ma, ...) requires
 * verified terms/robots/selectors that are not proven (all `verified: false` in
 * lib/ingestion/sources.ts). Manual ingestion via scripts/ingest-pdfs.mjs stays the only path.
 * This stub fails closed instead of silently crawling.
 */
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const auth = req.headers.get("authorization")?.replace("Bearer ", "") ?? "";
  if (!secret || auth !== secret) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  return NextResponse.json(
    { success: false, error: "CRON_CRAWL_DISABLED", hint: "Use scripts/ingest-pdfs.mjs (manual). See docs/INGESTION.md." },
    { status: 501 },
  );
}
