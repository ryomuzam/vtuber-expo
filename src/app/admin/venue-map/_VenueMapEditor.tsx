"use client";

import { useState, useRef } from "react";
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

function genId() {
  return Math.random().toString(36).slice(2, 9);
}

export default function VenueMapEditor({ initialData }: { initialData: VenueMapData }) {
  const [data, setData] = useState<VenueMapData>(initialData);
  const [editingBooth, setEditingBooth] = useState<VenueBooth | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const mapRef = useRef<HTMLDivElement>(null);

  function handleMapClick(e: React.MouseEvent<HTMLDivElement>) {
    if ((e.target as HTMLElement).closest("button")) return;
    const rect = mapRef.current!.getBoundingClientRect();
    const x = parseFloat((((e.clientX - rect.left) / rect.width) * 100).toFixed(1));
    const y = parseFloat((((e.clientY - rect.top) / rect.height) * 100).toFixed(1));
    setEditingBooth({ id: genId(), name: "", type: "booth", description: "", x, y });
    setIsNew(true);
  }

  function handleBoothClick(booth: VenueBooth) {
    setEditingBooth({ ...booth });
    setIsNew(false);
  }

  function handleSaveBooth() {
    if (!editingBooth || !editingBooth.name.trim()) return;
    if (isNew) {
      setData((prev) => ({ ...prev, booths: [...prev.booths, editingBooth] }));
    } else {
      setData((prev) => ({
        ...prev,
        booths: prev.booths.map((b) => (b.id === editingBooth.id ? editingBooth : b)),
      }));
    }
    setEditingBooth(null);
  }

  function handleDeleteBooth(id: string) {
    setData((prev) => ({ ...prev, booths: prev.booths.filter((b) => b.id !== id) }));
    setEditingBooth(null);
  }

  async function handleSave() {
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      const res = await fetch("/api/admin/venue-map", {
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

  return (
    <div className="space-y-4">
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

      <div className="flex gap-4">
        {/* Map */}
        <div className="flex-1 rounded-xl bg-white p-4 shadow-sm">
          <p className="mb-3 text-xs text-gray-400">マップ上をクリックしてブースを追加</p>
          <div
            ref={mapRef}
            className="relative cursor-crosshair overflow-hidden rounded-lg border border-gray-200"
            onClick={handleMapClick}
          >
            <img src={data.mapImageUrl} alt="会場マップ" className="w-full" draggable={false} />
            {data.booths.map((booth) => (
              <button
                key={booth.id}
                onClick={(e) => { e.stopPropagation(); handleBoothClick(booth); }}
                title={booth.name}
                className="absolute flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-white shadow-md ring-2 ring-white transition hover:scale-125"
                style={{
                  left: `${booth.x}%`,
                  top: `${booth.y}%`,
                  backgroundColor: BOOTH_COLORS[booth.type],
                }}
              >
                <span className="text-[9px] font-bold leading-none">●</span>
              </button>
            ))}
          </div>
          {/* Legend */}
          <div className="mt-3 flex flex-wrap gap-3">
            {(Object.keys(BOOTH_COLORS) as BoothType[]).map((type) => (
              <span key={type} className="flex items-center gap-1.5 text-xs text-gray-500">
                <span className="h-3 w-3 rounded-full" style={{ backgroundColor: BOOTH_COLORS[type] }} />
                {BOOTH_TYPE_LABELS[type]}
              </span>
            ))}
          </div>
        </div>

        {/* Edit panel */}
        {editingBooth && (
          <div className="w-72 rounded-xl bg-white p-5 shadow-sm">
            <h3 className="mb-4 font-semibold text-gray-900">
              {isNew ? "ブースを追加" : "ブースを編集"}
            </h3>
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">名前 *</label>
                <input
                  type="text"
                  value={editingBooth.name}
                  onChange={(e) => setEditingBooth({ ...editingBooth, name: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#3D7FE0] focus:ring-2 focus:ring-[#3D7FE0]/20"
                  placeholder="例: ホロライブブース"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">種類</label>
                <select
                  value={editingBooth.type}
                  onChange={(e) => setEditingBooth({ ...editingBooth, type: e.target.value as BoothType })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#3D7FE0]"
                >
                  {(Object.keys(BOOTH_TYPE_LABELS) as BoothType[]).map((t) => (
                    <option key={t} value={t}>{BOOTH_TYPE_LABELS[t]}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">説明</label>
                <textarea
                  value={editingBooth.description}
                  onChange={(e) => setEditingBooth({ ...editingBooth, description: e.target.value })}
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#3D7FE0] focus:ring-2 focus:ring-[#3D7FE0]/20"
                  placeholder="ブースの説明"
                />
              </div>
              <div className="flex gap-2 text-xs text-gray-400">
                <span>X: {editingBooth.x}%</span>
                <span>Y: {editingBooth.y}%</span>
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  onClick={handleSaveBooth}
                  disabled={!editingBooth.name.trim()}
                  className="flex-1 rounded-lg bg-[#3D7FE0] py-2 text-sm font-semibold text-white transition hover:bg-[#3070cc] disabled:opacity-40"
                >
                  {isNew ? "追加" : "更新"}
                </button>
                {!isNew && (
                  <button
                    onClick={() => handleDeleteBooth(editingBooth.id)}
                    className="rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                  >
                    削除
                  </button>
                )}
                <button
                  onClick={() => setEditingBooth(null)}
                  className="rounded-lg bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-600 transition hover:bg-gray-200"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
