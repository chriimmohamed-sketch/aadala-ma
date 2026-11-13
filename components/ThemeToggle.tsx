"use client";
import { useEffect, useState } from "react";

function initialDark(): boolean {
  if (typeof window === "undefined") return false;
  const stored = localStorage.getItem("aadala-theme");
  if (stored) return stored === "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export default function ThemeToggle() {
  const [dark, setDark] = useState(initialDark);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
  }, [dark]);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.setAttribute("data-theme", next ? "dark" : "light");
    localStorage.setItem("aadala-theme", next ? "dark" : "light");
  }

  return (
    <button className="theme" type="button" aria-label="تبديل الوضع الداكن" onClick={toggle}>
      {dark ? "☀" : "◐"}
    </button>
  );
}