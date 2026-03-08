"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { HeroSlide } from "@/lib/data";
import MediaPicker from "./MediaPicker";

export default function HeroForm({ initial }: { initial: HeroSlide[] }) {
  const router = useRouter();
  const [slides, setSlides] = useState<HeroSlide[]>(initial);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  function move(index: number, direction: "up" | "down") {
    const next = [...slides];
    const swap = direction === "up" ? index - 1 : index + 1;
    if (swap < 0 || swap >= next.length) return;
    [next[index], next[swap]] = [next[swap], next[index]];
    setSlides(next);
  }

  function update(index: number, field: keyof HeroSlide, value: string) {
    setSlides((prev) =>
      prev.map((s, i) => (i === index ? { ...s, [field]: value } : s))
    );
  }

  function addSlide() {
    const maxId = slides.reduce((m, s) => Math.max(m, s.id), 0);
    setSlides([...slides, { id: maxId + 1, label: "", src: "" }]);
  }

  function removeSlide(index: number) {
    setSlides(slides.filter((_, i) => i !== index));
  }

  async function handleSave() {
    setError("");
    setSaving(true);
    try {
      const res = await fetch("/api/admin/hero", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(slides),
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

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
      )}

      {slides.map((slide, i) => (
        <div key={slide.id} className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-500">スライド {i + 1}</span>
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
                disabled={i === slides.length - 1}
                className="rounded-md bg-gray-100 px-2 py-1 text-xs disabled:opacity-30"
              >
                ▼
              </button>
              <button
                onClick={() => removeSlide(i)}
                className="rounded-md bg-red-50 px-2 py-1 text-xs text-red-600 hover:bg-red-100"
              >
                削除
              </button>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="label">ラベル</label>
              <input
                type="text"
                value={slide.label}
                onChange={(e) => update(i, "label", e.target.value)}
                className="input"
                placeholder="Key Visual 1"
              />
            </div>
            <div>
              <label className="label">画像</label>
              <MediaPicker
                value={slide.src}
                onChange={(url) => update(i, "src", url)}
                placeholder="/images/hero/kv1.png"
              />
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={addSlide}
        className="w-full rounded-xl border-2 border-dashed border-gray-200 py-4 text-sm font-medium text-gray-400 transition hover:border-[#3D7FE0] hover:text-[#3D7FE0]"
      >
        ＋ スライドを追加
      </button>

      <div className="flex gap-3">
        <button onClick={handleSave} disabled={saving} className="btn-primary">
          {saving ? "保存中..." : saved ? "保存しました！" : "保存する"}
        </button>
      </div>
    </div>
  );
}
