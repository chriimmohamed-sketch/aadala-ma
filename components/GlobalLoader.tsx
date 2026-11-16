"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

/** Brief pulse loader (auto-hides). Pure transition, no data fetch. */
export default function GlobalLoader({ durationMs = 1400 }: { durationMs?: number }) {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setVisible(false), durationMs);
    return () => clearTimeout(t);
  }, [durationMs]);
  if (!visible) return null;
  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-ivory" initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ duration: 0.4, delay: durationMs / 1000 }} aria-hidden>
      <div className="flex gap-3">
        {[0, 1].map((i) => (
          <motion.span key={i} className="block h-12 w-20 rounded-full bg-navy" animate={{ scale: [1, 1.15, 1] }} transition={{ repeat: Infinity, duration: 0.9, delay: i * 0.2 }} />
        ))}
      </div>
    </motion.div>
  );
}
