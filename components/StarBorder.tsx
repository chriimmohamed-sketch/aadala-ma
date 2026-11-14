"use client";

import { ReactNode } from "react";

interface StarBorderProps {
  children: ReactNode;
  className?: string;
  color?: string;
}

export default function StarBorder({ children, className = "", color = "#C9A227" }: StarBorderProps) {
  return (
    <span
      className={`relative inline-flex overflow-hidden rounded-lg ${className}`}
      style={{ "--star-color": color } as React.CSSProperties}
    >
      <span
        className="absolute inset-0 animate-[star-border_3s_linear_infinite]"
        style={{
          background: `conic-gradient(from 0deg, transparent 0%, ${color} 10%, transparent 20%)`,
        }}
      />
      <span className="relative z-10">{children}</span>
    </span>
  );
}
