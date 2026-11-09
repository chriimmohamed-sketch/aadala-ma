"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Home, Scale, Sparkles, BookOpen, User } from "lucide-react";

const TABS = [
  { id: "home", icon: Home, label: "الرئيسية", href: "" },
  { id: "legal", icon: Scale, label: "الموسوعة", href: "/legal" },
  { id: "ai", icon: Sparkles, label: "المساعد", href: "/ai" },
  { id: "student", icon: BookOpen, label: "الطلبة", href: "/student" },
  { id: "login", icon: User, label: "دخول", href: "/login" },
];

/** Mobile-only bottom glass nav (desktop keeps the top header). */
export default function MobileNav({ locale }: { locale: string }) {
  const [active, setActive] = useState("home");
  return (
    <nav aria-label="تنقل سريع" className="fixed bottom-4 left-1/2 z-40 flex -translate-x-1/2 items-center gap-1 rounded-full border border-white/20 bg-navy/85 p-2 shadow-2xl backdrop-blur-lg md:hidden">
      {TABS.map((t) => (
        <Link key={t.id} href={`/${locale}${t.href}`} onClick={() => setActive(t.id)} className="relative rounded-full p-2.5 text-white/70">
          <t.icon size={20} />
          {active === t.id && <motion.span layoutId="mobileTab" className="absolute inset-0 -z-10 rounded-full bg-teal/30" transition={{ type: "spring", stiffness: 300, damping: 20 }} />}
        </Link>
      ))}
    </nav>
  );
}
