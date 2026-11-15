"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * SkeuomorphicCard — AADALA institutional glass card.
 * زجاجية احترافية: حبل ذهبي رفيع + ظل كحلي + إضاءة داخلية علوية.
 * لا حركة ثقيلة: رفع ≤6px وتدوير ≤0.4° (يُلغى عند reduced-motion).
 * استخدمها في أقسام الثقة والوثائق والأدوات — لا للأهداف الزخرفية.
 */
export default function SkeuomorphicCard({
  eyebrow,
  title,
  children,
  footer,
  as: Tag = "div",
}: {
  eyebrow?: string;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  as?: "div" | "article" | "section";
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      whileHover={reduce ? undefined : { y: -6, rotate: -0.4 }}
      transition={{ type: "spring", stiffness: 240, damping: 22, mass: 0.9 }}
      className="skeu-card"
    >
      <Tag className="skeu-inner">
        {eyebrow && <span className="skeu-eyebrow">{eyebrow}</span>}
        {title && <h3 className="skeu-title">{title}</h3>}
        <div className="skeu-body">{children}</div>
        {footer && <div className="skeu-foot">{footer}</div>}
      </Tag>
    </motion.div>
  );
}
