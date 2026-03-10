import { getLocale } from "next-intl/server";
import ScrollReveal from "./ScrollReveal";
import type { AboutData } from "@/lib/data";

type Props = {
  data: AboutData;
};

/* Fallback icon colours per card */
const defaultIconBg = ["bg-[#8B5CF6]", "bg-[#3D7FE0]", "bg-[#4F46E5]", "bg-[#22D3EE]"];

/* Fallback SVG icons */
const defaultIcons = [
  <svg key="0" className="h-12 w-12 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437" /></svg>,
  <svg key="1" className="h-12 w-12 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M4.913 2.658c2.075-.27 4.19-.408 6.337-.408 2.147 0 4.262.139 6.337.408 1.922.25 3.291 1.861 3.405 3.727a4.403 4.403 0 0 0-1.032-.211 50.89 50.89 0 0 0-8.42 0c-2.358.196-4.04 2.19-4.04 4.434v4.286a4.986 4.986 0 0 0 2.59 4.374l-.443.332-2.897 2.174A.75.75 0 0 1 6 21.308v-3.57A4.18 4.18 0 0 1 2.75 13.72V6.383c.113-1.865 1.482-3.476 3.404-3.725h-.001Z" /><path d="M15.75 7.5c-1.376 0-2.739.057-4.086.169C10.124 7.797 9 9.103 9 10.609v4.285c0 1.507 1.128 2.814 2.67 2.94 1.243.102 2.5.157 3.768.165l2.782 2.085a.75.75 0 0 0 1.28-.53v-2.39a3.32 3.32 0 0 0 1.75-2.94V10.61c0-1.506-1.125-2.812-2.664-2.94A49.392 49.392 0 0 0 15.75 7.5Z" /></svg>,
  <svg key="2" className="h-12 w-12 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8.25 4.5a3.75 3.75 0 1 1 7.5 0v8.25a3.75 3.75 0 1 1-7.5 0V4.5Z" /><path d="M6 10.5a.75.75 0 0 1 .75.75v1.5a5.25 5.25 0 1 0 10.5 0v-1.5a.75.75 0 0 1 1.5 0v1.5a6.751 6.751 0 0 1-6 6.709V21h3a.75.75 0 0 1 0 1.5h-7.5a.75.75 0 0 1 0-1.5h3v-1.741a6.751 6.751 0 0 1-6-6.709v-1.5A.75.75 0 0 1 6 10.5Z" /></svg>,
  <svg key="3" className="h-12 w-12 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M11.584 2.376a.75.75 0 0 1 .832 0l9 6a.75.75 0 1 1-.832 1.248L12 3.901 3.416 9.624a.75.75 0 0 1-.832-1.248l9-6Z" /><path fillRule="evenodd" d="M20.25 10.332v9.918H21a.75.75 0 0 1 0 1.5H3a.75.75 0 0 1 0-1.5h.75v-9.918a.75.75 0 0 1 .634-.742A49.109 49.109 0 0 1 12 9c2.59 0 5.134.202 7.616.59a.75.75 0 0 1 .634.742Zm-7.5 2.418a.75.75 0 0 0-1.5 0v6.75a.75.75 0 0 0 1.5 0v-6.75Zm3-.75a.75.75 0 0 1 .75.75v6.75a.75.75 0 0 1-1.5 0v-6.75a.75.75 0 0 1 .75-.75ZM9 12.75a.75.75 0 0 0-1.5 0v6.75a.75.75 0 0 0 1.5 0v-6.75Z" clipRule="evenodd" /></svg>,
];

export default async function AboutSection({ data }: Props) {
  const locale = await getLocale();
  const isJa = locale === "ja";

  const cards = data.cards.map((c, i) => ({
    label: isJa ? (c.labelJa ?? "VTuberと") : (c.labelEn ?? "With VTubers"),
    keyword: isJa ? c.titleJa : c.titleEn,
    desc: isJa ? c.descJa : c.descEn,
    iconUrl: c.iconUrl,
    iconBgClass: defaultIconBg[i % defaultIconBg.length],
    defaultIcon: defaultIcons[i % defaultIcons.length],
  }));

  return (
    <section className="relative overflow-hidden bg-pop-bg/50 py-10 md:py-14">
      <div className="relative z-10 mx-auto max-w-5xl px-4 md:px-8">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5">
          {cards.map((card, i) => (
            <ScrollReveal key={i} delay={i * 100}>
              <div className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-md transition-transform hover:-translate-y-1 hover:shadow-lg">
                {/* Top: label + keyword */}
                <div className="flex flex-col items-center justify-end px-4 pb-2 pt-6 text-center" style={{ minHeight: "5.5rem" }}>
                  <p className="mb-1 text-xs font-bold text-gray-500 md:text-sm">
                    {card.label}
                  </p>
                  <p className="text-2xl font-black text-pop-text md:text-3xl">
                    {card.keyword}
                  </p>
                </div>

                {/* Middle: icon */}
                <div className="flex items-center justify-center py-4">
                  {card.iconUrl ? (
                    <img
                      src={card.iconUrl}
                      alt=""
                      className="h-20 w-20 rounded-full object-cover shadow-lg md:h-24 md:w-24"
                    />
                  ) : (
                    <div className={`flex h-20 w-20 items-center justify-center rounded-full ${card.iconBgClass} shadow-lg md:h-24 md:w-24`}>
                      {card.defaultIcon}
                    </div>
                  )}
                </div>

                {/* Bottom: description */}
                <div className="flex flex-1 items-center bg-gradient-to-r from-[#3D7FE0] to-[#22D3EE] px-4 py-5">
                  <p className="whitespace-pre-line text-center text-xs font-bold leading-relaxed text-white md:text-sm">
                    {card.desc}
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
