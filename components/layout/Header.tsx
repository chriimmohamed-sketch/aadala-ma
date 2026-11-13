import Link from "next/link";
import { localeNames, type Locale } from "@/lib/i18n/config";

const primaryNav = [
  { href: "", key: "home" },
  { href: "/legal", key: "legal" },
  { href: "/search", key: "search" },
  { href: "/ai", key: "ai" },
  { href: "/miyar", key: "inheritance" },
];

const moreNav = [
  { href: "/property", key: "property" },
  { href: "/case-law", key: "caseLaw" },
  { href: "/criminal", key: "criminal" },
  { href: "/procedures", key: "procedures" },
  { href: "/sharia", key: "sharia" },
  { href: "/academic", key: "academic" },
  { href: "/updates", key: "updates" },
  { href: "/founder", key: "founder" },
];

export default function Header({ locale, messages }: { locale: string; messages: Record<string, unknown> }) {
  const nav = (messages.nav ?? {}) as Record<string, string>;
  const brand = (messages.brand as string) ?? "AADALA.MA";
  const moreLabel = (messages.more as string) ?? "المزيد";
  const label = (key: string) => nav[key] ?? key;

  return (
    <header className="aadala-shell shadow-lg">
      <div className="mx-auto max-w-6xl px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <Link href={`/${locale}`} className="flex items-center gap-3" aria-label={brand}>
            <span className="aadala-logo-badge h-10 w-10 sm:h-11 sm:w-11 ring-1 ring-white/25">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="" width={44} height={44} />
            </span>
            <span className="text-xl font-extrabold tracking-wide text-ivory">{brand}</span>
          </Link>

          <nav className="hidden items-center gap-6 md:flex" aria-label="التنقل الأساسي">
            {primaryNav.map((n) => (
              <Link
                key={n.key}
                href={`/${locale}${n.href}`}
                className="text-sm text-ivory/85 transition-colors hover:text-gold"
              >
                {label(n.key)}
              </Link>
            ))}
            <details className="group relative">
              <summary
                className="cursor-pointer list-none text-sm text-ivory/85 transition-colors marker:content-none hover:text-gold"
                aria-label={moreLabel}
              >
                {moreLabel} <span aria-hidden className="inline-block transition-transform group-open:rotate-180">▾</span>
              </summary>
              <div className="absolute left-0 z-40 mt-2 w-64 overflow-hidden rounded-xl border border-navy-900/40 bg-[#1F2A3D] p-2 shadow-2xl shadow-black/30">
                {moreNav.map((n) => (
                  <Link
                    key={n.key}
                    href={`/${locale}${n.href}`}
                    className="block rounded-lg px-3 py-2 text-sm text-ivory/90 transition-colors hover:bg-white/5 hover:text-gold"
                  >
                    {label(n.key)}
                  </Link>
                ))}
              </div>
            </details>
          </nav>

          <div className="flex items-center gap-3">
            <span className="hidden text-xs text-ivory/60 lg:inline">{localeNames[locale as Locale]}</span>
            <Link href={`/${locale}/ai`} className="aadala-btn-gold text-xs">
              {label("ai")}
            </Link>
          </div>
        </div>

        {/* Mobile nav */}
        <details className="group mt-2 md:hidden">
          <summary
            className="cursor-pointer list-none rounded-lg border border-white/10 px-3 py-2 text-sm text-ivory/90 marker:content-none"
            aria-label={moreLabel}
          >
            {moreLabel} <span aria-hidden className="inline-block transition-transform group-open:rotate-180">▾</span>
          </summary>
          <nav className="mt-2 grid grid-cols-2 gap-1 rounded-xl border border-white/10 bg-[#1F2A3D] p-2" aria-label="التنقل المحمول">
            {[...primaryNav, ...moreNav].map((n) => (
              <Link
                key={n.key}
                href={`/${locale}${n.href}`}
                className="rounded-lg px-3 py-2 text-sm text-ivory/90 transition-colors hover:bg-white/5 hover:text-gold"
              >
                {label(n.key)}
              </Link>
            ))}
          </nav>
        </details>
      </div>
      <div className="aadala-divider" />
    </header>
  );
}
