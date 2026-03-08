import { useTranslations } from "next-intl";
import Image from "next/image";
import SectionTitle from "./SectionTitle";
import ScrollReveal from "./ScrollReveal";
import ScrollParallax from "./ScrollParallax";
import ParallaxText from "./ParallaxText";

export default function AboutSection() {
  const t = useTranslations("About");

  const cards = [
    {
      num: "01",
      titleKey: "card1Title" as const,
      descKey: "card1Desc" as const,
      accentColor: "from-accent-cyan to-accent-blue",
    },
    {
      num: "02",
      titleKey: "card2Title" as const,
      descKey: "card2Desc" as const,
      accentColor: "from-accent-blue to-accent-magenta",
    },
    {
      num: "03",
      titleKey: "card3Title" as const,
      descKey: "card3Desc" as const,
      accentColor: "from-accent-magenta to-accent-cyan",
    },
  ];

  return (
    <section id="about" className="relative overflow-hidden py-24">
      {/* Background decorations */}
      <div className="deco-blob left-[-10%] top-[10%] h-[400px] w-[400px] bg-accent-cyan/40" />
      <div className="deco-blob right-[-8%] bottom-[5%] h-[350px] w-[350px] bg-accent-magenta/30" />

      {/* Deco — star right, ball left-bottom */}
      <ScrollParallax speed={-0.15} className="pointer-events-none absolute -right-4 top-[20%] z-0">
        <img src="/images/deco/star.png" alt="" aria-hidden="true" className="w-20 opacity-60 md:w-32" />
      </ScrollParallax>
      <ScrollParallax speed={0.12} className="pointer-events-none absolute -left-6 bottom-[15%] z-0">
        <img src="/images/deco/ball.png" alt="" aria-hidden="true" className="w-16 opacity-50 md:w-24" />
      </ScrollParallax>
      <ScrollParallax speed={-0.08} className="pointer-events-none absolute left-[15%] top-[8%] z-0">
        <img src="/images/deco/star.png" alt="" aria-hidden="true" className="w-8 opacity-40 md:w-12" />
      </ScrollParallax>

      {/* Parallax background text */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        <ParallaxText
          text="ABOUT"
          speed={0.12}
          className="text-[12rem] text-accent-blue/[0.04] md:text-[20rem]"
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-8">
        <ScrollReveal>
          <SectionTitle title={t("sectionTitle")} subtitle={t("sectionSubtitle")} />
        </ScrollReveal>

        {/* Lead copy */}
        <ScrollReveal delay={100}>
          <p className="mx-auto mb-16 max-w-3xl text-center text-base leading-loose text-pop-muted md:whitespace-pre-line md:text-lg">
            {t("leadCopy")}
          </p>
        </ScrollReveal>

        <div className="grid gap-8 md:grid-cols-3">
          {cards.map((card, i) => (
            <ScrollReveal key={card.titleKey} delay={i * 150}>
              <div className="card-hover group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm">
                {/* Image */}
                <div className="relative aspect-[16/10] shrink-0 overflow-hidden">
                  <Image
                    src="/images/news/vtuberexpo_news.png"
                    alt={t(card.titleKey)}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                {/* Text content */}
                <div className="flex flex-1 flex-col p-6">
                  {/* Number accent */}
                  <span
                    className={`mb-3 inline-block bg-gradient-to-r ${card.accentColor} bg-clip-text text-3xl font-black leading-none text-transparent`}
                  >
                    {card.num}
                  </span>
                  <h3 className="mb-3 text-lg font-bold leading-snug text-pop-text md:whitespace-pre-line md:text-xl">
                    {t(card.titleKey)}
                  </h3>
                  <p className="text-sm leading-relaxed text-pop-muted">
                    {t(card.descKey)}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
