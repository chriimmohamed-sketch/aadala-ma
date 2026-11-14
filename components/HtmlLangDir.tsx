"use client";

import { useEffect } from "react";

export default function HtmlLangDir({ locale, rtl }: { locale: string; rtl: boolean }) {
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = rtl ? "rtl" : "ltr";
  }, [locale, rtl]);
  return null;
}
