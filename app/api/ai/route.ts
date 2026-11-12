import { NextResponse } from "next/server";
import { retrieveWithRefs, unverifiedCitations } from "@/lib/ai-assistant/retrieval";
import { callProvider } from "@/lib/ai-assistant/provider";
import type { AIAnswer } from "@/lib/ai-assistant/types";
import { clientIp, rateLimit } from "@/lib/security/rate-limit";
import { locales } from "@/lib/i18n/config";

export async function POST(req: Request) {
  const rl = rateLimit(`ai:${clientIp(req)}`, 8, 60_000);
  if (!rl.ok) return NextResponse.json({ error: "too many requests" }, { status: 429, headers: { "Retry-After": String(rl.retryAfter) } });
  if (Number(req.headers.get("content-length") ?? 0) > 8_192) return NextResponse.json({ error: "payload too large" }, { status: 413 });
  const body = await req.json().catch(() => ({}));
  const question = String(body?.question ?? "").trim().slice(0, 2000);
  const reqLocale = String(body?.locale ?? "ar");
  const locale = (locales as readonly string[]).includes(reqLocale) ? reqLocale : "ar";
  if (!question) return NextResponse.json({ error: "question required" }, { status: 400 });

  const chunks = retrieveWithRefs(question, 6);
  const refs = chunks.map((c) => ({ sourceSlug: c.slug, sourceTitle: c.title, excerpt: c.excerpt, location: c.location }));

  const context = chunks.map((c, i) => `[${i + 1}] ${c.title}${c.location ? " — " + c.location : ""}\n${c.excerpt}`).join("\n\n");

  const prompt = `أنت مساعد قانوني متخصص في القانون المغربي. أجب باللغة ${locale}.

استخدم فقط السياق المسترجع أدناه. لا تخترع مواد أو أحكام، ولا تذكر رقم فصل أو مادة إلا إذا ورد في عنوان مقطع من السياق. إذا لم تكف المصادر، صرح بذلك.

السياق:
${context || "(لا توجد مقاطع مسترجعة)"}

السؤال:
${question}

أعد JSON (فقط) بالشكل:
{"factsAssumed":"","legalIssue":"","legalBasis":"","analysis":"","possibleApplications":"","certainty":"high|medium|low|insufficient_sources","missingInfo":[],"disclaimer":""}`;

  const raw = await callProvider(prompt);

  let parsed: Partial<AIAnswer> | null = null;
  if (raw) {
    try {
      const m = raw.match(/\{[\s\S]*\}/);
      if (m) parsed = JSON.parse(m[0]);
    } catch { parsed = null; }
  }

  const answer: AIAnswer = {
    factsAssumed: parsed?.factsAssumed ?? "لم يُحدد AI provider. عرض مقاطع مسترجعة فقط.",
    legalIssue: parsed?.legalIssue ?? "يتطلب AI provider للتحليل.",
    legalBasis: parsed?.legalBasis ?? (chunks.length ? "مقاطع مسترجعة (انظر المراجع)." : "لا توجد مصادر كافية."),
    analysis: parsed?.analysis ?? (chunks.length ? "تعذّر التحليل (لا AI provider). راجع المقاطع." : "لا توجد مصادر كافية."),
    possibleApplications: parsed?.possibleApplications ?? "",
    references: refs,
    certainty: parsed?.certainty ?? (chunks.length ? "low" : "insufficient_sources"),
    missingInfo: parsed?.missingInfo ?? ["AI provider API key", "وقائع إضافية"],
    disclaimer: parsed?.disclaimer ?? "هذا ليس استشارة مهنية نهائية. راجع مختصاً.",
  };

  // Anti-hallucination check: any article number cited but absent from the retrieved passages downgrades the answer.
  if (parsed) {
    const bad = unverifiedCitations(`${answer.legalBasis} ${answer.analysis} ${answer.possibleApplications}`, chunks);
    if (bad.length) {
      answer.certainty = "low";
      answer.missingInfo = [...answer.missingInfo, `إحالات غير مؤكدة بالمصادر المسترجعة (الأرقام: ${bad.join("، ")}). تحقق منها قبل الاعتماد.`];
    }
  }
  return NextResponse.json(answer);
}