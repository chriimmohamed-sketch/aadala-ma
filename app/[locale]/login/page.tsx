import V5Shell from "@/components/layout/V5Shell";
import LoginForm from "@/components/LoginForm";

export default async function LoginPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <V5Shell locale={locale}>
      <main id="main" className="flex-1 px-4 py-10">
        <LoginForm locale={locale} />
      </main>
    </V5Shell>
  );
}
