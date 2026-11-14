"use client";

import { useCallback, useEffect, useRef } from "react";

/**
 * Plays the illustrative "answer forms step by step" animation.
 * Respects prefers-reduced-motion: falls back to instantly showing all steps.
 * Labelled illustrative only — not a legal answer.
 */
export default function AnswerAnimator() {
  const started = useRef(false);
  const timers = useRef<number[]>([]);

  const play = useCallback(() => {
    const d = document;
    const blks = Array.from(d.querySelectorAll(".blk")) as HTMLElement[];
    const btns = Array.from(d.querySelectorAll(".part")) as HTMLElement[];
    if (!blks.length) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
    if (reduced) {
      blks.forEach((b) => b.classList.add("on"));
      btns.forEach((b, i) => b.setAttribute("aria-pressed", String(i < blks.length)));
      return;
    }
    blks.forEach((b) => b.classList.remove("on"));
    blks.forEach((b, i) => {
      const t = window.setTimeout(() => {
        b.classList.add("on");
        btns.forEach((btn, j) => btn.setAttribute("aria-pressed", String(j === i)));
      }, 400 + i * 650);
      timers.current.push(t);
    });
    const done = window.setTimeout(() => {
      blks.forEach((b) => b.classList.add("on"));
      btns.forEach((b) => b.setAttribute("aria-pressed", "true"));
    }, 400 + blks.length * 650 + 300);
    timers.current.push(done);
  }, []);

  useEffect(() => {
    started.current = false;
    const btn = document.getElementById("watch-answer");
    if (!btn) return;
    const on = () => play();
    btn.addEventListener("click", on);
    return () => {
      btn.removeEventListener("click", on);
      timers.current.forEach((t) => window.clearTimeout(t));
    };
  }, [play]);

  return null;
}
