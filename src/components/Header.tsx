import Link from "next/link";
import { localeNames, type Locale } from "@/lib/i18n/config";

const navItems = [
  { href: "", key: "home" },
  { href: "/legal", key: "legal" },
  { href: "/case-law", key: "caseLaw" },
  { href: "/ai", key: "ai" },
  { href: "/inheritance", key: "inheritance" },
  { href: "/founder", key: "founder" },
];

export default function Header({ locale, messages }: { locale: string; messages: Record<string, unknown> }) {
  const nav = (messages.nav ?? {}) as Record<string, string>;
  const brand = (messages.brand as string) ?? "AADALA.MA";
  return (
    <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href={`/${locale}`} className="text-xl font-bold text-slate-900">
          {brand}
        </Link>
        <nav className="hidden gap-4 md:flex">
          {navItems.map((n) => (
            <Link key={n.key} href={`/${locale}${n.href}`} className="text-sm text-slate-600 hover:text-slate-900">
              {nav[n.key] ?? n.key}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">{localeNames[locale as Locale]}</span>
          <Link href={`/${locale}/ai`} className="rounded bg-slate-900 px-3 py-1.5 text-xs text-white">
            {nav.ai ?? "AI"}
          </Link>
        </div>
      </div>
    </header>
  );
}