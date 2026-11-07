"use client";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { FiBook, FiSearch, FiUsers, FiFileText } from "react-icons/fi";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const stats = [
  { title: "المصادر القانونية", value: 7, icon: <FiBook />, change: "+7" },
  { title: "البحث (AI)", value: 0, icon: <FiSearch />, change: "+0%" },
  { title: "المستخدمون", value: 0, icon: <FiUsers />, change: "+0%" },
  { title: "الوثائق", value: 0, icon: <FiFileText />, change: "+0%" },
];

const chartData = [
  { name: "Jan", uv: 0 },
  { name: "Feb", uv: 0 },
  { name: "Mar", uv: 0 },
  { name: "Apr", uv: 0 },
  { name: "May", uv: 0 },
];

export default function LegalDashboard() {
  return (
    <div className="min-h-screen bg-bg p-8 font-body" dir="rtl">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-navy mb-2">لوحة AADALA</h1>
        <p className="text-muted">إحصائيات المنصة (بيانات تجريبية)</p>
      </div>
      <div className="max-w-6xl mx-auto space-y-12">
        <section>
          <h2 className="text-xl font-semibold text-navy mb-6 border-b border-border pb-2">نظرة عامة</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div key={index} whileHover={{ y: -5 }} className="aadala-card p-6 cursor-pointer">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted mb-1">{stat.title}</p>
                    <h2 className="text-2xl font-bold text-navy mb-2">{stat.value}</h2>
                    <p className="flex items-center gap-1 text-sm text-teal font-medium">
                      <ArrowUpRight size={16} /> {stat.change}
                    </p>
                  </div>
                  <div className="text-teal text-2xl bg-teal/10 p-3 rounded-xl">{stat.icon}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <section className="aadala-card p-6">
            <h2 className="text-lg font-semibold text-navy mb-4">مخطط النشاط</h2>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <XAxis dataKey="name" stroke="#4B5964" />
                  <YAxis stroke="#4B5964" />
                  <Tooltip contentStyle={{ backgroundColor: "#FFFDF6", border: "1px solid #D9D2BE", borderRadius: "8px", color: "#0C1A2B" }} />
                  <Line type="monotone" dataKey="uv" stroke="#0F5C52" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </section>
          <section className="aadala-card p-6 flex flex-col items-center justify-center gap-8">
            <h2 className="text-lg font-semibold text-navy self-start w-full mb-2">عناصر تفاعلية</h2>
            <p className="text-sm text-muted">قيد التطوير</p>
          </section>
        </div>
      </div>
    </div>
  );
}