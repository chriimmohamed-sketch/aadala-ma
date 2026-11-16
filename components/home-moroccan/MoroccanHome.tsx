"use client";

import { useState } from "react";
import DoorsSection from "./DoorsSection";
import JusticeSections from "./JusticeSections";
import MoroccanHero from "./MoroccanHero";
import type { Door } from "./homeContent";

/** The Moroccan-city homepage layer: hero, six doors, justice sections. */
export default function MoroccanHome({ locale }: { locale: string }) {
  const [activeDoor, setActiveDoor] = useState<Door | null>(null);

  return (
    <div id="md">
      <MoroccanHero locale={locale} onOpenDoor={setActiveDoor} />
      <div className="m-main">
        <DoorsSection
          locale={locale}
          active={activeDoor}
          onOpenDoor={setActiveDoor}
          onClose={() => setActiveDoor(null)}
        />
        <JusticeSections locale={locale} />
      </div>
      <div className="m-foot">
        إرشاد عام لتوجيه القارئ وليس استشارة قانونية. للحالات الخاصة راجع محاميًا أو مصلحة المساعدة القضائية بالمحكمة.
      </div>
    </div>
  );
}
