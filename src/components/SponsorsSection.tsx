import type { SponsorPageData, SponsorTier, TieredSponsor } from "@/lib/data";

const TIER_CONFIG: Record<SponsorTier, { logoSize: string; itemWidth: string; padding: string }> = {
  gold: { logoSize: "h-24", itemWidth: "w-48 sm:w-56", padding: "p-6" },
  silver: { logoSize: "h-16", itemWidth: "w-36 sm:w-44", padding: "p-5" },
  bronze: { logoSize: "h-12", itemWidth: "w-28 sm:w-36", padding: "p-4" },
  sampling: { logoSize: "h-10", itemWidth: "w-24 sm:w-32", padding: "p-3" },
};

const TIER_ORDER: SponsorTier[] = ["gold", "silver", "bronze", "sampling"];

function SponsorLogo({ sponsor, logoSize, padding }: { sponsor: TieredSponsor; logoSize: string; padding: string }) {
  const inner = sponsor.logoUrl ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={sponsor.logoUrl}
      alt={sponsor.name}
      className={`${logoSize} w-full object-contain`}
    />
  ) : (
    <span className="text-sm font-semibold text-gray-700">{sponsor.name}</span>
  );

  if (sponsor.websiteUrl) {
    return (
      <a
        href={sponsor.websiteUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`flex items-center justify-center rounded-lg bg-white ${padding} shadow-sm transition hover:shadow-md`}
      >
        {inner}
      </a>
    );
  }
  return (
    <div className={`flex items-center justify-center rounded-lg bg-white ${padding} shadow-sm`}>
      {inner}
    </div>
  );
}

export default function SponsorsSection({ data }: { data: SponsorPageData }) {
  return (
    <section className="w-full bg-gray-50 py-16 px-4">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-12 text-center text-3xl font-black text-gray-900">
          SPONSORS &amp; PARTNERS
        </h2>
        <div className="space-y-8">
          {TIER_ORDER.map((tier) => {
            const sponsors = data.sponsors.filter((s) => s.tier === tier);
            if (sponsors.length === 0) return null;
            const config = TIER_CONFIG[tier];
            return (
              <div key={tier} className="flex flex-wrap justify-center gap-4">
                {sponsors.map((s) => (
                  <div key={s.id} className={config.itemWidth}>
                    <SponsorLogo sponsor={s} logoSize={config.logoSize} padding={config.padding} />
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
