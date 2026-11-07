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

  const prompt = `أنت AADALA AI، مساعد قانوني متخصص في القانون المغربي. أجب باللغة ${locale} (العربية، الدارجة، أو الفرنسية).

استخدم فقط السياق المسترجع أدناه. لا تخترع مواد أو أحكام أو مراجع. لا تذكر رقم مادة إلا إذا ورد في عنوان مقطع من السياق. إذا لم تكف المصادر، صرح بذلك.

السياق (RAG):
${context || "(لا توجد مقاطع مسترجعة)"}

السؤال:
${question}

أعد JSON (فقط) بالشكل (13 حقل):
{"factsAssumed":"","legalIssue":"","legalBasis":"","analysis":"","possibleApplications":"","references":[],"certainty":"high|medium|low|insufficient_sources","missingInfo":[],"disclaimer":"","textInterpretation":"","oldVsNewComparison":"","procedurePath":[],"documentList":[],"legalSummary":"","draftTemplate":""}

الحقول:
1. factsAssumed: الوقائع المفترضة
2. legalIssue: الإشكال القانوني
3. legalBasis: الأساس القانوني (مواد + نصوص)
4. analysis: التحليل (مع الافتراضات)
5. possibleApplications: التطبيقات المحتملة
6. references: قائمة المراجع (مصدر + مقطع)
7. certainty: درجة اليقين
8. missingInfo: المعلومات الناقصة
9. disclaimer: إخلاء المسؤولية (ليس استشارة مهنية)
10. textInterpretation: تفسير النصوص
11. oldVsNewComparison: مقارنة النصوص القديمة والجديدة (إن وجدت)
12. procedurePath: مسار إجرائي أولي (مصفوفة)
13. documentList: قائمة الوثائق المحتملة (مصفوفة)
14. legalSummary: ملخص قانوني
15. draftTemplate: مسودة أولية (طلب/شكاية/إنذار/مذكرة) قابلة للتعديل`;

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
    textInterpretation: parsed?.textInterpretation ?? "",
    oldVsNewComparison: parsed?.oldVsNewComparison ?? "",
    procedurePath: parsed?.procedurePath ?? [],
    documentList: parsed?.documentList ?? [],
    legalSummary: parsed?.legalSummary ?? "",
    draftTemplate: parsed?.draftTemplate ?? "",
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