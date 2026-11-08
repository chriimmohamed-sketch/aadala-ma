import { NextRequest, NextResponse } from "next/server";
import { getDocEngine } from "@/lib/documents/engine";

export async function GET(req: NextRequest) {
  const category = req.nextUrl.searchParams.get("category") || undefined;
  try {
    const data = await getDocEngine().getTemplates(category);
    return NextResponse.json({ data });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "error";
    const status = msg === "SUPABASE_NOT_CONFIGURED" ? 503 : 500;
    return NextResponse.json({ error: msg, hint: "طبّق 0003 في Supabase SQL Editor إن ظهر SUPABASE_NOT_CONFIGURED" }, { status });
  }
}
