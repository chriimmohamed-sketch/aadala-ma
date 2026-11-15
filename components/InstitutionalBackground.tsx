"use client";

import { useReducedMotion } from "framer-motion";
import ZelligeCanvas from "./ZelligeCanvas";
import { GalaxyCanvas } from "./aalada-ultimate/GalaxyBackground";

/**
 * InstitutionalBackground — خلفية مؤسساتية هادئة (AADALA.MA)
 * تجريد موحّد فوق المكوّنين الموجودين (ZelligeCanvas + GalaxyBackground).
 * المناخ: وزارة العدل / قاعة محكمة — يمنح الثقة، لا يلفت الانتباه.
 *
 * Tier 1 (prefers-reduced-motion): تُلغى كل الحركات، وتُعرض خلفية ثابتة فقط.
 */
export default function InstitutionalBackground({
  showZellige = true,
  showGalaxy = true,
}: {
  showZellige?: boolean;
  showGalaxy?: boolean;
}) {
  const reduce = useReducedMotion();
  const animated = !reduce;

  return (
    <>
      <div className="inst-bg-static" aria-hidden="true" />
      {animated && showZellige && <ZelligeCanvas />}
      {animated && showGalaxy && <GalaxyCanvas />}
    </>
  );
}
