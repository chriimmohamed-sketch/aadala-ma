import Link from "next/link";
import { localeNames, type Locale } from "@/lib/i18n/config";

const navItems = [
  { href: "", key: "home" },
  { href: "/legal", key: "legal" },
  { href: "/search", key: "search" },
  { href: "/ai", key: "ai" },
  { href: "/miyar", key: "miyar" },
  { href: "/property", key: "property" },
  { href: "/case-law", key: "caseLaw" },
  { href: "/legal-aid", key: "legalAid" },
  { href: "/student", key: "student" },
  { href: "/founder", key: "founder" },
];

export default function Header({ locale, messages }: { locale: string; messages: Record<string, unknown> }) {
  const nav = (messages.nav ?? {}) as Record<string, string>;
  const brand = (messages.brand as string) ?? "AADALA.MA";
  return (
    <header className="bg-navy text-ivory shadow-lg">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href={`/${locale}`} className="flex items-center gap-2">
          <span className="inline-block h-8 w-8 rounded-full bg-gold" aria-hidden />
          <span className="text-xl font-bold tracking-wide">{brand}</span>
        </Link>
        <nav className="hidden gap-6 md:flex">
          {navItems.map((n) => (
            <Link key={n.key} href={`/${locale}${n.href}`} className="text-sm text-ivory/80 hover:text-gold transition-colors">
              {nav[n.key] ?? n.key}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <span className="hidden text-xs text-ivory/60 md:inline">{localeNames[locale as Locale]}</span>
          <Link href={`/${locale}/ai`} className="aadala-btn-gold text-xs">
            {nav.ai ?? "AI"}
          </Link>
        </div>
      </div>
      <div className="aadala-divider" />
    </header>
  );
}