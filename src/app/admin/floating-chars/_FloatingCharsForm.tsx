"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { FloatingChar, FloatingCharsData } from "@/lib/data";
import MediaPicker from "../_components/MediaPicker";

export default function FloatingCharsForm({ initial }: { initial: FloatingCharsData }) {
  const router = useRouter();
  const [isPublic, setIsPublic] = useState(initial.isPublic);
  const [chars, setChars] = useState<FloatingChar[]>(initial.chars);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  function move(index: number, direction: "up" | "down") {
    const next = [...chars];
    const swap = direction === "up" ? index - 1 : index + 1;
    if (swap < 0 || swap >= next.length) return;
    [next[index], next[swap]] = [next[swap], next[index]];
    setChars(next);
  }

  function update(index: number, field: keyof FloatingChar, value: string) {
    setChars((prev) =>
      prev.map((c, i) => (i === index ? { ...c, [field]: value } : c))
    );
  }

  function addChar() {
    setChars([
      ...chars,
      { id: Date.now().toString(), name: "", imageUrl: "" },
    ]);
  }

  function removeChar(index: number) {
    setChars(chars.filter((_, i) => i !== index));
  }

  async function handleSave() {
    setError("");
    setSaving(true);
    try {
      const res = await fetch("/api/admin/floating-chars", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublic, chars }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "保存に失敗しました");
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

  async function handleToggle() {
    const next = !isPublic;
    setIsPublic(next);
    try {
      const res = await fetch("/api/admin/floating-chars", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublic: next, chars }),
      });
      if (!res.ok) {
        setIsPublic(!next);
      }
    } catch {
      setIsPublic(!next);
    }
  }

  return (
    <div className="space-y-6">
      {/* Public toggle */}
      <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-5">
        <div>
          <p className="text-sm font-semibold text-gray-700">LPに表示する</p>
          <p className="text-xs text-gray-400">
            {isPublic ? "公開中 — LPにキャラクターが表示されます" : "非公開 — LPには表示されません"}
          </p>
        </div>
        <button
          onClick={handleToggle}
          className={`relative h-6 w-11 rounded-full transition-colors ${isPublic ? "bg-[#3D7FE0]" : "bg-gray-300"}`}
        >
          <span
            className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${isPublic ? "translate-x-5" : ""}`}
          />
        </button>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
      )}

      {chars.map((char, i) => (
        <div key={char.id} className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-500">キャラクター {i + 1}</span>
            <div className="flex gap-2">
              <button
                onClick={() => move(i, "up")}
                disabled={i === 0}
                className="rounded-md bg-gray-100 px-2 py-1 text-xs disabled:opacity-30"
              >
                ▲
              </button>
              <button
                onClick={() => move(i, "down")}
                disabled={i === chars.length - 1}
                className="rounded-md bg-gray-100 px-2 py-1 text-xs disabled:opacity-30"
              >
                ▼
              </button>
              <button
                onClick={() => removeChar(i)}
                className="rounded-md bg-red-50 px-2 py-1 text-xs text-red-600 hover:bg-red-100"
              >
                削除
              </button>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="label">名前</label>
              <input
                type="text"
                value={char.name}
                onChange={(e) => update(i, "name", e.target.value)}
                className="input"
                placeholder="キャラクター名"
              />
            </div>
            <div>
              <label className="label">画像</label>
              <MediaPicker
                value={char.imageUrl}
                onChange={(url) => update(i, "imageUrl", url)}
                placeholder="画像を選択"
              />
            </div>
          </div>
          {char.imageUrl && (
            <div className="mt-3">
              <img
                src={char.imageUrl}
                alt={char.name}
                className="h-20 w-20 rounded-lg border border-gray-100 object-contain"
              />
            </div>
          )}
        </div>
      ))}

      <button
        onClick={addChar}
        className="w-full rounded-xl border-2 border-dashed border-gray-200 py-4 text-sm font-medium text-gray-400 transition hover:border-[#3D7FE0] hover:text-[#3D7FE0]"
      >
        ＋ キャラクターを追加
      </button>

      <div className="flex gap-3">
        <button onClick={handleSave} disabled={saving} className="btn-primary">
          {saving ? "保存中..." : saved ? "保存しました！" : "保存する"}
        </button>
      </div>
    </div>
  );
}
