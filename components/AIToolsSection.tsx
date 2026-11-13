import Link from "next/link";

const TOOLS = [
  { name: "المساعد القانوني", desc: "أجوبة مربوطة بالمصادر", href: "/ai" },
  { name: "مِعيار للمواريث", desc: "حساب تعليمي خطوة بخطوة", href: "/miyar" },
  { name: "مساطر تفاعلية", desc: "مسار إجرائي ومسودات", href: "/procedures" },
  { name: "البحث القانوني", desc: "بحث بالمادة والكلمة", href: "/search" },
  { name: "الاجتهاد القضائي", desc: "قرارات موثقة فقط", href: "/case-law" },
  { name: "فضاء الطلبة", desc: "أدوات دراسة وبحث", href: "/student" },
] as const;

/** Legal-tools grid (replaces the generic AI marketing list). */
export default function AIToolsSection({ locale }: { locale: string }) {
  return (
    <div className="grid grid-cols-1 gap-3 p-1 md:grid-cols-2 lg:grid-cols-3">
      {TOOLS.map((t, i) => (
        <Link key={t.href} href={`/${locale}${t.href}`} className="rounded-xl border border-border bg-surface p-4 transition hover:border-teal">
          <h3 className="mb-1 font-bold text-navy">{i + 1}. {t.name}</h3>
          <p className="text-sm text-graphite-soft">{t.desc}</p>
        </Link>
      ))}
    </div>
  );
}
