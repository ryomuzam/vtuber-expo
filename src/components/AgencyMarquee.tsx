import Image from "next/image";
import { agencies } from "@/data/agencies";

// Split agencies into two rows
const half = Math.ceil(agencies.length / 2);
const row1 = agencies.slice(0, half);
const row2 = agencies.slice(half);

function LogoItem({ name, logo }: { name: string; logo?: string }) {
  return (
    <div className="flex h-12 w-28 shrink-0 items-center justify-center px-2 md:h-14 md:w-32">
      {logo ? (
        <Image
          src={logo}
          alt={name}
          width={100}
          height={40}
          className="h-auto max-h-9 w-auto max-w-full object-contain opacity-70 md:max-h-10"
        />
      ) : (
        <span className="text-xs font-medium text-pop-muted/60">{name}</span>
      )}
    </div>
  );
}

function MarqueeRow({
  items,
  direction,
}: {
  items: typeof agencies;
  direction: "left" | "right";
}) {
  const animClass = direction === "left" ? "animate-marquee-left" : "animate-marquee-right";

  return (
    <div className="relative flex overflow-hidden">
      {/* Two copies for seamless loop */}
      <div className={`flex shrink-0 ${animClass}`}>
        {items.map((a) => (
          <LogoItem key={`a-${a.id}`} name={a.name} logo={a.logo} />
        ))}
      </div>
      <div className={`flex shrink-0 ${animClass}`} aria-hidden="true">
        {items.map((a) => (
          <LogoItem key={`b-${a.id}`} name={a.name} logo={a.logo} />
        ))}
      </div>
    </div>
  );
}

export default function AgencyMarquee() {
  return (
    <section className="bg-white py-6 md:py-8">
      <div className="flex flex-col gap-3">
        <MarqueeRow items={row1} direction="left" />
        <MarqueeRow items={row2} direction="right" />
      </div>
    </section>
  );
}
