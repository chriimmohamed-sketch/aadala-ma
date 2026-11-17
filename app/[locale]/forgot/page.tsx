import V5Shell from "@/components/layout/V5Shell";
import ForgotPasswordForm from "@/components/ForgotPasswordForm";

export default async function ForgotPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <V5Shell locale={locale}>
      <main id="main" className="flex-1 px-4 py-10">
        <ForgotPasswordForm locale={locale} />
      </main>
    </V5Shell>
  );
}
