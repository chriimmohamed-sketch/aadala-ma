import { NextResponse } from "next/server";
import { retrieve } from "@/lib/ai-assistant/retrieval";
import { callProvider } from "@/lib/ai-assistant/provider";
import type { AIAnswer } from "@/lib/ai-assistant/types";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const question = String(body?.question ?? "").trim();
  const locale = String(body?.locale ?? "ar");
  if (!question) return NextResponse.json({ error: "question required" }, { status: 400 });

  const chunks = retrieve(question, 6);
  const refs = chunks.map((c) => ({ sourceSlug: c.slug, sourceTitle: c.title, excerpt: c.excerpt }));

  const context = chunks.map((c, i) => `[${i + 1}] ${c.title}\n${c.excerpt}`).join("\n\n");

  const prompt = `أنت مساعد قانوني متخصص في القانون المغربي. أجب باللغة ${locale}.

استخدم فقط السياق المسترجع أدناه. لا تخترع مواد أو أحكام. إذا لم تكف المصادر، صرح بذلك.

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

  return NextResponse.json(answer);
}