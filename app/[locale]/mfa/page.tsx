import V5Shell from "@/components/layout/V5Shell";
import MfaForm from "@/components/MfaForm";

export default async function MfaPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <V5Shell locale={locale}>
      <main id="main" className="flex-1 px-4 py-10">
        <MfaForm locale={locale} />
      </main>
    </V5Shell>
  );
}
