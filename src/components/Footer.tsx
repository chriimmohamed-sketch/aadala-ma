import Link from "next/link";

export default function Footer({ locale, messages }: { locale: string; messages: Record<string, unknown> }) {
  const f = (messages.footer ?? {}) as Record<string, string>;
  const tagline = (messages.tagline as string) ?? "";
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-4 py-6 text-xs text-slate-500 md:flex-row md:justify-between">
        <span>© AADALA.MA — {tagline}</span>
        <div className="flex gap-4">
          <Link href={`/${locale}/privacy`}>{f.privacy ?? "Privacy"}</Link>
          <Link href={`/${locale}/terms`}>{f.terms ?? "Terms"}</Link>
          <Link href={`/${locale}/disclaimer`}>{f.disclaimer ?? "Disclaimer"}</Link>
        </div>
      </div>
    </footer>
  );
}