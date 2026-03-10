"use client";

import { useState } from "react";
import type { ContactSettings, ContactInquiry } from "@/lib/data";

type Props = {
  initialSettings: ContactSettings;
  initialInquiries: ContactInquiry[];
};

function InquiryTypeEditor({
  types,
  onChange,
  saving,
}: {
  types: string[];
  onChange: (types: string[]) => void;
  saving: boolean;
}) {
  const [newType, setNewType] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState("");

  function handleAdd() {
    if (!newType.trim()) return;
    onChange([...types, newType.trim()]);
    setNewType("");
  }

  function handleDelete(index: number) {
    onChange(types.filter((_, i) => i !== index));
  }

  function handleEditStart(index: number) {
    setEditingIndex(index);
    setEditingValue(types[index]);
  }

  function handleEditSave(index: number) {
    if (!editingValue.trim()) return;
    const updated = types.map((t, i) => (i === index ? editingValue.trim() : t));
    onChange(updated);
    setEditingIndex(null);
  }

  function handleMoveUp(index: number) {
    if (index === 0) return;
    const updated = [...types];
    [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
    onChange(updated);
  }

  function handleMoveDown(index: number) {
    if (index === types.length - 1) return;
    const updated = [...types];
    [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
    onChange(updated);
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <h2 className="mb-4 text-base font-semibold text-gray-800">お問合せ種別の管理</h2>

      <div className="mb-4 space-y-2">
        {types.map((type, index) => (
          <div key={index} className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
            {editingIndex === index ? (
              <>
                <input
                  value={editingValue}
                  onChange={(e) => setEditingValue(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") handleEditSave(index); if (e.key === "Escape") setEditingIndex(null); }}
                  autoFocus
                  className="input min-w-0 flex-1 py-1 text-sm"
                />
                <button
                  onClick={() => handleEditSave(index)}
                  className="rounded px-2 py-1 text-xs font-medium text-[#3D7FE0] hover:bg-blue-50"
                >
                  保存
                </button>
                <button
                  onClick={() => setEditingIndex(null)}
                  className="rounded px-2 py-1 text-xs text-gray-400 hover:bg-gray-100"
                >
                  キャンセル
                </button>
              </>
            ) : (
              <>
                <span className="min-w-0 flex-1 text-sm text-gray-700">{type}</span>
                <div className="flex items-center gap-1">
                  <button onClick={() => handleMoveUp(index)} disabled={index === 0} className="rounded p-1 text-gray-400 hover:bg-gray-200 disabled:opacity-30">
                    <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                    </svg>
                  </button>
                  <button onClick={() => handleMoveDown(index)} disabled={index === types.length - 1} className="rounded p-1 text-gray-400 hover:bg-gray-200 disabled:opacity-30">
                    <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </button>
                  <button onClick={() => handleEditStart(index)} className="rounded p-1 text-gray-400 hover:bg-gray-200">
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z" />
                    </svg>
                  </button>
                  <button onClick={() => handleDelete(index)} className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-500">
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <input
          value={newType}
          onChange={(e) => setNewType(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") handleAdd(); }}
          placeholder="新しい種別を入力..."
          className="input min-w-0 flex-1 text-sm"
        />
        <button
          onClick={handleAdd}
          disabled={!newType.trim() || saving}
          className="rounded-lg bg-[#3D7FE0] px-4 py-2 text-sm font-semibold text-white hover:bg-[#2d6fd0] disabled:opacity-50"
        >
          追加
        </button>
      </div>
    </div>
  );
}

export default function ContactManager({ initialSettings, initialInquiries }: Props) {
  const [settings, setSettings] = useState<ContactSettings>({
    ...initialSettings,
    inquiryTypes: initialSettings.inquiryTypes ?? [],
  });
  const [inquiries, setInquiries] = useState<ContactInquiry[]>(initialInquiries);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [selectedInquiry, setSelectedInquiry] = useState<ContactInquiry | null>(null);

  async function save(next: ContactSettings) {
    setSaving(true);
    setSaved(false);
    setError("");
    try {
      const res = await fetch("/api/admin/contact", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(next),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "保存に失敗しました");
      } else {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } finally {
      setSaving(false);
    }
  }

  function togglePublic() {
    const next = { ...settings, isPublic: !settings.isPublic };
    setSettings(next);
    save(next);
  }

  async function handleMarkRead(id: string) {
    await fetch("/api/admin/contact", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "markRead", id }),
    });
    setInquiries((prev) => prev.map((item) => (item.id === id ? { ...item, isRead: true } : item)));
    if (selectedInquiry?.id === id) {
      setSelectedInquiry((prev) => (prev ? { ...prev, isRead: true } : null));
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("この問い合わせを削除しますか？")) return;
    await fetch("/api/admin/contact", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete", id }),
    });
    setInquiries((prev) => prev.filter((item) => item.id !== id));
    if (selectedInquiry?.id === id) setSelectedInquiry(null);
  }

  const unreadCount = inquiries.filter((i) => !i.isRead).length;

  return (
    <div className="space-y-6">
      {/* Settings */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-800">フォーム設定</h2>
          <div className="flex items-center gap-3">
            {error && <span className="text-sm text-red-600">{error}</span>}
            {saved && <span className="text-sm text-green-600">保存しました</span>}
          </div>
        </div>

        <div className="mb-5 flex items-center gap-3">
          <button
            onClick={togglePublic}
            disabled={saving}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors disabled:opacity-50 ${
              settings.isPublic ? "bg-[#3D7FE0]" : "bg-gray-300"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                settings.isPublic ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
          <span className="text-sm font-medium text-gray-700">
            {settings.isPublic ? "公開中" : "非公開"}
          </span>
        </div>

        <div className="space-y-1">
          <label className="label">通知メールアドレス</label>
          <div className="flex items-center gap-3">
            <input
              type="email"
              value={settings.notifyEmail}
              onChange={(e) => setSettings((prev) => ({ ...prev, notifyEmail: e.target.value }))}
              placeholder="notify@example.com"
              className="input w-full max-w-md"
            />
            <button
              onClick={() => save(settings)}
              disabled={saving}
              className="rounded-lg bg-[#3D7FE0] px-4 py-2 text-sm font-semibold text-white hover:bg-[#2d6fd0] disabled:opacity-50"
            >
              {saving ? "保存中..." : "保存"}
            </button>
          </div>
        </div>
      </div>

      {/* Inquiry Types */}
      <InquiryTypeEditor
        types={settings.inquiryTypes}
        onChange={(types) => {
          const next = { ...settings, inquiryTypes: types };
          setSettings(next);
          save(next);
        }}
        saving={saving}
      />

      {/* Status summary */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-base font-semibold text-gray-800">設定内容の確認</h2>
        <dl className="space-y-2 text-sm">
          <div className="flex items-center gap-4">
            <dt className="w-36 text-gray-500">公開ステータス</dt>
            <dd>
              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                settings.isPublic ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
              }`}>
                {settings.isPublic ? "公開中" : "非公開"}
              </span>
            </dd>
          </div>
          <div className="flex items-center gap-4">
            <dt className="w-36 text-gray-500">通知メール</dt>
            <dd className="text-gray-900">{settings.notifyEmail || "未設定"}</dd>
          </div>
          <div className="flex items-center gap-4">
            <dt className="w-36 text-gray-500">受信済み件数</dt>
            <dd className="text-gray-900">{inquiries.length}件（未読 {unreadCount}件）</dd>
          </div>
          <div className="flex items-center gap-4">
            <dt className="w-36 text-gray-500">フォームURL</dt>
            <dd>
              <a href="/contact" target="_blank" className="text-[#3D7FE0] hover:underline">
                /contact
              </a>
            </dd>
          </div>
        </dl>
      </div>

      {/* Inquiries list */}
      <div className="rounded-xl border border-gray-200 bg-white">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="text-base font-semibold text-gray-800">
            受信した問い合わせ
            {unreadCount > 0 && (
              <span className="ml-2 rounded-full bg-[#3D7FE0] px-2 py-0.5 text-xs text-white">
                {unreadCount}
              </span>
            )}
          </h2>
        </div>

        {inquiries.length === 0 ? (
          <div className="px-6 py-12 text-center text-sm text-gray-400">
            まだ問い合わせはありません
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {inquiries.map((inquiry) => (
              <div
                key={inquiry.id}
                className={`flex cursor-pointer items-start gap-4 px-6 py-4 transition-colors hover:bg-gray-50 ${
                  selectedInquiry?.id === inquiry.id ? "bg-blue-50" : ""
                }`}
                onClick={() => {
                  setSelectedInquiry(inquiry);
                  if (!inquiry.isRead) handleMarkRead(inquiry.id);
                }}
              >
                <div className="mt-1.5 flex-shrink-0">
                  <span className={`inline-block h-2 w-2 rounded-full ${!inquiry.isRead ? "bg-[#3D7FE0]" : "bg-gray-200"}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className={`truncate text-sm ${!inquiry.isRead ? "font-semibold text-gray-900" : "font-medium text-gray-700"}`}>
                      {inquiry.inquiryType}
                    </p>
                    <span className="flex-shrink-0 text-xs text-gray-400">
                      {new Date(inquiry.createdAt).toLocaleDateString("ja-JP")}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">{inquiry.email}</p>
                  <p className="mt-0.5 truncate text-xs text-gray-400">{inquiry.message}</p>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); handleDelete(inquiry.id); }}
                  className="flex-shrink-0 rounded p-1 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detail panel */}
      {selectedInquiry && (
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-800">問い合わせ詳細</h2>
            <button onClick={() => setSelectedInquiry(null)} className="text-sm text-gray-400 hover:text-gray-600">
              閉じる
            </button>
          </div>
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="label">お問合せ種別</dt>
              <dd className="text-gray-900">{selectedInquiry.inquiryType}</dd>
            </div>
            <div>
              <dt className="label">メールアドレス</dt>
              <dd>
                <a href={`mailto:${selectedInquiry.email}`} className="text-[#3D7FE0] hover:underline">
                  {selectedInquiry.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="label">受信日時</dt>
              <dd className="text-gray-900">{new Date(selectedInquiry.createdAt).toLocaleString("ja-JP")}</dd>
            </div>
            <div>
              <dt className="label">内容</dt>
              <dd className="whitespace-pre-wrap rounded-lg bg-gray-50 p-3 text-gray-900">{selectedInquiry.message}</dd>
            </div>
          </dl>
        </div>
      )}
    </div>
  );
}
