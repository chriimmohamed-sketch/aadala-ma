import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import AuthButton from "@/components/AuthButton";

const navItems = [
  { href: "", key: "home" },
  { href: "/legal", key: "legal" },
  { href: "/search", key: "search" },
  { href: "/ai", key: "ai" },
  { href: "/miyar", key: "miyar" },
  { href: "/property", key: "property" },
  { href: "/case-law", key: "caseLaw" },
  { href: "/procedures", key: "procedures" },
  { href: "/criminal", key: "criminal" },
  { href: "/showcase", key: "showcase" },
  { href: "/student", key: "student" },
  { href: "/founder", key: "founder" },
];

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
          {navItems.map((n) => (
            <Link key={n.key} href={`/${locale}${n.href}`}>
              {nav[n.key] ?? n.key}
            </Link>
          ))}
        </nav>
        <AuthButton locale={locale} />
        <button id="kbd" type="button" className="kbd" aria-label="انتقال سريع (Ctrl K)">
          <span>انتقال سريع</span> <kbd>Ctrl K</kbd>
        </button>
        <ThemeToggle />
      </div>
    </header>
  );
}