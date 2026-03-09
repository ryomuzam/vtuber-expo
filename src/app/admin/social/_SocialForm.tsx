"use client";

import { useState } from "react";
import type { SocialLinks } from "@/lib/data";

export default function SocialForm({ initialData }: { initialData: SocialLinks }) {
  const [data, setData] = useState<SocialLinks>(initialData);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  async function handleSave() {
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      const res = await fetch("/api/admin/social", {
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
      <div className="rounded-2xl bg-white p-6 shadow-sm space-y-5">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            X（Twitter）URL
          </label>
          <input
            type="url"
            value={data.xUrl}
            onChange={(e) => setData((prev) => ({ ...prev, xUrl: e.target.value }))}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-[#3D7FE0] focus:ring-2 focus:ring-[#3D7FE0]/20"
            placeholder="https://x.com/yourhandle"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            YouTube URL
          </label>
          <input
            type="url"
            value={data.youtubeUrl}
            onChange={(e) => setData((prev) => ({ ...prev, youtubeUrl: e.target.value }))}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-[#3D7FE0] focus:ring-2 focus:ring-[#3D7FE0]/20"
            placeholder="https://www.youtube.com/@yourchannel"
          />
        </div>

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
