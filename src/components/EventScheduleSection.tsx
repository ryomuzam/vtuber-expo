"use client";

import { useState } from "react";
import type { EventScheduleData } from "@/lib/data";

type Labels = {
  sectionTitle: string;
  sectionSubtitle: string;
};

export default function EventScheduleSection({ data, labels, locale }: { data: EventScheduleData; labels: Labels; locale: string }) {
  const [tab, setTab] = useState<1 | 2>(1);
  const isEn = locale === "en";

  const dayItems = data.items.filter((s) => s.day === tab);

  const day1Label = (isEn && data.day1LabelEn) ? data.day1LabelEn : data.day1Label;
  const day2Label = (isEn && data.day2LabelEn) ? data.day2LabelEn : data.day2Label;

  const sectionImageMode = data.displayMode === "image" && data.imageUrl;

  if (sectionImageMode) {
    return (
      <section id="schedule" className="py-20 md:py-28">
        <div className="mx-auto max-w-3xl px-4 md:px-8">
          <div className="mb-10 text-center">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.3em] text-accent-blue/60">{labels.sectionSubtitle}</p>
            <h2 className="text-3xl font-black text-pop-text md:text-4xl">{labels.sectionTitle}</h2>
          </div>
          <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={data.imageUrl} alt={labels.sectionTitle} className="block w-full" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="schedule" className="py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-4 md:px-8">
        <div className="mb-10 text-center">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.3em] text-accent-blue/60">{labels.sectionSubtitle}</p>
          <h2 className="text-3xl font-black text-pop-text md:text-4xl">{labels.sectionTitle}</h2>
        </div>

        {/* Day tabs */}
        <div className="mb-8 flex gap-3 justify-center">
          <button
            onClick={() => setTab(1)}
            className={`rounded-full px-6 py-2.5 text-sm font-bold transition ${tab === 1 ? "bg-[#3D7FE0] text-white shadow-md" : "bg-white text-gray-500 shadow-sm hover:bg-gray-50"}`}
          >
            {day1Label}
          </button>
          <button
            onClick={() => setTab(2)}
            className={`rounded-full px-6 py-2.5 text-sm font-bold transition ${tab === 2 ? "bg-[#3D7FE0] text-white shadow-md" : "bg-white text-gray-500 shadow-sm hover:bg-gray-50"}`}
          >
            {day2Label}
          </button>
        </div>

        {/* Timeline */}
        <div className="relative pl-8">
          <div className="absolute left-3 top-0 h-full w-0.5 bg-gray-200" />
          <div className="space-y-6">
            {dayItems.map((slot, i) => {
              const isImageMode = slot.displayMode === "image" && slot.imageUrl;
              const title = (isEn && slot.titleEn) ? slot.titleEn : slot.title;
              const performers = (isEn && slot.performersEn) ? slot.performersEn : slot.performers;
              const description = (isEn && slot.descriptionEn) ? slot.descriptionEn : slot.description;
              const hasTime = slot.startTime || slot.endTime;
              return (
                <div key={slot.id} className="relative">
                  <div className="absolute -left-8 flex h-6 w-6 items-center justify-center rounded-full bg-[#3D7FE0] text-white shadow-sm">
                    <span className="text-[10px] font-bold">{i + 1}</span>
                  </div>
                  <div className={`rounded-xl bg-white shadow-sm ${isImageMode ? "overflow-hidden" : "p-5"}`}>
                    {isImageMode ? (
                      <>
                        {hasTime && (
                          <div className="px-5 pt-4">
                            <span className="text-sm font-bold text-[#3D7FE0]">
                              {slot.startTime}{slot.endTime ? ` – ${slot.endTime}` : ""}
                            </span>
                          </div>
                        )}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={slot.imageUrl}
                          alt={title || "schedule image"}
                          className={`block w-full ${hasTime ? "mt-2" : ""}`}
                        />
                      </>
                    ) : (
                      <>
                        {hasTime && (
                          <div className="mb-1 flex items-center gap-3">
                            <span className="text-sm font-bold text-[#3D7FE0]">
                              {slot.startTime}{slot.endTime ? ` – ${slot.endTime}` : ""}
                            </span>
                          </div>
                        )}
                        <h3 className="text-base font-bold text-gray-900">{title}</h3>
                        {performers && (
                          <p className="mt-1 text-sm text-gray-500">{performers}</p>
                        )}
                        {description && (
                          <p className="mt-1 text-sm text-gray-400">{description}</p>
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
