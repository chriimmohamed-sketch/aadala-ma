import V5Shell from "@/components/layout/V5Shell";
import RegisterForm from "@/components/RegisterForm";

export default async function RegisterPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <V5Shell locale={locale}>
      <main id="main" className="flex-1 px-4 py-10">
        <RegisterForm locale={locale} />
      </main>
    </V5Shell>
  );
}
