import { NextResponse } from "next/server"
import { retrieveWithRefs, unverifiedCitations, type RetrievedChunk } from "@/lib/ai-assistant/retrieval"
import { callProvider, embed } from "@/lib/ai-assistant/provider"
import type { AIAnswer } from "@/lib/ai-assistant/types"
import { clientIp, rateLimit } from "@/lib/security/rate-limit"
import { locales } from "@/lib/i18n/config"
import { getSupabaseClient } from "@/lib/supabase/client"

function getCorsOrigin(origin: string): string {
  const defaultOrigin = 'https://aadala-ma.cheraimmohamed20.workers.dev'
  if (!origin) return defaultOrigin
  const allowedOrigins = [
    'https://aadala-ma.cheraimmohamed20.workers.dev',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
  ]
  return allowedOrigins.includes(origin) ? origin : defaultOrigin
}

export async function POST(req: Request) {
  const originHeader = req.headers.get('origin')
  const corsOrigin = getCorsOrigin(originHeader as string)

  const rl = rateLimit(`ai:${clientIp(req)}`, 8, 60_000)
  if (!rl.ok) return NextResponse.json({ error: "too many requests" }, { 
    status: 429, 
    headers: { 
      "Retry-After": String(rl.retryAfter),
      "Access-Control-Allow-Origin": corsOrigin,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization"
    } 
  })
  if (Number(req.headers.get("content-length") ?? 0) > 8_192) return NextResponse.json({ error: "payload too large" }, { status: 413, headers: { "Access-Control-Allow-Origin": corsOrigin } })
  const body = await req.json().catch(() => ({}))
  const question = String(body?.question ?? "").trim().slice(0, 2000)
  const reqLocale = String(body?.locale ?? "ar")
  const locale = (locales as readonly string[]).includes(reqLocale) ? reqLocale : "ar"
  if (!question) return NextResponse.json({ error: "question required" }, { status: 400, headers: { "Access-Control-Allow-Origin": corsOrigin } })

  const chunks = retrieveWithRefs(question, 6)

  // Phase 1 (BAA): pgvector similarity search when embeddings + function are available.
  const useVector = process.env.AI_VECTOR_SEARCH === "1"
  let contextChunks: RetrievedChunk[] = chunks
  if (useVector) {
    try {
      const supabase = getSupabaseClient()
      const qVec = await embed(question)
      if (supabase && qVec) {
        const { data: vecRows, error: vecErr } = await supabase.rpc("match_legal_articles", {
          query_embedding: qVec,
          match_count: 6,
          filter_document_id: null,
        })
        if (!vecErr && Array.isArray(vecRows) && vecRows.length) {
          contextChunks = []
          for (const r of vecRows as Array<Record<string, unknown>>) {
            const docId: string = String(r.document_id ?? "")
            const artNum: string = String(r.article_number ?? "")
            const content: string = r.content !== null && r.content !== undefined ? String(r.content) : ""
            const excerpt: string = artNum != null ? artNum + " -- " + content : content
            contextChunks.push({
              slug: docId,
              title: artNum != null ? artNum : "المادة",
              excerpt: excerpt?.slice(0, 2000) || "",
              location: docId + "|" + artNum,
              score: Number(r.similarity ?? 0),
            })
          }
        }
      }
    } catch {
      // fall through to TF-IDF retrieval
    }
  }

  // Build context string manually without template literals
  const contextParts: string[] = []
  for (let i = 0; i < contextChunks.length; i++) {
    const c = contextChunks[i]
    contextParts.push("[" + (i + 1) + "] " + c.title + (c.location != null ? " -- " + c.location : "") + "\n" + c.excerpt)
  }
  const context = contextParts.join("\n\n")

  // Build prompt without template literals
  const prompt =
    "أنت مساعد قانوني متخصص في القانون المغربي. أجب باللغة " + locale + ".\n\n" +
    "استخدم فقط السياق المسترجع أدناه. لا تخترع مواد أو أحكام، ولا تذكر رقم فصل أو مادة إلا إذا ورد في عنوان مقطع من السياق. إذا لم تكف المصادر، صرح بذلك.\n\n" +
    "السياق:\n" + (context || "(لا توجد مقاطع مسترجعة)") + "\n\n" +
    "السؤال:\n" + question + "\n\n" +
    "أعد JSON (فقط) بالشكل:\n" +
    '{"factsAssumed":"","legalIssue":"","legalBasis":"","analysis":"","possibleApplications":"","certainty":"high|medium|low|insufficient_sources","missingInfo":[],"disclaimer":""}'

  const raw = await callProvider(prompt)

  let parsed: Partial<AIAnswer> | null = null
  if (raw) {
    try {
      const m = raw.match(/\{[\\s\\S]*\}/)
      if (m) parsed = JSON.parse(m[0])
    } catch { parsed = null }
  }

  const answer: AIAnswer = {
    factsAssumed: parsed?.factsAssumed ?? "لم يحدد AI provider. عرض مقاطع مسترجعة فقط.",
    legalIssue: parsed?.legalIssue ?? "يتطلب AI provider للتحليل.",
    legalBasis: parsed?.legalBasis ?? (contextChunks.length ? "مقاطع مسترجعة (انظر المراجع)." : "لا توجد مصادر كافية."),
    analysis: parsed?.analysis ?? (contextChunks.length ? "تعذر التحليل (لا AI provider). راجع المقاطع." : "لا توجد مصادر كافية."),
    possibleApplications: parsed?.possibleApplications ?? "",
    references: contextChunks.map((c) => ({ sourceSlug: c.slug, sourceTitle: c.title, excerpt: c.excerpt, location: c.location })),
    certainty: parsed?.certainty ?? (contextChunks.length ? "low" : "insufficient_sources"),
    missingInfo: parsed?.missingInfo ?? ["AI provider API key", "وقائع إضافية"],
    disclaimer: parsed?.disclaimer ?? "هذا ليس استشارة مهنية نهائية. راجع مختصاً.",
  }

  // Anti-hallucination check
  if (parsed) {
    const citedText = answer.legalBasis + " " + answer.analysis + " " + answer.possibleApplications
    const bad = unverifiedCitations(citedText, contextChunks)
    if (bad.length) {
      answer.certainty = "low"
      answer.missingInfo = [...answer.missingInfo, "إحالات غير مؤكدة بالمصادر المسترجعة (الأرقام: " + bad.join("، ") + "). تحقق منها قبل الاعتماد."]
    }
  }
  return NextResponse.json(answer, { headers: { "Access-Control-Allow-Origin": corsOrigin } })
}