"use client";

import { useMemo, useState } from "react";
import type { KnowledgeItem } from "@/data/knowledge";

const ALL = "الكل";

export default function KnowledgeHub({ items, categories }: { items: KnowledgeItem[]; categories: readonly string[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>(ALL);

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const item of items) map.set(item.category, (map.get(item.category) ?? 0) + 1);
    return map;
  }, [items]);

  const filtered = useMemo(() => {
    const q = query.trim();
    return items.filter((item) => {
      if (category !== ALL && item.category !== category) return false;
      if (!q) return true;
      const haystack = `${item.title} ${item.lead} ${item.points.join(" ")} ${item.source} ${item.category}`;
      return haystack.includes(q);
    });
  }, [items, query, category]);

  return (
    <div className="kbd-hub">
      <div className="kbd-toolbar" role="search">
        <input
          type="text"
          className="kbd-search"
          placeholder="ابحث في بطاقات العلم… مثال: الصداق، الشيك، التوقيف، SMIG"
          aria-label="البحث في الموسوعة القانونية"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <span className="kbd-count">{filtered.length} / {items.length} بطاقة</span>
      </div>

      <div className="kbd-chips" role="group" aria-label="التصنيفات">
        <button type="button" className={`kbd-chip ${category === ALL ? "is-active" : ""}`} onClick={() => setCategory(ALL)}>
          {ALL} <b>{items.length}</b>
        </button>
        {categories.filter((c) => counts.get(c)).map((c) => (
          <button key={c} type="button" className={`kbd-chip ${category === c ? "is-active" : ""}`} onClick={() => setCategory(c)}>
            {c} <b>{counts.get(c)}</b>
          </button>
        ))}
      </div>

      <div className="kbd-grid">
        {filtered.map((item) => (
          <article key={item.id} className="kbd-card" aria-label={item.title}>
            <div className="kbd-card-head">
              <span className="kbd-cat">{item.category}</span>
              {item.status === "review-required" && <span className="kbd-badge kbd-badge-warn">يحتاج تحقق اختصاصي</span>}
              {item.status === "verify-update" && <span className="kbd-badge kbd-badge-caution">قابل للتحديث</span>}
              {item.status === "foundational" && <span className="kbd-badge kbd-badge-ok">مبدأ راسخ</span>}
            </div>
            <h2 className="kbd-title">{item.title}</h2>
            <p className="kbd-lead">{item.lead}</p>
            <ul className="kbd-points">
              {item.points.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
            <div className="kbd-foot">
              <p className="kbd-source"><b>السند:</b> {item.source}</p>
              {item.note && <p className="kbd-note">⚠ {item.note}</p>}
            </div>
          </article>
        ))}
        {filtered.length === 0 && (
          <p className="kbd-empty">لا توجد نتائج مطابقة — جرّب كلمات أخرى (مثل: المطل، الصداق، الشيك).</p>
        )}
      </div>
    </div>
  );
}
