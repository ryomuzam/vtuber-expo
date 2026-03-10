import { getTranslations } from "next-intl/server";
import SectionTitle from "./SectionTitle";
import ScrollReveal from "./ScrollReveal";
import ScrollParallax from "./ScrollParallax";
import ParallaxText from "./ParallaxText";

export default async function AccessSection() {
  const t = await getTranslations("Access");

  const accessInfo = [
    { label: t("venue"), value: t("venueValue") },
    { label: t("address"), value: t("addressValue") },
    { label: t("station"), value: t("stationValue") },
  ];

  return (
    <section id="access" className="relative overflow-hidden py-24">
      {/* Background decorations */}
      <div className="deco-blob left-[-8%] top-[25%] h-[300px] w-[300px] bg-accent-blue/20" />
      <div className="deco-blob right-[-6%] bottom-[20%] h-[250px] w-[250px] bg-accent-magenta/15" />


      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        <ParallaxText
          text="ACCESS"
          speed={0.08}
          className="text-[10rem] text-accent-blue/[0.04] md:text-[16rem]"
        />
      </div>

      <div className="relative z-10 mx-auto max-w-3xl px-4 md:px-8">
        <ScrollReveal>
          <SectionTitle title={t("sectionTitle")} subtitle={t("sectionSubtitle")} />
        </ScrollReveal>

        {/* Map */}
        <ScrollReveal delay={200}>
          <div className="mb-8 overflow-hidden rounded-2xl shadow-sm">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3240.1!2d139.7707!3d35.6997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60188ea73e2b8811%3A0x45afbb49c5c29a4!2z44OZ44Or44K144O844Or56eL6JGJ5Y6f!5e0!3m2!1sja!2sjp!4v1"
              width="100%"
              height="300"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full"
            />
          </div>
        </ScrollReveal>

        {/* Info */}
        <ScrollReveal delay={300}>
          <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
            {accessInfo.map((row, i) => (
              <div
                key={i}
                className={`flex flex-col gap-1 px-6 py-5 md:flex-row md:gap-8 ${
                  i !== accessInfo.length - 1 ? "border-b border-pop-bg" : ""
                }`}
              >
                <dt className="shrink-0 text-sm font-bold text-accent-blue md:w-40">
                  {row.label}
                </dt>
                <dd className="whitespace-pre-wrap text-sm text-pop-text md:text-base">
                  {row.value}
                </dd>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
