"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import {
  COURT_LEVELS,
  DISPUTES,
  GLOSSARY,
  INSTITUTIONS,
  JOURNEY,
  JUSTICE_SYMBOLS,
  MAXIMS,
  OFFICIAL_SOURCES,
  TIMELINE,
} from "./homeContent";

const ICONS: Record<string, ReactNode> = {
  scale: (
    <path d="M32 8v44M18 52h28M10 20h44M10 20l-7 18h14zM54 20l-7 18h14zM3 38q7 8 14 0M47 38q7 8 14 0" />
  ),
  arch: (
    <path d="M12 56V34C12 16 24 8 32 8s20 8 20 26v22M21 56V36c0-10 5-16 11-16s11 6 11 16v20M8 56h48" />
  ),
  seal: (
    <>
      <path d="M14 14h36v36H14zM32 4l28 28-28 28L4 32z" />
      <circle cx="32" cy="32" r="8" />
    </>
  ),
  scroll: (
    <path d="M16 10h32a4 4 0 014 4v36a4 4 0 01-4 4H20a4 4 0 01-4-4V14M16 10a4 4 0 00-4 4v4h8M24 24h20M24 32h20M24 40h12" />
  ),
  gavel: <path d="M10 20l12-12 16 16-12 12zM30 30l24 24M6 58h24" />,
  sword: <path d="M32 4v40M22 44h20M32 44v12M26 56h12M29 4h6" />,
  eye: (
    <>
      <path d="M6 32q26-22 52 0-26 22-52 0zM4 12 60 52" />
      <circle cx="32" cy="32" r="6" />
    </>
  ),
  book: <path d="M8 12q12-4 24 4 12-8 24-4v38q-12-4-24 4-12-8-24-4zM32 16v38" />,
  crown: <path d="M8 46 4 18l16 14 12-20 12 20 16-14-4 28zM8 54h48" />,
};

const SYMBOL_ICON: Record<string, string> = {
  scale: "scale",
  sword: "sword",
  blindfold: "eye",
  text: "book",
  king: "crown",
};

function Icon({ name }: { name: string }) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      {ICONS[name] ?? ICONS.scale}
    </svg>
  );
}

function FlipCard({
  icon,
  title,
  text,
  open,
  onToggle,
  compact = false,
}: {
  icon: string;
  title: string;
  text: string;
  open: boolean;
  onToggle: () => void;
  compact?: boolean;
}) {
  return (
    <button
      className={`m-sc${open ? " f" : ""}${compact ? " m-tm" : ""}`}
      type="button"
      aria-pressed={open}
      onClick={onToggle}
    >
      <i className="m-fr">
        <Icon name={icon} />
        <b>{title}</b>
      </i>
      <i className="m-bk">{text}</i>
    </button>
  );
}

function useCountUp(target: number, active: boolean) {
  const [value, setValue] = useState(target);

  useEffect(() => {
    if (!active) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    let start = 0;
    const duration = 900;
    const tick = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min(1, (timestamp - start) / duration);
      setValue(Math.round(target * progress));
      if (progress < 1) frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [target, active]);

  return value;
}

type CourtInfo =
  | { kind: "hint" }
  | { kind: "level"; level: number }
  | { kind: "dispute"; key: string };

export default function JusticeSections({ locale }: { locale: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const towerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);

  const [left, setLeft] = useState(0);
  const [right, setRight] = useState(0);
  const [maxim, setMaxim] = useState(0);
  const [hold, setHold] = useState(false);
  const [flipped, setFlipped] = useState<Record<string, boolean>>({});
  const [levelsOn, setLevelsOn] = useState<number[]>([]);
  const [courtInfo, setCourtInfo] = useState<CourtInfo>({ kind: "hint" });
  const [activeDispute, setActiveDispute] = useState<string | null>(null);
  const [mapActive, setMapActive] = useState(false);

  const primary = useCountUp(109, mapActive);
  const appeal = useCountUp(34, mapActive);
  const financial = useCountUp(4, mapActive);

  const angle = Math.max(-16, Math.min(16, -(left - right) * 5));

  const sequence = useCallback((steps: number[]) => {
    timers.current.forEach((timer) => window.clearTimeout(timer));
    timers.current = [];
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setLevelsOn(steps);
      return;
    }
    setLevelsOn([]);
    steps.forEach((level, index) => {
      timers.current.push(
        window.setTimeout(() => setLevelsOn(steps.slice(0, index + 1)), 300 * index + 150),
      );
    });
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    root.classList.add("m-reveal");
    const items = Array.from(root.querySelectorAll(".m-stn"));
    if (!("IntersectionObserver" in window)) {
      items.forEach((item) => item.classList.add("in"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 },
    );
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const tower = towerRef.current;
    if (!tower || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          sequence([1, 2, 3]);
          observer.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    observer.observe(tower);
    return () => {
      observer.disconnect();
      timers.current.forEach((timer) => window.clearTimeout(timer));
    };
  }, [sequence]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !("IntersectionObserver" in window)) {
      const timer = window.setTimeout(() => setMapActive(true), 0);
      return () => window.clearTimeout(timer);
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setMapActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    observer.observe(map);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (hold) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      if (!document.hidden) setMaxim((index) => (index + 1) % MAXIMS.length);
    }, 7000);
    return () => window.clearInterval(id);
  }, [hold]);

  function toggleCard(key: string) {
    setFlipped((current) => ({ ...current, [key]: !current[key] }));
  }

  function pickLevel(level: number) {
    timers.current.forEach((timer) => window.clearTimeout(timer));
    timers.current = [];
    setLevelsOn([level]);
    setActiveDispute(null);
    setCourtInfo({ kind: "level", level });
  }

  function pickDispute(key: string) {
    setActiveDispute(key);
    setCourtInfo({ kind: "dispute", key });
    sequence([1, 2, 3]);
  }

  const dispute = courtInfo.kind === "dispute" ? DISPUTES.find((item) => item.key === courtInfo.key) : undefined;
  const courtLevel = courtInfo.kind === "level" ? COURT_LEVELS.find((item) => item.level === courtInfo.level) : undefined;
  const currentMaxim = MAXIMS[maxim] ?? MAXIMS[0];

  return (
    <div className="m-justice" ref={rootRef}>
      <h2>ميزان الإنصاف</h2>
      <p className="m-sub">
        ضع الحجج في كفّتي الميزان وانظر كيف يميل. العدل ألا يميل القاضي إلا بحجة.
      </p>
      <div className="m-scl">
        <svg viewBox="0 0 400 220" role="img" aria-label="ميزان ذو كفتين">
          <path d="M200 60v150M150 210h100" />
          <circle cx="200" cy="60" r="7" />
          <g style={{ transform: `rotate(${angle}deg)`, transformOrigin: "200px 60px" }}>
            <path d="M60 60h280" />
            <g style={{ transform: `rotate(${-angle}deg)`, transformOrigin: "60px 60px" }}>
              <path d="M60 60 20 150M60 60l40 90M10 150h100q-8 28-50 28T10 150z" />
              <g fill="currentColor" stroke="none">
                {Array.from({ length: left }, (_, index) => (
                  <circle
                    key={`l-${index}`}
                    cx={30 + (index % 4) * 20}
                    cy={142 - Math.floor(index / 4) * 19}
                    r={8}
                  />
                ))}
              </g>
            </g>
            <g style={{ transform: `rotate(${-angle}deg)`, transformOrigin: "340px 60px" }}>
              <path d="M340 60l-40 90M340 60l40 90M290 150h100q-8 28-50 28t-50-28z" />
              <g fill="currentColor" stroke="none">
                {Array.from({ length: right }, (_, index) => (
                  <circle
                    key={`r-${index}`}
                    cx={310 + (index % 4) * 20}
                    cy={142 - Math.floor(index / 4) * 19}
                    r={8}
                  />
                ))}
              </g>
            </g>
          </g>
        </svg>
        <div className="m-btns">
          <button className="m-b2" type="button" onClick={() => setLeft((value) => Math.min(8, value + 1))} disabled={left >= 8}>
            حجة للمدّعي +
          </button>
          <button className="m-b2" type="button" onClick={() => setRight((value) => Math.min(8, value + 1))} disabled={right >= 8}>
            حجة للمدّعى عليه +
          </button>
          <button
            className="m-b2 o"
            type="button"
            onClick={() => {
              setLeft(0);
              setRight(0);
            }}
          >
            إعادة
          </button>
        </div>
        <p id="m-st" role="status">
          {left === right
            ? "الميزان متوازن: لا يميل إلا بحجة."
            : left > right
              ? "رجحت كفّة المدّعي بحججها."
              : "رجحت كفّة المدّعى عليه بحججه."}
        </p>
      </div>

      <h2>رموز العدل ودلالاتها</h2>
      <p className="m-sub">انقر على أي رمز لتقرأ دلالته.</p>
      <div className="m-sy">
        {JUSTICE_SYMBOLS.map((symbol) => (
          <FlipCard
            key={symbol.id}
            icon={SYMBOL_ICON[symbol.id] ?? "scale"}
            title={symbol.title}
            text={symbol.text}
            open={Boolean(flipped[`symbol-${symbol.id}`])}
            onToggle={() => toggleCard(`symbol-${symbol.id}`)}
          />
        ))}
      </div>

      <div
        className="m-qb"
        onMouseEnter={() => setHold(true)}
        onMouseLeave={() => setHold(false)}
        onFocus={() => setHold(true)}
        onBlur={() => setHold(false)}
      >
        <div id="m-qt" key={maxim} aria-live="off">
          {currentMaxim?.text}
        </div>
        <div id="m-qs">{currentMaxim?.source}</div>
        <div className="m-qn">
          <button className="m-b2 o" type="button" aria-label="السابقة" onClick={() => setMaxim((index) => (index - 1 + MAXIMS.length) % MAXIMS.length)}>
            →
          </button>
          <button className="m-b2 o" type="button" aria-label="التالية" onClick={() => setMaxim((index) => (index + 1) % MAXIMS.length)}>
            ←
          </button>
        </div>
      </div>

      <h2>الدستور يحرس العدالة</h2>
      <p className="m-sub">
        ثلاثة فصول تختصر روح العدالة في الدستور المغربي. النص الكامل في موقع الأمانة العامة للحكومة.
      </p>
      <div className="m-jr m-cs">
        <div className="m-stn" style={{ "--i": 0 } as React.CSSProperties}>
          <b>٢٣</b>
          <h4>قرينة البراءة</h4>
          <p>قرينة البراءة والحق في محاكمة عادلة مضمونان.</p>
        </div>
        <div className="m-stn" style={{ "--i": 1 } as React.CSSProperties}>
          <b>١١٧</b>
          <h4>القاضي حارس الحقوق</h4>
          <p>يتولى القاضي حماية حقوق الأشخاص والجماعات وحرياتهم وأمنهم القضائي، وتطبيق القانون.</p>
        </div>
        <div className="m-stn" style={{ "--i": 2 } as React.CSSProperties}>
          <b>١٢٠</b>
          <h4>المحاكمة العادلة</h4>
          <p>لكل شخص الحق في محاكمة عادلة وفي حكم يصدر داخل أجل معقول، وحقوق الدفاع مضمونة أمام جميع المحاكم.</p>
        </div>
      </div>
      <p className="m-note">
        صياغة مختصرة بتصرّف من دستور المملكة المغربية لسنة 2011.{" "}
        <a href={`/${locale}/legal/constitution-2011`}>اقرأ النص الكامل في المكتبة</a>، وراجعه دائمًا في الجريدة الرسمية.
      </p>

      <h2>صومعة العدالة: هرم المحاكم</h2>
      <p className="m-sub">
        كما تعلو الصومعة طبقةً فوق طبقة، تعلو المحاكم المغربية درجةً فوق درجة. اختر نوع نزاعك لترى الطريق الذي يسلكه،
        أو انقر على أي طبقة.
      </p>
      <div className="m-courts">
        <div className="m-tw" ref={towerRef}>
          <svg className={`m-lan${levelsOn.includes(3) ? " on" : ""}`} viewBox="0 0 64 64" aria-hidden="true">
            {ICONS.scale}
          </svg>
          {COURT_LEVELS.map((level) => (
            <button
              key={level.level}
              className={`m-tr m-t${level.level}${levelsOn.includes(level.level) ? " on" : ""}`}
              type="button"
              onClick={() => pickLevel(level.level)}
            >
              <span>{level.title}</span>
              <small>{level.subtitle}</small>
            </button>
          ))}
        </div>
        <div>
          <div className="m-chips2">
            {DISPUTES.map((item) => (
              <button
                key={item.key}
                className={`m-b2 o m-dz${activeDispute === item.key ? " on" : ""}`}
                type="button"
                onClick={() => pickDispute(item.key)}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="m-card" aria-live="polite">
            {dispute ? (
              <>
                <h3>{dispute.title}</h3>
                <ol>
                  <li>تبدأ في: {dispute.first}</li>
                  <li>ثم الطعن عند الاقتضاء أمام: {dispute.appeal}</li>
                  <li>وأخيرًا: محكمة النقض (الغرفة المختصة)، وهي تراقب تطبيق القانون.</li>
                </ol>
                <p className="m-note">
                  إرشاد عام: يتحدد الاختصاص بنوع النزاع ومكانه وقيمته. تحقق من المحكمة المختصة عبر{" "}
                  <a href="https://www.mahakim.ma" target="_blank" rel="noopener noreferrer">
                    بوابة محاكم
                  </a>{" "}
                  أو{" "}
                  <a href="https://www.justice.gov.ma" target="_blank" rel="noopener noreferrer">
                    وزارة العدل
                  </a>
                  .
                </p>
              </>
            ) : courtLevel ? (
              <>
                <h3>{courtLevel.title}</h3>
                <p>{courtLevel.body}</p>
              </>
            ) : (
              <>
                <h3>اقرأ الصومعة من الأسفل</h3>
                <p>
                  القضية تبدأ غالبًا في الطبقة السفلى، وتصعد إلى الاستئناف إن وُجد طعن، ثم إلى محكمة النقض التي تراقب
                  تطبيق القانون. اختر نوع نزاعك فوق.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="m-inst">
        {INSTITUTIONS.map((institution) => (
          <div className="m-ins" key={institution.title}>
            <h4>{institution.title}</h4>
            <p>{institution.text}</p>
          </div>
        ))}
      </div>
      <div className="m-jm" ref={mapRef}>
        <h3 style={{ fontSize: "1.4rem" }}>الخريطة القضائية للمملكة</h3>
        <div className="m-ns">
          <div>
            <b className="m-cn">{primary}</b>
            <span>محكمة من الدرجة الأولى</span>
          </div>
          <div>
            <b className="m-cn">{appeal}</b>
            <span>محكمة من الدرجة الثانية</span>
          </div>
          <div>
            <b className="m-cn">{financial}</b>
            <span>محاكم استئناف بأقسام للجرائم المالية</span>
          </div>
        </div>
        <p>
          محاكم الدرجة الأولى تضم المحاكم الابتدائية العادية والتجارية والإدارية، ومحاكم الدرجة الثانية تضم محاكم
          الاستئناف العادية والتجارية والإدارية. من محاكم الاستئناف التجارية: الدار البيضاء وفاس ومراكش وطنجة وأكادير.
        </p>
        <p className="m-note">
          المصدر: المرسوم رقم 2.23.665 بتحديد الخريطة القضائية للمملكة، كما حُيِّن في{" "}
          <a href="https://adala.justice.gov.ma" target="_blank" rel="noopener noreferrer">
            بوابة عدالة
          </a>
          . الأعداد تتغير مع التحيين، فراجع النسخة الأحدث.
        </p>
      </div>

      <h2>ذاكرة العدل المغربي</h2>
      <p className="m-sub">
        من القاضي والعدول إلى استقلال السلطة القضائية: محطات صنعت القانون المغربي. مرّر جانبًا. التواريخ للتوجيه العام
        وتُراجع على الجريدة الرسمية.
      </p>
      <div className="m-tl" tabIndex={0} aria-label="محطات تاريخية">
        {TIMELINE.map((stop) => (
          <div className="m-tc" key={`${stop.date}-${stop.title}`}>
            <b>{stop.date}</b>
            <h4>{stop.title}</h4>
            <p>{stop.text}</p>
          </div>
        ))}
      </div>

      <h2>قاموس العدل المغربي</h2>
      <p className="m-sub">كلمات تسمعها في المحاكم والعقود المغربية. انقر لتعرف معناها.</p>
      <div className="m-sy">
        {GLOSSARY.map((entry) => (
          <FlipCard
            key={entry.term}
            icon={entry.icon}
            title={entry.term}
            text={entry.text}
            compact
            open={Boolean(flipped[`glossary-${entry.term}`])}
            onToggle={() => toggleCard(`glossary-${entry.term}`)}
          />
        ))}
      </div>

      <h2>رحلة الدعوى</h2>
      <p className="m-sub">
        مهما اختلف الباب، فمسار القضية يمرّ غالبًا بهذه المحطات. تختلف التفاصيل بين المدني والجنائي والإداري.
      </p>
      <div className="m-jr">
        {JOURNEY.map((step, index) => (
          <div className="m-stn" key={step.title} style={{ "--i": index } as React.CSSProperties}>
            <b>{["١", "٢", "٣", "٤", "٥", "٦"][index] ?? index + 1}</b>
            <h4>{step.title}</h4>
            <p>{step.text}</p>
          </div>
        ))}
      </div>

      <div className="m-src" aria-labelledby="m-src-title">
        <h3 id="m-src-title">ركيزتنا: المصادر الرسمية</h3>
        <p>كل إحالة هنا تشير إلى جهة رسمية. نصوص القوانين تُراجَع دائمًا على النسخة المنشورة في الجريدة الرسمية.</p>
        <ul>
          {OFFICIAL_SOURCES.map((source) => (
            <li key={source.href}>
              <a href={source.href} target="_blank" rel="noopener noreferrer">
                {source.label}
              </a>{" "}
              — {source.note}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
