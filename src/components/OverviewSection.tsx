import { getTranslations, getLocale } from "next-intl/server";
import SectionTitle from "./SectionTitle";
import ScrollReveal from "./ScrollReveal";
import ScrollParallax from "./ScrollParallax";
import ParallaxText from "./ParallaxText";
import { getOverviewData } from "@/lib/data";

export default async function OverviewSection() {
  const [t, locale, overviewData] = await Promise.all([
    getTranslations("Overview"),
    getLocale(),
    getOverviewData(),
  ]);

  const values = overviewData[locale as "ja" | "en"] ?? overviewData.ja;

  const rows = [
    { label: t("eventName"), value: values.eventNameValue },
    { label: t("date"), value: values.dateValue },
    { label: t("venue"), value: values.venueValue },
    { label: t("admission"), value: values.admissionValue },
    { label: t("organizer"), value: values.organizerValue },
  ];

  return (
    <section id="overview" className="relative overflow-hidden py-24">
      {/* Background decorations */}
      <div className="deco-blob left-[-12%] top-[20%] h-[350px] w-[350px] bg-accent-blue/25" />
      <div className="deco-blob right-[-10%] bottom-[15%] h-[280px] w-[280px] bg-accent-magenta/20" />

      {/* Deco — star right, ball left */}
      <ScrollParallax speed={-0.12} className="pointer-events-none absolute -right-6 top-[30%] z-0">
        <img src="/images/deco/star.png" alt="" aria-hidden="true" className="w-16 rotate-12 opacity-50 md:w-28" />
      </ScrollParallax>
      <ScrollParallax speed={0.1} className="pointer-events-none absolute -left-4 bottom-[25%] z-0">
        <img src="/images/deco/ball.png" alt="" aria-hidden="true" className="w-12 opacity-40 md:w-20" />
      </ScrollParallax>

      {/* Parallax background text */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        <ParallaxText
          text="OVERVIEW"
          speed={0.08}
          className="text-[10rem] text-accent-blue/[0.04] md:text-[16rem]"
        />
      </div>

      <div className="relative z-10 mx-auto max-w-3xl px-4 md:px-8">
        <ScrollReveal>
          <SectionTitle title={t("sectionTitle")} subtitle={t("sectionSubtitle")} />
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
            {rows.map((row, i) => (
              <div
                key={i}
                className={`flex flex-col gap-1 px-6 py-5 md:flex-row md:gap-8 ${
                  i !== rows.length - 1 ? "border-b border-pop-bg" : ""
                }`}
              >
                <dt className="shrink-0 text-sm font-bold text-accent-blue md:w-40">
                  {row.label}
                </dt>
                <dd className="text-sm text-pop-text md:text-base">{row.value}</dd>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
