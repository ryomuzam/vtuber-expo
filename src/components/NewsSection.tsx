"use client";

import { useTranslations, useLocale } from "next-intl";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import SectionTitle from "./SectionTitle";
import ScrollReveal from "./ScrollReveal";
import ScrollParallax from "./ScrollParallax";
import ParallaxText from "./ParallaxText";
import type { NewsItem } from "@/lib/data";

type Props = { news: NewsItem[] };

export default function NewsSection({ news }: Props) {
  const t = useTranslations("News");
  const locale = useLocale();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = 400;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  const localePath = locale === "ja" ? "" : "/en";

  return (
    <section id="news" className="relative overflow-hidden bg-[#3D7FE0] py-16 md:py-20">
      {/* Background decorations */}
      <div className="deco-blob right-[-5%] top-[15%] h-[300px] w-[300px] bg-white/10" />
      <div className="deco-blob left-[5%] bottom-[10%] h-[250px] w-[250px] bg-white/10" />


      {/* Parallax background text */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        <ParallaxText
          text="NEWS"
          speed={-0.1}
          className="text-[12rem] text-white/[0.06] md:text-[20rem]"
        />
      </div>

      {/* Section title stays centered */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-8">
        <ScrollReveal>
          <SectionTitle title={t("sectionTitle")} subtitle={t("sectionSubtitle")} variant="light" />
        </ScrollReveal>
      </div>

      {/* Full-width slider that bleeds off screen */}
      <ScrollReveal delay={150}>
        <div className="relative z-10">
          {/* Slider - full width, overflows both sides */}
          <div
            ref={scrollRef}
            className="scrollbar-hide flex gap-6 overflow-x-auto px-[calc((100vw-340px)/2)] pb-4 pt-2 snap-x sm:px-[calc((100vw-380px)/2)] md:px-[calc((100vw-1280px)/2+2rem)]"
          >
            {news.map((item) => (
              <Link
                key={item.slug}
                href={`${localePath}/news/${item.slug}`}
                className="group w-[340px] shrink-0 snap-center sm:w-[380px]"
              >
                <div className="card-hover flex h-[360px] flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition-shadow hover:shadow-lg sm:h-[380px]">
                  {/* Image */}
                  <div className="relative aspect-[16/10] shrink-0 overflow-hidden bg-gray-50">
                    <Image
                      src={item.image || "/images/news/vtuberexpo_news.png"}
                      alt={locale === "ja" ? item.title.ja : item.title.en}
                      fill
                      className={`transition-transform duration-300 group-hover:scale-105 ${item.image ? "object-contain" : "object-cover"}`}
                    />
                  </div>
                  {/* Content */}
                  <div className="flex flex-1 flex-col p-6">
                    <time className="text-xs font-semibold text-accent-blue">
                      {item.date}
                    </time>
                    <h3 className="mt-2 text-base font-bold leading-snug text-pop-text transition-colors group-hover:text-accent-blue">
                      {locale === "ja" ? item.title.ja : item.title.en}
                    </h3>
                    <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-pop-muted">
                      {locale === "ja" ? item.description.ja : item.description.en}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Arrow buttons — centered to card height */}
          <div className="pointer-events-none absolute inset-0 z-20">
            <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 md:px-8">
              <button
                onClick={() => scroll("left")}
                className="pointer-events-auto flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-lg ring-1 ring-white/20 transition-all hover:scale-110 hover:bg-white hover:shadow-xl active:scale-95 md:h-12 md:w-12"
                aria-label="Previous"
              >
                <svg className="h-5 w-5 text-accent-blue" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => scroll("right")}
                className="pointer-events-auto flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-lg ring-1 ring-white/20 transition-all hover:scale-110 hover:bg-white hover:shadow-xl active:scale-95 md:h-12 md:w-12"
                aria-label="Next"
              >
                <svg className="h-5 w-5 text-accent-blue" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
