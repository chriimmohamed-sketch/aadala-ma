import type { ReactNode } from "react";
import V5Shell from "@/components/layout/V5Shell";

export default async function PageShell({
  locale, title, intro, badge, children,
}: { locale: string; title: string; intro: string; badge?: string; children: ReactNode }) {
  return (
    <V5Shell locale={locale}>
      <main id="main">
        <section className="section-v5">
          <div className="wrap">
            <div className="rv">
              <span className="num-v5">AADALA.MA</span>
              <h1 className="title-v5">{title}</h1>
              {badge ? <span className="badge">{badge}</span> : null}
              <p className="sub-v5">{intro}</p>
            </div>
            <div style={{ marginTop: "2rem" }}>{children}</div>
          </div>
        </section>
      </main>
    </V5Shell>
  );
}
