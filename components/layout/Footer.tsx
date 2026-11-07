import Link from "next/link";

export default function Footer({ locale, messages }: { locale: string; messages: Record<string, unknown> }) {
  const f = (messages.footer ?? {}) as Record<string, string>;
  const tagline = (messages.tagline as string) ?? "";
  return (
    <footer>
      <div className="wrap">
        <p>AADALA.MA منصة مستقلة وغير تابعة لوزارة العدل أو لأي جهة رسمية. المحتوى للتوعية القانونية ولا يُعد استشارة مهنية؛ استشر محاميًا مغربيًا في قضيتك.</p>
        <p>أسّسها محمد شرايم، طالب بكلية العلوم القانونية والاقتصادية والاجتماعية، جامعة ابن زهر، أكادير.</p>
      </div>
    </footer>
  );
}