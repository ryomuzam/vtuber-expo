"use client";

import { useEffect, useRef } from "react";

type ParallaxTextProps = {
  text: string;
  /** Speed multiplier — positive = move right on scroll, negative = move left */
  speed?: number;
  className?: string;
};

export default function ParallaxText({
  text,
  speed = 0.15,
  className = "",
}: ParallaxTextProps) {
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
        const offset = (progress - 0.5) * speed * 1000;
        el.style.transform = `translateX(${offset}px)`;
        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [speed]);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`pointer-events-none select-none whitespace-nowrap font-black uppercase leading-none ${className}`}
    >
      {text}
    </div>
  );
}
