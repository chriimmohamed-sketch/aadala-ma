"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type AgentPhase = "idle" | "researching" | "coding" | "automating" | "devops" | "fixing" | "success" | "error";

export interface AgentLogLine {
  id: number;
  phase: AgentPhase;
  text: string;
  ts: number;
}

export interface AgentTask {
  id: string;
  label: string;
  run: () => Promise<void>;
}

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

export function useAgentOrchestrator() {
  const [phase, setPhase] = useState<AgentPhase>("idle");
  const [lines, setLines] = useState<AgentLogLine[]>([]);
  const [running, setRunning] = useState(false);
  const counter = useRef(0);

  const runCycle = useCallback(() => {
    if (running) return;
    setRunning(true);
    setLines([]);
    setPhase("researching");
    const timers: number[] = [];
    for (const step of SCRIPTED_RUN) {
      const id = ++counter.current;
      timers.push(
        window.setTimeout(() => {
          setLines((prev) => [...prev, { id, phase: step.phase, text: step.text, ts: Date.now() }]);
          setPhase(step.phase);
          if (step.phase === "idle") setRunning(false);
        }, step.delay),
      );
    }
    return () => timers.forEach(clearTimeout);
  }, [running]);

  const reset = useCallback(() => {
    setLines([]);
    setPhase("idle");
    setRunning(false);
  }, []);

  return { phase, lines, running, runCycle, reset };
}
