import { getMessages } from "@/lib/i18n/getMessages";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { legalSources } from "@/data/legal-sources";
import quality from "@/data/legal-quality.json";
import fs from "fs";
import path from "path";

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
  return (
    <div className="flex min-h-screen flex-col bg-ivory">
      <Header locale={locale} messages={messages} />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
        <h1 className="text-3xl font-bold text-navy">{src.title}</h1>
        <p className="mt-1 text-sm text-graphite-soft">{src.type} — {src.description}</p>
        <div className="aadala-divider mt-3" />
        <p className="mt-2 text-xs text-amber-700">نص مستخرج من PDF. تحقق من الجريدة الرسمية قبل الاعتماد.</p>
        {q && q !== "good" && (
          <p className="mt-2 rounded border border-amber-300 bg-amber-50 p-3 text-xs text-amber-900">
            {q === "unreliable" ? "تحذير: استخراج النص من هذا الملف تالف إلى حد كبير، ولا يُعتمد عليه. ارجع إلى الجريدة الرسمية." : "تنبيه: أجزاء من هذا النص قد تكون تالفة الاستخراج."}
          </p>
        )}
        <p className="mt-2 text-xs text-graphite-soft">قد يظهر في النص (ال) بدل (لا) و(إال) بدل (إلا) بسبب استخراج PDF؛ اقرأ المعنى بحذر.</p>
        <pre className="aadala-card mt-4 max-h-[70vh] overflow-auto whitespace-pre-wrap p-4 text-sm leading-7">
          {text}
        </pre>
      </main>
      <Footer locale={locale} messages={messages} />
    </div>
  );
}