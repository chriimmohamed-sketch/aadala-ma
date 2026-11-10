import { getMessages } from "@/lib/i18n/getMessages";
import Header from "@/components/layout/HeaderSupreme";
import Footer from "@/components/layout/Footer";
import CitationActions from "@/components/CitationActions";
import LegalArticleView, { LegalTreeView } from "@/components/LegalArticle";
import SourceCard from "@/components/SourceCard";
import { legalSources } from "@/data/legal-sources";
import { legalDatabase } from "@/data/legal-database";
import { getStructuredDocument } from "@/lib/legal-data";
import { flattenArticles } from "@/lib/legal-data/types";
import quality from "@/data/legal-quality.json";
import fs from "fs";
import path from "path";
import Link from "next/link";

export async function generateStaticParams() {
  const locales = ["ar","zgh","fr","en","es","de","fa","tr","nl","it"];
  const params: { locale: string; slug: string }[] = [];
  for (const locale of locales) for (const s of legalSources) params.push({ locale, slug: s.slug });
  return params;
}

export default async function DetailPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const messages = await getMessages(locale);
  const src = legalSources.find((s) => s.slug === slug);
  if (!src) {
    return (
      <div className="flex min-h-screen flex-col bg-ivory">
        <Header locale={locale} messages={messages} />
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
          <h1 className="text-2xl font-bold text-navy">الصفحة غير موجودة</h1>
        </main>
        <Footer locale={locale} messages={messages} />
      </div>
    );
  }
  const filePath = path.join(process.cwd(), "public", src.file.replace(/^\//, ""));
  let text = "";
  try { text = fs.readFileSync(filePath, "utf8"); } catch { text = "تعذر قراءة الملف."; }
  const q = (quality as Record<string, { quality: string }>)[slug]?.quality;
  const rec = legalDatabase.find((r) => r.slug === slug);
  const idx = legalSources.findIndex((s) => s.slug === slug);
  const prev = idx > 0 ? legalSources[idx - 1] : null;
  const next = idx >= 0 && idx < legalSources.length - 1 ? legalSources[idx + 1] : null;
  const verification = q === "unreliable" ? "غير موثوق الاستخراج — يُراجع يدويًا" : q === "good" ? "قيد المراجعة — استخراج سليم مبدئيًا" : "قيد المراجعة";

  // Structured data (when available) — registry lookup.
  const structured = getStructuredDocument(slug) ?? null;
  const structuredArticles = structured ? flattenArticles(structured) : [];

  return (
    <div className="flex min-h-screen flex-col bg-ivory">
      <Header locale={locale} messages={messages} />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
        <p className="mb-2"><span className="badge">قيد المراجعة</span></p>
        <h1 className="text-3xl font-bold text-navy">{src.title}</h1>
        <p className="mt-1 text-sm text-graphite-soft">{src.type} — {src.description}</p>
        <div className="aadala-divider mt-3" />
        <dl className="mt-4 grid grid-cols-1 gap-2 text-sm sm:grid-cols-3">
          <div className="aadala-card p-3"><dt className="font-semibold text-brass">حالة التحقق</dt><dd className="text-graphite">{verification}</dd></div>
          <div className="aadala-card p-3"><dt className="font-semibold text-brass">تاريخ الظهير</dt><dd className="text-graphite">{rec?.promulgated ?? "—"}</dd></div>
          <div className="aadala-card p-3"><dt className="font-semibold text-brass">الجريدة الرسمية</dt><dd className="text-graphite">{rec?.published ?? "—"}</dd></div>
        </dl>
        <CitationActions locale={locale} title={src.title} lawNumber={rec?.lawNumber ?? src.type} slug={slug} promulgated={rec?.promulgated ?? null} published={rec?.published ?? null} />

        {structured && (
          <section className="mt-6 grid gap-4 lg:grid-cols-[1fr_280px]">
            <div>
              <h2 className="mb-3 text-xl font-bold text-navy">النص (منظَّم — {structuredArticles.length} مادة)</h2>
              <p className="mb-3 text-xs text-graphite-soft">
                بنية: قسم → باب → فرع → فصل. النص الأصلي لا يُعاد كتابته. قيد المراجعة.
              </p>
              {structuredArticles.map((art) => (
                <div key={art.number} id={art.number}>
                  <LegalArticleView doc={structured} article={art} locale={locale} />
                </div>
              ))}
            </div>
            <div className="space-y-4">
              <SourceCard doc={structured} />
              <LegalTreeView doc={structured} />
            </div>
          </section>
        )}

        {!structured && (
          <>
            <p className="mt-4 text-xs text-graphite">نص مستخرج من PDF. تحقق من الجريدة الرسمية قبل الاعتماد.</p>
            {q && q !== "good" && (
              <p className="mt-2 rounded border border-gold/60 bg-gold/10 p-3 text-xs text-graphite">
                {q === "unreliable" ? "تحذير: استخراج النص من هذا الملف تالف إلى حد كبير، ولا يُعتمد عليه. ارجع إلى الجريدة الرسمية." : "تنبيه: أجزاء من هذا النص قد تكون تالفة الاستخراج."}
              </p>
            )}
            <p className="mt-2 text-xs text-graphite-soft">قد يظهر في النص (ال) بدل (لا) و(إال) بدل (إلا) بسبب استخراج PDF؛ اقرأ المعنى بحذر.</p>
            <pre className="aadala-card mt-4 max-h-[70vh] overflow-auto whitespace-pre-wrap p-4 text-sm leading-7">
              {text}
            </pre>
          </>
        )}

        <nav aria-label="التنقل بين النصوص" className="mt-6 flex flex-wrap items-center justify-between gap-3">
          {prev ? <Link href={`/${locale}/legal/${prev.slug}`} className="aadala-btn-ghost text-xs">← السابق: {prev.title}</Link> : <span className="text-xs text-graphite-soft">لا السابق</span>}
          {next ? <Link href={`/${locale}/legal/${next.slug}`} className="aadala-btn-ghost text-xs">التالي: {next.title} →</Link> : <span className="text-xs text-graphite-soft">لا التالي</span>}
        </nav>
      </main>
      <Footer locale={locale} messages={messages} />
    </div>
  );
}
