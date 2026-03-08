import { useTranslations, useLocale } from "next-intl";
import SectionTitle from "./SectionTitle";
import ScrollReveal from "./ScrollReveal";
import ScrollParallax from "./ScrollParallax";
import ParallaxText from "./ParallaxText";
import { schedule } from "@/data/schedule";

export default function ScheduleSection() {
  const t = useTranslations("Schedule");
  const locale = useLocale();

  const dayLabels = [t("day1"), t("day2")];

  return (
    <section id="schedule" className="relative overflow-hidden bg-gradient-to-br from-[#3D7FE0] via-[#6B5CE7] to-[#C94BEA] py-24">
      {/* Background decorations */}
      <div className="deco-blob right-[-10%] top-[10%] h-[380px] w-[380px] bg-accent-cyan/20" />
      <div className="deco-blob left-[-8%] bottom-[5%] h-[300px] w-[300px] bg-accent-blue/20" />

      {/* Deco — star left, ball right */}
      <ScrollParallax speed={0.14} className="pointer-events-none absolute -left-4 top-[20%] z-0">
        <img src="/images/deco/star.png" alt="" aria-hidden="true" className="w-16 opacity-40 md:w-24" />
      </ScrollParallax>
      <ScrollParallax speed={-0.1} className="pointer-events-none absolute -right-6 bottom-[18%] z-0">
        <img src="/images/deco/ball.png" alt="" aria-hidden="true" className="w-20 opacity-35 md:w-28" />
      </ScrollParallax>

      {/* Parallax background text */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        <ParallaxText
          text="SCHEDULE"
          speed={-0.08}
          className="text-[8rem] text-accent-blue/[0.04] md:text-[14rem]"
        />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 md:px-8">
        <ScrollReveal>
          <SectionTitle title={t("sectionTitle")} subtitle={t("sectionSubtitle")} variant="light" />
        </ScrollReveal>

        <div className="grid gap-6 md:grid-cols-2">
          {schedule.map((day, dayIndex) => (
            <ScrollReveal key={dayIndex} delay={dayIndex * 200}>
              <div className="rounded-2xl bg-white/10 p-6 ring-1 ring-white/10 backdrop-blur-sm md:p-8">
                {/* Day header */}
                <div className="relative mb-6">
                  <h3 className="text-center text-2xl font-black tracking-wider text-white md:text-3xl">
                    {dayLabels[dayIndex]}
                  </h3>
                  <div className="mx-auto mt-2 h-0.5 w-16 rounded-full bg-main-gradient opacity-50" />
                </div>

                {/* Timeline */}
                <div className="divide-y divide-white/10">
                  {day.items.map((item, i) => (
                    <div key={i} className="flex gap-4 py-4">
                      {/* Time */}
                      <div className="w-12 shrink-0 text-sm font-bold text-accent-cyan">
                        {item.time}
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <h4 className="text-sm font-bold text-white">
                          {locale === "ja" ? item.title.ja : item.title.en}
                        </h4>
                        {item.description && (
                          <p className="mt-1 text-xs text-white/60">
                            {locale === "ja"
                              ? item.description.ja
                              : item.description.en}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
