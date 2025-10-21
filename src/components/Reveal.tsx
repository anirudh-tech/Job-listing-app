"use client";

import React from "react";

type Variant = "up" | "left" | "right";

interface RevealProps {
  children: React.ReactNode;
  variant?: Variant;
  delayMs?: number;
  durationMs?: number;
}

export default function Reveal({ children, variant = "up", delayMs = 0, durationMs = 1000 }: RevealProps) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), delayMs);
          observer.unobserve(node);
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [delayMs]);

  const base = "transition-all ease-out will-change-transform";
  const hidden =
    variant === "up"
      ? "opacity-0 translate-y-6"
      : variant === "left"
      ? "opacity-0 -translate-x-6"
      : "opacity-0 translate-x-6";
  const shown = "opacity-100 translate-x-0 translate-y-0";

  return (
    <div ref={ref} className={`${base} ${visible ? shown : hidden}`} style={{ transitionDuration: `${durationMs}ms` }}>
      {children}
    </div>
  );
}


