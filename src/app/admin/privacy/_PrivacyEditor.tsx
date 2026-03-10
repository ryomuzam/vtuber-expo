"use client";

import { useState } from "react";

export default function PrivacyEditor({ initialContent }: { initialContent: string }) {
  const [content, setContent] = useState(initialContent);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  async function handleSave() {
    setError("");
    setSaving(true);
    try {
      const res = await fetch("/api/admin/privacy", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "保存に失敗しました");
        return;
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">
              テキストを入力してください。改行はそのまま反映されます。
            </p>
          </div>
          <div className="flex items-center gap-3">
            {error && <span className="text-sm text-red-600">{error}</span>}
            {saved && <span className="text-sm text-green-600">保存しました</span>}
            <button
              onClick={handleSave}
              disabled={saving}
              className="rounded-lg bg-[#3D7FE0] px-4 py-2 text-sm font-semibold text-white hover:bg-[#2d6fd0] disabled:opacity-50"
            >
              {saving ? "保存中..." : "保存"}
            </button>
          </div>
        </div>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={30}
          placeholder={`プライバシーポリシーの内容を入力してください。

例：
第1条（個人情報の収集）
当社は、お問い合わせフォームの利用に際して、メールアドレス等の個人情報を収集します。

第2条（個人情報の利用目的）
収集した個人情報は、お問い合わせへの回答のみに使用します。`}
          className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#3D7FE0] focus:ring-1 focus:ring-[#3D7FE0]"
          style={{ fontFamily: "monospace" }}
        />
      </div>

      {content && (
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-sm font-semibold text-gray-500 uppercase tracking-wide">プレビュー</h2>
          <div className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700">
            {content}
          </div>
        </div>
      )}
    </div>
  );
}
