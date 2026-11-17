import V5Shell from "@/components/layout/V5Shell";
import LegalDashboard from "@/components/LegalDashboard";

export default async function DashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <V5Shell locale={locale}>
      <main id="main" className="flex-1">
        <LegalDashboard />
      </main>
    </V5Shell>
  );
}
