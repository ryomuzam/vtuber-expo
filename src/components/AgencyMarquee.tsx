import Image from "next/image";
import type { Agency, Tieup } from "@/lib/data";

type LogoItem = { id: string; name: string; logo?: string };

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
        <span className="text-xs font-medium text-gray-500">{name}</span>
      )}
    </div>
  );
}

function MarqueeRow({
  items,
  direction,
}: {
  items: LogoItem[];
  direction: "left" | "right";
}) {
  const animClass = direction === "left" ? "animate-marquee-left" : "animate-marquee-right";

  return (
    <div className="relative flex overflow-hidden">
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

type Props = {
  agencies: Agency[];
  tieups: Tieup[];
};

export default function AgencyMarquee({ agencies, tieups }: Props) {
  const allItems: LogoItem[] = [...agencies, ...tieups];
  if (allItems.length === 0) return null;

  const half = Math.ceil(allItems.length / 2);
  const row1 = allItems.slice(0, half);
  const row2 = allItems.slice(half);

  return (
    <section className="bg-white py-6 md:py-8">
      <div className="flex flex-col gap-3">
        <MarqueeRow items={row1} direction="left" />
        {row2.length > 0 && <MarqueeRow items={row2} direction="right" />}
      </div>
    </section>
  );
}
