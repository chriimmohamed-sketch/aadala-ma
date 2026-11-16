"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { FormEvent, PointerEvent as ReactPointerEvent } from "react";
import {
  DOORS,
  HERO_ARTICLES,
  HERO_EXAMPLES,
  JUSTICE_SYMBOLS,
  matchDoor,
} from "./homeContent";

const SKY_STOPS = [
  { a: [38, 52, 122], b: [244, 170, 120] },
  { a: [30, 110, 200], b: [190, 228, 240] },
  { a: [74, 40, 120], b: [238, 120, 70] },
  { a: [6, 12, 34], b: [20, 32, 86] },
];

function mix(from: number[], to: number[], t: number) {
  return from.map((value, index) => Math.round(value + ((to[index] ?? value) - value) * t));
}

export default function MoroccanHero({
  locale,
  onOpenDoor,
}: {
  locale: string;
  onOpenDoor: (door: (typeof DOORS)[number]) => void;
}) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const sunRef = useRef<HTMLDivElement>(null);
  const clockRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef(0);
  const [query, setQuery] = useState("");
  const [note, setNote] = useState("");
  const [articleIndex, setArticleIndex] = useState(0);
  const [symbolIndex, setSymbolIndex] = useState(0);
  const [dates, setDates] = useState<{ hijri: string; gregorian: string } | null>(null);
  const [shooting, setShooting] = useState<{ id: number; top: number; left: number } | null>(null);

  const article = HERO_ARTICLES[articleIndex] ?? HERO_ARTICLES[0];
  const symbol = JUSTICE_SYMBOLS[symbolIndex] ?? JUSTICE_SYMBOLS[0];
  const liveDoor = query.trim().length > 2 ? matchDoor(query) : null;

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    const update = () => {
      rafRef.current = 0;
      const height = scene.offsetHeight || 1;
      const progress = Math.max(0, Math.min(1, window.scrollY / (height * 0.8)));
      const scaled = progress * (SKY_STOPS.length - 1);
      const index = Math.min(SKY_STOPS.length - 2, Math.floor(scaled));
      const t = scaled - index;
      const from = SKY_STOPS[index];
      const to = SKY_STOPS[index + 1];
      if (from && to) {
        scene.style.setProperty("--sky-a", `rgb(${mix(from.a, to.a, t).join(",")})`);
        scene.style.setProperty("--sky-b", `rgb(${mix(from.b, to.b, t).join(",")})`);
      }
      scene.style.setProperty("--day", String(Math.max(0, 1 - progress * 1.4)));
      scene.style.setProperty("--nt", String(Math.max(0, (progress - 0.5) * 2)));
      if (clockRef.current) {
        const labels = ["فجر", "ضحى", "عصر", "غروب", "ليل"];
        clockRef.current.textContent = labels[Math.min(4, Math.floor(progress * 5))] ?? "غروب";
      }
      if (sunRef.current) {
        const night = progress > 0.8;
        sunRef.current.style.left = `${10 + 78 * progress}%`;
        sunRef.current.style.top = `${62 - 48 * Math.sin(Math.PI * Math.min(progress, 0.95))}%`;
        sunRef.current.style.background = night ? "#e9e9ff" : "#F7B538";
        sunRef.current.style.boxShadow = night
          ? "0 0 50px 14px rgba(233,233,255,.35)"
          : "0 0 70px 24px rgba(247,181,56,.55)";
      }
    };
    const onScroll = () => {
      if (rafRef.current) return;
      rafRef.current = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
    };
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const now = new Date();
        setDates({
          hijri: new Intl.DateTimeFormat("ar-u-ca-islamic-umalqura", { dateStyle: "long" }).format(now),
          gregorian: new Intl.DateTimeFormat("ar-MA", { dateStyle: "long" }).format(now),
        });
      } catch {
        setDates(null);
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const articleTimer = window.setInterval(() => {
      if (!document.hidden) setArticleIndex((index) => (index + 1) % HERO_ARTICLES.length);
    }, 9000);
    const symbolTimer = window.setInterval(() => {
      if (!document.hidden) setSymbolIndex((index) => (index + 1) % JUSTICE_SYMBOLS.length);
    }, 6500);
    return () => {
      window.clearInterval(articleTimer);
      window.clearInterval(symbolTimer);
    };
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      if (document.hidden) return;
      setShooting({ id: Date.now(), top: Math.random() * 35, left: Math.random() * 60 });
      window.setTimeout(() => setShooting(null), 1300);
    }, 7000);
    return () => window.clearInterval(timer);
  }, []);

  function onPointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    const scene = sceneRef.current;
    if (!scene) return;
    const rect = scene.getBoundingClientRect();
    scene.style.setProperty("--mx", `${((event.clientX - rect.left) / rect.width) * 100}%`);
    scene.style.setProperty("--my", `${((event.clientY - rect.top) / rect.height) * 100}%`);
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = query.trim();
    if (!value) {
      setNote("اكتب مشكلتك أولًا.");
      return;
    }
    const door = matchDoor(value);
    if (door) {
      setNote("");
      onOpenDoor(door);
      return;
    }
    setNote("لم نجد بابًا واضحًا. اختر من الأبواب الستة أدناه.");
    const target = document.getElementById("m-doors");
    target?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    });
  }

  function pickExample(example: string) {
    setQuery(example);
    setNote("");
    const door = matchDoor(example);
    if (door) onOpenDoor(door);
  }

  function cycleEmblem() {
    setSymbolIndex((index) => (index + 1) % JUSTICE_SYMBOLS.length);
    setArticleIndex((index) => (index + 1) % HERO_ARTICLES.length);
  }

  return (
    <div className="m-hero" id="top">
      <div
        className="m-scene"
        ref={sceneRef}
        onPointerMove={onPointerMove}
      >
        <div className="m-sky" aria-hidden="true" />
        <div className="m-stars" aria-hidden="true" />
        <div className="m-sun" ref={sunRef} aria-hidden="true" />

        <div className="m-fx" aria-hidden="true">
          <svg className="m-zl" aria-hidden="true">
            <defs>
              <pattern id="m-zellige" width="80" height="80" patternUnits="userSpaceOnUse">
                <g fill="none" stroke="#F7B538" strokeWidth="1.2">
                  <rect x="20" y="20" width="40" height="40" />
                  <rect x="20" y="20" width="40" height="40" transform="rotate(45 40 40)" />
                  <circle cx="40" cy="40" r="10" />
                  <path d="M0 0l12 12M80 0L68 12M0 80l12-12M80 80L68 68" />
                </g>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#m-zellige)" />
          </svg>
          <svg className="m-zl lit" aria-hidden="true">
            <rect width="100%" height="100%" fill="url(#m-zellige)" />
          </svg>
          <div className="m-spot" />
          {Array.from({ length: 6 }, (_, index) => (
            <i
              key={`beam-${index}`}
              className="m-ln"
              style={{
                insetInlineStart: `${8 + index * 17 + (index % 2) * 3}%`,
                height: `${60 + ((index * 37) % 110)}px`,
                animationDelay: `-${index * 0.7}s`,
              } as React.CSSProperties}
            >
              <i />
            </i>
          ))}
          {[12, 26, 7].map((top, index) => (
            <i
              key={`cloud-${index}`}
              className={`m-cld ${index === 1 ? "c2" : index === 2 ? "c3" : ""}`}
              style={{ top: `${top}%`, "--d": `${150 + index * 40}s`, "--l": `${-30 - index * 45}s` } as React.CSSProperties}
            />
          ))}
          <div className="m-brds">
            {Array.from({ length: 6 }, (_, index) => (
              <div
                key={`bird-${index}`}
                className="m-brd"
                style={{
                  "--t": `${10 + ((index * 13) % 34)}%`,
                  "--w": `${18 + (index % 3) * 7}px`,
                  "--d": `${26 + index * 5}s`,
                  "--l": `${-index * 6.5}s`,
                } as React.CSSProperties}
              >
                <svg viewBox="0 0 26 12">
                  <path d="M1 8q6-9 12 0q6-9 12 0" />
                </svg>
              </div>
            ))}
          </div>
          <div className="m-ems">
            {Array.from({ length: 24 }, (_, index) => (
              <i
                key={`ember-${index}`}
                className="m-em"
                style={{
                  "--x": `${(index * 37) % 100}%`,
                  "--dx": `${((index * 53) % 80) - 40}px`,
                  "--d": `${9 + ((index * 7) % 9)}s`,
                  "--l": `${-((index * 1.7) % 12).toFixed(1)}s`,
                } as React.CSSProperties}
              />
            ))}
          </div>
          {shooting ? (
            <i
              className="m-shoot"
              key={shooting.id}
              style={{ top: `${shooting.top}%`, left: `${shooting.left}%` }}
            />
          ) : null}
        </div>

        <div className="m-clk" ref={clockRef} aria-hidden="true" />
        {dates ? (
          <div className="m-date">
            {dates.hijri}
            <br />
            {dates.gregorian}
          </div>
        ) : null}

        <svg className="m-skyline m-s1" viewBox="0 0 1200 210" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 210V140q30-40 60 0v-15h26v15q34-60 68 0v10h60V110h8V86l6-14 6 14v24h8v40h80q40-60 80 0v-10h50V120q25-35 50 0v30h90q30-50 60 0v-20h70V100h8V78l6-12 6 12v22h8v50h90q35-55 70 0v-12h60q22-38 44 0v12h80V210Z" />
        </svg>
        <svg className="m-skyline" viewBox="0 0 1200 150" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 150V118h60V98h40v20h50V88q20-30 40 0v30h70V108h30V78h10V68h6v10h10v30h60V88q30-50 60 0v20h40V104h50v14h60V84h8V58l6-14 6 14v26h8v34h70V94q25-40 50 0v24h60V98h40v20h80V94q15-25 30 0v24h60V106h50v12h70V90h12v-8h6v8h12v28h60V108h50v42Z" />
        </svg>

        <div className="m-wrap">
          <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
            <symbol id="m-sym-scale" viewBox="0 0 64 64">
              <path d="M32 8v44M18 52h28M10 20h44M10 20l-7 18h14zM54 20l-7 18h14zM3 38q7 8 14 0M47 38q7 8 14 0" />
            </symbol>
            <symbol id="m-sym-arch" viewBox="0 0 64 64">
              <path d="M12 56V34C12 16 24 8 32 8s20 8 20 26v22M21 56V36c0-10 5-16 11-16s11 6 11 16v20M8 56h48" />
            </symbol>
            <symbol id="m-sym-seal" viewBox="0 0 64 64">
              <path d="M14 14h36v36H14zM32 4l28 28-28 28L4 32zM32 24a8 8 0 100 16 8 8 0 000-16z" />
            </symbol>
            <symbol id="m-sym-scroll" viewBox="0 0 64 64">
              <path d="M16 10h32a4 4 0 014 4v36a4 4 0 01-4 4H20a4 4 0 01-4-4V14M16 10a4 4 0 00-4 4v4h8M24 24h20M24 32h20M24 40h12" />
            </symbol>
            <symbol id="m-sym-gavel" viewBox="0 0 64 64">
              <path d="M10 20l12-12 16 16-12 12zM30 30l24 24M6 58h24" />
            </symbol>
          </svg>

          <svg className="m-halo" viewBox="0 0 160 160" aria-hidden="true">
            <g fill="none" stroke="currentColor" strokeWidth="1.2">
              <rect x="30" y="30" width="100" height="100" />
              <rect x="30" y="30" width="100" height="100" transform="rotate(45 80 80)" />
              <rect x="30" y="30" width="100" height="100" transform="rotate(22.5 80 80)" />
              <rect x="30" y="30" width="100" height="100" transform="rotate(67.5 80 80)" />
              <circle cx="80" cy="80" r="74" strokeDasharray="2 6" />
              <circle cx="80" cy="80" r="40" />
            </g>
          </svg>
          <button className="m-emb" type="button" onClick={cycleEmblem} aria-label="بدّل رمز العدل">
            <svg viewBox="0 0 64 64" aria-hidden="true">
              <use href={`#m-sym-${symbol.icon}`} />
            </svg>
          </button>
          <div className="m-cap" aria-hidden="true">{symbol.caption}</div>
          <div className="m-kick">عدالة · AADALA.MA</div>
          <h1>
            قل لنا مشكلتك…
            <br />
            ندلّك على الباب
          </h1>
          <p className="m-lead">
            اكتب ما حدث لك بكلماتك، فنقودك إلى المحكمة المختصة والوثائق والنص القانوني، مع روابط المصادر الرسمية.
          </p>

          <form
            className="m-ask"
            action={`/${locale}/ai`}
            method="get"
            role="search"
            onSubmit={submit}
          >
            <input
              id="m-q"
              name="q"
              type="text"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                if (note) setNote("");
              }}
              aria-label="صف مشكلتك"
              placeholder="مثال: صاحب الكراء يريد إخراجي من البيت"
              autoComplete="off"
            />
            <button className="m-go" type="submit">دلّني</button>
          </form>

          <div className="m-chips" id="m-chips">
            {HERO_EXAMPLES.map((example) => (
              <button key={example} className="m-chip" type="button" onClick={() => pickExample(example)}>
                {example}
              </button>
            ))}
          </div>
          <div className="m-live" aria-live="polite">
            {liveDoor ? (
              <button type="button" onClick={() => onOpenDoor(liveDoor)}>
                الباب الأقرب: {liveDoor.title} — افتحه
              </button>
            ) : null}
          </div>
          <p className="m-note" role="status">{note}</p>
          <p className="m-ai-link">
            أو اسأل <Link href={`/${locale}/ai`}>المساعد القانوني</Link> مباشرة، أو{" "}
            <Link href={`/${locale}/search`}>ابحث في النصوص</Link>.
          </p>

          <aside className="m-art k" key={articleIndex} aria-label="فصل قانوني متغير">
            <b>{article.number}</b>
            <p>{article.text}</p>
            <small>{article.source}</small>
          </aside>
          <div className="m-hint">↓ مرّر نحو الغروب لترى أبواب المدينة</div>
        </div>
      </div>
    </div>
  );
}
