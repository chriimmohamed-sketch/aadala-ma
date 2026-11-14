import { getMessages } from "@/lib/i18n/getMessages";
import Header from "@/components/layout/HeaderSupreme";
import Footer from "@/components/layout/Footer";
import data from "@/data/institutions.json";

export async function generateStaticParams() {
  const locales = ["ar", "zgh", "fr", "en", "es", "de", "fa", "tr", "nl", "it"];
  return locales.map((locale) => ({ locale }));
}

interface Institution {
  id: string;
  name_ar: string;
  name_fr: string;
  abbreviation: string;
  type: string;
  city_ar: string;
  city_fr: string;
  website_url: string;
  official_source_url: string;
  status: string;
  status_label: string;
  notes: string;
  last_verified: string;
}

const TYPE_LABELS: Record<string, string> = {
  fac: "كلية",
  school: "مدرسة",
  inst: "معهد",
};

export default async function InstitutionsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const messages = await getMessages(locale);
  const institutions = (data as { institutions: Institution[] }).institutions;

  const byCity = institutions.reduce<Record<string, Institution[]>>((acc, inst) => {
    (acc[inst.city_ar] ??= []).push(inst);
    return acc;
  }, {});

  return (
    <div className="flex min-h-screen flex-col bg-ivory">
      <Header locale={locale} messages={messages} />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
        <h1 className="text-3xl font-bold text-navy">المؤسسات الجامعية (جهة سوس-ماسة والجنوب)</h1>
        <p className="mt-2 text-sm text-graphite-soft">
          لائحة المؤسسات (كليات، مدارس، معاهد) وفق المصادر الرسمية — {institutions.length} مؤسسة.
          مرجع إرشادي، قيد التحقق.
        </p>
        <div className="aadala-divider mt-3" />

        {Object.entries(byCity).map(([city, list]) => (
          <section key={city} className="mt-8">
            <h2 className="text-xl font-bold text-teal mb-3">{city}</h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {list.map((inst) => {
                const isLaw = inst.name_ar.includes("العلوم القانونية");
                return (
                  <article
                    key={inst.id}
                    className={`aadala-card p-4 ${isLaw ? "border-2 border-brass" : ""}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-bold text-navy text-sm">
                          {inst.name_ar}
                          {isLaw && <span className="ms-2 rounded-full bg-brass/10 px-2 py-0.5 text-[10px] text-brass">قانون</span>}
                        </h3>
                        <p className="text-xs text-graphite-soft">{inst.name_fr} — {inst.abbreviation}</p>
                      </div>
                      <span className="text-[10px] text-graphite-soft">{TYPE_LABELS[inst.type] ?? inst.type}</span>
                    </div>
                    {inst.website_url && (
                      <a href={inst.website_url} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-xs text-teal underline">
                        الموقع الرسمي ←
                      </a>
                    )}
                    <p className="mt-1 text-[10px] text-graphite-soft">التحقق: {inst.last_verified} — {inst.status_label}</p>
                  </article>
                );
              })}
            </div>
          </section>
        ))}

        <p className="mt-8 text-xs text-graphite-soft">
          المصدر: institutions-database.csv (بيانات رسمية، قيد المراجعة). لا تُعدّ هذه اللائحة exhaustive.
        </p>
      </main>
      <Footer locale={locale} messages={messages} />
    </div>
  );
}
