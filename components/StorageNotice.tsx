"use client";
import { useEffect, useState } from "react";

const KEY = "aadala-notice-ack";

export default function StorageNotice({ locale }: { locale: string }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    try { if (!localStorage.getItem(KEY)) setShow(true); } catch { setShow(true); }
  }, []);
  if (!show) return null;
  function ack() {
    try { localStorage.setItem(KEY, "1"); } catch { /* ignore */ }
    setShow(false);
  }
  return (
    <div role="region" aria-label="إشعار التخزين المحلي" className="print:hidden fixed inset-x-0 bottom-0 z-50 border-t border-border bg-surface p-4 text-sm shadow-lg">
      <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-3">
        <p className="max-w-2xl">
          يستخدم الموقع تخزينًا محليًا ضروريًا فقط (مثل تفضيل الوضع الداكن) ولا يستخدم ملفات تتبّع إعلانية.{" "}
          <a className="underline" href={`/${locale}/privacy`}>سياسة الخصوصية</a>
        </p>
        <button type="button" onClick={ack} className="aadala-btn-primary">فهمت</button>
      </div>
    </div>
  );
}
