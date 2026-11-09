"use client";

import { motion } from "framer-motion";

export default function HangingCard({ userName, role }: { userName: string; role: string }) {
  return (
    <div className="flex items-start justify-center">
      <motion.div className="flex flex-col items-center" animate={{ rotate: [0, 1.2, -1.2, 0] }} transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}>
        <div className="h-10 w-1.5 bg-graphite-soft/40" />
        <div className="relative w-72 rotate-0 rounded-2xl bg-navy p-5 text-ivory shadow-2xl">
          <div className="mb-4 flex items-start justify-between">
            <h3 className="font-display text-lg font-bold">AADALA.MA</h3>
            <span className="text-[11px] text-ivory/60">مؤسِّس</span>
          </div>
          <p className="text-xs text-ivory/70">طالب جامعي + محتوى قانوني موثق</p>
          <h2 className="mt-1 text-2xl font-bold">{userName}</h2>
          <p className="text-sm text-ivory/70">{role}</p>
          <p className="mt-4 text-[11px] tracking-widest text-ivory/50">AADALA.MA — القانون بنصه ومادته</p>
          <div className="mt-3 flex items-center justify-between text-xs text-ivory/60">
            <span>aadala-ma</span>
            <span className="font-bold text-ivory">AR</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
