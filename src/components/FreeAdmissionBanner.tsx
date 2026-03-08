import { useTranslations } from "next-intl";
import ScrollReveal from "./ScrollReveal";
import ScrollParallax from "./ScrollParallax";
import ParallaxText from "./ParallaxText";

export default function FreeAdmissionBanner() {
  const t = useTranslations("FreeAdmission");

  return (
    <section className="relative overflow-hidden bg-main-gradient py-16">
      {/* Decorative circles */}
      <div className="absolute left-[10%] top-[20%] h-32 w-32 rounded-full bg-white/10" />
      <div className="absolute right-[15%] bottom-[15%] h-24 w-24 rounded-full bg-white/10" />

      {/* Deco — ball right, star left */}
      <ScrollParallax speed={-0.18} className="pointer-events-none absolute -right-4 top-[20%] z-0">
        <img src="/images/deco/ball.png" alt="" aria-hidden="true" className="w-16 opacity-30 md:w-28" />
      </ScrollParallax>
      <ScrollParallax speed={0.14} className="pointer-events-none absolute -left-2 bottom-[15%] z-0">
        <img src="/images/deco/star.png" alt="" aria-hidden="true" className="w-10 opacity-35 md:w-16" />
      </ScrollParallax>

      {/* Parallax background text */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        <ParallaxText
          text="FREE"
          speed={-0.2}
          className="text-[14rem] text-white/[0.06] md:text-[22rem]"
        />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center md:px-8">
        <ScrollReveal>
          <p className="mb-2 text-sm font-bold uppercase tracking-[0.3em] text-white/70">
            {t("subtitle")}
          </p>
          <h2 className="mb-4 text-4xl font-black tracking-wider text-white md:text-6xl">
            {t("title")}
          </h2>
          <p className="text-sm text-white/80">{t("note")}</p>
        </ScrollReveal>
      </div>
    </section>
  );
}
