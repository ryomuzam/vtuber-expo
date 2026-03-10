"use client";

import { useState } from "react";
import type { EventScheduleData, ScheduleSlot } from "@/lib/data";

function genId() {
  return Math.random().toString(36).slice(2, 9);
}

function emptySlot(day: 1 | 2): ScheduleSlot {
  return { id: genId(), day, startTime: "", endTime: "", title: "", titleEn: "", performers: "", performersEn: "", description: "", descriptionEn: "" };
}

function SlotForm({
  slot,
  onChange,
  onDelete,
}: {
  slot: ScheduleSlot;
  onChange: (s: ScheduleSlot) => void;
  onDelete: () => void;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        <input
          type="text"
          value={slot.startTime}
          onChange={(e) => onChange({ ...slot, startTime: e.target.value })}
          placeholder="開始 (例: 10:00)"
          className="w-28 rounded-lg border border-gray-300 px-3 py-1.5 text-sm outline-none focus:border-[#3D7FE0]"
        />
        <span className="text-gray-400">〜</span>
        <input
          type="text"
          value={slot.endTime}
          onChange={(e) => onChange({ ...slot, endTime: e.target.value })}
          placeholder="終了 (例: 11:00)"
          className="w-28 rounded-lg border border-gray-300 px-3 py-1.5 text-sm outline-none focus:border-[#3D7FE0]"
        />
        <button onClick={onDelete} className="ml-auto text-sm text-red-400 hover:text-red-600">削除</button>
      </div>

      {/* Title */}
      <div className="mb-2 grid grid-cols-2 gap-2">
        <input
          type="text"
          value={slot.title}
          onChange={(e) => onChange({ ...slot, title: e.target.value })}
          placeholder="タイトル（日本語）*"
          className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm outline-none focus:border-[#3D7FE0]"
        />
        <input
          type="text"
          value={slot.titleEn ?? ""}
          onChange={(e) => onChange({ ...slot, titleEn: e.target.value })}
          placeholder="Title (English)"
          className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm outline-none focus:border-[#3D7FE0]"
        />
      </div>

      {/* Performers */}
      <div className="mb-2 grid grid-cols-2 gap-2">
        <input
          type="text"
          value={slot.performers}
          onChange={(e) => onChange({ ...slot, performers: e.target.value })}
          placeholder="出演者（日本語・任意）"
          className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm outline-none focus:border-[#3D7FE0]"
        />
        <input
          type="text"
          value={slot.performersEn ?? ""}
          onChange={(e) => onChange({ ...slot, performersEn: e.target.value })}
          placeholder="Performers (English)"
          className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm outline-none focus:border-[#3D7FE0]"
        />
      </div>

      {/* Description */}
      <div className="grid grid-cols-2 gap-2">
        <input
          type="text"
          value={slot.description}
          onChange={(e) => onChange({ ...slot, description: e.target.value })}
          placeholder="説明（日本語・任意）"
          className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm outline-none focus:border-[#3D7FE0]"
        />
        <input
          type="text"
          value={slot.descriptionEn ?? ""}
          onChange={(e) => onChange({ ...slot, descriptionEn: e.target.value })}
          placeholder="Description (English)"
          className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm outline-none focus:border-[#3D7FE0]"
        />
      </div>
    </div>
  );
}

export default function ScheduleEditor({ initialData }: { initialData: EventScheduleData }) {
  const [data, setData] = useState<EventScheduleData>(initialData);
  const [tab, setTab] = useState<1 | 2>(1);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  function updateSlot(id: string, updated: ScheduleSlot) {
    setData((prev) => ({ ...prev, items: prev.items.map((s) => (s.id === id ? updated : s)) }));
  }

  function deleteSlot(id: string) {
    setData((prev) => ({ ...prev, items: prev.items.filter((s) => s.id !== id) }));
  }

  function addSlot() {
    const newSlot = emptySlot(tab);
    setData((prev) => ({ ...prev, items: [...prev.items, newSlot] }));
  }

  async function handleSave() {
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      const res = await fetch("/api/admin/event-schedule", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const d = await res.json();
        setError(d.error ?? "保存に失敗しました");
      } else {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch {
      setError("通信エラーが発生しました");
    } finally {
      setSaving(false);
    }
  }

  const dayItems = data.items.filter((s) => s.day === tab);

  return (
    <div className="max-w-3xl space-y-4">
      {/* Public toggle + Save */}
      <div className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm">
        <label className="flex items-center gap-3 cursor-pointer">
          <div
            onClick={() => setData((prev) => ({ ...prev, isPublic: !prev.isPublic }))}
            className={`relative h-6 w-11 rounded-full transition-colors ${data.isPublic ? "bg-[#3D7FE0]" : "bg-gray-300"}`}
          >
            <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${data.isPublic ? "translate-x-5" : ""}`} />
          </div>
          <span className="text-sm font-medium text-gray-700">
            {data.isPublic ? "公開中" : "非公開"}
          </span>
        </label>
        <div className="flex items-center gap-3">
          {saved && <span className="text-sm text-green-600">保存しました</span>}
          {error && <span className="text-sm text-red-600">{error}</span>}
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-lg bg-[#3D7FE0] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#3070cc] disabled:opacity-60"
          >
            {saving ? "保存中..." : "保存する"}
          </button>
        </div>
      </div>

      {/* Day label editors */}
      <div className="rounded-xl bg-white p-4 shadow-sm space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">DAY1 ラベル（日本語）</label>
            <input
              type="text"
              value={data.day1Label}
              onChange={(e) => setData((prev) => ({ ...prev, day1Label: e.target.value }))}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#3D7FE0]"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">DAY1 Label (English)</label>
            <input
              type="text"
              value={data.day1LabelEn ?? ""}
              onChange={(e) => setData((prev) => ({ ...prev, day1LabelEn: e.target.value }))}
              placeholder="e.g. DAY 1 - 5/3 SAT"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#3D7FE0]"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">DAY2 ラベル（日本語）</label>
            <input
              type="text"
              value={data.day2Label}
              onChange={(e) => setData((prev) => ({ ...prev, day2Label: e.target.value }))}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#3D7FE0]"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">DAY2 Label (English)</label>
            <input
              type="text"
              value={data.day2LabelEn ?? ""}
              onChange={(e) => setData((prev) => ({ ...prev, day2LabelEn: e.target.value }))}
              placeholder="e.g. DAY 2 - 5/4 SUN"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#3D7FE0]"
            />
          </div>
        </div>
      </div>

      {/* Day tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setTab(1)}
          className={`rounded-lg px-5 py-2 text-sm font-semibold transition ${tab === 1 ? "bg-[#3D7FE0] text-white" : "bg-white text-gray-600 shadow-sm hover:bg-gray-50"}`}
        >
          {data.day1Label}
        </button>
        <button
          onClick={() => setTab(2)}
          className={`rounded-lg px-5 py-2 text-sm font-semibold transition ${tab === 2 ? "bg-[#3D7FE0] text-white" : "bg-white text-gray-600 shadow-sm hover:bg-gray-50"}`}
        >
          {data.day2Label}
        </button>
      </div>

      {/* Schedule items */}
      <div className="space-y-3">
        {dayItems.map((slot) => (
          <SlotForm
            key={slot.id}
            slot={slot}
            onChange={(updated) => updateSlot(slot.id, updated)}
            onDelete={() => deleteSlot(slot.id)}
          />
        ))}
        <button
          onClick={addSlot}
          className="w-full rounded-xl border-2 border-dashed border-gray-300 py-3 text-sm font-medium text-gray-400 transition hover:border-[#3D7FE0] hover:text-[#3D7FE0]"
        >
          ＋ プログラムを追加
        </button>
      </div>
    </div>
  );
}
