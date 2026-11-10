"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, Scale, Sparkles, BookOpen, UserRound } from "lucide-react";

const TABS = [
  { id: "home", icon: Home, label: "الرئيسية", href: "" },
  { id: "legal", icon: Scale, label: "الموسوعة", href: "/legal" },
  { id: "ai", icon: Sparkles, label: "المساعد", href: "/ai" },
  { id: "student", icon: BookOpen, label: "الطلبة", href: "/student" },
  { id: "founder", icon: UserRound, label: "عن المنصة", href: "/founder" },
];

/** Persistent mobile quick access; active state follows the actual route. */
export default function MobileNav({ locale }: { locale: string }) {
  const pathname = usePathname() || `/${locale}`;
  const active = TABS.find((tab) => tab.href === "" ? pathname === `/${locale}` || pathname === `/${locale}/` : pathname === `/${locale}${tab.href}` || pathname.startsWith(`/${locale}${tab.href}/`))?.id ?? "";
  return (
    <nav aria-label="التنقل السريع" className="justice-mobile-tabs fixed bottom-3 left-1/2 z-40 flex -translate-x-1/2 items-center gap-1 rounded-2xl border border-[#c9a227]/35 bg-[#091a2e]/95 p-1.5 shadow-2xl backdrop-blur-xl md:hidden">
      {TABS.map((tab) => {
        const Icon = tab.icon;
        const selected = active === tab.id;
        return <Link key={tab.id} href={`/${locale}${tab.href}`} aria-label={tab.label} aria-current={selected ? "page" : undefined} className={`relative flex min-w-[57px] flex-col items-center gap-1 rounded-xl px-2.5 py-2 text-[10px] transition-colors ${selected ? "text-[#f0d98e]" : "text-white/60 hover:text-white"}`}>
          {selected && <motion.span layoutId="aadala-mobile-active" className="absolute inset-0 -z-10 rounded-xl border border-[#c9a227]/25 bg-[#c9a227]/15" transition={{ type: "spring", stiffness: 330, damping: 28 }} />}
          <Icon size={19} strokeWidth={selected ? 2.2 : 1.7}/><span>{tab.label}</span>
        </Link>;
      })}
    </nav>
  );
}
