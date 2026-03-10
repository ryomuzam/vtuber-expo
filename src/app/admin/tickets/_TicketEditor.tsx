"use client";

import { useState } from "react";
import type { TicketData, TicketItem } from "@/lib/data";

function genId() {
  return Math.random().toString(36).slice(2, 9);
}

function emptyTicket(): TicketItem {
  return { id: genId(), name: "", nameEn: "", price: "", priceEn: "", description: "", descriptionEn: "", purchaseUrl: "", isSoldOut: false };
}

function TicketItemForm({
  item,
  onChange,
  onDelete,
}: {
  item: TicketItem;
  onChange: (t: TicketItem) => void;
  onDelete: () => void;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-gray-700">
          {item.name || "新しいチケット"}
        </span>
        <div className="flex items-center gap-3">
          {/* Sold out toggle */}
          <label className="flex items-center gap-2 cursor-pointer">
            <div
              onClick={() => onChange({ ...item, isSoldOut: !item.isSoldOut })}
              className={`relative h-6 w-11 rounded-full transition-colors ${item.isSoldOut ? "bg-red-500" : "bg-gray-300"}`}
            >
              <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${item.isSoldOut ? "translate-x-5" : ""}`} />
            </div>
            <span className="text-xs text-gray-500">{item.isSoldOut ? "売り切れ" : "販売中"}</span>
          </label>
          <button onClick={onDelete} className="text-sm text-red-400 hover:text-red-600">削除</button>
        </div>
      </div>

      {/* Name */}
      <div className="grid grid-cols-2 gap-2">
        <input
          type="text"
          value={item.name}
          onChange={(e) => onChange({ ...item, name: e.target.value })}
          placeholder="チケット名（日本語）*"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#3D7FE0]"
        />
        <input
          type="text"
          value={item.nameEn ?? ""}
          onChange={(e) => onChange({ ...item, nameEn: e.target.value })}
          placeholder="Ticket Name (English)"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#3D7FE0]"
        />
      </div>

      {/* Price */}
      <div className="grid grid-cols-2 gap-2">
        <input
          type="text"
          value={item.price}
          onChange={(e) => onChange({ ...item, price: e.target.value })}
          placeholder="価格（例: 6,600円（税込み））"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#3D7FE0]"
        />
        <input
          type="text"
          value={item.priceEn ?? ""}
          onChange={(e) => onChange({ ...item, priceEn: e.target.value })}
          placeholder="Price (e.g. ¥6,600 incl. tax)"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#3D7FE0]"
        />
      </div>

      {/* Description */}
      <div className="grid grid-cols-2 gap-2">
        <textarea
          value={item.description}
          onChange={(e) => onChange({ ...item, description: e.target.value })}
          placeholder="説明（日本語・任意）"
          rows={2}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#3D7FE0]"
        />
        <textarea
          value={item.descriptionEn ?? ""}
          onChange={(e) => onChange({ ...item, descriptionEn: e.target.value })}
          placeholder="Description (English)"
          rows={2}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#3D7FE0]"
        />
      </div>

      {/* Purchase URL */}
      <input
        type="url"
        value={item.purchaseUrl}
        onChange={(e) => onChange({ ...item, purchaseUrl: e.target.value })}
        placeholder="購入URL（https://...）"
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#3D7FE0]"
      />
    </div>
  );
}

export default function TicketEditor({ initialData }: { initialData: TicketData }) {
  const [data, setData] = useState<TicketData>(initialData);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  function updateItem(id: string, updated: TicketItem) {
    setData((prev) => ({ ...prev, items: prev.items.map((t) => (t.id === id ? updated : t)) }));
  }

  function deleteItem(id: string) {
    setData((prev) => ({ ...prev, items: prev.items.filter((t) => t.id !== id) }));
  }

  function addItem() {
    setData((prev) => ({ ...prev, items: [...prev.items, emptyTicket()] }));
  }

  function moveItem(index: number, direction: -1 | 1) {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= data.items.length) return;
    const items = [...data.items];
    [items[index], items[newIndex]] = [items[newIndex], items[index]];
    setData((prev) => ({ ...prev, items }));
  }

  async function handleSave() {
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      const res = await fetch("/api/admin/tickets", {
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
    <div className="max-w-3xl space-y-4">
      {/* Toggles + Save */}
      <div className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm">
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-3 cursor-pointer">
            <div
              onClick={() => setData((prev) => ({ ...prev, isPublic: !prev.isPublic }))}
              className={`relative h-6 w-11 rounded-full transition-colors ${data.isPublic ? "bg-[#3D7FE0]" : "bg-gray-300"}`}
            >
              <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${data.isPublic ? "translate-x-5" : ""}`} />
            </div>
            <span className="text-sm font-medium text-gray-700">
              {data.isPublic ? "セクション公開" : "セクション非公開"}
            </span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <div
              onClick={() => setData((prev) => ({ ...prev, floatingButtonEnabled: !prev.floatingButtonEnabled }))}
              className={`relative h-6 w-11 rounded-full transition-colors ${data.floatingButtonEnabled ? "bg-[#C94BEA]" : "bg-gray-300"}`}
            >
              <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${data.floatingButtonEnabled ? "translate-x-5" : ""}`} />
            </div>
            <span className="text-sm font-medium text-gray-700">
              {data.floatingButtonEnabled ? "フローティングボタン表示" : "フローティングボタン非表示"}
            </span>
          </label>
        </div>

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

      {/* Note */}
      <div className="rounded-xl bg-white p-4 shadow-sm space-y-3">
        <label className="block text-sm font-medium text-gray-700">注意事項</label>
        <div className="grid grid-cols-2 gap-2">
          <textarea
            value={data.note}
            onChange={(e) => setData((prev) => ({ ...prev, note: e.target.value }))}
            placeholder="注意事項（日本語・任意）"
            rows={2}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#3D7FE0]"
          />
          <textarea
            value={data.noteEn ?? ""}
            onChange={(e) => setData((prev) => ({ ...prev, noteEn: e.target.value }))}
            placeholder="Note (English)"
            rows={2}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#3D7FE0]"
          />
        </div>
      </div>

      {/* Ticket items */}
      <div className="space-y-3">
        {data.items.map((item, index) => (
          <div key={item.id} className="relative">
            {/* Reorder buttons */}
            <div className="absolute -left-8 top-4 flex flex-col gap-0.5">
              <button onClick={() => moveItem(index, -1)} disabled={index === 0} className="text-gray-400 hover:text-gray-600 disabled:opacity-30">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" /></svg>
              </button>
              <button onClick={() => moveItem(index, 1)} disabled={index === data.items.length - 1} className="text-gray-400 hover:text-gray-600 disabled:opacity-30">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
              </button>
            </div>
            <TicketItemForm
              item={item}
              onChange={(updated) => updateItem(item.id, updated)}
              onDelete={() => deleteItem(item.id)}
            />
          </div>
        ))}

        <button
          onClick={addItem}
          className="w-full rounded-xl border-2 border-dashed border-gray-300 py-3 text-sm font-medium text-gray-400 transition hover:border-[#3D7FE0] hover:text-[#3D7FE0]"
        >
          ＋ チケットを追加
        </button>
      </div>
    </div>
  );
}
