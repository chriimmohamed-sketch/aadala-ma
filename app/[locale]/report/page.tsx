import V5Shell from "@/components/layout/V5Shell";
import ReportErrorForm from "@/components/ReportErrorForm";

export default async function ReportPage({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams?: Promise<{ location?: string }> }) {
  const { locale } = await params;
  const q = searchParams ? await searchParams : {};
  return (
    <V5Shell locale={locale}>
      <main id="main" className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
        <h1 className="text-3xl font-bold text-navy">أبلغ عن خطأ في مادة</h1>
        <div className="aadala-divider mt-3" />
        <div className="mt-6">
          <ReportErrorForm initialLocation={q.location ?? ""} />
        </div>
      </main>
    </V5Shell>
  );
}
