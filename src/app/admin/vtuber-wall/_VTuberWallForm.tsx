"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { VTuberWallData } from "@/lib/data";
import MediaPicker from "../_components/MediaPicker";

export default function VTuberWallForm({ initial }: { initial: VTuberWallData }) {
  const router = useRouter();
  const [data, setData] = useState<VTuberWallData>(initial);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  function updateField<K extends keyof VTuberWallData>(field: K, value: VTuberWallData[K]) {
    setData((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSave() {
    setError("");
    setSaving(true);
    try {
      const res = await fetch("/api/admin/vtuber-wall", {
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
            onChange={(e) => updateField("isPublic", e.target.checked)}
            className="peer sr-only"
          />
          <div className="h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-[#3D7FE0] peer-checked:after:translate-x-full" />
        </label>
        <span className="text-sm font-medium text-gray-700">
          {data.isPublic ? "公開中" : "非公開"}
        </span>
      </div>

      {/* Background Image */}
      <fieldset className="rounded-xl border border-gray-200 bg-white p-5">
        <legend className="px-2 text-sm font-semibold text-gray-600">背景画像</legend>
        <MediaPicker
          value={data.backgroundImageUrl ?? ""}
          onChange={(url) => updateField("backgroundImageUrl", url)}
          placeholder="背景画像を選択またはURLを入力（未設定の場合はデフォルト背景）"
        />
      </fieldset>

      {/* Banner Image */}
      <fieldset className="rounded-xl border border-gray-200 bg-white p-5">
        <legend className="px-2 text-sm font-semibold text-gray-600">バナー画像</legend>
        <MediaPicker
          value={data.bannerImageUrl}
          onChange={(url) => updateField("bannerImageUrl", url)}
          placeholder="バナー画像を選択またはURLを入力"
        />
      </fieldset>

      {/* Form URL */}
      <fieldset className="rounded-xl border border-gray-200 bg-white p-5">
        <legend className="px-2 text-sm font-semibold text-gray-600">応募フォームURL</legend>
        <input
          type="url"
          value={data.formUrl}
          onChange={(e) => updateField("formUrl", e.target.value)}
          className="input font-mono text-xs"
          placeholder="https://forms.google.com/..."
        />
      </fieldset>

      {/* Subtitle */}
      <fieldset className="rounded-xl border border-gray-200 bg-white p-5">
        <legend className="px-2 text-sm font-semibold text-gray-600">サブタイトル</legend>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">日本語</label>
            <input type="text" value={data.subtitleJa} onChange={(e) => updateField("subtitleJa", e.target.value)} className="input" />
          </div>
          <div>
            <label className="label">English</label>
            <input type="text" value={data.subtitleEn} onChange={(e) => updateField("subtitleEn", e.target.value)} className="input" />
          </div>
        </div>
      </fieldset>

      {/* Title */}
      <fieldset className="rounded-xl border border-gray-200 bg-white p-5">
        <legend className="px-2 text-sm font-semibold text-gray-600">タイトル</legend>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">日本語</label>
            <input type="text" value={data.titleJa} onChange={(e) => updateField("titleJa", e.target.value)} className="input" />
          </div>
          <div>
            <label className="label">English</label>
            <input type="text" value={data.titleEn} onChange={(e) => updateField("titleEn", e.target.value)} className="input" />
          </div>
        </div>
      </fieldset>

      {/* Description */}
      <fieldset className="rounded-xl border border-gray-200 bg-white p-5">
        <legend className="px-2 text-sm font-semibold text-gray-600">説明文</legend>
        <div className="space-y-3">
          <div>
            <label className="label">日本語</label>
            <textarea rows={3} value={data.descriptionJa} onChange={(e) => updateField("descriptionJa", e.target.value)} className="input resize-y" />
          </div>
          <div>
            <label className="label">English</label>
            <textarea rows={3} value={data.descriptionEn} onChange={(e) => updateField("descriptionEn", e.target.value)} className="input resize-y" />
          </div>
        </div>
      </fieldset>

      {/* Button Label */}
      <fieldset className="rounded-xl border border-gray-200 bg-white p-5">
        <legend className="px-2 text-sm font-semibold text-gray-600">ボタンテキスト</legend>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">日本語</label>
            <input type="text" value={data.buttonLabelJa} onChange={(e) => updateField("buttonLabelJa", e.target.value)} className="input" />
          </div>
          <div>
            <label className="label">English</label>
            <input type="text" value={data.buttonLabelEn} onChange={(e) => updateField("buttonLabelEn", e.target.value)} className="input" />
          </div>
        </div>
      </fieldset>

      {/* Deadline */}
      <fieldset className="rounded-xl border border-gray-200 bg-white p-5">
        <legend className="px-2 text-sm font-semibold text-gray-600">募集期間テキスト</legend>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">日本語</label>
            <input type="text" value={data.deadlineJa} onChange={(e) => updateField("deadlineJa", e.target.value)} className="input" />
          </div>
          <div>
            <label className="label">English</label>
            <input type="text" value={data.deadlineEn} onChange={(e) => updateField("deadlineEn", e.target.value)} className="input" />
          </div>
        </div>
      </fieldset>

      <div className="flex gap-3">
        <button onClick={handleSave} disabled={saving} className="btn-primary">
          {saving ? "保存中..." : saved ? "保存しました！" : "保存する"}
        </button>
      </div>
    </div>
  );
}
