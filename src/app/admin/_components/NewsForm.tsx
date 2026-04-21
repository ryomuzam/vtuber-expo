"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { NewsItem } from "@/lib/data";
import MediaPicker from "./MediaPicker";

type Props = {
  initial?: NewsItem;
  isNew?: boolean;
};

const empty: NewsItem = {
  slug: "",
  date: new Date().toISOString().split("T")[0].replace(/-/g, "."),
  image: "",
  title: { ja: "", en: "" },
  description: { ja: "", en: "" },
  body: { ja: "", en: "" },
};

export default function NewsForm({ initial, isNew = false }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<NewsItem>(initial ?? empty);
  const [originalSlug] = useState<string>(initial?.slug ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function update(field: string, value: string) {
    setForm((prev) => {
      const parts = field.split(".");
      if (parts.length === 2) {
        const [key, sub] = parts;
        return {
          ...prev,
          [key]: { ...(prev[key as keyof NewsItem] as Record<string, string>), [sub]: value },
        };
      }
      return { ...prev, [field]: value };
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const url = isNew ? "/api/admin/news" : `/api/admin/news/${originalSlug}`;
      const method = isNew ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "保存に失敗しました");
        return;
      }

      router.push("/admin/news");
      router.refresh();
    } catch {
      setError("通信エラーが発生しました");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label">スラッグ (英数字とハイフンのみ)</label>
          <input
            type="text"
            value={form.slug}
            onChange={(e) => update("slug", e.target.value)}
            required
            pattern="[a-z0-9-]+"
            className="input"
            placeholder="my-news-slug"
          />
          {!isNew && form.slug !== originalSlug && (
            <p className="mt-1 text-xs text-amber-600">
              スラッグを変更すると、記事URL（/news/{originalSlug}）も変わります。
            </p>
          )}
        </div>
        <div>
          <label className="label">日付 (例: 2026.03.04)</label>
          <input
            type="text"
            value={form.date}
            onChange={(e) => update("date", e.target.value)}
            required
            className="input"
            placeholder="2026.03.04"
          />
        </div>
      </div>

      <div>
        <label className="label">サムネイル画像</label>
        <MediaPicker
          value={form.image ?? ""}
          onChange={(url) => update("image", url)}
        />
      </div>

      <fieldset className="rounded-xl border border-gray-200 p-4">
        <legend className="px-2 text-sm font-semibold text-gray-600">タイトル</legend>
        <div className="space-y-3">
          <div>
            <label className="label">日本語</label>
            <input type="text" value={form.title.ja} onChange={(e) => update("title.ja", e.target.value)} required className="input" />
          </div>
          <div>
            <label className="label">English</label>
            <input type="text" value={form.title.en} onChange={(e) => update("title.en", e.target.value)} required className="input" />
          </div>
        </div>
      </fieldset>

      <fieldset className="rounded-xl border border-gray-200 p-4">
        <legend className="px-2 text-sm font-semibold text-gray-600">説明文</legend>
        <div className="space-y-3">
          <div>
            <label className="label">日本語</label>
            <textarea rows={3} value={form.description.ja} onChange={(e) => update("description.ja", e.target.value)} className="input resize-none" />
          </div>
          <div>
            <label className="label">English</label>
            <textarea rows={3} value={form.description.en} onChange={(e) => update("description.en", e.target.value)} className="input resize-none" />
          </div>
        </div>
      </fieldset>

      <fieldset className="rounded-xl border border-gray-200 p-4">
        <legend className="px-2 text-sm font-semibold text-gray-600">本文</legend>
        <div className="space-y-3">
          <div>
            <label className="label">日本語</label>
            <textarea rows={6} value={form.body.ja} onChange={(e) => update("body.ja", e.target.value)} className="input resize-y" />
          </div>
          <div>
            <label className="label">English</label>
            <textarea rows={6} value={form.body.en} onChange={(e) => update("body.en", e.target.value)} className="input resize-y" />
          </div>
        </div>
      </fieldset>

      <div className="flex gap-3">
        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? "保存中..." : "保存する"}
        </button>
        <button type="button" onClick={() => router.back()} className="btn-secondary">
          キャンセル
        </button>
      </div>
    </form>
  );
}
