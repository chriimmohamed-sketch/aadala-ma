import Link from "next/link";

export default function Footer({ locale, messages }: { locale: string; messages: Record<string, unknown> }) {
  const f = (messages.footer ?? {}) as Record<string, string>;
  const tagline = (messages.tagline as string) ?? "";
  return (
    <footer className="bg-graphite text-ivory/80">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-4 py-8 md:flex-row md:justify-between">
        <div>
          <div className="text-lg font-bold text-gold">AADALA.MA</div>
          <div className="text-xs text-ivory/60">{tagline}</div>
        </div>
        <div className="flex gap-6 text-xs">
          <Link href={`/${locale}/privacy`} className="hover:text-gold transition-colors">{f.privacy ?? "Privacy"}</Link>
          <Link href={`/${locale}/terms`} className="hover:text-gold transition-colors">{f.terms ?? "Terms"}</Link>
          <Link href={`/${locale}/disclaimer`} className="hover:text-gold transition-colors">{f.disclaimer ?? "Disclaimer"}</Link>
        </div>
      </div>
      <div className="border-t border-ivory/10 py-3 text-center text-xs text-ivory/40">
        © AADALA.MA — 2026
      </div>
    </footer>
  );
}