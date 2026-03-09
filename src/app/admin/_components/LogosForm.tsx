"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Agency, Sponsor, Tieup, MarqueeSettings } from "@/lib/data";
import MediaPicker from "./MediaPicker";

type LogoItem = { id: string; name: string; logo?: string };

function LogoList({
  title,
  items,
  onChange,
}: {
  title: string;
  items: LogoItem[];
  onChange: (items: LogoItem[]) => void;
}) {
  function update(index: number, field: keyof LogoItem, value: string) {
    onChange(items.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
  }

  function addItem() {
    onChange([...items, { id: `item-${Date.now()}`, name: "", logo: "" }]);
  }

  function removeItem(index: number) {
    onChange(items.filter((_, i) => i !== index));
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <h3 className="mb-4 text-base font-semibold text-gray-800">{title}</h3>
      <div className="space-y-4">
        {items.map((item, i) => (
          <div key={i} className="rounded-lg border border-gray-100 bg-gray-50 p-3">
            <div className="mb-2 grid grid-cols-2 gap-2">
              <div>
                <label className="label">ID</label>
                <input
                  type="text"
                  value={item.id}
                  onChange={(e) => update(i, "id", e.target.value)}
                  className="input font-mono text-xs"
                  placeholder="hololive"
                />
              </div>
              <div>
                <label className="label">名前</label>
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) => update(i, "name", e.target.value)}
                  className="input text-sm"
                  placeholder="ホロライブプロダクション"
                />
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="flex-1">
                <label className="label">ロゴ画像</label>
                <MediaPicker
                  value={item.logo ?? ""}
                  onChange={(url) => update(i, "logo", url)}
                  placeholder="/images/agencies/..."
                />
              </div>
              <button
                onClick={() => removeItem(i)}
                className="mt-5 shrink-0 rounded-md bg-red-50 px-2 py-1.5 text-xs text-red-500 hover:bg-red-100"
              >
                削除
              </button>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-sm text-gray-400">エントリがありません</p>
        )}
      </div>
      <button
        onClick={addItem}
        className="mt-3 w-full rounded-lg border border-dashed border-gray-200 py-2 text-sm text-gray-400 hover:border-[#3D7FE0] hover:text-[#3D7FE0]"
      >
        ＋ 追加
      </button>
    </div>
  );
}

type Props = {
  initial: {
    agencies: Agency[];
    sponsors: Sponsor[];
    tieups: Tieup[];
    marquee: MarqueeSettings;
  };
};

export default function LogosForm({ initial }: Props) {
  const router = useRouter();
  const [agencies, setAgencies] = useState<Agency[]>(initial.agencies);
  const [sponsors, setSponsors] = useState<Sponsor[]>(initial.sponsors);
  const [tieups, setTieups] = useState<Tieup[]>(initial.tieups);
  const [marquee, setMarquee] = useState<MarqueeSettings>(initial.marquee);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  async function handleSave() {
    setError("");
    setSaving(true);
    try {
      const res = await fetch("/api/admin/logos", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agencies, sponsors, tieups, marquee }),
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
    <div className="space-y-6">
      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
      )}

      {/* Marquee toggle */}
      <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-5">
        <div>
          <p className="font-semibold text-gray-800">ロゴカルーセル</p>
          <p className="text-sm text-gray-500">事務所・タイアップのロゴを流れるように表示します</p>
        </div>
        <button
          type="button"
          onClick={() => setMarquee({ isPublic: !marquee.isPublic })}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            marquee.isPublic ? "bg-[#3D7FE0]" : "bg-gray-300"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              marquee.isPublic ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>

      <LogoList title="事務所" items={agencies} onChange={setAgencies} />
      <LogoList title="協賛企業" items={sponsors} onChange={setSponsors} />
      <LogoList title="タイアップ" items={tieups} onChange={setTieups} />

      <button onClick={handleSave} disabled={saving} className="btn-primary">
        {saving ? "保存中..." : saved ? "保存しました！" : "保存する"}
      </button>
    </div>
  );
}
