"use client";

import { useState } from "react";
import type { VenueMapData, VenueBooth } from "@/lib/data";

type Labels = {
  sectionTitle: string;
  sectionSubtitle: string;
  moreInfo: string;
};

export default function VenueMapSection({ data, labels }: { data: VenueMapData; labels: Labels }) {
  const [selected, setSelected] = useState<VenueBooth | null>(null);

  const categories = data.pinCategories ?? [];

  function getCategoryColor(categoryId: string) {
    return categories.find((c) => c.id === categoryId)?.color ?? "#6b7280";
  }

  function getCategoryName(categoryId: string) {
    return categories.find((c) => c.id === categoryId)?.name ?? "";
  }

  return (
    <section id="venue-map" className="py-20 md:py-28 bg-pop-bg">
      <div className="mx-auto max-w-5xl px-4 md:px-8">
        <div className="mb-10 text-center">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.3em] text-accent-blue/60">{labels.sectionSubtitle}</p>
          <h2 className="text-3xl font-black text-pop-text md:text-4xl">{labels.sectionTitle}</h2>
        </div>

        <div className="relative overflow-hidden rounded-2xl shadow-lg">
          <img src={data.mapImageUrl} alt={labels.sectionTitle} className="w-full" />
          {data.booths.map((booth) => (
            <button
              key={booth.id}
              onClick={() => setSelected(selected?.id === booth.id ? null : booth)}
              title={booth.name}
              className="absolute flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-white shadow-md ring-2 ring-white transition hover:scale-125 active:scale-110"
              style={{
                left: `${booth.x}%`,
                top: `${booth.y}%`,
                backgroundColor: getCategoryColor(booth.categoryId),
              }}
            >
              <span className="text-[10px] font-bold">●</span>
            </button>
          ))}
        </div>

        {/* Legend */}
        {categories.length > 0 && (
          <div className="mt-4 flex flex-wrap justify-center gap-4">
            {categories.map((cat) => (
              <span key={cat.id} className="flex items-center gap-1.5 text-sm text-gray-500">
                <span className="h-3 w-3 rounded-full" style={{ backgroundColor: cat.color }} />
                {cat.name}
              </span>
            ))}
          </div>
        )}

        {/* Popup */}
        {selected && (
          <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                {selected.logoUrl && (
                  <img
                    src={selected.logoUrl}
                    alt={selected.name}
                    className="h-14 w-14 shrink-0 rounded-lg border border-gray-100 object-contain"
                  />
                )}
                <div>
                  {getCategoryName(selected.categoryId) && (
                    <span
                      className="mb-2 inline-block rounded-full px-3 py-0.5 text-xs font-semibold text-white"
                      style={{ backgroundColor: getCategoryColor(selected.categoryId) }}
                    >
                      {getCategoryName(selected.categoryId)}
                    </span>
                  )}
                  <h3 className="text-xl font-bold text-gray-900">{selected.name}</h3>
                  {selected.description && (
                    <p className="mt-2 whitespace-pre-wrap text-sm text-gray-500">{selected.description}</p>
                  )}
                  {selected.url && (
                    <a
                      href={selected.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-[#3D7FE0] hover:underline"
                    >
                      {labels.moreInfo}
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                      </svg>
                    </a>
                  )}
                </div>
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
