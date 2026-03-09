"use client";

import { useState } from "react";
import type { OverviewData } from "@/lib/data";

const FIELDS: { key: keyof OverviewData["ja"]; labelJa: string }[] = [
  { key: "eventNameValue", labelJa: "イベント名" },
  { key: "dateValue", labelJa: "開催日時" },
  { key: "venueValue", labelJa: "会場" },
  { key: "admissionValue", labelJa: "参加方法" },
  { key: "organizerValue", labelJa: "主催" },
];

export default function OverviewForm({ initialData }: { initialData: OverviewData }) {
  const [data, setData] = useState<OverviewData>(initialData);
  const [tab, setTab] = useState<"ja" | "en">("ja");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  function handleChange(key: keyof OverviewData["ja"], value: string) {
    setData((prev) => ({
      ...prev,
      [tab]: { ...prev[tab], [key]: value },
    }));
  }

  async function handleSave() {
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      const res = await fetch("/api/admin/overview", {
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
    <div className="max-w-2xl">
      {/* Tab */}
      <div className="mb-6 flex gap-2">
        <button
          onClick={() => setTab("ja")}
          className={`rounded-lg px-5 py-2 text-sm font-semibold transition ${
            tab === "ja"
              ? "bg-[#3D7FE0] text-white"
              : "bg-white text-gray-600 shadow-sm hover:bg-gray-50"
          }`}
        >
          日本語
        </button>
        <button
          onClick={() => setTab("en")}
          className={`rounded-lg px-5 py-2 text-sm font-semibold transition ${
            tab === "en"
              ? "bg-[#3D7FE0] text-white"
              : "bg-white text-gray-600 shadow-sm hover:bg-gray-50"
          }`}
        >
          English
        </button>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm space-y-5">
        {FIELDS.map(({ key, labelJa }) => (
          <div key={key}>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              {labelJa}
            </label>
            <input
              type="text"
              value={data[tab][key]}
              onChange={(e) => handleChange(key, e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-[#3D7FE0] focus:ring-2 focus:ring-[#3D7FE0]/20"
            />
          </div>
        ))}

        {error && (
          <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
        )}
        {saved && (
          <p className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-600">保存しました</p>
        )}

        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-lg bg-[#3D7FE0] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#3070cc] disabled:opacity-60"
        >
          {saving ? "保存中..." : "保存する"}
        </button>
      </div>
    </div>
  );
}
