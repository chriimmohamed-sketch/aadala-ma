import { getMessages } from "@/lib/i18n/getMessages";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ZelligeCanvas from "@/components/ZelligeCanvas";
import HomeInteractions from "@/components/HomeInteractions";
import AnswerAnimator from "@/components/AnswerAnimator";
import { legalDatabase } from "@/data/legal-database";
import Link from "next/link";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const messages = await getMessages(locale);
  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <div className="bar" id="bar" />
      <HomeInteractions locale={locale} />
      <AnswerAnimator />
      <Header locale={locale} messages={messages} />
      <div id="v-home">
        <main id="main">
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
                  <Link className="chip" href={`/${locale}/ai?q=${encodeURIComponent("ما شروط صحة عقد البيع؟")}`}>ما شروط صحة عقد البيع؟</Link>
                  <Link className="chip" href={`/${locale}/ai?q=${encodeURIComponent("كيف يتم تحفيظ عقار؟")}`}>كيف يتم تحفيظ عقار؟</Link>
                  <Link className="chip" href={`/${locale}/ai?q=${encodeURIComponent("ما الفرق بين الشياع والقسمة؟")}`}>ما الفرق بين الشياع والقسمة؟</Link>
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
              <div className="rv">
                <span className="num">٠١ · المساعد</span>
                <h2>جواب لا تُصدّقه حتى تراجعه.</h2>
                <p className="sub">كل إجابة تُعرض بنفس الترتيب، فتعرف ما افتُرض وما استُند إليه وما ينقص. اضغط على أي خطوة لترى موضعها.</p>
                <div className="parts">
                  <button className="part" type="button" data-k="0" aria-pressed="false"><i>١</i><b>الوقائع المفترضة</b><span>ما فهمه المساعد من سؤالك.</span></button>
                  <button className="part" type="button" data-k="1" aria-pressed="false"><i>٢</i><b>الأساس القانوني</b><span>المادة والنص الذي بُني عليه الجواب.</span></button>
                  <button className="part" type="button" data-k="2" aria-pressed="false"><i>٣</i><b>التحليل</b><span>تطبيق النص على حالتك بلغة واضحة.</span></button>
                  <button className="part" type="button" data-k="3" aria-pressed="false"><i>٤</i><b>درجة اليقين</b><span>وعندما لا تكفي المصادر، يقول ذلك صراحة.</span></button>
                </div>
                <Link href={`/${locale}/ai`} className="btn play">▶ اسأل المساعد</Link>
                <button id="watch-answer" type="button" className="btn play" style={{ marginInlineStart: "0.5rem", background: "transparent", color: "var(--teal)", border: "1px solid var(--teal)" }}>
                  شاهد الجواب يتشكّل
                </button>
              </div>
              <article className="sample rv" aria-label="شكل الإجابة">
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
              <div className="rv"><span className="num">٠٢ · المكتبة</span>
              <h2>المكتبة القانونية</h2>
              <p className="sub">مصادر منشورة، تُقرأ كاملة وتُستخدم مرجعًا للمساعد.</p></div>
              <div className="shelf">
                <Link className="book rv" style={{ "--c": "var(--aadala-teal)" } as React.CSSProperties} href={`/${locale}/legal/constitution-2011`}><span className="ty">دستور · <span className="badge">متاح</span></span><h3>دستور المملكة المغربية</h3><small>{(legalDatabase.find((r) => r.slug === "constitution-2011")?.articlesCount ?? 0) > 0 ? legalDatabase.find((r) => r.slug === "constitution-2011")?.articlesCount + " مادة مفهرسة" : "2011 — يُحصَرم بالفصول"}</small><b>اقرأ النص ←</b></Link>
                <Link className="book" style={{ "--c": "#8A5F1C" } as React.CSSProperties} href={`/${locale}/legal/obligations-contrats`}><span className="ty">قانون · <span className="badge">متاح</span></span><h3>قانون الالتزامات والعقود</h3><small>{legalDatabase.find((r) => r.slug === "obligations-contrats")?.articlesCount} مادة مفهرسة</small><b>اقرأ النص ←</b></Link>
                <Link className="book" style={{ "--c": "#6B4A8A" } as React.CSSProperties} href={`/${locale}/legal`}><span className="ty">مدونة · <span className="badge">قيد التجهيز</span><span className="badge-yellow">قرار مطلوب</span></span><h3>مدونة الأسرة</h3><small>القانون 70.03 — النص الكامل قيد الإدماج والتحقق</small><b>عرض الباحث ←</b></Link>
                <Link className="book" style={{ "--c": "#2D4A7A" } as React.CSSProperties} href={`/${locale}/legal/droits-reels-2025`}><span className="ty">مدونة · <span className="badge">متاح</span></span><h3>مدونة الحقوق العينية</h3><small>القانون 39.08 — {legalDatabase.find((r) => r.slug === "droits-reels-2018")?.articlesCount} مادة في صيغة 2018</small><b>اقرأ النص ←</b></Link>
                <Link className="book" style={{ "--c": "#7A2D3C" } as React.CSSProperties} href={`/${locale}/legal/tahfidh-immobilier`}><span className="ty">ظهير · <span className="badge">متاح</span></span><h3>ظهير التحفيظ العقاري</h3><small>كما وقع تغييره وتتميمه</small><b>اقرأ النص ←</b></Link>
                <Link className="book" style={{ "--c": "#4A4A4A" } as React.CSSProperties} href={`/${locale}/legal/code-penal`}><span className="ty">مجموعة · <span className="badge">متاح</span></span><h3>مجموعة القانون الجنائي</h3><small>صيغة محينة</small><b>اقرأ النص ←</b></Link>
                <Link className="book" style={{ "--c": "#0F5C52" } as React.CSSProperties} href={`/${locale}/legal/bulletin-officiel-7437`}><span className="ty">جريدة رسمية · <span className="badge">متاح</span></span><h3>الجريدة الرسمية عدد 7437</h3><small>عدد مدمج كما هو في المصدر</small><b>اقرأ النص ←</b></Link>
              </div>
            </div>
          </section>

          <section id="tools">
            <div className="wrap">
              <div className="rv"><span className="num">٠٣ · الأدوات</span>
              <h2>أدوات لحالتك الفعلية</h2>
              <p className="sub">من الفهم إلى الإجراء: احسب، حلّل، وحضّر ملفك.</p></div>
              <div className="tools">
                <Link href={`/${locale}/miyar`} className="tool" data-n="١">
                  <svg className="tool-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M12 3v18M6 7l6-4 6 4M5 13l-2 4h4l-2-4zM19 13l-2 4h4l-2-4z" /></svg>
                  <h3>حاسبة الميراث<span className="badge">تجريبي</span></h3>
                  <p>توزيع التركة بين الورثة خطوة بخطوة، وتُراجع النتيجة مع مختص قبل أي اعتماد.</p>
                </Link>
                <Link href={`/${locale}/property`} className="tool" data-n="٢">
                  <svg className="tool-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M4 21V9l8-6 8 6v12M9 21v-6h6v6" /></svg>
                  <h3>النزاعات العقارية</h3>
                  <p>محفّظ أم غير محفّظ؟ تعرّف على الوثائق الناقصة والدعاوى الممكنة.</p>
                </Link>
                <Link href={`/${locale}/criminal`} className="tool" data-n="٣">
                  <svg className="tool-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M9 3h6M10 3v7l-6 9a2 2 0 0 0 1.7 3h12.6A2 2 0 0 0 20 19l-6-9V3" /></svg>
                  <h3>المختبر الجنائي<span className="badge">تعليمي</span></h3>
                  <p>تمرّن على التكييف القانوني وأركان الجريمة والإجراءات.</p>
                </Link>
                <Link href={`/${locale}/procedures`} className="tool" data-n="٤">
                  <svg className="tool-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M6 2h9l5 6v14H6zM14 2v7h7" /></svg>
                  <h3>المساطر والنماذج</h3>
                  <p>أدلة إجرائية ومسودات جاهزة للتعديل، تصدّرها بصيغة PDF.</p>
                </Link>
                <Link href={`/${locale}/procedures`} className="tool" data-n="٦">
                  <svg className="tool-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M7 4l-4 8 4 8M17 4l4 8-4 8M9 8h6M9 16h6" /></svg>
                  <h3>إنهاء عقد الزواج<span className="badge">تعليمي</span></h3>
                  <p>مسار الطلاق/الخلع بخطواته ووثائقه، دون استشارة نهائية.</p>
                </Link>
                <Link href={`/${locale}/property`} className="tool" data-n="٧">
                  <svg className="tool-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M3 12h18M12 3v18M7 7l-3 5 4 0-1-5zM17 7l-3 5 4 0-1-5z" /></svg>
                  <h3>قسمة العقار<span className="badge">تجريبي</span></h3>
                  <p>تحليل الشياع والوثائق الناقصة قبل أي قسمة؛ تُراجع وثائقيًا.</p>
                </Link>
                <Link href={`/${locale}/student`} className="tool" data-n="٥">
                  <svg className="tool-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M4 19V6a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2zM20 20v-16H6" /></svg>
                  <h3>فضاء طلبة القانون</h3>
                  <p>لطلبة شعبة القانون: أدوات الدراسة والبحث، ورابط موقع المؤسِّس الثاني دليل الطالب CHRAIM.</p>
                </Link>
                <a href="/mushkilati.html" className="tool" data-n="٨">
                  <svg className="tool-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M12 2l3 7h7l-6 4 2 7-6-4-6 4 2-7-6-4h7z" /></svg>
                  <h3>مشكلتي<span className="badge">جديد</span></h3>
                  <p>أجوبة جاهزة وخطوات وأدوات تفاعلية (محرّر وثائق، حاسبة آجال، هل أحتاج محاميا) لمشاكلك اليومية.</p>
                </a>
            </div>
            </div>
          </section>

          <section id="trust">
            <div className="wrap">
              <div className="rv"><span className="num">٠٤ · منهجنا</span>
              <h2>كيف نحافظ على ثقتك</h2>
              <p className="sub">منصة قانونية تخسر قيمتها بخطأ واحد. لهذا نلتزم بثلاث قواعد وخمس خطوات تحقق.</p></div>
              <ol className="parts" style={{ listStyle: "none", padding: 0 }}>
                <li className="part" style={{ cursor: "default" }}><i>١</i><b>نأخذ النص من مصدر منشور</b><span>لا تُعاد صياغة المواد؛ يُنقل النص كما هو.</span></li>
                <li className="part" style={{ cursor: "default" }}><i>٢</i><b>نُبقي النسخة وتاريخها</b><span>رقم الظهير وتاريخه وعدد الجريدة الرسمية مذكورة في كل صفحة نص.</span></li>
                <li className="part" style={{ cursor: "default" }}><i>٣</i><b>نبني الأجوبة على النص وحده</b><span>بلا اجتهاد مخترع؛ ما لم يرد في مصدر مدمج لا يُذكر.</span></li>
                <li className="part" style={{ cursor: "default" }}><i>٤</i><b>نُعلن درجة اليقين</b><span>مرتفعة · متوسطة · منخفضة · مصادر غير كافية — ونعيّنها في كل جواب.</span></li>
                <li className="part" style={{ cursor: "default" }}><i>٥</i><b>نُصحّح علنًا</b><span>عبر صفحة «أبلغ عن خطأ»؛ يُراجع البلاغ يدويًا ولا تُصحّح شيئًا تلقائيًا.</span></li>
              </ol>
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
              <div className="sample rv" style={{ marginTop: "2rem" }}>
                <span className="tag">حدود المنصة</span>
                <p>ليست استشارة مهنية؛ النصوص مستخرجة وتحتاج تحققًا من الجريدة الرسمية قبل أي اعتماد. الأدوات موسومة «تجريبي» أو «تعليمي» ولا تُغني عن محامٍ أو موثق.</p>
              </div>
            </div>
          </section>
        </main>
      </div>
      <Footer locale={locale} messages={messages} />
    </div>
  );
}