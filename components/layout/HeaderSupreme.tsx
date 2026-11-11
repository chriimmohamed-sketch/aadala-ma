"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import {
  Activity, ArrowUpLeft, BookOpen, BriefcaseBusiness, ChevronDown, FileSearch,
  Gavel, GraduationCap, Landmark, Menu, Search, Scale, ShieldCheck, Sparkles,
  X, LibraryBig, UserRound, Workflow,
} from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

type NavLink = { href: string; label: string; description: string; icon: typeof Scale; key?: string };
type NavGroup = { title: string; eyebrow: string; links: NavLink[] };

const groups: NavGroup[] = [
  { title: "المعرفة القانونية", eyebrow: "THE LAW LIBRARY", links: [
    { href: "/legal", key: "legal", label: "الموسوعة القانونية", description: "التشريعات والنصوص القانونية المغربية", icon: LibraryBig },
    { href: "/search", key: "search", label: "البحث القانوني", description: "اعثر على النص أو المعلومة القانونية", icon: FileSearch },
    { href: "/case-law", key: "caseLaw", label: "الاجتهاد القضائي", description: "قرارات وأحكام ومبادئ قضائية", icon: Gavel },
    { href: "/sharia", label: "الدراسات الشرعية", description: "مراجع ومعارف في الدراسات الشرعية", icon: BookOpen },
  ]},
  { title: "الخدمات والأدوات", eyebrow: "JUSTICE SERVICES", links: [
    { href: "/ai", key: "ai", label: "المساعد القانوني الذكي", description: "افهم سؤالك القانوني وابدأ البحث", icon: Sparkles },
    { href: "/procedures", key: "procedures", label: "المساطر والإجراءات", description: "خطوات عملية لفهم المساطر", icon: Workflow },
    { href: "/legal-aid", label: "المساعدة القانونية", description: "بوابة التوجيه والمساعدة القانونية", icon: ShieldCheck },
    { href: "/miyar", key: "miyar", label: "معيار", description: "أدوات ومؤشرات قانونية", icon: Activity },
    { href: "/property", key: "property", label: "العقار", description: "المعلومات والخدمات القانونية العقارية", icon: Landmark },
    { href: "/criminal", key: "criminal", label: "القانون الجنائي", description: "المفاهيم والمراجع الجنائية", icon: Gavel },
  ]},
  { title: "المجتمع والمنصة", eyebrow: "THE PLATFORM", links: [
    { href: "/student", key: "student", label: "الفضاء الأكاديمي", description: "موارد ومحتوى للطلبة والباحثين", icon: GraduationCap },
    { href: "/updates", label: "المستجدات", description: "آخر الإضافات والتحديثات القانونية", icon: BriefcaseBusiness },
    { href: "/showcase", key: "showcase", label: "استكشف المنصة", description: "تعرف على إمكانات AADALA.MA", icon: Sparkles },
    { href: "/founder", key: "founder", label: "عن المؤسس", description: "الرؤية والفريق وهوية المشروع", icon: UserRound },
  ]},
];

export default function Header({ locale, messages }: { locale: string; messages: Record<string, unknown> }) {
  const pathname = usePathname() || `/${locale}`;
  const nav = (messages.nav ?? {}) as Record<string, string>;
  const brand = (messages.brand as string) ?? "AADALA.MA";
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const allLinks = useMemo(() => groups.flatMap((g) => g.links), []);
  const filtered = query.trim() ? allLinks.filter((item) => `${item.label} ${item.description}`.includes(query.trim())) : [];
  const isActive = (href: string) => href === "" ? pathname === `/${locale}` || pathname === `/${locale}/` : pathname === `/${locale}${href}` || pathname.startsWith(`/${locale}${href}/`);
  const close = () => { setOpen(false); setQuery(""); };

  return (
    <>
      <div className="justice-topline"><div className="justice-topline-inner"><span><span className="justice-live-dot" /> منصة المعرفة القانونية المغربية</span><span className="justice-topline-motto">الحق يُفهم بالمعرفة، والعدالة تُصان بالوعي</span><span className="justice-topline-code">EST. · AADALA.MA</span></div></div>
      <header className="justice-header">
        <div className="justice-header-inner">
          <Link className="justice-brand" href={`/${locale}`} aria-label="AADALA.MA — الصفحة الرئيسية" onClick={close}>
            <span className="justice-brand-seal" aria-hidden="true"><Scale size={27} strokeWidth={1.55}/><i/><b/></span>
            <span className="justice-brand-copy"><strong>{brand}</strong><small>منصة العدالة والذكاء القانوني المغربي</small></span>
          </Link>

          <nav className="justice-desktop-nav" aria-label="التنقل الرئيسي">
            <Link className={`justice-home-link ${isActive("") ? "is-active" : ""}`} href={`/${locale}`}><Landmark size={16}/><span>{nav.home ?? "الرئيسية"}</span></Link>
            {groups.map((group, index) => (
              <div className="justice-nav-group" key={group.eyebrow}>
                <button className={`justice-nav-trigger ${group.links.some((item) => isActive(item.href)) ? "is-active" : ""}`} type="button" aria-haspopup="true">
                  {group.title}<ChevronDown size={14}/>
                </button>
                <div className={`justice-mega-menu mega-${index + 1}`}>
                  <div className="justice-mega-heading"><span>{group.eyebrow}</span><strong>{group.title}</strong><p>بوابتك المنظمة إلى المعرفة والخدمات القانونية.</p></div>
                  <div className="justice-mega-links">{group.links.map((item) => { const Icon = item.icon; return <Link key={item.href} href={`/${locale}${item.href}`} className={isActive(item.href) ? "is-active" : ""} onClick={close}><span className="justice-menu-icon"><Icon size={19}/></span><span><b>{item.key ? nav[item.key] ?? item.label : item.label}</b><small>{item.description}</small></span><ArrowUpLeft className="justice-menu-arrow" size={15}/></Link>; })}</div>
                  <div className="justice-mega-foot"><Scale size={14}/> معرفة قانونية منظمة، في متناول الجميع</div>
                </div>
              </div>
            ))}
          </nav>

          <div className="justice-header-actions"><Link className="justice-search-button" href={`/${locale}/search`} aria-label="البحث"><Search size={18}/></Link><ThemeToggle/><button className="justice-mobile-toggle" type="button" onClick={() => setOpen(!open)} aria-label={open ? "إغلاق القائمة" : "فتح القائمة"} aria-expanded={open}>{open ? <X/> : <Menu/>}</button></div>
        </div>
      </header>

      {open && <div className="justice-mobile-backdrop" onClick={close} />}
      <aside className={`justice-mobile-drawer ${open ? "is-open" : ""}`} aria-hidden={!open}>
        <div className="justice-drawer-head"><div><span className="justice-drawer-seal"><Scale size={22}/></span><span><b>AADALA.MA</b><small>بوابة العدالة والمعرفة القانونية</small></span></div><button onClick={close} aria-label="إغلاق القائمة"><X/></button></div>
        <label className="justice-drawer-search"><Search size={17}/><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="ابحث داخل أقسام المنصة..." /></label>
        {query.trim() ? <div className="justice-drawer-results">{filtered.map((item) => { const Icon = item.icon; return <Link key={item.href} href={`/${locale}${item.href}`} onClick={close}><Icon size={18}/><span>{item.label}<small>{item.description}</small></span></Link>; })}{filtered.length === 0 && <p>لا توجد نتائج مطابقة.</p>}</div> : <div className="justice-drawer-content"><Link className="justice-drawer-home" href={`/${locale}`} onClick={close}><Landmark size={19}/>الرئيسية<ArrowUpLeft size={16}/></Link>{groups.map((group) => <section key={group.eyebrow}><div className="justice-drawer-section-title"><span>{group.eyebrow}</span><b>{group.title}</b></div>{group.links.map((item) => { const Icon = item.icon; return <Link key={item.href} href={`/${locale}${item.href}`} onClick={close} className={isActive(item.href) ? "is-active" : ""}><Icon size={18}/><span>{item.key ? nav[item.key] ?? item.label : item.label}</span><ArrowUpLeft size={14}/></Link>; })}</section>)}</div>}
        <div className="justice-drawer-footer"><ShieldCheck size={16}/> منصة معرفية مستقلة للتوعية والبحث القانوني</div>
      </aside>
    </>
  );
}
