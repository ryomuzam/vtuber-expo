"use client";

import { useState } from "react";
import type { SponsorPageData, TieredSponsor, SponsorTier } from "@/lib/data";
import MediaPicker from "../_components/MediaPicker";

const TIERS: { key: SponsorTier; label: string; sizeLabel: string; color: string }[] = [
  { key: "gold", label: "大（ゴールド）", sizeLabel: "最大ロゴ", color: "text-yellow-600 bg-yellow-50 border-yellow-200" },
  { key: "silver", label: "中（シルバー）", sizeLabel: "大ロゴ", color: "text-gray-600 bg-gray-50 border-gray-200" },
  { key: "bronze", label: "小（ブロンズ）", sizeLabel: "中ロゴ", color: "text-orange-700 bg-orange-50 border-orange-200" },
  { key: "sampling", label: "極小（サンプリング）", sizeLabel: "小ロゴ", color: "text-blue-600 bg-blue-50 border-blue-200" },
];

function newSponsor(tier: SponsorTier): TieredSponsor {
  return {
    id: crypto.randomUUID(),
    name: "",
    logoUrl: "",
    websiteUrl: "",
    tier,
    isVisible: true,
  };
}

function isTierVisible(data: SponsorPageData, tier: SponsorTier): boolean {
  return data.tierVisibility?.[tier] !== false;
}

function isSponsorVisible(s: TieredSponsor): boolean {
  return s.isVisible !== false;
}

export default function SponsorEditor({ initial }: { initial: SponsorPageData }) {
  const [data, setData] = useState<SponsorPageData>(initial);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  async function save(next: SponsorPageData) {
    setSaving(true);
    setSaved(false);
    const res = await fetch("/api/admin/sponsors", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(next),
    });
    setSaving(false);
    if (res.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  }

  function togglePublic() {
    const next = { ...data, isPublic: !data.isPublic };
    setData(next);
    save(next);
  }

  function toggleTier(tier: SponsorTier) {
    const current = isTierVisible(data, tier);
    const next: SponsorPageData = {
      ...data,
      tierVisibility: { ...(data.tierVisibility ?? {}), [tier]: !current },
    };
    setData(next);
    save(next);
  }

  function toggleSponsorVisibility(id: string) {
    const next: SponsorPageData = {
      ...data,
      sponsors: data.sponsors.map((s) =>
        s.id === id ? { ...s, isVisible: !isSponsorVisible(s) } : s,
      ),
    };
    setData(next);
    save(next);
  }

  function addSponsor(tier: SponsorTier) {
    const s = newSponsor(tier);
    const next = { ...data, sponsors: [...data.sponsors, s] };
    setData(next);
    setEditingId(s.id);
  }

  function updateSponsor(id: string, patch: Partial<TieredSponsor>) {
    setData((d) => ({
      ...d,
      sponsors: d.sponsors.map((s) => (s.id === id ? { ...s, ...patch } : s)),
    }));
  }

  function deleteSponsor(id: string) {
    const next = { ...data, sponsors: data.sponsors.filter((s) => s.id !== id) };
    setData(next);
    if (editingId === id) setEditingId(null);
  }

  function saveAll() {
    save(data);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={togglePublic}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              data.isPublic ? "bg-[#3D7FE0]" : "bg-gray-300"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                data.isPublic ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
          <span className="text-sm font-medium text-gray-700">
            {data.isPublic ? "公開中" : "非公開"}
          </span>
        </div>
        <button
          onClick={saveAll}
          disabled={saving}
          className="rounded-lg bg-[#3D7FE0] px-4 py-2 text-sm font-semibold text-white hover:bg-[#2d6fd0] disabled:opacity-50"
        >
          {saving ? "保存中..." : saved ? "保存しました" : "保存"}
        </button>
      </div>

      {/* Tiers */}
      {TIERS.map(({ key, label, sizeLabel, color }) => {
        const tierSponsors = data.sponsors.filter((s) => s.tier === key);
        const tierVisible = isTierVisible(data, key);
        return (
          <div key={key} className={`rounded-xl border-2 p-5 ${color} ${tierVisible ? "" : "opacity-60"}`}>
            <div className="mb-4 flex items-center justify-between gap-3">
              <h3 className="font-bold text-lg">{label} <span className="text-sm font-normal opacity-70">— {sizeLabel}</span></h3>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleTier(key)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      tierVisible ? "bg-[#3D7FE0]" : "bg-gray-300"
                    }`}
                    aria-label="ランク全体の表示切替"
                  >
                    <span
                      className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                        tierVisible ? "translate-x-5" : "translate-x-0.5"
                      }`}
                    />
                  </button>
                  <span className="text-xs font-medium opacity-80">
                    {tierVisible ? "表示" : "非表示"}
                  </span>
                </div>
                <button
                  onClick={() => addSponsor(key)}
                  className="rounded-lg bg-white/80 px-3 py-1.5 text-sm font-medium shadow-sm hover:bg-white"
                >
                  + 追加
                </button>
              </div>
            </div>

            {tierSponsors.length === 0 && (
              <p className="text-sm opacity-60">スポンサーがいません</p>
            )}

            <div className="space-y-3">
              {tierSponsors.map((s) => {
                const visible = isSponsorVisible(s);
                return (
                  <div key={s.id} className={`rounded-lg bg-white p-4 shadow-sm ${visible ? "" : "opacity-60"}`}>
                    {editingId === s.id ? (
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="mb-1 block text-xs font-medium text-gray-600">企業名</label>
                            <input
                              value={s.name}
                              onChange={(e) => updateSponsor(s.id, { name: e.target.value })}
                              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#3D7FE0] focus:outline-none"
                              placeholder="株式会社〇〇"
                            />
                          </div>
                          <div>
                            <label className="mb-1 block text-xs font-medium text-gray-600">WebサイトURL</label>
                            <input
                              value={s.websiteUrl}
                              onChange={(e) => updateSponsor(s.id, { websiteUrl: e.target.value })}
                              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#3D7FE0] focus:outline-none"
                              placeholder="https://example.com"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="mb-1 block text-xs font-medium text-gray-600">ロゴ画像</label>
                          <MediaPicker
                            value={s.logoUrl}
                            onChange={(url: string) => updateSponsor(s.id, { logoUrl: url })}
                            placeholder="画像を選択"
                          />
                        </div>
                        <div className="flex justify-between">
                          <button
                            onClick={() => deleteSponsor(s.id)}
                            className="text-sm text-red-500 hover:text-red-700"
                          >
                            削除
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="rounded-md bg-[#3D7FE0] px-3 py-1.5 text-sm font-medium text-white hover:bg-[#2d6fd0]"
                          >
                            完了
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-4">
                        {s.logoUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={s.logoUrl} alt={s.name} className="h-10 w-24 object-contain" />
                        ) : (
                          <div className="flex h-10 w-24 items-center justify-center rounded bg-gray-100 text-xs text-gray-400">
                            ロゴなし
                          </div>
                        )}
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{s.name || "（未入力）"}</p>
                          {s.websiteUrl && (
                            <p className="text-xs text-gray-500">{s.websiteUrl}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => toggleSponsorVisibility(s.id)}
                              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                                visible ? "bg-[#3D7FE0]" : "bg-gray-300"
                              }`}
                              aria-label="個別ロゴの表示切替"
                            >
                              <span
                                className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                                  visible ? "translate-x-5" : "translate-x-0.5"
                                }`}
                              />
                            </button>
                            <span className="text-xs font-medium text-gray-600">
                              {visible ? "表示" : "非表示"}
                            </span>
                          </div>
                          <button
                            onClick={() => setEditingId(s.id)}
                            className="text-sm text-[#3D7FE0] hover:underline"
                          >
                            編集
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
