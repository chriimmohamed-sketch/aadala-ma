"use client";

import { useState } from "react";
import AIChat from "@/components/AIChat";
import { Sparkles, X } from "lucide-react";

/**
 * Floating AI assistant widget — additive, does not replace AIChat.
 * Small button (bottom-left) expands to a compact chat panel.
 * User can close it anytime.
 */
export default function FloatingAI({ locale }: { locale: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="فتح المساعد الذكي"
          className="fixed bottom-20 left-4 z-50 flex h-14 w-14 items-center justify-center rounded-full border-2 border-gold bg-navy text-ivory shadow-2xl transition hover:scale-105 md:bottom-6"
        >
          <Sparkles size={24} />
        </button>
      )}

      {/* Compact chat panel */}
      {open && (
        <div className="fixed bottom-20 left-4 z-50 w-[92vw] max-w-md md:bottom-6">
          <div className="aadala-card flex flex-col overflow-hidden shadow-2xl" style={{ maxHeight: "70vh" }}>
            <div className="flex items-center justify-between border-b border-border bg-navy px-4 py-2 text-ivory">
              <span className="font-display text-sm font-bold">AADALA AI — المساعد</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="إغلاق المساعد"
                className="flex h-7 w-7 items-center justify-center rounded-full text-ivory/70 hover:bg-white/10"
              >
                <X size={16} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <AIChat locale={locale} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
