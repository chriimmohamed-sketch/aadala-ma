import Link from "next/link";

const platformLinks: Array<[string, string]> = [
  ["/legal", "الموسوعة القانونية"],
  ["/search", "البحث القانوني"],
  ["/ai", "المساعد القانوني الذكي"],
  ["/miyar", "محرك الإرث (MIYAR)"],
  ["/procedures", "المساطر والوثائق"],
];

const sourceLinks: Array<[string, string]> = [
  ["/updates", "المستجدات التشريعية"],
  ["/case-law", "الاجتهاد القضائي"],
  ["/criminal", "المختبر الجنائي"],
  ["/sharia", "الشريعة والفقه"],
  ["/academic", "الفضاء الأكاديمي"],
];

export default function Footer({ locale, messages }: { locale: string; messages: Record<string, unknown> }) {
  const f = (messages.footer ?? {}) as Record<string, string>;
  const tagline = (messages.tagline as string) ?? "القانون مفهوم، والحق معلوم.";

  return (
    <footer className="aadala-shell">
      <div className="aadala-divider" />
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2">
              <span className="aadala-logo-badge h-9 w-9 ring-1 ring-white/25">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo.png" alt="" width={36} height={36} />
              </span>
              <span className="text-lg font-extrabold text-gold">AADALA.MA</span>
            </div>
            <p className="mt-3 text-sm text-ivory/85">{tagline}</p>
            <p className="mt-2 text-xs leading-6 text-ivory/60">
              منصة المعرفة القانونية المغربية. المحتوى للتوعية والتثقيف ولا يُغني عن استشارة محامٍ مؤهل.
            </p>
          </div>

          <nav aria-label="المنصة">
            <h2 className="text-xs font-bold uppercase tracking-widest text-gold">المنصة</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {platformLinks.map(([href, label]) => (
                <li key={href}>
                  <Link href={`/${locale}${href}`} className="text-ivory/80 transition-colors hover:text-gold">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="المصادر والمنهجية">
            <h2 className="text-xs font-bold uppercase tracking-widest text-gold">المصادر والمنهجية</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {sourceLinks.map(([href, label]) => (
                <li key={href}>
                  <Link href={`/${locale}${href}`} className="text-ivory/80 transition-colors hover:text-gold">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="الثقة والشركة">
            <h2 className="text-xs font-bold uppercase tracking-widest text-gold">الثقة والشركة</h2>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href={`/${locale}/founder`} className="text-ivory/80 transition-colors hover:text-gold">
                  عن المؤسس
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/privacy`} className="text-ivory/80 transition-colors hover:text-gold">
                  {f.privacy ?? "الخصوصية"}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/terms`} className="text-ivory/80 transition-colors hover:text-gold">
                  {f.terms ?? "الشروط والأحكام"}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/disclaimer`} className="text-ivory/80 transition-colors hover:text-gold">
                  {f.disclaimer ?? "إخلاء المسؤولية"}
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
      <div className="border-t border-white/10 py-3 text-center text-xs text-ivory/50">
        © 2026 AADALA.MA — جميع الحقوق محفوظة · القانون مفهوم، والحق معلوم.
      </div>
    </footer>
  );
}
