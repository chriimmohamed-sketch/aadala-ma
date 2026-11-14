import Link from "next/link";

export default function Footer({ locale, messages }: { locale: string; messages: Record<string, unknown> }) {
  const f = (messages.footer ?? {}) as Record<string, string>;
  const tagline = (messages.tagline as string) ?? "";
  return (
    <footer data-locale={locale}>
      <div className="wrap">
        <p>
          AADALA.MA منصة مستقلة وغير تابعة لوزارة العدل أو لأي جهة رسمية. المحتوى للتوعية القانونية ولا يُعد استشارة مهنية؛
          استشر محاميًا مغربيًا في قضيتك.
        </p>
        <p>
          أسّسها محمد شرايم — طالب بكلية العلوم القانونية والاقتصادية والاجتماعية، جامعة ابن زهر بأكادير —
          السنة الأولى، القانون الخاص، العلوم الجنائية.
        </p>
        <nav aria-label="روابط المنصة">
          <p className="mt-2 flex flex-wrap gap-4">
            <a className="underline" href={`/${locale}/report`}>أبلغ عن خطأ في مادة</a>
            <a className="underline" href={`/${locale}/legal`}>الموسوعة</a>
            <a className="underline" href={`/${locale}/ai`}>المساعد</a>
            <a className="underline" href={`/${locale}/procedures`}>المساطر والنماذج</a>
            <a className="underline" href="/mushkilati.html">مشكلتي</a>
            <Link href="/profile/" className="underline">ملفي</Link>
            <a className="underline" href={`/${locale}/founder`}>عن المؤسس</a>
            <a className="underline" href={`/${locale}/privacy`}>{f.privacy ?? "سياسة الخصوصية"}</a>
            <a className="underline" href={`/${locale}/terms`}>{f.terms ?? "الشروط والأحكام"}</a>
            <a className="underline" href={`/${locale}/disclaimer`}>{f.disclaimer ?? "إخلاء المسؤولية"}</a>
          </p>
        </nav>
        <p className="text-xs text-muted">
          القانون مفهوم، والحق معلوم.
          {tagline ? ` ${tagline}` : ""}
          {"  "}© 2026 AADALA.MA.
        </p>
      </div>
    </footer>
  );
}
