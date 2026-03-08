import { useTranslations } from "next-intl";
import ScrollReveal from "./ScrollReveal";
import ScrollParallax from "./ScrollParallax";
import ParallaxText from "./ParallaxText";

export default function SocialSection() {
  const t = useTranslations("Social");

  return (
    <section className="relative overflow-hidden bg-main-gradient py-20 md:py-28">
      {/* Decorative circles */}
      <div className="absolute left-[5%] top-[15%] h-28 w-28 rounded-full bg-white/10" />
      <div className="absolute right-[10%] bottom-[20%] h-20 w-20 rounded-full bg-white/10" />

      {/* Deco — ball right, star left */}
      <ScrollParallax speed={-0.16} className="pointer-events-none absolute -right-4 top-[25%] z-0">
        <img src="/images/deco/ball.png" alt="" aria-hidden="true" className="w-16 opacity-30 md:w-28" />
      </ScrollParallax>
      <ScrollParallax speed={0.12} className="pointer-events-none absolute left-[8%] bottom-[15%] z-0">
        <img src="/images/deco/star.png" alt="" aria-hidden="true" className="w-10 opacity-40 md:w-16" />
      </ScrollParallax>

      {/* Parallax background text */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        <ParallaxText
          text="FOLLOW"
          speed={0.15}
          className="text-[12rem] text-white/[0.05] md:text-[20rem]"
        />
      </div>

      <div className="relative z-10 mx-auto max-w-3xl px-4 text-center md:px-8">
        <ScrollReveal>
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.3em] text-white/60">
            {t("subtitle")}
          </p>
          <h2 className="mb-4 text-3xl font-black text-white md:text-4xl">
            {t("title")}
          </h2>
          <p className="mb-10 text-base text-white/70">
            {t("description")}
          </p>
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <div className="flex flex-col items-center justify-center gap-6 sm:flex-row sm:gap-8">
            {/* X (Twitter) Button */}
            <a
              href="https://x.com/VTUBEREXPO2026"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex w-full flex-col items-center justify-center gap-4 rounded-3xl bg-black px-12 py-10 shadow-xl transition-all hover:-translate-y-2 hover:shadow-2xl sm:w-64 md:w-72"
            >
              <svg className="h-16 w-16 text-white md:h-20 md:w-20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              <span className="text-xl font-black tracking-wide text-white md:text-2xl">X (Twitter)</span>
            </a>

            {/* YouTube Button */}
            <a
              href="https://www.youtube.com/@VTUBEREXPO"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex w-full flex-col items-center justify-center gap-4 rounded-3xl bg-[#FF0000] px-12 py-10 shadow-xl transition-all hover:-translate-y-2 hover:shadow-2xl sm:w-64 md:w-72"
            >
              <svg className="h-16 w-16 text-white md:h-20 md:w-20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
              <span className="text-xl font-black tracking-wide text-white md:text-2xl">YouTube</span>
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
