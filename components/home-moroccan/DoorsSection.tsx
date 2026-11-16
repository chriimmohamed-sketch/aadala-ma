"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { DOORS, type Door } from "./homeContent";

const HAND = (
  <svg viewBox="0 0 64 64" width="64" height="64" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden="true">
    <rect x="14" y="14" width="36" height="36" />
    <rect x="14" y="14" width="36" height="36" transform="rotate(45 32 32)" />
    <circle cx="32" cy="29" r="5" />
    <path d="M32 34v10" />
  </svg>
);

export default function DoorsSection({
  locale,
  active,
  onOpenDoor,
  onClose,
}: {
  locale: string;
  active: Door | null;
  onOpenDoor: (door: Door) => void;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [done, setDone] = useState<number[]>([]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    let timer = 0;
    if (active) {
      timer = window.setTimeout(() => {
        try {
          const raw = window.localStorage.getItem(`adl-${active.key}`);
          const parsed: unknown = raw ? JSON.parse(raw) : [];
          setDone(Array.isArray(parsed) ? parsed.filter((value): value is number => typeof value === "number") : []);
        } catch {
          setDone([]);
        }
      }, 0);
      if (!dialog.open) dialog.showModal();
    } else if (dialog.open) {
      dialog.close();
    }
    return () => window.clearTimeout(timer);
  }, [active]);

  function toggle(index: number) {
    if (!active) return;
    const next = done.includes(index) ? done.filter((value) => value !== index) : [...done, index];
    setDone(next);
    try {
      window.localStorage.setItem(`adl-${active.key}`, JSON.stringify(next));
    } catch {
      /* private mode */
    }
  }

  const total = active?.docs.length ?? 0;
  const percent = total > 0 ? Math.round((done.length / total) * 100) : 0;
  const internal = (href: string) => (href.startsWith("/") ? `/${locale}${href}` : href);

  return (
    <section id="m-doors" className="m-doors-block" aria-labelledby="m-doors-title">
      <h2 id="m-doors-title">أبواب المدينة الستة</h2>
      <p className="m-sub">
        لكل باب بابُ مشكلةٍ شائعة. مرّر المؤشر ليُفتح، أو انقر لتحصل على خطتك خطوة بخطوة — ثم تابع في أدوات المنصة
        وموادها.
      </p>
      <div className="m-doors">
        {DOORS.map((door) => (
          <button
            key={door.key}
            className="m-door"
            type="button"
            style={{ "--dc": door.color } as React.CSSProperties}
            aria-label={`باب ${door.title}`}
            onClick={() => onOpenDoor(door)}
          >
            <span className="m-frame">
              <span className="m-dn">{door.title}</span>
              <span className="m-dm">{door.meta}</span>
              <span className="m-leaf">{HAND}</span>
            </span>
          </button>
        ))}
      </div>

      <dialog
        className="m-dlg"
        ref={dialogRef}
        aria-labelledby="m-door-title"
        onClose={onClose}
        onClick={(event) => {
          if (event.target === dialogRef.current) onClose();
        }}
      >
        {active ? (
          <>
            <div className="m-sh" style={{ "--dc": active.color } as React.CSSProperties}>
              <button className="m-x" type="button" aria-label="إغلاق" onClick={onClose}>✕</button>
              <h3 id="m-door-title">{active.emoji} {active.title}</h3>
              <p>{active.meta}</p>
            </div>
            <div className="m-bd">
              <div className="m-st">
                <div className="m-n">1</div>
                <div>
                  <h4>الجهة المختصة</h4>
                  <p>{active.court}</p>
                </div>
              </div>

              <div className="m-st">
                <div className="m-n">2</div>
                <div className="m-st-grow">
                  <h4>جهّز ملفك <small>({done.length} من {total})</small></h4>
                  <div
                    className="m-bar"
                    role="progressbar"
                    aria-valuemin={0}
                    aria-valuemax={total}
                    aria-valuenow={done.length}
                    aria-label="الوثائق المجهزة"
                  >
                    <i style={{ width: `${percent}%` }} />
                  </div>
                  {active.docs.map((doc, index) => (
                    <label className="m-ck" key={doc}>
                      <input
                        type="checkbox"
                        checked={done.includes(index)}
                        onChange={() => toggle(index)}
                      />
                      <span>{doc}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="m-st">
                <div className="m-n">3</div>
                <div>
                  <h4>السند القانوني</h4>
                  <p>{active.law}</p>
                </div>
              </div>

              <div className="m-st">
                <div className="m-n">4</div>
                <div>
                  <h4>أدوات ومواد الموقع</h4>
                  <div className="m-lk">
                    {active.siteLinks.map((link) => (
                      <Link key={`${link.href}-${link.label}`} href={internal(link.href)} onClick={onClose}>
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              <div className="m-st">
                <div className="m-n">5</div>
                <div>
                  <h4>المصادر الرسمية</h4>
                  <div className="m-lk">
                    {active.sources.map((source) => (
                      <a key={source.href} href={source.href} target="_blank" rel="noopener noreferrer">
                        {source.label}
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              <p className="m-note">
                الآجال والشروط تختلف بحسب كل حالة، وقد تتغير النصوص. راجع النص المنشور في الجريدة الرسمية قبل أي إجراء.
              </p>
            </div>
          </>
        ) : null}
      </dialog>
    </section>
  );
}
