"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { buildFlashcards, buildQuiz } from "@/lib/study/flashcards";

export default function ReviewMode({ locale }: { locale: string }) {
  const cards = useMemo(() => buildFlashcards(2, 12), []);
  const quiz = useMemo(() => buildQuiz(cards, 5, 42), [cards]);
  const [flipped, setFlipped] = useState<Record<string, boolean>>({});
  const [known, setKnown] = useState<Record<string, boolean>>({});
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showScore, setShowScore] = useState(false);
  const knownCount = Object.values(known).filter(Boolean).length;
  const answered = Object.keys(answers).length;
  const score = quiz.filter((q) => answers[q.id] === q.correctIndex).length;

  return (
    <section className="aadala-card mt-6 p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-lg font-semibold text-navy">وضع المراجعة — بطاقات واختبار قصير</h2>
        <span className="text-xs text-graphite-soft">التقدّم: {knownCount}/{cards.length} بطاقة محفوظة</span>
      </div>
      <p className="mt-2 text-sm leading-7 text-graphite-soft">
        بطاقات من النصوص المسترجعة نفسها (لا تلخيص من الذاكرة). ادخل فضاء الطلبة للمزيد:{" "}
        <Link className="font-semibold text-teal underline" href={`/${locale}/student`}>طلبة القانون</Link>
      </p>

      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <div key={c.id} className="rounded border border-border bg-ivory p-3">
            <p className="text-xs text-graphite-soft">{c.sourceTitle}{c.location ? ` — ${c.location}` : ""}</p>
            <p className="mt-1 text-sm font-semibold text-navy">{c.front}</p>
            {flipped[c.id] ? (
              <>
                <p className="mt-2 line-clamp-6 text-xs leading-6 text-graphite">{c.back}</p>
                <Link href={`/${locale}/legal/${c.sourceSlug}`} className="mt-1 inline-block text-xs font-semibold text-teal underline">تحقق في المكتبة ←</Link>
              </>
            ) : (
              <button type="button" className="mt-2 text-xs font-semibold text-teal" onClick={() => setFlipped({ ...flipped, [c.id]: true })}>أظهر النص</button>
            )}
            <div className="mt-2 flex gap-2">
              <button type="button" className="text-xs font-semibold text-teal" onClick={() => setKnown({ ...known, [c.id]: true })}>أتقنتها</button>
              <button type="button" className="text-xs text-graphite-soft" onClick={() => setKnown({ ...known, [c.id]: false })}>أعيدها</button>
            </div>
          </div>
        ))}
      </div>

      <h3 className="mt-6 text-base font-semibold text-navy">اختبار قصير — من أين هذا المقطع؟</h3>
      <p className="text-xs text-graphite-soft">التقدّم: {answered}/{quiz.length}{showScore ? ` — النتيجة ${score}/${quiz.length}` : ""}</p>
      <div className="mt-3 space-y-3">
        {quiz.map((q, i) => (
          <div key={q.id} className="rounded border border-border bg-ivory p-3">
            <p className="text-sm font-semibold text-navy">س{i + 1}. {q.excerpt.slice(0, 120)}…</p>
            <div className="mt-2 grid gap-1">
              {q.options.map((opt, oi) => {
                const picked = answers[q.id] === oi;
                const correct = q.correctIndex === oi;
                const show = showScore || answers[q.id] !== undefined;
                return (
                  <button
                    key={oi}
                    type="button"
                    disabled={show}
                    onClick={() => setAnswers({ ...answers, [q.id]: oi })}
                    className={`rounded border px-2 py-1 text-right text-xs ${picked && correct ? "border-teal bg-teal/10" : picked ? "border-danger bg-danger/10" : "border-border bg-surface"}`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <button type="button" className="aadala-btn-primary mt-3 text-xs" onClick={() => setShowScore(true)} disabled={answered < quiz.length}>
        اعرض النتيجة ({score}/{quiz.length})
      </button>
    </section>
  );
}
