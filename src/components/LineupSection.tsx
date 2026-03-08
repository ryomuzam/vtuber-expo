import Image from "next/image";
import { useTranslations } from "next-intl";
import SectionTitle from "./SectionTitle";
import ScrollReveal from "./ScrollReveal";
import ScrollParallax from "./ScrollParallax";
import ParallaxText from "./ParallaxText";
import type { Agency, Sponsor, Tieup } from "@/lib/data";

type Props = {
  agencies: Agency[];
  sponsors: Sponsor[];
  tieups: Tieup[];
};

export default function LineupSection({ agencies, sponsors, tieups }: Props) {
  const t = useTranslations("Lineup");

  return (
    <section id="lineup" className="relative overflow-hidden bg-main-gradient-soft py-24">
      {/* Background decorations */}
      <div className="deco-blob left-[-8%] top-[5%] h-[500px] w-[500px] bg-accent-cyan/20" />
      <div className="deco-blob right-[-6%] top-[40%] h-[400px] w-[400px] bg-accent-magenta/15" />
      <div className="deco-blob left-[30%] bottom-[-5%] h-[350px] w-[350px] bg-accent-blue/20" />

      {/* Deco — star right-top, ball left-bottom, ring right-bottom */}
      <ScrollParallax speed={-0.15} className="pointer-events-none absolute -right-8 top-[12%] z-0">
        <img src="/images/deco/star.png" alt="" aria-hidden="true" className="w-24 opacity-50 md:w-40" />
      </ScrollParallax>
      <ScrollParallax speed={0.12} className="pointer-events-none absolute -left-6 bottom-[25%] z-0">
        <img src="/images/deco/ball.png" alt="" aria-hidden="true" className="w-20 opacity-40 md:w-32" />
      </ScrollParallax>
      <ScrollParallax speed={-0.06} className="pointer-events-none absolute right-[5%] bottom-[10%] z-0">
        <img src="/images/deco-ring.png" alt="" aria-hidden="true" className="w-20 opacity-15 md:w-32" />
      </ScrollParallax>

      {/* Parallax background text */}
      <div className="absolute inset-0 flex items-start justify-center overflow-hidden pt-[15%]">
        <ParallaxText
          text="LINE UP"
          speed={0.1}
          className="text-[10rem] text-accent-blue/[0.04] md:text-[18rem]"
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-8">
        <ScrollReveal>
          <SectionTitle title={t("sectionTitle")} subtitle={t("sectionSubtitle")} />
        </ScrollReveal>

        {/* Agencies */}
        <div className="mb-16">
          <ScrollReveal>
            <h3 className="mb-8 text-center text-xl font-bold text-pop-text">
              {t("agencies")}
            </h3>
          </ScrollReveal>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {agencies.map((agency, i) => (
              <ScrollReveal key={agency.id} delay={(i % 6) * 50}>
                <div className="card-hover flex aspect-[3/2] items-center justify-center rounded-xl bg-white p-4 shadow-sm">
                  {agency.logo ? (
                    <Image
                      src={agency.logo}
                      alt={agency.name}
                      width={160}
                      height={90}
                      className="h-auto max-h-14 w-auto max-w-full object-contain"
                    />
                  ) : (
                    <span className="text-center text-xs font-medium text-pop-muted">
                      {agency.name}
                    </span>
                  )}
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>

        {/* Sponsors */}
        <div className="mb-16">
          <ScrollReveal>
            <h3 className="mb-8 text-center text-xl font-bold text-pop-text">
              {t("sponsors")}
            </h3>
          </ScrollReveal>
          {sponsors.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {sponsors.map((sponsor) => (
                <div
                  key={sponsor.id}
                  className="flex aspect-[3/2] items-center justify-center rounded-xl bg-white p-3 shadow-sm"
                >
                  <span className="text-center text-xs font-medium text-pop-muted">
                    {sponsor.name}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <ScrollReveal>
              <p className="text-center text-sm text-pop-muted">{t("comingSoon")}</p>
            </ScrollReveal>
          )}
        </div>

        {/* Tie-ups */}
        <div>
          <ScrollReveal>
            <h3 className="mb-8 text-center text-xl font-bold text-pop-text">
              {t("tieups")}
            </h3>
          </ScrollReveal>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {tieups.map((tieup, i) => (
              <ScrollReveal key={tieup.id} delay={i * 100}>
                <div className="card-hover flex h-20 w-40 items-center justify-center rounded-xl bg-white p-4 shadow-sm">
                  {tieup.logo ? (
                    <Image
                      src={tieup.logo}
                      alt={tieup.name}
                      width={140}
                      height={50}
                      className="h-auto max-h-10 w-auto max-w-full object-contain"
                    />
                  ) : (
                    <span className="text-center text-sm font-medium text-pop-muted">
                      {tieup.name}
                    </span>
                  )}
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
