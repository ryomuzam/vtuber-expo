"use client";

import { useState } from "react";
import type { EventScheduleData } from "@/lib/data";

export default function EventScheduleSection({ data }: { data: EventScheduleData }) {
  const [tab, setTab] = useState<1 | 2>(1);

  const dayItems = data.items
    .filter((s) => s.day === tab)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  return (
    <section id="schedule" className="py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-4 md:px-8">
        <div className="mb-10 text-center">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.3em] text-accent-blue/60">TIME SCHEDULE</p>
          <h2 className="text-3xl font-black text-pop-text md:text-4xl">当日の流れ</h2>
        </div>

        {/* Day tabs */}
        <div className="mb-8 flex gap-3 justify-center">
          <button
            onClick={() => setTab(1)}
            className={`rounded-full px-6 py-2.5 text-sm font-bold transition ${tab === 1 ? "bg-[#3D7FE0] text-white shadow-md" : "bg-white text-gray-500 shadow-sm hover:bg-gray-50"}`}
          >
            {data.day1Label}
          </button>
          <button
            onClick={() => setTab(2)}
            className={`rounded-full px-6 py-2.5 text-sm font-bold transition ${tab === 2 ? "bg-[#3D7FE0] text-white shadow-md" : "bg-white text-gray-500 shadow-sm hover:bg-gray-50"}`}
          >
            {data.day2Label}
          </button>
        </div>

        {/* Timeline */}
        <div className="relative pl-8">
          <div className="absolute left-3 top-0 h-full w-0.5 bg-gray-200" />
          <div className="space-y-6">
            {dayItems.map((slot, i) => (
              <div key={slot.id} className="relative">
                <div className="absolute -left-8 flex h-6 w-6 items-center justify-center rounded-full bg-[#3D7FE0] text-white shadow-sm">
                  <span className="text-[10px] font-bold">{i + 1}</span>
                </div>
                <div className="rounded-xl bg-white p-5 shadow-sm">
                  <div className="mb-1 flex items-center gap-3">
                    <span className="text-sm font-bold text-[#3D7FE0]">
                      {slot.startTime}{slot.endTime ? ` – ${slot.endTime}` : ""}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-gray-900">{slot.title}</h3>
                  {slot.performers && (
                    <p className="mt-1 text-sm text-gray-500">{slot.performers}</p>
                  )}
                  {slot.description && (
                    <p className="mt-1 text-sm text-gray-400">{slot.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
