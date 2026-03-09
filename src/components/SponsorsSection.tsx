import type { SponsorPageData, SponsorTier, TieredSponsor } from "@/lib/data";

const TIER_CONFIG: Record<SponsorTier, { label: string; logoSize: string; cols: string }> = {
  gold: { label: "GOLD", logoSize: "h-20", cols: "grid-cols-2 sm:grid-cols-3" },
  silver: { label: "SILVER", logoSize: "h-14", cols: "grid-cols-3 sm:grid-cols-4" },
  bronze: { label: "BRONZE", logoSize: "h-12", cols: "grid-cols-4 sm:grid-cols-5" },
  sampling: { label: "SAMPLING", logoSize: "h-10", cols: "grid-cols-4 sm:grid-cols-6" },
};

const TIER_ORDER: SponsorTier[] = ["gold", "silver", "bronze", "sampling"];

function SponsorLogo({ sponsor, logoSize }: { sponsor: TieredSponsor; logoSize: string }) {
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
        className="flex items-center justify-center rounded-lg bg-white p-4 shadow-sm transition hover:shadow-md"
      >
        {inner}
      </a>
    );
  }
  return (
    <div className="flex items-center justify-center rounded-lg bg-white p-4 shadow-sm">
      {inner}
    </div>
  );
}

export default function SponsorsSection({ data }: { data: SponsorPageData }) {
  return (
    <section className="w-full bg-gray-50 py-16 px-4">
      <div className="mx-auto max-w-4xl">
        <h2 className="mb-12 text-center text-3xl font-black text-gray-900">SPONSORS</h2>
        <div className="space-y-12">
          {TIER_ORDER.map((tier) => {
            const sponsors = data.sponsors.filter((s) => s.tier === tier);
            if (sponsors.length === 0) return null;
            const config = TIER_CONFIG[tier];
            return (
              <div key={tier}>
                <div className="mb-6 flex items-center gap-4">
                  <div
                    className={`rounded-full px-4 py-1 text-xs font-bold tracking-widest ${
                      tier === "gold"
                        ? "bg-yellow-400 text-yellow-900"
                        : tier === "silver"
                        ? "bg-gray-300 text-gray-800"
                        : tier === "bronze"
                        ? "bg-orange-300 text-orange-900"
                        : "bg-blue-200 text-blue-900"
                    }`}
                  >
                    {config.label}
                  </div>
                  <div className="flex-1 border-t border-gray-200" />
                </div>
                <div className={`grid ${config.cols} gap-4`}>
                  {sponsors.map((s) => (
                    <SponsorLogo key={s.id} sponsor={s} logoSize={config.logoSize} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
