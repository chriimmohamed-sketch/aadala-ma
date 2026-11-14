import type { JurisprudenceDecision } from "@/lib/legal-data/jurisprudence";
import { JURISPRUDENCE_NOTE } from "@/lib/legal-data/jurisprudence";

/**
 * بطاقة قرار — مخصصة للاجتهاد القضائي.
 * لا نستعمل LegalArticleView لأنه يفرض لفظ «الفصل»، والقرار ليس مادة.
 */
export default function JurisprudenceView({ decisions }: { decisions: JurisprudenceDecision[] }) {
  return (
    <section className="mt-6 space-y-6">
      <div className="rounded border border-gold/60 bg-gold/10 p-4 text-xs leading-6 text-graphite">
        <p className="font-semibold text-brass">طبقة الاجتهاد القضائي — ليست نصوصًا قانونية</p>
        <p className="mt-1">{JURISPRUDENCE_NOTE}</p>
        <p className="mt-1">
          أُخضعت النصوص لبوابة جودة: حُذفت المقاطع غير المقروءة من المصدر واستُبدلت بعلامة […].
          المصدر الأصلي PDF؛ التحقق البشري لم يتم بعد.
        </p>
      </div>

      {decisions.map((d) => (
        <article key={d.id} id={d.id} className="aadala-card space-y-3 p-5">
          <header className="space-y-1">
            <h2 className="text-xl font-bold text-navy">
              القرار {d.id} — {d.court}
            </h2>
            <p className="text-sm text-brass">
              {d.date}
              {d.caseNo ? ` — ملف ${d.caseNo}` : ""}
              {d.appealNo ? ` — استئناف رقم ${d.appealNo}` : ""}
            </p>
            <span className="inline-block rounded-full border border-border bg-surface px-3 py-1 text-xs text-graphite">
              {d.topic}
            </span>
          </header>

          <section>
            <h3 className="mb-2 text-sm font-semibold text-teal">النص (مبتور في مواضع تالفة من المصدر)</h3>
            <p className="whitespace-pre-wrap rounded border border-border bg-ivory p-4 text-sm leading-8 text-graphite">
              {d.text}
            </p>
          </section>

          <dl className="grid grid-cols-1 gap-2 text-xs sm:grid-cols-3">
            <div className="rounded border border-border bg-surface p-3">
              <dt className="font-semibold text-brass">حالة التحقق</dt>
              <dd className="text-graphite">غير مُراجع — اجتهاد قضائي</dd>
            </div>
            <div className="rounded border border-border bg-surface p-3">
              <dt className="font-semibold text-brass">مواضع غير مقروءة</dt>
              <dd className="text-graphite">{d.elisions} (المقروء {d.wordsAfter} كلمة)</dd>
            </div>
            <div className="rounded border border-border bg-surface p-3">
              <dt className="font-semibold text-brass">المصدر</dt>
              <dd className="text-graphite" dir="ltr">{d.sourceFile}</dd>
            </div>
          </dl>
        </article>
      ))}
    </section>
  );
}
