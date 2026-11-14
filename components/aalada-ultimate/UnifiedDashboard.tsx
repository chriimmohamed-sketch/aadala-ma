"use client";

import React from "react";
import { motion } from "framer-motion";
import { Activity, LayoutDashboard, Settings, Zap, Globe, ArrowUpRight, Server, Cpu, MemoryStick } from "lucide-react";
import { LineChart, Line, ResponsiveContainer, XAxis, Tooltip } from "recharts";

const PROJECTS = [
  { id: "aadala-ma", name: "AADALA.MA", url: "https://aadala-ma.cheraimmohamed20.workers.dev", status: "live", cpu: 12, mem: 44 },
  { id: "aadala-ai", name: "AADALA AI", url: "https://aadala-ma.cheraimmohamed20.workers.dev/ar/ai", status: "preview", cpu: 34, mem: 62 },
  { id: "miyar", name: "MIYAR", url: "https://aadala-ma.cheraimmohamed20.workers.dev/ar/miyar", status: "live", cpu: 8, mem: 31 },
  { id: "legal-ency", name: "الموسوعة", url: "https://aadala-ma.cheraimmohamed20.workers.dev/ar/legal", status: "live", cpu: 15, mem: 50 },
  { id: "qanun", name: "القانون بنصّه", url: "/ar/legal", status: "live", cpu: 4, mem: 20 },
  { id: "al-ilm", name: "العلم", url: "/ar/academic", status: "live", cpu: 6, mem: 26 },
];

function spark(seed: number) {
  return Array.from({ length: 12 }, (_, i) => ({ x: i, y: Math.max(1, 50 + Math.sin(i * 0.7 + seed) * 25 + (Math.random() - 0.5) * 12) }));
}

const STATUS_COLOR: Record<string, string> = {
  live: "bg-emerald-400",
  preview: "bg-amber-400",
  error: "bg-rose-400",
};

export function ProjectCard({ p }: { p: typeof PROJECTS[number] }) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-2xl transition hover:border-white/20"
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-bold text-white">{p.name}</h3>
          <a href={p.url} target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex items-center gap-1 text-xs text-cyan-300 hover:text-cyan-200">
            {p.url.replace("https://", "")} <ArrowUpRight size={12} />
          </a>
        </div>
        <span className={`h-2.5 w-2.5 rounded-full ${STATUS_COLOR[p.status]}`} />
      </div>
      <div className="mt-4 h-12">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={spark(p.cpu)}>
            <XAxis dataKey="x" hide />
            <Tooltip contentStyle={{ background: "#0b1220", border: "1px solid #1f2937", fontSize: 11 }} />
            <Line type="monotone" dataKey="y" stroke="#22d3ee" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
        <span className="flex items-center gap-1"><Cpu size={12} /> {p.cpu}%</span>
        <span className="flex items-center gap-1"><MemoryStick size={12} /> {p.mem}%</span>
        <span className="flex items-center gap-1"><Server size={12} /> Workers</span>
      </div>
    </motion.div>
  );
}

export function MetricsWidget() {
  const cpu = spark(1);
  const mem = spark(2);
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-2xl">
        <div className="mb-2 flex items-center gap-2 text-sm text-gray-300">
          <Activity size={14} /> CPU (live)
        </div>
        <div className="h-20">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={cpu}>
              <XAxis dataKey="x" hide />
              <Line type="monotone" dataKey="y" stroke="#f59e0b" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-2xl">
        <div className="mb-2 flex items-center gap-2 text-sm text-gray-300">
          <Activity size={14} /> Memory (live)
        </div>
        <div className="h-20">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mem}>
              <XAxis dataKey="x" hide />
              <Line type="monotone" dataKey="y" stroke="#34d399" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default function UnifiedDashboard() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden w-64 shrink-0 border-r border-white/10 bg-black/40 p-4 backdrop-blur-2xl md:block">
          <div className="mb-6 flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-cyan-400 to-orange-400" />
            <span className="font-bold">AALADA ULTIMATE</span>
          </div>
          <nav className="space-y-1 text-sm">
            {["Overview", "Projects", "Metrics", "Agents", "Settings"].map((n) => (
              <a key={n} href="#" className="block rounded-lg px-3 py-2 text-gray-300 hover:bg-white/5 hover:text-white">
                {n}
              </a>
            ))}
          </nav>
        </aside>
        {/* Main */}
        <main className="flex-1 p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Cloud Command Center</h1>
              <p className="text-sm text-gray-400">AADALA.MA — Supreme Architect dashboard</p>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <Globe size={14} /> aadala-ma.cheraimmohamed20.workers.dev
            </div>
          </div>
          <MetricsWidget />
          <h2 className="mb-3 mt-6 text-lg font-semibold">Projects</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PROJECTS.map((p) => (
              <ProjectCard key={p.id} p={p} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
