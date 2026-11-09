"use client";

import { useMemo } from "react";
import type { ShareLine } from "@/lib/miyar/types";
import { RELATION_LABELS } from "@/lib/miyar/engine";

const PALETTE = ["var(--aadala-teal)", "var(--aadala-gold)", "var(--aadala-navy)", "var(--aadala-muted)", "var(--aadala-success)", "var(--aadala-gold-soft)", "var(--aadala-navy-soft)", "var(--aadala-danger)", "var(--aadala-muted)", "var(--aadala-teal)"];

export default function MiyarSharePie({ shares, remainder }: { shares: ShareLine[]; remainder: number }) {
  const slices = useMemo(() => {
    const rows = shares.map((s, i) => ({
      label: (s.heirId === "wasiyya" ? "وصية" : (RELATION_LABELS[s.relation] ?? s.relation)) + (s.count > 1 ? ` × ${s.count}` : ""),
      value: Math.max(0, s.fraction),
      color: PALETTE[i % PALETTE.length],
    }));
    if (remainder > 0.0001) rows.push({ label: "باقٍ غير موزَّع", value: remainder, color: "var(--aadala-border)" });
    return rows.filter((r) => r.value > 0);
  }, [shares, remainder]);

  const total = slices.reduce((a, s) => a + s.value, 0) || 1;
  const R = 70;
  const C = 2 * Math.PI * R;
  const arcs = useMemo(() => {
    const c = 2 * Math.PI * R;
    return slices.map((s, i) => {
      const dash = (s.value / total) * c;
      const offset = slices.slice(0, i).reduce((a, x) => a + (x.value / total) * c, 0);
      return { ...s, dash, offset };
    });
  }, [slices, total]);

  return (
    <div className="flex flex-col items-center gap-4 md:flex-row">
      <svg width={180} height={180} viewBox="0 0 180 180" role="img" aria-label="مخطط دائري للأنصبة">
        <circle cx={90} cy={90} r={R} fill="none" strokeWidth={22} stroke="var(--aadala-ivory-deep)" />
        {arcs.map((s, i) => (
          <circle key={i} cx={90} cy={90} r={R} fill="none" stroke={s.color} strokeWidth={22} strokeDasharray={`${Math.max(0, s.dash - 1)} ${C}`} strokeDashoffset={-s.offset} transform="rotate(-90 90 90)" />
        ))}
        <text x={90} y={88} textAnchor="middle" fontSize={13} fontWeight={700} fill="var(--aadala-navy)">الأنصبة</text>
        <text x={90} y={103} textAnchor="middle" fontSize={11} fill="var(--aadala-muted)">({total.toFixed(2)})</text>
      </svg>
      <ul className="w-full space-y-1 text-xs">
        {slices.map((s, i) => (
          <li key={i} className="flex items-center gap-2">
            <span className="inline-block h-3 w-3 shrink-0 rounded-sm" style={{ background: s.color }} />
            <span className="flex-1">{s.label}</span>
            <span className="font-semibold">{((s.value / total) * 100).toFixed(1)}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
