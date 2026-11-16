"use client";

import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";

/** Opens `fileUrl` in a new tab (next to a print option when the doc is a page). */
export default function DownloadButton({ fileUrl, label = "تنزيل" }: { fileUrl: string; label?: string }) {
  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      onClick={() => window.open(fileUrl, "_blank", "noopener")}
      className="inline-flex items-center gap-2 rounded-full border-2 border-teal bg-teal px-5 py-2 text-sm font-bold text-white"
    >
      <ArrowDown size={18} />
      {label}
    </motion.button>
  );
}
