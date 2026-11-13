"use client";
import { useEffect, useRef } from "react";

export default function ZelligeCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    // Parent is .hero (see app/[locale]/page.tsx). Canvas must size to it.
    const hero = canvas?.parentElement as HTMLElement | null;
    if (!canvas || !hero) return;
    const cx = canvas.getContext("2d");
    if (!cx) return;

    let W = 0, H = 0; const S = 68;
    let mx: number | null = null, my: number | null = null;
    let vis = true;
    let raf = 0;

    function size() {
      const r = hero!.getBoundingClientRect();
      const p = Math.min(window.devicePixelRatio || 1, 2);
      W = r.width; H = r.height;
      canvas!.width = W * p; canvas!.height = H * p;
      cx!.setTransform(p, 0, 0, p, 0, 0);
    }

    function sq(x: number, y: number, r: number, a: number) {
      cx!.save(); cx!.translate(x, y); cx!.rotate(a); cx!.strokeRect(-r, -r, 2 * r, 2 * r); cx!.restore();
    }

    function draw(t: number) {
      const cs = getComputedStyle(document.documentElement);
      const teal = cs.getPropertyValue("--teal").trim();
      const brass = cs.getPropertyValue("--brass").trim();
      const px = mx == null ? W * 0.3 + Math.sin(t / 1700) * W * 0.22 : mx;
      const py = my == null ? H * 0.45 + Math.cos(t / 2100) * H * 0.25 : my;
      cx!.clearRect(0, 0, W, H);
      cx!.lineWidth = 1.3;
      for (let y = S / 2; y < H + S; y += S) {
        for (let x = S / 2; x < W + S; x += S) {
          const k = Math.max(0, 1 - Math.hypot(x - px, y - py) / 280);
          const e = k * k;
          const r = S * 0.3 * (1 + e * 0.55);
          cx!.globalAlpha = 0.14 + e * 0.85;
          cx!.strokeStyle = e > 0.35 ? brass : teal;
          sq(x, y, r, e * Math.PI / 2);
          sq(x, y, r, Math.PI / 4 + e * Math.PI / 2);
          if (e > 0.2) { cx!.beginPath(); cx!.arc(x, y, S * 0.09 + e * S * 0.12, 0, 7); cx!.stroke(); }
        }
      }
      cx!.globalAlpha = 1;
    }

    function loop(t: number) { if (vis) draw(t); raf = requestAnimationFrame(loop); }

    size();
    const onResize = () => size();
    window.addEventListener("resize", onResize);
    const onMove = (e: PointerEvent) => { const r = hero!.getBoundingClientRect(); mx = e.clientX - r.left; my = e.clientY - r.top; };
    const onLeave = () => { mx = my = null; };
    hero.addEventListener("pointermove", onMove, { passive: true });
    hero.addEventListener("pointerleave", onLeave);

    const io = new IntersectionObserver((es) => { vis = es[0].isIntersecting; });
    io.observe(hero);

    const rm = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (rm) draw(0); else raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      hero.removeEventListener("pointermove", onMove);
      hero.removeEventListener("pointerleave", onLeave);
      io.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className="cv" aria-hidden="true" />;
}