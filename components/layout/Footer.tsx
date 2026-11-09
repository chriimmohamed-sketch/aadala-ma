export default function Footer({ locale, messages }: { locale: string; messages: Record<string, unknown> }) {
  const tagline = (messages.tagline as string) ?? "";
  return (
    <footer data-locale={locale}>
      <div className="wrap">
        <p>AADALA.MA منصة مستقلة وغير تابعة لوزارة العدل أو لأي جهة رسمية. المحتوى للتوعية القانونية ولا يُعد استشارة مهنية؛ استشر محاميًا مغربيًا في قضيتك.</p>
        <p>أسّسها محمد شرايم، طالب بكلية العلوم القانونية والاقتصادية والاجتماعية، جامعة ابن زهر، أكادير.</p>
        <p className="mt-2 flex flex-wrap gap-4">
          <a className="underline" href={`/${locale}/report`}>أبلغ عن خطأ في مادة</a>
          <a className="underline" href={`/${locale}/legal`}>المكتبة</a>
          <a className="underline" href={`/${locale}/ai`}>المساعد</a>
          <a className="underline" href={`/${locale}/procedures`}>المساطر والنماذج</a>
        </p>
        {tagline && <p className="text-xs text-muted">{tagline}</p>}
      </div>
    </footer>
  );
}