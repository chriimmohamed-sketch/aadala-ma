import { getMessages } from "@/lib/i18n/getMessages";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ZelligeCanvas from "@/components/ZelligeCanvas";
import Link from "next/link";

const library = [
  { ty: "دستور", title: "دستور المملكة المغربية", sub: "2011", color: "#0F5C52" },
  { ty: "قانون", title: "قانون الالتزامات والعقود", sub: "صيغة محينة", color: "#8A5F1C" },
  { ty: "مدونة", title: "مدونة الحقوق العينية", sub: "2018 و2025", color: "#2D4A7A" },
  { ty: "ظهير", title: "ظهير التحفيظ العقاري", sub: "كما وقع تغييره وتتميمه", color: "#7A2D3C" },
  { ty: "مجموعة", title: "مجموعة القانون الجنائي", sub: "صيغة محينة", color: "#4A4A4A" },
  { ty: "جريدة رسمية", title: "الجريدة الرسمية عدد 7437", sub: "عدد منفرد", color: "#5A7A2D" },
];

const tools = [
  { n: "١", title: "حاسبة الميراث", badge: "تجريبي", desc: "توزيع التركة بين الورثة خطوة بخطوة، وتُراجع النتيجة مع مختص قبل أي اعتماد.", href: "/miyar" },
  { n: "٢", title: "النزاعات العقارية", desc: "محفّظ أم غير محفّظ؟ تعرّف على الوثائق الناقصة والدعاوى الممكنة.", href: "/property" },
  { n: "٣", title: "المختبر الجنائي", badge: "تعليمي", desc: "تمرّن على التكييف القانوني وأركان الجريمة والإجراءات.", href: "/criminal" },
  { n: "٤", title: "المساطر والنماذج", desc: "أدلة إجرائية ومسودات جاهزة للتعديل، تصدّرها بصيغة PDF.", href: "/procedures" },
];

const parts = [
  { i: "١", b: "الوقائع المفترضة", span: "ما فهمه المساعد من سؤالك." },
  { i: "٢", b: "الأساس القانوني", span: "المادة والنص الذي بُني عليه الجواب." },
  { i: "٣", b: "التحليل", span: "تطبيق النص على حالتك بلغة واضحة." },
  { i: "٤", b: "درجة اليقين", span: "وعندما لا تكفي المصادر، يقول ذلك صراحة." },
];

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const messages = await getMessages(locale);
  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <Header locale={locale} messages={messages} />
      <main id="top" className="flex-1">
        {/* Hero */}
        <div className="hero">
          <ZelligeCanvas />
          <div className="wrap">
            <div>
              <span className="kicker">منصة قانونية مغربية مستقلة</span>
              <h1>القانون المغربي، بنصّه <em>ومادّته.<svg viewBox="0 0 200 20" preserveAspectRatio="none" aria-hidden="true"><path d="M2 14 C50 4, 110 18, 198 6" /></svg></em></h1>
              <p className="lead">اسأل سؤالك القانوني واحصل على جواب مبني على النص الأصلي، مع المرجع الذي يمكنك التحقق منه قبل أن تعتمد عليه.</p>
              <form className="ask" action={`/${locale}/ai`} method="get" role="search">
                <input name="q" type="text" maxLength={2000} placeholder="مثال: ما شروط صحة عقد البيع؟" aria-label="سؤالك القانوني" autoComplete="off" />
                <button className="btn" type="submit">اسأل</button>
              </form>
              <div className="chips" role="group" aria-label="أسئلة مقترحة">
                <a className="chip" href={`/${locale}/ai?q=${encodeURIComponent("ما شروط صحة عقد البيع؟")}`}>ما شروط صحة عقد البيع؟</a>
                <a className="chip" href={`/${locale}/ai?q=${encodeURIComponent("كيف يتم تحفيظ عقار؟")}`}>كيف يتم تحفيظ عقار؟</a>
                <a className="chip" href={`/${locale}/ai?q=${encodeURIComponent("ما الفرق بين الشياع والقسمة؟")}`}>ما الفرق بين الشياع والقسمة؟</a>
              </div>
              <p className="note">هذه نسخة تصميمية: شاهد أدناه كيف سيُبنى الجواب. سيُربط المساعد بالمصادر عند تفعيل الخادم.</p>
            </div>
            <svg className="seal" viewBox="0 0 320 320" aria-hidden="true">
              <defs><path id="circ" d="M160 160 m-128 0 a128 128 0 1 1 256 0 a128 128 0 1 1 -256 0" /></defs>
              <g className="ring"><text><textPath href="#circ" startOffset="0">AADALA.MA ✦ القانون بنصّه ومادّته ✦ مصدر قابل للتحقق ✦</textPath></text></g>
              <circle cx="160" cy="160" r="104" fill="none" stroke="currentColor" strokeWidth="1" opacity=".4" />
              <g className="rose" fill="none" stroke="currentColor" strokeWidth="2.2">
                <rect x="100" y="100" width="120" height="120" />
                <rect x="100" y="100" width="120" height="120" transform="rotate(45 160 160)" />
                <circle cx="160" cy="160" r="34" />
              </g>
              <g className="gold" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                <line x1="160" y1="132" x2="160" y2="188" />
                <line x1="134" y1="140" x2="186" y2="140" />
                <path d="M134 140 l-10 24 h20z M186 140 l-10 24 h20z" fill="none" />
              </g>
            </svg>
          </div>
        </div>

        <div className="tick" aria-hidden="true">
          <div className="trk">
            <span>دستور المملكة المغربية</span><span>قانون الالتزامات والعقود</span><span>مدونة الحقوق العينية</span><span>ظهير التحفيظ العقاري</span><span>مجموعة القانون الجنائي</span><span>الجريدة الرسمية عدد 7437</span>
            <span>دستور المملكة المغربية</span><span>قانون الالتزامات والعقود</span><span>مدونة الحقوق العينية</span><span>ظهير التحفيظ العقاري</span><span>مجموعة القانون الجنائي</span><span>الجريدة الرسمية عدد 7437</span>
          </div>
        </div>

        <section id="assistant">
          <div className="wrap split">
            <div>
              <span className="num">٠١ · المساعد</span>
              <h2>جواب لا تُصدّقه حتى تراجعه.</h2>
              <p className="sub">كل إجابة تُعرض بنفس الترتيب، فتعرف ما افتُرض وما استُند إليه وما ينقص.</p>
              <div className="parts">
                {parts.map((p) => (
                  <button key={p.b} className="part" type="button">
                    <i>{p.i}</i><b>{p.b}</b><span>{p.span}</span>
                  </button>
                ))}
              </div>
              <Link href={`/${locale}/ai`} className="btn play">▶ اسأل المساعد</Link>
            </div>
            <article className="sample" aria-label="شكل الإجابة">
              <span className="tag">شكل توضيحي — ليس جوابًا قانونيًا</span>
              <p className="q">سؤالك يظهر هنا…</p>
              <div className="blk"><h3>الوقائع المفترضة</h3><p>صياغة السؤال في نقطة قانونية محددة.</p></div>
              <div className="blk"><h3>الأساس القانوني</h3><p><span className="ph">رقم المادة</span> من <span className="ph">اسم النص القانوني</span>، مع مقطع من النص الأصلي.</p></div>
              <div className="blk"><h3>التحليل</h3><p>تطبيق النص على الوقائع، وبيان المعلومات الناقصة التي تغيّر الجواب لو توفرت.</p></div>
              <div className="blk"><h3>درجة اليقين</h3><p>مرتفعة · متوسطة · منخفضة · مصادر غير كافية</p></div>
              <div className="stamp" aria-hidden="true">مرجع<br />قابل<br />للتحقق</div>
            </article>
          </div>
        </section>

        <section id="library">
          <div className="wrap">
            <div><span className="num">٠٢ · المكتبة</span>
            <h2>المكتبة القانونية</h2>
            <p className="sub">مصادر منشورة، تُقرأ كاملة وتُستخدم مرجعًا للمساعد.</p></div>
            <div className="shelf">
              {library.map((b) => (
                <Link key={b.title} className="book" style={{ "--c": b.color } as React.CSSProperties} href={`/${locale}/legal`}>
                  <span className="ty">{b.ty}</span>
                  <h3>{b.title}</h3>
                  <small>{b.sub}</small>
                  <b>اقرأ النص ←</b>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section id="tools">
          <div className="wrap">
            <div><span className="num">٠٣ · الأدوات</span>
            <h2>أدوات لحالتك الفعلية</h2>
            <p className="sub">من الفهم إلى الإجراء: احسب، حلّل، وحضّر ملفك.</p></div>
            <div className="tools">
              {tools.map((t) => (
                <Link key={t.title} href={`/${locale}${t.href}`} className="tool" data-n={t.n}>
                  <h3>{t.title}{t.badge && <span className="badge">{t.badge}</span>}</h3>
                  <p>{t.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section id="trust">
          <div className="wrap">
            <div><span className="num">٠٤ · منهجنا</span>
            <h2>كيف نحافظ على ثقتك</h2>
            <p className="sub">منصة قانونية تخسر قيمتها بخطأ واحد. لهذا نلتزم بثلاث قواعد.</p></div>
            <div className="trust">
              <div>
                <svg viewBox="0 0 54 54" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true"><circle cx="27" cy="27" r="22" /><path d="M15 15l24 24" /></svg>
                <h3>لا اختلاق</h3>
                <p>لا مواد ولا أحكام من خارج المصادر. إن لم نجد، نقول ذلك.</p>
              </div>
              <div>
                <svg viewBox="0 0 54 54" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true"><rect x="8" y="8" width="38" height="38" /><rect x="8" y="8" width="38" height="38" transform="rotate(45 27 27)" /><path d="M19 28l6 6 11-13" /></svg>
                <h3>كل شيء قابل للتحقق</h3>
                <p>لكل جواب مرجع، ولكل نص نسخة وتاريخ وإحالة إلى الجريدة الرسمية.</p>
              </div>
              <div>
                <svg viewBox="0 0 54 54" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true"><rect x="12" y="24" width="30" height="22" rx="3" /><path d="M18 24v-7a9 9 0 0 1 18 0v7" /><circle cx="27" cy="35" r="3" /></svg>
                <h3>خصوصيتك أولًا</h3>
                <p>تُعالج بياناتك وفق القانون 09.08، ويمكنك طلب حذفها.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer locale={locale} messages={messages} />
    </div>
  );
}