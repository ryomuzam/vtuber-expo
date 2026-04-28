"use client";

import { useState } from "react";
import type { EventScheduleData, ScheduleSlot } from "@/lib/data";
import MediaPicker from "@/app/admin/_components/MediaPicker";

function genId() {
  return Math.random().toString(36).slice(2, 9);
}

function emptySlot(day: 1 | 2): ScheduleSlot {
  return { id: genId(), day, startTime: "", endTime: "", title: "", titleEn: "", performers: "", performersEn: "", description: "", descriptionEn: "", displayMode: "text", imageUrl: "" };
}

function SlotForm({
  slot,
  onChange,
  onDelete,
  onDragHandleMouseDown,
}: {
  slot: ScheduleSlot;
  onChange: (s: ScheduleSlot) => void;
  onDelete: () => void;
  onDragHandleMouseDown?: () => void;
}) {
  const mode = slot.displayMode ?? "text";

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        <button
          type="button"
          onMouseDown={onDragHandleMouseDown}
          aria-label="ドラッグして並び替え"
          title="ドラッグして並び替え"
          className="flex h-8 w-6 cursor-grab items-center justify-center text-gray-300 hover:text-gray-500 active:cursor-grabbing"
        >
          <svg width="12" height="16" viewBox="0 0 12 16" fill="currentColor" aria-hidden>
            <circle cx="3" cy="3" r="1.4" />
            <circle cx="9" cy="3" r="1.4" />
            <circle cx="3" cy="8" r="1.4" />
            <circle cx="9" cy="8" r="1.4" />
            <circle cx="3" cy="13" r="1.4" />
            <circle cx="9" cy="13" r="1.4" />
          </svg>
        </button>
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

      {/* Display mode toggle */}
      <div className="mb-3 inline-flex rounded-lg border border-gray-200 bg-gray-50 p-0.5">
        <button
          type="button"
          onClick={() => onChange({ ...slot, displayMode: "text" })}
          className={`rounded-md px-3 py-1 text-xs font-semibold transition ${mode === "text" ? "bg-white text-[#3D7FE0] shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
        >
          テキスト
        </button>
        <button
          type="button"
          onClick={() => onChange({ ...slot, displayMode: "image" })}
          className={`rounded-md px-3 py-1 text-xs font-semibold transition ${mode === "image" ? "bg-white text-[#3D7FE0] shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
        >
          画像のみ
        </button>
      </div>

      {mode === "image" ? (
        <MediaPicker
          value={slot.imageUrl ?? ""}
          onChange={(url) => onChange({ ...slot, imageUrl: url })}
          placeholder="画像URLを入力、または「選択」から画像を選ぶ"
        />
      ) : (
        <>
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
        </>
      )}
    </div>
  );
}

function reorderInDay(items: ScheduleSlot[], day: 1 | 2, fromId: string, toId: string): ScheduleSlot[] {
  if (fromId === toId) return items;
  const dayItems = items.filter((s) => s.day === day);
  const fromIdx = dayItems.findIndex((s) => s.id === fromId);
  const toIdx = dayItems.findIndex((s) => s.id === toId);
  if (fromIdx < 0 || toIdx < 0) return items;
  const reordered = [...dayItems];
  const [moved] = reordered.splice(fromIdx, 1);
  reordered.splice(toIdx, 0, moved);
  let cursor = 0;
  return items.map((s) => (s.day === day ? reordered[cursor++] : s));
}

export default function ScheduleEditor({ initialData }: { initialData: EventScheduleData }) {
  const [data, setData] = useState<EventScheduleData>(initialData);
  const [tab, setTab] = useState<1 | 2>(1);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

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

  function handleDragOver(e: React.DragEvent, overId: string) {
    if (!draggingId) return;
    e.preventDefault();
    if (dragOverId !== overId) setDragOverId(overId);
  }

  function handleDrop(e: React.DragEvent, overId: string) {
    e.preventDefault();
    if (draggingId && draggingId !== overId) {
      setData((prev) => ({ ...prev, items: reorderInDay(prev.items, tab, draggingId, overId) }));
    }
    setDraggingId(null);
    setDragOverId(null);
  }

  function handleDragEnd() {
    setDraggingId(null);
    setDragOverId(null);
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
  const sectionMode = data.displayMode ?? "timeline";

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

      {/* Section display mode */}
      <div className="rounded-xl bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center gap-3">
          <span className="text-sm font-semibold text-gray-700">セクションの表示</span>
          <div className="inline-flex rounded-lg border border-gray-200 bg-gray-50 p-0.5">
            <button
              type="button"
              onClick={() => setData((prev) => ({ ...prev, displayMode: "timeline" }))}
              className={`rounded-md px-3 py-1 text-xs font-semibold transition ${sectionMode === "timeline" ? "bg-white text-[#3D7FE0] shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
            >
              タイムライン
            </button>
            <button
              type="button"
              onClick={() => setData((prev) => ({ ...prev, displayMode: "image" }))}
              className={`rounded-md px-3 py-1 text-xs font-semibold transition ${sectionMode === "image" ? "bg-white text-[#3D7FE0] shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
            >
              画像のみ
            </button>
          </div>
        </div>
        {sectionMode === "image" ? (
          <>
            <p className="mb-2 text-xs text-gray-500">公開時は DAY タブやタイムラインを非表示にし、この画像のみを表示します。</p>
            <MediaPicker
              value={data.imageUrl ?? ""}
              onChange={(url) => setData((prev) => ({ ...prev, imageUrl: url }))}
              placeholder="画像URLを入力、または「選択」から画像を選ぶ"
            />
          </>
        ) : (
          <p className="text-xs text-gray-500">DAY タブとタイムライン（プログラム一覧）を公開します。</p>
        )}
      </div>

      {sectionMode === "timeline" && (<>
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
        {dayItems.map((slot) => {
          const isDragging = draggingId === slot.id;
          const isOver = dragOverId === slot.id && draggingId !== slot.id;
          return (
            <div
              key={slot.id}
              draggable={isDragging}
              onDragStart={(e) => {
                e.dataTransfer.effectAllowed = "move";
                e.dataTransfer.setData("text/plain", slot.id);
              }}
              onDragOver={(e) => handleDragOver(e, slot.id)}
              onDragLeave={() => { if (dragOverId === slot.id) setDragOverId(null); }}
              onDrop={(e) => handleDrop(e, slot.id)}
              onDragEnd={handleDragEnd}
              className={`transition ${isDragging ? "opacity-50" : ""} ${isOver ? "ring-2 ring-[#3D7FE0] rounded-xl" : ""}`}
            >
              <SlotForm
                slot={slot}
                onChange={(updated) => updateSlot(slot.id, updated)}
                onDelete={() => deleteSlot(slot.id)}
                onDragHandleMouseDown={() => setDraggingId(slot.id)}
              />
            </div>
          );
        })}
        <button
          onClick={addSlot}
          className="w-full rounded-xl border-2 border-dashed border-gray-300 py-3 text-sm font-medium text-gray-400 transition hover:border-[#3D7FE0] hover:text-[#3D7FE0]"
        >
          ＋ プログラムを追加
        </button>
      </div>
      </>)}
    </div>
  );
}
