"use client";

import { useEffect, useRef } from "react";

interface LightRaysProps {
  color?: string;
  count?: number;
  className?: string;
}

export default function LightRays({ color = "#C9A227", count = 8, className = "" }: LightRaysProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const container = ref.current;
    const rays: HTMLDivElement[] = [];
    for (let i = 0; i < count; i++) {
      const ray = document.createElement("div");
      ray.style.position = "absolute";
      ray.style.top = "0";
      ray.style.left = "50%";
      ray.style.width = "2px";
      ray.style.height = "100%";
      ray.style.background = `linear-gradient(to bottom, ${color}40, transparent)`;
      ray.style.transformOrigin = "top center";
      ray.style.transform = `rotate(${(i - count / 2) * 8}deg)`;
      ray.style.opacity = "0.6";
      ray.style.pointerEvents = "none";
      container.appendChild(ray);
      rays.push(ray);
    }

    let frame: number;
    let t = 0;
    const animate = () => {
      t += 0.005;
      rays.forEach((ray, i) => {
        ray.style.opacity = String(0.3 + 0.3 * Math.sin(t + i * 0.5));
        ray.style.transform = `rotate(${(i - count / 2) * 8 + Math.sin(t + i) * 2}deg)`;
      });
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frame);
      rays.forEach((r) => r.remove());
    };
  }, [color, count]);

  return (
    <div
      ref={ref}
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
    />
  );
}
