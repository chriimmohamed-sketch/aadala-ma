"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

interface BlurTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
}

export default function BlurText({ text, className = "", delay = 0, duration = 1 }: BlurTextProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      ref.current.style.opacity = "1";
      ref.current.style.filter = "none";
      return;
    }
    const el = ref.current;
    el.style.opacity = "0";
    el.style.filter = "blur(12px)";
    gsap.to(el, {
      opacity: 1,
      filter: "blur(0px)",
      duration,
      delay,
      ease: "power2.out",
    });
  }, [text, delay, duration]);

  return <span ref={ref} className={className}>{text}</span>;
}
