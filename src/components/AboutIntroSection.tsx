import { getLocale } from "next-intl/server";
import ScrollReveal from "./ScrollReveal";
import ParallaxText from "./ParallaxText";
import type { AboutIntroData } from "@/lib/data";

type Props = {
  data: AboutIntroData;
};

export default async function AboutIntroSection({ data }: Props) {
  const locale = await getLocale();
  const isJa = locale === "ja";

  return (
    <section id="about" className="relative overflow-hidden py-16 md:py-24">
      {/* Background decorations */}
      <div className="deco-blob left-[-10%] top-[10%] h-[400px] w-[400px] bg-accent-cyan/40" />
      <div className="deco-blob right-[-8%] bottom-[5%] h-[350px] w-[350px] bg-accent-magenta/30" />

{/* Parallax background text */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        <ParallaxText
          text="ABOUT"
          speed={0.12}
          className="text-[12rem] text-accent-blue/[0.04] md:text-[20rem]"
        />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center md:px-8">
        <ScrollReveal>
          {/* Subtitle */}
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.4em] text-accent-blue/60 md:text-sm">
            ABOUT VTUBER EXPO
          </p>

          {/* Main title */}
          <h2 className="mb-2 text-3xl font-black leading-tight text-pop-text md:text-5xl">
            {isJa ? data.sectionTitleJa : data.sectionTitleEn}
          </h2>
          <p className="mb-8 text-4xl font-black tracking-[0.15em] text-pop-text md:text-6xl">
            VTUBER EXPO{isJa ? "とは" : ""}
          </p>
        </ScrollReveal>

        {/* Description */}
        <ScrollReveal delay={150}>
          <p className="mx-auto max-w-2xl whitespace-pre-line text-base font-bold leading-[2] text-pop-text md:text-lg">
            {isJa ? data.leadCopyJa : data.leadCopyEn}
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
