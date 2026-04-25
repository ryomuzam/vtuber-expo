"use client";

import { useState } from "react";
import type { VenueMapData, VenueBooth, BoothUrl } from "@/lib/data";

type Labels = {
  sectionTitle: string;
  sectionSubtitle: string;
};

function getBoothUrls(booth: VenueBooth): BoothUrl[] {
  const list = (booth.urls ?? []).filter((u) => u.url.trim());
  if (list.length > 0) return list;
  if (booth.url) return [{ id: "legacy", label: "", url: booth.url }];
  return [];
}

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
          {data.booths.map((booth) => {
            const size = booth.size ?? 28;
            const opacity = booth.opacity ?? 1;
            return (
              <button
                key={booth.id}
                onClick={() => setSelected(selected?.id === booth.id ? null : booth)}
                title={booth.name}
                className="absolute flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-white shadow-md ring-2 ring-white transition hover:scale-125 active:scale-110"
                style={{
                  left: `${booth.x}%`,
                  top: `${booth.y}%`,
                  width: `${size}px`,
                  height: `${size}px`,
                  backgroundColor: getCategoryColor(booth.categoryId),
                  opacity,
                }}
              >
                <span className="font-bold" style={{ fontSize: `${Math.max(8, Math.round(size * 0.4))}px` }}>●</span>
              </button>
            );
          })}
        </div>

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
                  {(() => {
                    const urls = getBoothUrls(selected);
                    if (urls.length === 0) return null;
                    return (
                      <ul className="mt-3 space-y-1">
                        {urls.map((u) => (
                          <li key={u.id} className="flex flex-wrap items-baseline gap-1.5 text-sm">
                            {u.label && (
                              <span className="font-medium text-gray-700">{u.label}:</span>
                            )}
                            <a
                              href={u.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="break-all text-[#3D7FE0] hover:underline"
                            >
                              {u.url}
                            </a>
                          </li>
                        ))}
                      </ul>
                    );
                  })()}
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
