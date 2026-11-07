import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

export default function Header({ locale, messages }: { locale: string; messages: Record<string, unknown> }) {
  const nav = (messages.nav ?? {}) as Record<string, string>;
  const brand = (messages.brand as string) ?? "AADALA.MA";
  return (
    <header>
      <div className="wrap">
        <Link className="logo" href={`/${locale}`} aria-label="AADALA.MA — الصفحة الرئيسية">
          <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
            <rect x="9" y="9" width="22" height="22" />
            <rect x="9" y="9" width="22" height="22" transform="rotate(45 20 20)" />
            <line x1="20" y1="13" x2="20" y2="27" />
            <line x1="14" y1="15" x2="26" y2="15" />
          </svg>
          {brand}
        </Link>
        <nav aria-label="التنقل الرئيسي">
          <Link href={`/${locale}`}>{nav.home ?? "الرئيسية"}</Link>
          <Link href={`/${locale}/legal`}>{nav.legal ?? "المكتبة"}</Link>
          <Link href={`/${locale}/ai`}>{nav.ai ?? "المساعد"}</Link>
          <Link href={`/${locale}/miyar`}>{nav.miyar ?? "MIYAR"}</Link>
          <Link href={`/${locale}/property`}>{nav.property ?? "العقار"}</Link>
          <Link href={`/${locale}/case-law`}>{nav.caseLaw ?? "الاجتهاد"}</Link>
        </nav>
        <button className="kbd" type="button" aria-label="فتح البحث السريع">⌕ <span>انتقال سريع</span> <kbd>Ctrl K</kbd></button>
        <ThemeToggle />
      </div>
    </header>
  );
}