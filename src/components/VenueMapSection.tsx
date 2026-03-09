"use client";

import { useState } from "react";
import type { VenueMapData, VenueBooth, BoothType } from "@/lib/data";

const BOOTH_COLORS: Record<BoothType, string> = {
  booth: "#3D7FE0",
  stage: "#E040FB",
  entrance: "#22c55e",
  goods: "#a855f7",
  food: "#f97316",
  other: "#6b7280",
};

const BOOTH_TYPE_LABELS: Record<BoothType, string> = {
  booth: "展示ブース",
  stage: "ステージ",
  entrance: "エントランス",
  goods: "グッズ",
  food: "フード",
  other: "その他",
};

export default function VenueMapSection({ data }: { data: VenueMapData }) {
  const [selected, setSelected] = useState<VenueBooth | null>(null);

  return (
    <section id="venue-map" className="py-20 md:py-28 bg-pop-bg">
      <div className="mx-auto max-w-5xl px-4 md:px-8">
        <div className="mb-10 text-center">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.3em] text-accent-blue/60">VENUE MAP</p>
          <h2 className="text-3xl font-black text-pop-text md:text-4xl">会場マップ</h2>
        </div>

        <div className="relative overflow-hidden rounded-2xl shadow-lg">
          <img src={data.mapImageUrl} alt="会場マップ" className="w-full" />
          {data.booths.map((booth) => (
            <button
              key={booth.id}
              onClick={() => setSelected(selected?.id === booth.id ? null : booth)}
              title={booth.name}
              className="absolute flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-white shadow-md ring-2 ring-white transition hover:scale-125 active:scale-110"
              style={{
                left: `${booth.x}%`,
                top: `${booth.y}%`,
                backgroundColor: BOOTH_COLORS[booth.type],
              }}
            >
              <span className="text-[10px] font-bold">●</span>
            </button>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap justify-center gap-4">
          {(Object.keys(BOOTH_COLORS) as BoothType[]).map((type) => (
            <span key={type} className="flex items-center gap-1.5 text-sm text-gray-500">
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: BOOTH_COLORS[type] }} />
              {BOOTH_TYPE_LABELS[type]}
            </span>
          ))}
        </div>

        {/* Popup */}
        {selected && (
          <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span
                  className="mb-2 inline-block rounded-full px-3 py-0.5 text-xs font-semibold text-white"
                  style={{ backgroundColor: BOOTH_COLORS[selected.type] }}
                >
                  {BOOTH_TYPE_LABELS[selected.type]}
                </span>
                <h3 className="text-xl font-bold text-gray-900">{selected.name}</h3>
                {selected.description && (
                  <p className="mt-2 text-sm text-gray-500">{selected.description}</p>
                )}
              </div>
              <button
                onClick={() => setSelected(null)}
                className="shrink-0 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
