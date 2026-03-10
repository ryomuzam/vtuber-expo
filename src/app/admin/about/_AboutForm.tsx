"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { AboutData, AboutCardData } from "@/lib/data";
import MediaPicker from "../_components/MediaPicker";

export default function AboutForm({ initial }: { initial: AboutData }) {
  const router = useRouter();
  const [data, setData] = useState<AboutData>(initial);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  function updateCard(index: number, field: keyof AboutCardData, value: string) {
    setData((prev) => ({
      ...prev,
      cards: prev.cards.map((c, i) =>
        i === index ? { ...c, [field]: value } : c
      ),
    }));
  }

  function addCard() {
    setData((prev) => ({
      ...prev,
      cards: [...prev.cards, { titleJa: "", titleEn: "", labelJa: "", labelEn: "", descJa: "", descEn: "", iconUrl: "" }],
    }));
  }

  function removeCard(index: number) {
    setData((prev) => ({
      ...prev,
      cards: prev.cards.filter((_, i) => i !== index),
    }));
  }

  function moveCard(index: number, direction: "up" | "down") {
    const swap = direction === "up" ? index - 1 : index + 1;
    setData((prev) => {
      const next = [...prev.cards];
      if (swap < 0 || swap >= next.length) return prev;
      [next[index], next[swap]] = [next[swap], next[index]];
      return { ...prev, cards: next };
    });
  }

  async function handleSave() {
    setError("");
    setSaving(true);
    try {
      const res = await fetch("/api/admin/about", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const d = await res.json();
        setError(d.error ?? "保存に失敗しました");
        return;
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      router.refresh();
    } catch {
      setError("通信エラーが発生しました");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-3xl space-y-6">
      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
      )}

      {/* isPublic toggle */}
      <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-5 py-4">
        <label className="relative inline-flex cursor-pointer items-center">
          <input
            type="checkbox"
            checked={data.isPublic}
            onChange={(e) => setData((prev) => ({ ...prev, isPublic: e.target.checked }))}
            className="peer sr-only"
          />
          <div className="h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-[#3D7FE0] peer-checked:after:translate-x-full" />
        </label>
        <span className="text-sm font-medium text-gray-700">
          {data.isPublic ? "公開中" : "非公開"}
        </span>
      </div>

      {/* Cards */}
      {data.cards.map((card, i) => (
        <div key={i} className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-500">
              カード {i + 1}（{String(i + 1).padStart(2, "0")}）
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => moveCard(i, "up")}
                disabled={i === 0}
                className="rounded-md bg-gray-100 px-2 py-1 text-xs disabled:opacity-30"
              >
                ▲
              </button>
              <button
                onClick={() => moveCard(i, "down")}
                disabled={i === data.cards.length - 1}
                className="rounded-md bg-gray-100 px-2 py-1 text-xs disabled:opacity-30"
              >
                ▼
              </button>
              <button
                onClick={() => removeCard(i)}
                className="rounded-md bg-red-50 px-2 py-1 text-xs text-red-600 hover:bg-red-100"
              >
                削除
              </button>
            </div>
          </div>
          <div className="space-y-3">
            {/* Label fields */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">ラベル（日本語）</label>
                <input
                  type="text"
                  value={card.labelJa ?? ""}
                  onChange={(e) => updateCard(i, "labelJa", e.target.value)}
                  className="input"
                  placeholder="例: VTuberに"
                />
              </div>
              <div>
                <label className="label">ラベル（English）</label>
                <input
                  type="text"
                  value={card.labelEn ?? ""}
                  onChange={(e) => updateCard(i, "labelEn", e.target.value)}
                  className="input"
                  placeholder="e.g. With VTubers"
                />
              </div>
            </div>
            {/* Title fields */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">タイトル（日本語）</label>
                <input
                  type="text"
                  value={card.titleJa}
                  onChange={(e) => updateCard(i, "titleJa", e.target.value)}
                  className="input"
                  placeholder="例: 「なれる」"
                />
              </div>
              <div>
                <label className="label">タイトル（English）</label>
                <input
                  type="text"
                  value={card.titleEn}
                  onChange={(e) => updateCard(i, "titleEn", e.target.value)}
                  className="input"
                  placeholder='e.g. "Become"'
                />
              </div>
            </div>
            {/* Description fields */}
            <div>
              <label className="label">説明文（日本語）</label>
              <textarea
                rows={3}
                value={card.descJa}
                onChange={(e) => updateCard(i, "descJa", e.target.value)}
                className="input resize-y"
              />
            </div>
            <div>
              <label className="label">説明文（English）</label>
              <textarea
                rows={3}
                value={card.descEn}
                onChange={(e) => updateCard(i, "descEn", e.target.value)}
                className="input resize-y"
              />
            </div>
            {/* Icon image */}
            <div>
              <label className="label">アイコン画像（任意）</label>
              <MediaPicker
                value={card.iconUrl ?? ""}
                onChange={(url) => updateCard(i, "iconUrl", url)}
                placeholder="アイコン画像を選択（未設定の場合はデフォルトアイコン）"
              />
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={addCard}
        className="w-full rounded-xl border-2 border-dashed border-gray-200 py-4 text-sm font-medium text-gray-400 transition hover:border-[#3D7FE0] hover:text-[#3D7FE0]"
      >
        ＋ カードを追加
      </button>

      <div className="flex gap-3">
        <button onClick={handleSave} disabled={saving} className="btn-primary">
          {saving ? "保存中..." : saved ? "保存しました！" : "保存する"}
        </button>
      </div>
    </div>
  );
}
