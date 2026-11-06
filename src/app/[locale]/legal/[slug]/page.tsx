import { getMessages } from "@/lib/i18n/getMessages";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { legalSources } from "@/data/legal-sources";
import fs from "fs";
import path from "path";

export async function generateStaticParams() {
  // locale x slug
  const locales = ["ar","zgh","fr","en","es","de","fa","tr","nl","it"];
  const params: { locale: string; slug: string }[] = [];
  for (const locale of locales) for (const s of legalSources) params.push({ locale, slug: s.slug });
  return params;
}

export default async function DetailPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const messages = await getMessages(locale);
  const src = legalSources.find((s) => s.slug === slug);
  if (!src) return <div>Not found</div>;
  const filePath = path.join(process.cwd(), "public", src.file.replace(/^\//, ""));
  let text = "";
  try { text = fs.readFileSync(filePath, "utf8"); } catch { text = "تعذر قراءة الملف."; }
  return (
    <div className="flex min-h-screen flex-col">
      <Header locale={locale} messages={messages} />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
        <h1 className="text-2xl font-bold">{src.title}</h1>
        <p className="mt-1 text-sm text-slate-600">{src.type} — {src.description}</p>
        <p className="mt-2 text-xs text-amber-700">نص مستخرج من PDF. تحقق من الجريدة الرسمية قبل الاعتماد.</p>
        <pre className="mt-4 max-h-[70vh] overflow-auto whitespace-pre-wrap rounded border border-slate-200 bg-white p-4 text-sm leading-7">
          {text}
        </pre>
      </main>
      <Footer locale={locale} messages={messages} />
    </div>
  );
}