"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal as TerminalIcon, X, ChevronDown } from "lucide-react";

export type AgentPhase = "idle" | "researching" | "coding" | "automating" | "devops" | "fixing" | "success" | "error";

interface LogLine {
  id: number;
  phase: AgentPhase;
  text: string;
  ts: number;
}

const PHASE_COLOR: Record<AgentPhase, string> = {
  idle: "text-gray-400",
  researching: "text-cyan-300",
  coding: "text-emerald-300",
  automating: "text-amber-300",
  devops: "text-violet-300",
  fixing: "text-orange-300",
  success: "text-green-400",
  error: "text-rose-400",
};

const PHASE_LABEL: Record<AgentPhase, string> = {
  idle: "idle",
  researching: "RESEARCH",
  coding: "CODE",
  automating: "AUTOMATE",
  devops: "DEVOPS",
  fixing: "FIX",
  success: "OK",
  error: "ERR",
};

const SCRIPTED_RUN: Array<{ phase: AgentPhase; text: string; delay: number }> = [
  { phase: "researching", text: "[Researcher] Parsing request: \"secure document template engine\"", delay: 0 },
  { phase: "researching", text: "[Researcher] Querying legal corpus (733 chunks)…", delay: 600 },
  { phase: "researching", text: "[Researcher] Found 12 relevant articles (obligations-contrats, code-penal) ✓", delay: 1200 },
  { phase: "coding", text: "[Coder] Scaffolding /lib/documents/engine.ts (TS, RLS-aware)", delay: 1800 },
  { phase: "coding", text: "[Coder] Writing 2725 bytes — fill.ts, engine.ts, types.ts", delay: 2400 },
  { phase: "coding", text: "[Coder] tsc --noEmit …", delay: 3000 },
  { phase: "fixing", text: "[Coder] TS error: 'verified' is possibly undefined. Patching …", delay: 3600 },
  { phase: "coding", text: "[Coder] Patch applied. Re-running tsc …", delay: 4200 },
  { phase: "success", text: "[Coder] ✓ tsc clean · 0 errors", delay: 4800 },
  { phase: "automating", text: "[Automator] Triggering n8n workflow 'notify-reviewers' (mocked)", delay: 5400 },
  { phase: "automating", text: "[Automator] Webhook 200 OK · queued 1 notification", delay: 6000 },
  { phase: "devops", text: "[DevOps] Cloudflare Workers build (cf:build) …", delay: 6600 },
  { phase: "devops", text: "[DevOps] cf:build complete · .open-next/worker.js (2,216 B) + 89 assets", delay: 7200 },
  { phase: "success", text: "[DevOps] ✓ Deployed aadala-ma 3554c86b-5ffd-40cc-a7d8-ed4e8ae44ebb", delay: 7800 },
  { phase: "idle", text: "[Agent] Cycle complete. Awaiting next instruction.", delay: 8400 },
];

export default function AgentTerminal() {
  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState<LogLine[]>([]);
  const [phase, setPhase] = useState<AgentPhase>("idle");
  const [running, setRunning] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const counter = useRef(0);

  useEffect(() => {
    if (!running) return;
    const timers: number[] = [];
    setLines([]);
    setPhase("researching");
    for (const step of SCRIPTED_RUN) {
      const id = ++counter.current;
      timers.push(window.setTimeout(() => {
        setLines((prev) => [...prev, { id, phase: step.phase, text: step.text, ts: Date.now() }]);
        setPhase(step.phase);
        if (step.phase === "idle") setRunning(false);
      }, step.delay));
    }
    return () => timers.forEach(clearTimeout);
  }, [running]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [lines]);

  return (
    <>
      <motion.button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-black/60 px-4 py-2 text-sm font-mono text-cyan-300 shadow-2xl backdrop-blur-xl border border-cyan-400/30 hover:border-cyan-400 transition"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        aria-label="Toggle agent terminal"
      >
        <TerminalIcon size={16} />
        AALADA AGENT
        <ChevronDown size={14} className={open ? "rotate-180 transition-transform" : "transition-transform"} />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-20 right-6 z-50 w-[min(90vw,520px)] overflow-hidden rounded-2xl border border-white/10 bg-black/70 shadow-2xl backdrop-blur-2xl"
          >
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-2 text-xs font-mono text-gray-400">
              <span className="flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${running ? "animate-pulse bg-emerald-400" : "bg-gray-500"}`} />
                phase: <span className={PHASE_COLOR[phase]}>{PHASE_LABEL[phase]}</span>
              </span>
              <button onClick={() => setOpen(false)} className="rounded p-1 text-gray-400 hover:text-white" aria-label="Close">
                <X size={14} />
              </button>
            </div>
            <div ref={scrollRef} className="h-72 overflow-y-auto px-4 py-3 font-mono text-xs leading-relaxed text-gray-200">
              {lines.length === 0 && (
                <p className="text-gray-500">Press "Run cycle" to start the self-correction loop.</p>
              )}
              {lines.map((l) => (
                <div key={l.id} className={`${PHASE_COLOR[l.phase]} whitespace-pre-wrap`}>
                  {l.text}
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between border-t border-white/10 px-4 py-2">
              <button
                onClick={() => setRunning(true)}
                disabled={running}
                className="rounded-lg bg-cyan-500/20 px-3 py-1.5 text-xs font-mono text-cyan-300 hover:bg-cyan-500/30 disabled:opacity-40"
              >
                {running ? "Running…" : "Run cycle"}
              </button>
              <span className="text-[10px] text-gray-500">mocked · no real backend</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
