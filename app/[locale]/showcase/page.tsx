import V5Shell from "@/components/layout/V5Shell";
import ShowcaseGallery from "@/components/ShowcaseGallery";

export default async function ShowcasePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <V5Shell locale={locale}>
      <main id="main" className="flex-1">
        <ShowcaseGallery locale={locale} />
      </main>
    </V5Shell>
  );
}
