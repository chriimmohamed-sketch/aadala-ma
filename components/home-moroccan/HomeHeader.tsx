"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";
import { CITY_THEMES } from "./homeContent";

/**
 * Homepage-only header. The rest of the site keeps HeaderSupreme, so the
 * internal pages and their menus are untouched.
 */
export default function HomeHeader({ locale }: { locale: string }) {
  const [cityIndex, setCityIndex] = useState(0);
  const [toast, setToast] = useState("");

  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = localStorage.getItem("aadala-city");
    } catch {
      /* private mode */
    }
    const index = Math.max(
      0,
      CITY_THEMES.findIndex((city) => city.key === saved),
    );
    applyCity(index);
    const timer = window.setTimeout(() => setCityIndex(index), 0);
    return () => window.clearTimeout(timer);
  }, []);

  function applyCity(index: number) {
    const city = CITY_THEMES[index];
    if (!city) return;
    if (city.key === "fes") {
      delete document.documentElement.dataset.city;
    } else {
      document.documentElement.dataset.city = city.key;
    }
    try {
      localStorage.setItem("aadala-city", city.key);
    } catch {
      /* private mode */
    }
  }

  function cycleCity() {
    const next = (cityIndex + 1) % CITY_THEMES.length;
    setCityIndex(next);
    applyCity(next);
    const city = CITY_THEMES[next];
    if (!city) return;
    setToast(`${city.label} — ${city.note}`);
    window.setTimeout(() => setToast(""), 1800);
  }

  return (
    <>
      <header className="mh-header">
        <div className="mh-wrap">
          <Link className="mh-logo" href={`/${locale}`} aria-label="AADALA.MA — الصفحة الرئيسية">
            <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
              <rect x="9" y="9" width="22" height="22" />
              <rect x="9" y="9" width="22" height="22" transform="rotate(45 20 20)" />
              <line x1="20" y1="13" x2="20" y2="27" />
              <line x1="14" y1="15" x2="26" y2="15" />
            </svg>
            <span>AADALA.MA</span>
          </Link>

          <nav className="mh-nav" aria-label="التنقل الرئيسي">
            <Link href={`/${locale}/ai`}>المساعد</Link>
            <a href="#library">المكتبة</a>
            <a href="#tools">الأدوات</a>
            <a href="#trust">المنهجية</a>
            <Link href={`/${locale}/report`}>أبلغ عن خطأ</Link>
          </nav>

          <div className="mh-actions">
            <button className="m-kbd" id="kbd" type="button" aria-label="فتح البحث السريع">
              <span aria-hidden="true">⌕</span>
              <span className="m-kbd-label">انتقال سريع</span>
              <kbd>Ctrl K</kbd>
            </button>
            <button
              className="m-city"
              type="button"
              onClick={cycleCity}
              title="تبديل الطابع المغربي"
              aria-label={`الطابع المغربي: ${CITY_THEMES[cityIndex]?.label ?? "فاس"}`}
            >
              <span aria-hidden="true">🏺</span>
              <span>{CITY_THEMES[cityIndex]?.label ?? "فاس"}</span>
            </button>
            <Link className="m-icon" href={`/${locale}/login`} aria-label="دخول">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <circle cx="12" cy="8" r="3.5" />
                <path d="M5 20c.7-4 3.2-6 7-6s6.3 2 7 6" />
              </svg>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>
      <div className={`m-cityname ${toast ? "on" : ""}`} role="status" aria-live="polite">
        {toast}
      </div>
    </>
  );
}
