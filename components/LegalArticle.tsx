"use client";

import type { LegalArticle, LegalDocument } from "@/lib/legal-data/types";
import { neighbors } from "@/lib/legal-data/types";

/** Unified article card — same DNA for every law. */
export default function LegalArticleView({
  doc,
  article,
  locale,
}: {
  doc: LegalDocument;
  article: LegalArticle;
  locale: string;
}) {
  const { prev, next } = neighbors(doc, article.number);
  const citation = `${doc.metadata.title} — الفصل ${article.number}${article.title ? ` (${article.title})` : ""}`;

  function copyCitation() {
    try { navigator.clipboard.writeText(citation); } catch { /* ignore */ }
  }

  return (
    <article className="aadala-card mt-4 space-y-4 p-5">
      <header className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-2xl font-bold text-navy">الفصل {article.number}</h2>
        {article.title && <span className="text-sm text-brass">{article.title}</span>}
      </header>

      {article.officialText && (
        <section>
          <h3 className="mb-2 text-sm font-semibold text-teal">النص (الأصلي — لا يُعاد كتابته)</h3>
          <p className="whitespace-pre-wrap rounded border border-border bg-ivory p-4 text-sm leading-8 text-graphite">
            {article.officialText}
          </p>
        </section>
      )}

      <dl className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
        <div className="rounded border border-border bg-surface p-3">
          <dt className="font-semibold text-brass">المصدر</dt>
          <dd className="text-graphite">{doc.metadata.title}</dd>
        </div>
        <div className="rounded border border-border bg-surface p-3">
          <dt className="font-semibold text-brass">الحالة</dt>
          <dd className="text-graphite">{doc.metadata.status === "active" ? "ساري (قيد المراجعة)" : doc.metadata.status}</dd>
        </div>
        {article.sourcePage != null && (
          <div className="rounded border border-border bg-surface p-3">
            <dt className="font-semibold text-brass">الصفحة</dt>
            <dd className="text-graphite">{article.sourcePage}</dd>
          </div>
        )}
        {article.amendments && article.amendments.length > 0 && (
          <div className="rounded border border-border bg-surface p-3">
            <dt className="font-semibold text-brass">تعديلات</dt>
            <dd className="text-graphite">{article.amendments.join("، ")}</dd>
          </div>
        )}
      </dl>

      {article.note && (
        <p className="rounded border border-gold/60 bg-gold/10 p-3 text-xs text-graphite">{article.note}</p>
      )}

      {article.relatedArticles && article.relatedArticles.length > 0 && (
        <section>
          <h3 className="mb-2 text-sm font-semibold text-teal">مرتبطة بها</h3>
          <div className="flex flex-wrap gap-2">
            {article.relatedArticles.map((n) => (
              <span key={n} className="rounded-full border border-border bg-surface px-3 py-1 text-xs text-graphite">
                الفصل {n}
              </span>
            ))}
          </div>
        </section>
      )}

      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={copyCitation} className="aadala-btn-gold text-xs">
          انسخ الإحالة
        </button>
        <a href={`/${locale}/report?location=${encodeURIComponent(citation)}`} className="aadala-btn-ghost text-xs">
          أبلغ عن خطأ في هذه المادة
        </a>
      </div>

      <nav aria-label="التنقل بين المواد" className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3">
        {prev ? (
          <a href={`#${prev.number}`} className="aadala-btn-ghost text-xs">
            ← السابق: الفصل {prev.number}
          </a>
        ) : (
          <span className="text-xs text-graphite-soft">لا السابق</span>
        )}
        {next ? (
          <a href={`#${next.number}`} className="aadala-btn-ghost text-xs">
            التالي: الفصل {next.number} →
          </a>
        ) : (
          <span className="text-xs text-graphite-soft">لا التالي</span>
        )}
      </nav>
    </article>
  );
}

/** Unified law tree (interactive map). */
export function LegalTreeView({ doc }: { doc: LegalDocument }) {
  return (
    <nav aria-label="خريطة القانون" className="aadala-card p-4">
      <h3 className="mb-3 text-sm font-bold text-navy">خريطة {doc.metadata.title}</h3>
      <ul className="space-y-1 text-sm">
        {doc.sections.map((s) => (
          <li key={s.id}>
            <details open>
              <summary className="cursor-pointer font-semibold text-teal">{s.title}</summary>
              <ul className="mt-1 space-y-1 pr-4">
                {s.articles?.map((a) => (
                  <li key={a.number}>
                    <a href={`#${a.number}`} className="text-graphite hover:text-navy">
                      الفصل {a.number}{a.title ? ` — ${a.title}` : ""}
                    </a>
                  </li>
                ))}
                {s.chapters?.map((c) => (
                  <li key={c.id}>
                    <details>
                      <summary className="cursor-pointer text-graphite-soft">{c.title}</summary>
                      <ul className="mt-1 space-y-1 pr-4">
                        {c.articles?.map((a) => (
                          <li key={a.number}>
                            <a href={`#${a.number}`} className="text-graphite hover:text-navy">
                              الفصل {a.number}{a.title ? ` — ${a.title}` : ""}
                            </a>
                          </li>
                        ))}
                        {c.branches?.map((b) => (
                          <li key={b.id}>
                            <details>
                              <summary className="cursor-pointer text-graphite-soft">{b.title}</summary>
                              <ul className="mt-1 space-y-1 pr-4">
                                {b.articles?.map((a) => (
                                  <li key={a.number}>
                                    <a href={`#${a.number}`} className="text-graphite hover:text-navy">
                                      الفصل {a.number}{a.title ? ` — ${a.title}` : ""}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </details>
                          </li>
                        ))}
                      </ul>
                    </details>
                  </li>
                ))}
              </ul>
            </details>
          </li>
        ))}
      </ul>
    </nav>
  );
}
