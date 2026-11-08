"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight,
  ArrowDown,
  Upload,
  Lock,
  Search,
  Home,
  Plus,
  User,
  Bell,
  Folder,
  BookOpen,
  TrendingUp,
  Globe,
} from "lucide-react";
import { FiBook, FiSearch, FiUsers, FiFileText } from "react-icons/fi";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

/* ============================================================
 * AADALA — معرض مكونات تفاعلية (framer-motion + lucide + recharts)
 * تكييف قانوني لمكتبة النماذج: إحصاءات، مصباح دخول، تحميل، رفع،
 * بطاقة معلقة، تحميل، تحقق، تنقل زجاجي. الألوان = Teal/Brass.
 * ============================================================ */

const iconMap: Record<string, React.ReactNode> = {
  book: <FiBook size={24} />,
  search: <FiSearch size={24} />,
  users: <FiUsers size={24} />,
  file: <FiFileText size={24} />,
};

const StatsCard = ({ title, value, change, icon }: { title: string; value: string; change: string; icon: string }) => (
  <motion.div whileHover={{ y: -5 }} className="aadala-card p-5">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-muted mb-1">{title}</p>
        <h2 className="text-2xl font-bold text-navy mb-2">{value}</h2>
        <p className="flex items-center gap-1 text-sm text-teal font-medium">
          <ArrowUpRight size={16} /> {change}
        </p>
      </div>
      <div className="text-teal text-2xl bg-teal/10 p-3 rounded-xl">{iconMap[icon]}</div>
    </div>
  </motion.div>
);

const LampLogin = ({ locale }: { locale: string }) => {
  const [isOn, setIsOn] = useState(false);
  return (
    <div className="relative flex flex-col items-center justify-center min-h-[380px] bg-[#111] overflow-hidden rounded-xl border border-white/10 w-full max-w-sm">
      <AnimatePresence>
        {isOn && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute top-20 w-64 h-64 bg-yellow-500/20 blur-[80px] rounded-full pointer-events-none"
          />
        )}
      </AnimatePresence>
      <motion.div
        className="cursor-pointer z-10 relative"
        onClick={() => setIsOn(!isOn)}
        animate={{ rotate: isOn ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        role="button"
        aria-label={isOn ? "إطفاء المصباح" : "تشغيل المصباح"}
      >
        <div className="w-32 h-16 bg-zinc-800 rounded-t-full border-b-4 border-yellow-600 flex justify-center items-end pb-2 shadow-2xl">
          <div className="w-4 h-4 bg-yellow-400 rounded-full shadow-[0_0_15px_#facc15]" />
        </div>
        <div className="w-1 h-8 bg-zinc-700 mx-auto" />
      </motion.div>
      <AnimatePresence>
        {isOn && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mt-10 p-6 bg-black/60 backdrop-blur-md border border-white/10 rounded-2xl w-4/5 z-10 text-center"
          >
            <h2 className="text-white mb-4 font-semibold">تسجيل الدخول</h2>
            <p className="text-xs text-white/60 mb-4">المصادقة الحقيقية عبر Supabase Auth على Workers</p>
            <Link
              href={`/${locale}/login`}
              className="block w-full bg-teal-700 text-white py-2 rounded-lg font-medium text-center no-underline"
            >
              متابعة إلى /ar/login
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const DownloadButton = () => (
  <div className="flex items-center justify-center p-8 bg-ivory-deep rounded-xl w-full max-w-sm border border-border">
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="rounded-full border-2 border-teal text-teal flex items-center justify-center gap-2 px-8 py-3 font-semibold overflow-hidden relative group bg-transparent"
    >
      <motion.div initial={{ width: 0 }} whileHover={{ width: "auto" }} className="flex items-center gap-2">
        <ArrowDown size={20} className="group-hover:animate-bounce" />
        <Link href="/ar/legal" className="text-teal no-underline">تحميل النصوص</Link>
      </motion.div>
    </motion.button>
  </div>
);

const BasketballUpload = () => (
  <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-2xl relative overflow-hidden text-graphite">
    <div className="flex justify-between items-center mb-6">
      <h3 className="font-bold text-xl">رفع وثيقة للمراجعة</h3>
      <span className="text-xs bg-gray-100 px-3 py-1 rounded-full text-gray-500">3 مرفوعة</span>
    </div>
    <div className="border-2 border-dashed border-gray-300 rounded-xl h-64 relative flex flex-col items-center justify-center bg-gray-50/50">
      <Upload className="text-gray-400 mb-2" size={32} />
      <p className="font-semibold text-gray-700">أسقط الملف هنا</p>
      <p className="text-sm text-gray-400">أو وجّه نحو السلة</p>
      <div className="absolute bottom-0 flex flex-col items-center">
        <div className="w-16 h-10 border-2 border-b-0 border-gray-400 rounded-t-sm relative">
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-20 h-8 border-2 border-gray-400 rounded-b-full border-t-0 flex flex-col justify-end items-center overflow-hidden">
            <div className="w-full h-[1px] bg-gray-300 absolute top-2" />
            <div className="w-full h-[1px] bg-gray-300 absolute top-4" />
          </div>
        </div>
      </div>
      <motion.div
        drag
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        className="absolute bottom-10 left-10 bg-white p-2 rounded shadow-lg cursor-grab active:cursor-grabbing border border-gray-200"
      >
        <Folder size={24} className="text-teal" />
        <span className="text-[10px] font-bold text-teal bg-teal-50 px-1 rounded mt-1 block">PDF</span>
      </motion.div>
    </div>
    <p className="text-center text-xs text-gray-400 mt-4">عرض بصري فقط — لا يُرفع ملف حقيقي على الثابت</p>
  </div>
);

const HangingCard = () => (
  <div className="flex flex-col items-center pt-10 h-[400px] bg-ivory-deep rounded-xl w-full max-w-sm relative overflow-hidden">
    <div className="w-full h-2 bg-gray-300 absolute top-8" />
    <motion.div
      animate={{ rotate: [-2, 2, -2] }}
      transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
      className="flex flex-col items-center origin-top z-10"
    >
      <div className="w-6 h-20 bg-[#0B1D3A] text-[8px] text-white flex items-center justify-center [writing-mode:vertical-lr] rotate-180">AADALA.MA</div>
      <div className="w-56 h-80 bg-[#0B1D3A] rounded-xl p-5 text-white shadow-2xl relative flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-xl font-bold">AADALA.</h2>
            <span className="text-[10px] text-gray-400">بطاقة نموذج</span>
          </div>
          <p className="text-xs text-gray-300 mb-1">الملتقى القانوني</p>
          <p className="text-xs text-gray-300 mb-1">القانون بنصّه ومادّته</p>
          <p className="text-xs text-gray-400">نموذج عرض تفاعلي</p>
        </div>
        <div>
          <p className="text-sm font-semibold">زائر</p>
          <p className="text-[10px] text-gray-400 mb-2">مشارك — نموذج</p>
          <h1 className="text-3xl font-bold">متحدث</h1>
          <p className="text-[10px] text-gray-400 tracking-widest">وصول للمسرح</p>
        </div>
        <div className="flex justify-between items-center text-xs text-gray-500 mt-4">
          <span>aadala.ma</span>
          <span className="text-white font-bold">1.</span>
        </div>
      </div>
    </motion.div>
  </div>
);

const SharinganLoader = () => (
  <div className="bg-[#0B1D3A] w-full max-w-sm h-64 flex items-center justify-center gap-8 rounded-xl border border-border relative overflow-hidden">
    {[1, 2].map((eye) => (
      <div key={eye} className="relative w-24 h-12 bg-teal-50 rounded-full flex items-center justify-center overflow-hidden border-2 border-teal">
        <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center relative">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            className="absolute inset-0 border border-teal rounded-full"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-black rounded-full border border-teal-100" />
            <div className="absolute bottom-2 left-1 w-2 h-2 bg-black rounded-full border border-teal-100" />
            <div className="absolute bottom-2 right-1 w-2 h-2 bg-black rounded-full border border-teal-100" />
          </motion.div>
        </div>
      </div>
    ))}
  </div>
);

const OtpV15 = () => {
  const [otp] = useState(["1", "2", "3", ""]);
  return (
    <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-sm flex flex-col items-center border border-gray-100 text-graphite">
      <div className="w-16 h-16 rounded-full bg-teal-50 flex items-center justify-center mb-4 border border-teal-100">
        <Lock className="text-teal" size={24} />
      </div>
      <h2 className="text-xl font-bold mb-2">التحقق من الهوية</h2>
      <p className="text-xs text-gray-500 mb-6 text-center">أدخل الرمز المكوّن من 4 أرقام المرسل إلى<br /><strong>بريدك الإلكتروني</strong></p>
      <div className="flex gap-3 mb-6" dir="ltr">
        {otp.map((digit, i) => (
          <div key={i} className={`w-14 h-16 border-2 rounded-xl flex items-center justify-center text-2xl font-bold ${digit ? "border-teal text-gray-800" : "border-gray-200 text-gray-300"}`}>
            {digit || "-"}
          </div>
        ))}
      </div>
      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-4">
        <div className="w-3/4 h-full bg-teal rounded-full" />
      </div>
      <p className="text-xs text-gray-500">لم يصلك الرمز؟ <span className="text-teal font-semibold cursor-pointer">أعد الإرسال خلال 0:16</span></p>
    </div>
  );
};

const GlassyOtpV4 = () => (
  <div className="bg-gradient-to-br from-zinc-800 to-black p-8 rounded-3xl shadow-2xl w-full max-w-sm relative overflow-hidden border border-white/10">
    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay" />
    <div className="relative z-10 flex flex-col items-center">
      <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4 backdrop-blur-sm shadow-[0_0_15px_rgba(16,185,129,0.25)]">
        <Lock className="text-teal-300" size={20} />
      </div>
      <h2 className="text-white font-bold text-lg mb-1">التحقق من الرقم</h2>
      <p className="text-xs text-gray-400 mb-6">أرسلنا رمزًا من 4 أرقام إلى هاتفك</p>
      <div className="flex gap-3 mb-6" dir="ltr">
        {[1, 2, 3, 4].map((_, i) => (
          <div key={i} className={`w-12 h-14 rounded-xl flex items-center justify-center border ${i === 0 ? "border-teal-400 shadow-[0_0_10px_rgba(45,212,191,0.5)] bg-teal-500/10" : "border-white/10 bg-white/5"} text-white`}>
            {i === 0 ? <span className="animate-pulse w-[2px] h-6 bg-teal-300" /> : ""}
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-500">لم تستلم الرمز؟ <span className="text-white cursor-pointer">أعد الإرسال</span></p>
    </div>
  </div>
);

const GlassyNavV5 = () => (
  <div className="w-full max-w-md bg-zinc-900 p-8 rounded-3xl flex flex-col gap-6 items-center border border-white/10">
    <div className="flex items-center justify-between w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-full p-2 px-4 shadow-lg">
      <div className="flex flex-col items-center text-teal-300"><Home size={20} /><span className="text-[10px] mt-1">الرئيسية</span></div>
      <div className="flex flex-col items-center text-gray-400"><Search size={20} /><span className="text-[10px] mt-1">بحث</span></div>
      <div className="flex flex-col items-center text-gray-400"><Plus size={20} /><span className="text-[10px] mt-1">إضافة</span></div>
      <div className="flex flex-col items-center text-gray-400"><User size={20} /><span className="text-[10px] mt-1">الحساب</span></div>
      <div className="flex flex-col items-center text-gray-400"><Bell size={20} /><span className="text-[10px] mt-1">تنبيهات</span></div>
    </div>
  </div>
);

const GlassyNavV7 = () => (
  <div className="w-full max-w-lg flex flex-col gap-4 items-center">
    <div className="flex items-center gap-6 bg-[#e0e0e0]/80 backdrop-blur-lg px-6 py-3 rounded-full shadow-xl border border-white/50 text-gray-700">
      <div className="flex items-center gap-2"><Home size={16} /> <span className="text-sm font-medium">الرئيسية</span></div>
      <div className="flex items-center gap-2"><Search size={16} /> <span className="text-sm font-medium">اكتشاف</span></div>
      <div className="flex items-center gap-2 bg-white px-4 py-1.5 rounded-full shadow-sm"><BookOpen size={16} /> <span className="text-sm font-medium">المكتبة</span></div>
      <div className="flex items-center gap-2 text-gray-500"><User size={16} /> <span className="text-sm font-medium">الحساب</span></div>
    </div>
    <div className="flex items-center gap-4 bg-white/40 backdrop-blur-xl px-4 py-2 rounded-full shadow-lg border border-white/60 text-gray-700">
      <div className="flex items-center gap-2"><User size={16} /> <span className="text-sm font-medium">المستخدم</span></div>
      <div className="flex items-center gap-2 bg-zinc-900 text-white px-4 py-2 rounded-full shadow-md"><Folder size={16} /> <span className="text-sm font-medium">نظرة عامة</span></div>
      <div className="flex items-center gap-2 text-gray-600"><Folder size={16} /> <span className="text-sm font-medium">المشاريع</span></div>
    </div>
  </div>
);

/* نشاط المنصة — صورة توضيحية (ليست إحصاءات حقيقية) */
const activityData = [
  { name: "يناير", uv: 12 },
  { name: "فبراير", uv: 18 },
  { name: "مارس", uv: 24 },
  { name: "أبريل", uv: 31 },
  { name: "مايو", uv: 42 },
];

const ActivityChart = () => (
  <div className="bg-white p-6 rounded-2xl w-full max-w-md shadow-xl border border-gray-100 text-graphite" dir="ltr">
    <div className="flex items-center justify-between mb-4">
      <h3 className="font-bold">نشاط الاستعلامات (نموذج توضيحي)</h3>
      <TrendingUp className="text-teal" size={20} />
    </div>
    <div className="h-48">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={activityData}>
          <XAxis dataKey="name" stroke="#737373" fontSize={12} />
          <YAxis stroke="#737373" fontSize={12} />
          <Tooltip contentStyle={{ backgroundColor: "#0B1D3A", border: "none", borderRadius: "8px", color: "#fff" }} />
          <Line type="monotone" dataKey="uv" stroke="#0F5C52" strokeWidth={3} dot={{ r: 3 }} activeDot={{ r: 6 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
    <p className="text-xs text-gray-400 mt-2">بيانات توضيحية للعرض فقط — ليست إحصاءات حقيقية.</p>
  </div>
);

const GlobeCard = () => (
  <div className="bg-[#0B1D3A] p-6 rounded-2xl w-full max-w-md shadow-xl border border-white/10 text-white">
    <div className="flex items-center gap-3 mb-4">
      <Globe className="text-[#C9A227]" size={28} />
      <h3 className="font-bold text-lg">شبكة المنصة</h3>
    </div>
    <p className="text-sm text-white/70 leading-7">مصادر قانونية مغربية موثقة، واجهة عربية RTL، ورابط مرجعي لكل مادة. هذا المعرض يجمع مكونات حركية للعرض التقني فقط.</p>
  </div>
);

const SectionTitle = ({ children }: { children: string }) => (
  <h2 className="text-xl text-graphite-soft font-semibold">{children}</h2>
);

export default function ShowcaseGallery({ locale }: { locale: string }) {
  return (
    <div className="min-h-screen bg-bg py-10 px-4" dir="rtl">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-navy">معرض المكونات التفاعلية</h1>
          <p className="mt-2 text-sm text-muted">مكونات framer-motion + lucide + recharts بهوية AADALA — للعرض التقني، ليست صفحة تشغيلية.</p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
          <div className="flex flex-col items-center gap-4">
            <SectionTitle>بطاقات إحصاء قانونية</SectionTitle>
            <StatsCard title="المصادر القانونية" value="7" change="+7" icon="book" />
            <StatsCard title="الاستعلامات (نموذجي)" value="42" change="+6" icon="search" />
            <StatsCard title="الوثائق (نموذجي)" value="5" change="+1" icon="file" />
          </div>
          <div className="flex flex-col items-center gap-4">
            <SectionTitle>مصباح الدخول</SectionTitle>
            <LampLogin locale={locale} />
          </div>
          <div className="flex flex-col items-center gap-4">
            <SectionTitle>زر التحميل</SectionTitle>
            <DownloadButton />
          </div>
          <div className="flex flex-col items-center gap-4">
            <SectionTitle>رفع وثيقة</SectionTitle>
            <BasketballUpload />
          </div>
          <div className="flex flex-col items-center gap-4">
            <SectionTitle>البطاقة المعلقة</SectionTitle>
            <HangingCard />
          </div>
          <div className="flex flex-col items-center gap-4">
            <SectionTitle>رسوم التحميل</SectionTitle>
            <SharinganLoader />
          </div>
          <div className="flex flex-col items-center gap-4">
            <SectionTitle>التحقق — أبيض</SectionTitle>
            <OtpV15 />
          </div>
          <div className="flex flex-col items-center gap-4">
            <SectionTitle>التحقق — داكن</SectionTitle>
            <GlassyOtpV4 />
          </div>
          <div className="flex flex-col items-center gap-4">
            <SectionTitle>تنقل زجاجي</SectionTitle>
            <GlassyNavV5 />
            <GlassyNavV7 />
          </div>
          <div className="flex flex-col items-center gap-4">
            <SectionTitle>مخطط النشاط</SectionTitle>
            <ActivityChart />
          </div>
          <div className="flex flex-col items-center gap-4">
            <SectionTitle>بطاقة الشبكة</SectionTitle>
            <GlobeCard />
          </div>
        </div>
      </div>
    </div>
  );
}
