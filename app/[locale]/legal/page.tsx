import { getMessages } from "@/lib/i18n/getMessages";
import HomeInteractions from "@/components/HomeInteractions";
import Footer from "@/components/layout/Footer";
import AnswerAnimator from "@/components/AnswerAnimator";
import AgentTerminal from "@/components/aalada-ultimate/AgentTerminal";
import HomeHeader from "@/components/home-moroccan/HomeHeader";
import { legalSources } from "@/data/legal-sources";
import { legalCategories } from "@/data/legal-categories";
import { legalDatabase } from "@/data/legal-database";
import { siteUrl } from "@/lib/site/config";
import Link from "next/link";

export default async function LegalPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const messages = await getMessages(locale);
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "AADALA.MA — الموسوعة القانونية",
      description: "17 تصنيفاً. لا محتوى افتراضي — كل نص مرتبط بمصدر قابل للتحقق.",
      url: `${siteUrl}/${locale}/legal`,
      inLanguage: locale,
      isPartOf: { "@type": "WebSite", name: "AADALA.MA", url: siteUrl },
    },
  ];
  return (
    <div id="v-home" className="mh-page flex min-h-screen flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="bar" id="bar" />
      <HomeInteractions locale={locale} />
      <AnswerAnimator />
      <HomeHeader locale={locale} />
      <main id="main">
        <section id="library" className="section-v5">
          <div className="wrap">
            <div className="rv"><span className="num-v5">٠١ · المكتبة</span>
              <h1 className="title-v5">الموسوعة القانونية</h1>
              <p className="sub-v5">17 تصنيفاً. لا محتوى افتراضي — كل نص مرتبط بمصدر قابل للتحقق.</p>
            </div>

            <h3 className="title-v5" style={{ fontSize: "1.05rem", marginTop: "2rem" }}>التصنيفات ({legalCategories.length})</h3>
            <div className="parts-v5" style={{ marginTop: "1rem" }}>
              {legalCategories.map((c) => (
                <div key={c} className="part-v5" style={{ cursor: "default" }}><b>{c}</b></div>
              ))}
            </div>

            <h3 className="title-v5" style={{ fontSize: "1.05rem", marginTop: "2.5rem" }}>المصادر المدمجة ({legalSources.length})</h3>
            <div className="tools tools-v5" style={{ marginTop: "1rem" }}>
              {legalSources.map((s) => (
                <Link key={s.slug} href={`/${locale}/legal/${s.slug}`} className="tool tool-v5">
                  <span className="ty" style={{ fontSize: ".72rem", opacity: .75 }}>{s.type}</span>
                  <h3>{s.title}</h3>
                  <p>{s.description}</p>
                </Link>
              ))}
            </div>

            <h3 className="title-v5" style={{ fontSize: "1.05rem", marginTop: "2.5rem" }}>قاعدة البيانات القانونية ({legalDatabase.length} مصادر)</h3>
            <div style={{ marginTop: "1rem", display: "grid", gap: ".75rem" }}>
              {legalDatabase.map((r) => (
                <details key={r.slug} className="sample" style={{ padding: "1rem" }}>
                  <summary style={{ cursor: "pointer", fontWeight: 600 }}>{r.lawNumber} — {r.title}</summary>
                  <dl style={{ marginTop: ".75rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".5rem", fontSize: ".85rem" }}>
                    <div><dt style={{ fontWeight: 600 }}>الصيغة</dt><dd>{r.version}</dd></div>
                    <div><dt style={{ fontWeight: 600 }}>الإصدار</dt><dd>{r.promulgated ?? "—"}</dd></div>
                    <div><dt style={{ fontWeight: 600 }}>النشر</dt><dd>{r.published ?? "—"}</dd></div>
                    <div><dt style={{ fontWeight: 600 }}>التعديلات</dt><dd>{r.amendments}</dd></div>
                    <div><dt style={{ fontWeight: 600 }}>الإلغاء</dt><dd>{r.abrogation}</dd></div>
                    <div><dt style={{ fontWeight: 600 }}>المواد المخزنة</dt><dd>{r.articlesCount > 0 ? r.articlesCount : "لم تُستخرج آليًا — راجع النص الكامل"}</dd></div>
                    <div><dt style={{ fontWeight: 600 }}>مصدر الاستيراد</dt><dd>{r.sourceNote}</dd></div>
                    <div><dt style={{ fontWeight: 600 }}>SHA-256</dt><dd dir="ltr">{r.sha256.slice(0, 16)}… ({r.bytes} بايت)</dd></div>
                  </dl>
                  <Link href={`/${locale}/legal/${r.slug}`} style={{ marginTop: ".75rem", display: "inline-block", fontWeight: 600, textDecoration: "underline" }}>عرض النص</Link>
                </details>
              ))}
            </div>
            <p style={{ marginTop: ".75rem", fontSize: ".75rem", opacity: .75 }}>أعد التشغيل بـ <code>npm run legal:ingest</code> لتحديث الأعداد والبصمات والتقرير في docs/legal-ingestion-report.md.</p>

            <div className="sample" style={{ marginTop: "2.5rem", padding: "1.25rem" }}>
              <h3 style={{ fontWeight: 600 }}>نظام الاستيراد/المراجعة/التحديث</h3>
              <ol style={{ marginTop: ".5rem", paddingInlineStart: "1.25rem", fontSize: ".9rem" }}>
                <li>رفع source (PDF/URL) + تسجيل metadata + checksum + حقوق استخدام.</li>
                <li>استخراج النص (parse) + تطبيع Unicode (NFKC).</li>
                <li>تقسيم إلى مواد/فصول + مراجعة بشرية.</li>
                <li>اعتماد (review) → نشر (publish) → أرشفة نسخة.</li>
                <li>تسجيل تعديلات/إلغاءات + تاريخ نفاذ.</li>
              </ol>
              <p style={{ marginTop: ".75rem", fontSize: ".75rem", opacity: .75 }}>Schema: supabase/schema.sql (8 tables). RBAC: src/lib/admin/permissions.ts.</p>
            </div>
          </div>
        </section>
      </main>
      <Footer locale={locale} messages={messages} />
      <div className="legacy-agent">
        <AgentTerminal />
      </div>
    </div>
  );
}