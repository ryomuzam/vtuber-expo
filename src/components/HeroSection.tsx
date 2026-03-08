"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import type { HeroSlide } from "@/lib/data";

const TRANSITION_MS = 600;

type Props = {
  slides: HeroSlide[];
};

export default function HeroSection({ slides }: Props) {
  // Extended: [clone of last, ...real slides, clone of first]
  const extended = slides.length > 0
    ? [slides[slides.length - 1], ...slides, slides[0]]
    : [];

  // index within the extended array; 1 = first real slide
  const [index, setIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const trackRef = useRef<HTMLDivElement>(null);
  const isSnapping = useRef(false);

  // The real slide index (0-based) for indicators & overlay
  const realIndex = slides.length > 0
    ? ((index - 1) % slides.length + slides.length) % slides.length
    : 0;

  // Snap to real position if on a clone (instant, no transition)
  const snapIfClone = useCallback((currentIndex: number) => {
    if (isSnapping.current || slides.length === 0) return;
    if (currentIndex === 0) {
      isSnapping.current = true;
      setIsTransitioning(false);
      setIndex(slides.length);
      requestAnimationFrame(() => {
        isSnapping.current = false;
      });
    } else if (currentIndex === extended.length - 1) {
      isSnapping.current = true;
      setIsTransitioning(false);
      setIndex(1);
      requestAnimationFrame(() => {
        isSnapping.current = false;
      });
    }
  }, [slides.length, extended.length]);

  const goTo = useCallback((next: number) => {
    if (isSnapping.current) return;
    setIsTransitioning(true);
    setIndex(next);
  }, []);

  const prev = useCallback(() => goTo(index - 1), [index, goTo]);
  const next = useCallback(() => goTo(index + 1), [index, goTo]);

  // Handle transition end — only for the track's own transform
  const handleTransitionEnd = useCallback(
    (e: React.TransitionEvent) => {
      if (e.target !== trackRef.current || e.propertyName !== "transform") return;
      snapIfClone(index);
    },
    [index, snapIfClone]
  );

  // Fallback timeout in case transitionEnd doesn't fire
  useEffect(() => {
    if (!isTransitioning) return;
    const isClone = index === 0 || index === extended.length - 1;
    if (!isClone) return;
    const timer = setTimeout(() => snapIfClone(index), TRANSITION_MS + 50);
    return () => clearTimeout(timer);
  }, [index, isTransitioning, snapIfClone, extended.length]);

  // Auto-play
  useEffect(() => {
    if (slides.length === 0) return;
    const timer = setInterval(() => goTo(index + 1), 5000);
    return () => clearInterval(timer);
  }, [index, goTo, slides.length]);

  if (slides.length === 0) {
    return <section className="relative w-full pt-24 md:pt-28" />;
  }

  return (
    <section className="relative w-full overflow-hidden pt-24 md:pt-28">
      {/* Slider track wrapper — buttons are positioned relative to this */}
      <div className="relative">
        {/* Slider track */}
        <div
          ref={trackRef}
          className={`flex [--sw:92vw] md:[--sw:70vw] ${
            isTransitioning ? "transition-transform ease-in-out" : ""
          }`}
          style={{
            transitionDuration: isTransitioning ? `${TRANSITION_MS}ms` : "0ms",
            transform: `translateX(calc(50vw - var(--sw) / 2 - var(--sw) * ${index}))`,
          }}
          onTransitionEnd={handleTransitionEnd}
        >
          {extended.map((slide, i) => (
            <div
              key={`${slide.id}-${i}`}
              className="relative w-[var(--sw)] shrink-0"
            >
              {/* Slide content */}
              {slide.src ? (
                <div className="relative aspect-[16/9]">
                  <Image
                    src={slide.src}
                    alt={slide.label}
                    fill
                    className="object-cover"
                    priority={slide.id === slides[0]?.id}
                  />
                </div>
              ) : (
                <div className="img-placeholder flex aspect-[16/9] items-center justify-center">
                  <span className="text-sm font-medium tracking-wider text-accent-blue/30 md:text-base">
                    {slide.label} — 1920 × 1080
                  </span>
                </div>
              )}

              {/* Dark overlay for non-active slides */}
              <div
                className="pointer-events-none absolute inset-0 bg-black/60 transition-opacity duration-600 ease-in-out"
                style={{
                  opacity:
                    i === index ||
                    (index === 0 && i === extended.length - 2) ||
                    (index === extended.length - 1 && i === 1)
                      ? 0
                      : 1,
                }}
              />
            </div>
          ))}
        </div>

        {/* Navigation buttons — centered vertically within the slider track */}
        <button
          onClick={prev}
          className="absolute left-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 shadow-lg backdrop-blur-sm transition-all hover:scale-110 hover:bg-white active:scale-95 md:left-8 md:h-14 md:w-14"
          aria-label="Previous slide"
        >
          <svg className="h-5 w-5 text-pop-text md:h-6 md:w-6" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={next}
          className="absolute right-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 shadow-lg backdrop-blur-sm transition-all hover:scale-110 hover:bg-white active:scale-95 md:right-8 md:h-14 md:w-14"
          aria-label="Next slide"
        >
          <svg className="h-5 w-5 text-pop-text md:h-6 md:w-6" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2.5 md:bottom-6">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i + 1)}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              i === realIndex
                ? "w-8 bg-white"
                : "w-2.5 bg-white/40 hover:bg-white/60"
            }`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
