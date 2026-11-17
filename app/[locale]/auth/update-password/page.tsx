import V5Shell from "@/components/layout/V5Shell";
import UpdatePasswordForm from "@/components/UpdatePasswordForm";

export default async function UpdatePasswordPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <V5Shell locale={locale}>
      <main id="main" className="flex-1 px-4 py-10">
        <UpdatePasswordForm locale={locale} />
      </main>
    </V5Shell>
  );
}
