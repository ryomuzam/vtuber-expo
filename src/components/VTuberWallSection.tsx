import { getLocale } from "next-intl/server";
import ScrollReveal from "./ScrollReveal";
import type { VTuberWallData } from "@/lib/data";

type Props = {
  data: VTuberWallData;
};

export default async function VTuberWallSection({ data }: Props) {
  const locale = await getLocale();
  const isJa = locale === "ja";

  const title = isJa ? data.titleJa : data.titleEn;
  const subtitle = isJa ? data.subtitleJa : data.subtitleEn;
  const description = isJa ? data.descriptionJa : data.descriptionEn;
  const buttonLabel = isJa ? data.buttonLabelJa : data.buttonLabelEn;
  const deadline = isJa ? data.deadlineJa : data.deadlineEn;

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#0a0e27] via-[#111640] to-[#0d1233] py-16 md:py-24">
      {/* Background image */}
      {data.backgroundImageUrl ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={data.backgroundImageUrl}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full object-cover"
          />
          <div className="pointer-events-none absolute inset-0 bg-[#0a0e27]/60" />
        </>
      ) : (
        /* Decorative grid dots (fallback) */
        <div className="pointer-events-none absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle, #22d3ee 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
      )}

      {/* Left checker decoration */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/deco/checker-left.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 z-[1] h-full w-auto object-contain object-left opacity-60"
      />

      <div className="relative z-10 mx-auto max-w-5xl px-4 md:px-8">
        <ScrollReveal>
          {/* Subtitle badge */}
          <div className="mb-6 flex justify-center">
            <span className="inline-block rounded-full bg-gradient-to-r from-[#22d3ee] to-[#a78bfa] px-5 py-1.5 text-xs font-bold tracking-widest text-white md:text-sm">
              {subtitle}
            </span>
          </div>

          {/* Banner image */}
          {data.bannerImageUrl && (
            <div className="mb-8 overflow-hidden rounded-2xl shadow-2xl shadow-cyan-500/20">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={data.bannerImageUrl}
                alt={title}
                className="w-full object-cover"
              />
            </div>
          )}

          {/* Title */}
          <h2 className="mb-4 text-center text-3xl font-black leading-tight text-white md:text-5xl">
            <span className="bg-gradient-to-r from-[#22d3ee] to-[#a78bfa] bg-clip-text text-transparent">
              {title}
            </span>
          </h2>

          {/* Description */}
          <p className="mx-auto mb-4 max-w-2xl whitespace-pre-line text-center text-sm font-medium leading-relaxed text-gray-300 md:text-base">
            {description}
          </p>

          {/* Deadline */}
          {deadline && (
            <p className="mb-8 text-center text-sm font-bold text-[#22d3ee]">
              {deadline}
            </p>
          )}

          {/* Details grid */}
          {isJa && (
            <div className="mx-auto mb-8 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2">
              {[
                { label: "応募条件", value: "VTuber、Vライバーとして活動されている方" },
                { label: "応募内容", value: "ご自身の活動アイコン画像の提供" },
                { label: "応募方法", value: "専用フォームより受付" },
                { label: "募集期間", value: "2026年3月末日まで" },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm">
                  <span className="shrink-0 text-xs font-bold text-[#22d3ee]">{item.label}</span>
                  <span className="text-xs text-gray-300">{item.value}</span>
                </div>
              ))}
            </div>
          )}

          {/* CTA Button */}
          {data.formUrl && (
            <div className="flex justify-center">
              <a
                href={data.formUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-[#22d3ee] to-[#a78bfa] px-8 py-4 text-sm font-bold text-white shadow-lg shadow-cyan-500/25 transition-all hover:shadow-xl hover:shadow-cyan-500/40 md:text-base"
              >
                <span className="relative z-10">{buttonLabel}</span>
                <svg className="relative z-10 h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
                <div className="absolute inset-0 bg-gradient-to-r from-[#a78bfa] to-[#22d3ee] opacity-0 transition-opacity group-hover:opacity-100" />
              </a>
            </div>
          )}
        </ScrollReveal>
      </div>
    </section>
  );
}
