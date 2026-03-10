"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { AboutIntroData } from "@/lib/data";

export default function AboutIntroForm({ initial }: { initial: AboutIntroData }) {
  const router = useRouter();
  const [data, setData] = useState<AboutIntroData>(initial);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  function updateField(field: keyof AboutIntroData, value: string | boolean) {
    setData((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSave() {
    setError("");
    setSaving(true);
    try {
      const res = await fetch("/api/admin/about-intro", {
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

      {/* Section Title */}
      <fieldset className="rounded-xl border border-gray-200 bg-white p-5">
        <legend className="px-2 text-sm font-semibold text-gray-600">セクションタイトル</legend>
        <div className="space-y-3">
          <div>
            <label className="label">日本語</label>
            <input
              type="text"
              value={data.sectionTitleJa}
              onChange={(e) => updateField("sectionTitleJa", e.target.value)}
              className="input"
            />
          </div>
          <div>
            <label className="label">English</label>
            <input
              type="text"
              value={data.sectionTitleEn}
              onChange={(e) => updateField("sectionTitleEn", e.target.value)}
              className="input"
            />
          </div>
        </div>
      </fieldset>

      {/* Lead Copy */}
      <fieldset className="rounded-xl border border-gray-200 bg-white p-5">
        <legend className="px-2 text-sm font-semibold text-gray-600">リードコピー</legend>
        <div className="space-y-3">
          <div>
            <label className="label">日本語</label>
            <textarea
              rows={5}
              value={data.leadCopyJa}
              onChange={(e) => updateField("leadCopyJa", e.target.value)}
              className="input resize-y"
            />
          </div>
          <div>
            <label className="label">English</label>
            <textarea
              rows={5}
              value={data.leadCopyEn}
              onChange={(e) => updateField("leadCopyEn", e.target.value)}
              className="input resize-y"
            />
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
