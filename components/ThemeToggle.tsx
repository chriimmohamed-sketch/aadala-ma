"use client";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const stored = localStorage.getItem("aadala-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = stored ? stored === "dark" : prefersDark;
    setDark(isDark);
    root.setAttribute("data-theme", isDark ? "dark" : "light");
  }, []);

  function toggle() {
    const root = document.documentElement;
    const next = !dark;
    setDark(next);
    root.setAttribute("data-theme", next ? "dark" : "light");
    localStorage.setItem("aadala-theme", next ? "dark" : "light");
  }

  return (
    <button className="theme" type="button" aria-label="تبديل الوضع الداكن" onClick={toggle}>
      {dark ? "☀" : "◐"}
    </button>
  );
}