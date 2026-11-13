"use client";

/** Opens the browser print dialog; the user can choose "Save as PDF". Only elements with .print-area are printed. */
export default function PrintButton({ label = "تصدير PDF / طباعة" }: { label?: string }) {
  return (
    <button type="button" onClick={() => window.print()} className="aadala-btn-primary print:hidden">
      {label}
    </button>
  );
}
