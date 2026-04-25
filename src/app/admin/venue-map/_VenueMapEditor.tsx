"use client";

import { useState, useRef } from "react";
import type { VenueMapData, VenueBooth, PinCategory, BoothUrl } from "@/lib/data";
import MediaPicker from "../_components/MediaPicker";

function genId() {
  return Math.random().toString(36).slice(2, 9);
}

function normalizeBoothUrls(booth: VenueBooth): BoothUrl[] {
  if (booth.urls && booth.urls.length > 0) return booth.urls;
  if (booth.url) return [{ id: genId(), label: "", url: booth.url }];
  return [];
}

export default function VenueMapEditor({ initialData }: { initialData: VenueMapData }) {
  const [data, setData] = useState<VenueMapData>(initialData);
  const [editingBooth, setEditingBooth] = useState<VenueBooth | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [showCategoryEditor, setShowCategoryEditor] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const dragStateRef = useRef<{ id: string; startX: number; startY: number; moved: boolean } | null>(null);
  const suppressClickRef = useRef(false);

  const categories = data.pinCategories ?? [];

  function getCategoryColor(categoryId: string) {
    return categories.find((c) => c.id === categoryId)?.color ?? "#6b7280";
  }

  function getCategoryName(categoryId: string) {
    return categories.find((c) => c.id === categoryId)?.name ?? "未分類";
  }

  // --- Category management ---
  function addCategory() {
    setData((prev) => ({
      ...prev,
      pinCategories: [...(prev.pinCategories ?? []), { id: genId(), name: "", color: "#6b7280" }],
    }));
  }

  function updateCategory(index: number, field: keyof PinCategory, value: string) {
    setData((prev) => ({
      ...prev,
      pinCategories: prev.pinCategories.map((c, i) =>
        i === index ? { ...c, [field]: value } : c
      ),
    }));
  }

  function removeCategory(index: number) {
    setData((prev) => ({
      ...prev,
      pinCategories: prev.pinCategories.filter((_, i) => i !== index),
    }));
  }

  // --- Booth management ---
  function handleMapClick(e: React.MouseEvent<HTMLDivElement>) {
    if ((e.target as HTMLElement).closest("button")) return;
    const rect = mapRef.current!.getBoundingClientRect();
    const x = parseFloat((((e.clientX - rect.left) / rect.width) * 100).toFixed(1));
    const y = parseFloat((((e.clientY - rect.top) / rect.height) * 100).toFixed(1));
    setEditingBooth({
      id: genId(),
      name: "",
      categoryId: categories[0]?.id ?? "",
      description: "",
      urls: [],
      x,
      y,
    });
    setIsNew(true);
  }

  function handleBoothClick(booth: VenueBooth) {
    setEditingBooth({ ...booth, urls: normalizeBoothUrls(booth) });
    setIsNew(false);
  }

  function addBoothUrl() {
    if (!editingBooth) return;
    setEditingBooth({
      ...editingBooth,
      urls: [...(editingBooth.urls ?? []), { id: genId(), label: "", url: "" }],
    });
  }

  function updateBoothUrl(id: string, field: "label" | "url", value: string) {
    if (!editingBooth) return;
    setEditingBooth({
      ...editingBooth,
      urls: (editingBooth.urls ?? []).map((u) => (u.id === id ? { ...u, [field]: value } : u)),
    });
  }

  function removeBoothUrl(id: string) {
    if (!editingBooth) return;
    setEditingBooth({
      ...editingBooth,
      urls: (editingBooth.urls ?? []).filter((u) => u.id !== id),
    });
  }

  function handlePinPointerDown(e: React.PointerEvent<HTMLButtonElement>, booth: VenueBooth) {
    if (e.button !== 0) return;
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    dragStateRef.current = { id: booth.id, startX: e.clientX, startY: e.clientY, moved: false };
    setDraggingId(booth.id);
  }

  function handlePinPointerMove(e: React.PointerEvent<HTMLButtonElement>) {
    const d = dragStateRef.current;
    if (!d) return;
    const dx = e.clientX - d.startX;
    const dy = e.clientY - d.startY;
    if (!d.moved && Math.hypot(dx, dy) < 4) return;
    d.moved = true;
    suppressClickRef.current = true;
    const rect = mapRef.current!.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, parseFloat((((e.clientX - rect.left) / rect.width) * 100).toFixed(1))));
    const y = Math.max(0, Math.min(100, parseFloat((((e.clientY - rect.top) / rect.height) * 100).toFixed(1))));
    setData((prev) => ({
      ...prev,
      booths: prev.booths.map((b) => (b.id === d.id ? { ...b, x, y } : b)),
    }));
  }

  function handlePinPointerUp(e: React.PointerEvent<HTMLButtonElement>) {
    const d = dragStateRef.current;
    if (!d) return;
    e.currentTarget.releasePointerCapture(e.pointerId);
    dragStateRef.current = null;
    setDraggingId(null);
    if (!d.moved) suppressClickRef.current = false;
  }

  function handleSaveBooth() {
    if (!editingBooth || !editingBooth.name.trim()) return;
    const cleanedUrls = (editingBooth.urls ?? [])
      .map((u) => ({ ...u, label: u.label.trim(), url: u.url.trim() }))
      .filter((u) => u.url);
    const { url: _legacyUrl, ...rest } = editingBooth;
    void _legacyUrl;
    const cleaned: VenueBooth = { ...rest, urls: cleanedUrls };
    if (isNew) {
      setData((prev) => ({ ...prev, booths: [...prev.booths, cleaned] }));
    } else {
      setData((prev) => ({
        ...prev,
        booths: prev.booths.map((b) => (b.id === cleaned.id ? cleaned : b)),
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

      {/* Map Image */}
      <div className="rounded-xl bg-white p-4 shadow-sm">
        <h3 className="mb-3 text-sm font-semibold text-gray-800">マップ画像</h3>
        <MediaPicker
          value={data.mapImageUrl}
          onChange={(url: string) => setData((prev) => ({ ...prev, mapImageUrl: url }))}
          placeholder="/images/venue/..."
        />
        <p className="mt-2 text-xs text-gray-400">
          会場マップの背景画像を選択します。変更後は「保存する」を押してください。
        </p>
      </div>

      {/* Pin Category Editor */}
      <div className="rounded-xl bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-800">ピンカテゴリ</h3>
          <button
            onClick={() => setShowCategoryEditor(!showCategoryEditor)}
            className="text-xs font-medium text-[#3D7FE0] hover:underline"
          >
            {showCategoryEditor ? "閉じる" : "編集"}
          </button>
        </div>

        {/* Legend (always visible) */}
        <div className="flex flex-wrap gap-3">
          {categories.map((cat) => (
            <span key={cat.id} className="flex items-center gap-1.5 text-xs text-gray-500">
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: cat.color }} />
              {cat.name || "（未設定）"}
            </span>
          ))}
          {categories.length === 0 && (
            <span className="text-xs text-gray-400">カテゴリがありません</span>
          )}
        </div>

        {/* Edit mode */}
        {showCategoryEditor && (
          <div className="mt-4 space-y-2 border-t border-gray-100 pt-4">
            {categories.map((cat, i) => (
              <div key={cat.id} className="flex items-center gap-2">
                <input
                  type="color"
                  value={cat.color}
                  onChange={(e) => updateCategory(i, "color", e.target.value)}
                  className="h-8 w-8 shrink-0 cursor-pointer rounded border border-gray-200"
                />
                <input
                  type="text"
                  value={cat.name}
                  onChange={(e) => updateCategory(i, "name", e.target.value)}
                  className="flex-1 rounded-lg border border-gray-300 px-3 py-1.5 text-sm outline-none focus:border-[#3D7FE0]"
                  placeholder="カテゴリ名"
                />
                <button
                  onClick={() => removeCategory(i)}
                  className="shrink-0 rounded-md bg-red-50 px-2 py-1 text-xs text-red-500 hover:bg-red-100"
                >
                  削除
                </button>
              </div>
            ))}
            <button
              onClick={addCategory}
              className="w-full rounded-lg border border-dashed border-gray-200 py-2 text-xs text-gray-400 hover:border-[#3D7FE0] hover:text-[#3D7FE0]"
            >
              ＋ カテゴリを追加
            </button>
          </div>
        )}
      </div>

      <div className="flex gap-4">
        {/* Map */}
        <div className="flex-1 rounded-xl bg-white p-4 shadow-sm">
          <p className="mb-3 text-xs text-gray-400">マップ上をクリックしてピンを追加・ピンをドラッグして位置を移動・クリックで編集</p>
          <div
            ref={mapRef}
            className="relative cursor-crosshair overflow-hidden rounded-lg border border-gray-200"
            onClick={handleMapClick}
          >
            {data.mapImageUrl ? (
              <img src={data.mapImageUrl} alt="会場マップ" className="w-full" draggable={false} />
            ) : (
              <div className="flex aspect-[16/9] items-center justify-center bg-gray-50 text-sm text-gray-400">
                マップ画像が設定されていません
              </div>
            )}
            {data.booths.map((booth) => {
              const isDragging = draggingId === booth.id;
              const size = booth.size ?? 24;
              const opacity = booth.opacity ?? 1;
              return (
                <button
                  key={booth.id}
                  onPointerDown={(e) => handlePinPointerDown(e, booth)}
                  onPointerMove={handlePinPointerMove}
                  onPointerUp={handlePinPointerUp}
                  onPointerCancel={handlePinPointerUp}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (suppressClickRef.current) {
                      suppressClickRef.current = false;
                      return;
                    }
                    handleBoothClick(booth);
                  }}
                  title={`${booth.name}（ドラッグで移動）`}
                  className={`absolute flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-white shadow-md ring-2 ring-white touch-none select-none ${
                    isDragging
                      ? "scale-125 cursor-grabbing ring-4"
                      : "cursor-grab transition hover:scale-125"
                  }`}
                  style={{
                    left: `${booth.x}%`,
                    top: `${booth.y}%`,
                    width: `${size}px`,
                    height: `${size}px`,
                    backgroundColor: getCategoryColor(booth.categoryId),
                    opacity: isDragging ? Math.min(opacity, 0.9) : opacity,
                  }}
                >
                  <span className="font-bold leading-none" style={{ fontSize: `${Math.max(8, Math.round(size * 0.4))}px` }}>●</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Edit panel */}
        {editingBooth && (
          <div className="w-72 shrink-0 rounded-xl bg-white p-5 shadow-sm">
            <h3 className="mb-4 font-semibold text-gray-900">
              {isNew ? "ピンを追加" : "ピンを編集"}
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
                <label className="mb-1 block text-xs font-medium text-gray-600">カテゴリ</label>
                <select
                  value={editingBooth.categoryId}
                  onChange={(e) => setEditingBooth({ ...editingBooth, categoryId: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#3D7FE0]"
                >
                  {categories.length === 0 && <option value="">カテゴリなし</option>}
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name || "（未設定）"}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">ロゴ画像</label>
                <MediaPicker
                  value={editingBooth.logoUrl ?? ""}
                  onChange={(url: string) => setEditingBooth({ ...editingBooth, logoUrl: url })}
                  placeholder="ロゴを選択"
                />
                {editingBooth.logoUrl && (
                  <img src={editingBooth.logoUrl} alt="" className="mt-2 h-10 w-auto rounded border border-gray-100 object-contain" />
                )}
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
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <label className="block text-xs font-medium text-gray-600">URL</label>
                  <button
                    type="button"
                    onClick={addBoothUrl}
                    className="text-xs font-medium text-[#3D7FE0] hover:underline"
                  >
                    ＋ URLを追加
                  </button>
                </div>
                <div className="space-y-2">
                  {(editingBooth.urls ?? []).length === 0 && (
                    <p className="rounded-md border border-dashed border-gray-200 px-3 py-2 text-xs text-gray-400">
                      URLがありません。「＋ URLを追加」で追加できます。
                    </p>
                  )}
                  {(editingBooth.urls ?? []).map((u) => (
                    <div key={u.id} className="space-y-1 rounded-md border border-gray-200 p-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={u.label}
                          onChange={(e) => updateBoothUrl(u.id, "label", e.target.value)}
                          className="flex-1 rounded border border-gray-200 px-2 py-1 text-xs outline-none focus:border-[#3D7FE0]"
                          placeholder="ラベル（例: 公式サイト, X）"
                        />
                        <button
                          type="button"
                          onClick={() => removeBoothUrl(u.id)}
                          className="shrink-0 rounded bg-red-50 px-2 py-1 text-xs text-red-500 hover:bg-red-100"
                        >
                          削除
                        </button>
                      </div>
                      <input
                        type="url"
                        value={u.url}
                        onChange={(e) => updateBoothUrl(u.id, "url", e.target.value)}
                        className="w-full rounded border border-gray-200 px-2 py-1 text-xs outline-none focus:border-[#3D7FE0]"
                        placeholder="https://example.com"
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <label className="mb-1 flex items-center justify-between text-xs font-medium text-gray-600">
                  <span>ピンサイズ</span>
                  <span className="text-gray-400">{editingBooth.size ?? 24}px</span>
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingBooth({ ...editingBooth, size: Math.max(12, (editingBooth.size ?? 24) - 2) })}
                    className="shrink-0 rounded-md bg-gray-100 px-2 py-1 text-xs font-bold text-gray-600 hover:bg-gray-200"
                  >
                    －
                  </button>
                  <input
                    type="range"
                    min={12}
                    max={64}
                    step={2}
                    value={editingBooth.size ?? 24}
                    onChange={(e) => setEditingBooth({ ...editingBooth, size: Number(e.target.value) })}
                    className="flex-1 accent-[#3D7FE0]"
                  />
                  <button
                    type="button"
                    onClick={() => setEditingBooth({ ...editingBooth, size: Math.min(64, (editingBooth.size ?? 24) + 2) })}
                    className="shrink-0 rounded-md bg-gray-100 px-2 py-1 text-xs font-bold text-gray-600 hover:bg-gray-200"
                  >
                    ＋
                  </button>
                </div>
              </div>
              <div>
                <label className="mb-1 flex items-center justify-between text-xs font-medium text-gray-600">
                  <span>透明度</span>
                  <span className="text-gray-400">{Math.round((editingBooth.opacity ?? 1) * 100)}%</span>
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingBooth({ ...editingBooth, opacity: Math.max(0, Math.round(((editingBooth.opacity ?? 1) - 0.1) * 10) / 10) })}
                    className="shrink-0 rounded-md bg-gray-100 px-2 py-1 text-xs font-bold text-gray-600 hover:bg-gray-200"
                  >
                    －
                  </button>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={5}
                    value={Math.round((editingBooth.opacity ?? 1) * 100)}
                    onChange={(e) => setEditingBooth({ ...editingBooth, opacity: Number(e.target.value) / 100 })}
                    className="flex-1 accent-[#3D7FE0]"
                  />
                  <button
                    type="button"
                    onClick={() => setEditingBooth({ ...editingBooth, opacity: Math.min(1, Math.round(((editingBooth.opacity ?? 1) + 0.1) * 10) / 10) })}
                    className="shrink-0 rounded-md bg-gray-100 px-2 py-1 text-xs font-bold text-gray-600 hover:bg-gray-200"
                  >
                    ＋
                  </button>
                </div>
                <p className="mt-1 text-[10px] text-gray-400">0%で完全に透明（下のマップの番号が見えます）</p>
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
