"use client";

import { useEffect, useRef, type ReactNode } from "react";

type ScrollParallaxProps = {
  children: ReactNode;
  /** Vertical speed multiplier. Positive = moves down slower (lags), negative = moves up faster. */
  speed?: number;
  className?: string;
};

export default function ScrollParallax({
  children,
  speed = 0.1,
  className = "",
}: ScrollParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const viewH = window.innerHeight;
        // progress: 0 when element enters bottom, 1 when it exits top
        const progress = 1 - (rect.top + rect.height) / (viewH + rect.height);
        const offset = (progress - 0.5) * speed * 600;
        el.style.transform = `translateY(${offset}px)`;
        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [speed]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
