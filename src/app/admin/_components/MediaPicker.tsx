"use client";

import { useState, useRef, useCallback } from "react";

type BlobItem = {
  url: string;
  pathname: string;
  size: number;
  uploadedAt: string;
};

type Props = {
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
};

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)}KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)}MB`;
}

export default function MediaPicker({ value, onChange, placeholder }: Props) {
  const [open, setOpen] = useState(false);
  const [blobs, setBlobs] = useState<BlobItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchBlobs = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/media");
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "読み込みに失敗しました"); return; }
      setBlobs(data.blobs ?? []);
    } catch {
      setError("通信エラーが発生しました");
    } finally {
      setLoading(false);
    }
  }, []);

  function openModal() {
    setOpen(true);
    fetchBlobs();
  }

  async function handleUpload(file: File) {
    setUploading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/media/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "アップロードに失敗しました"); return; }
      await fetchBlobs();
    } catch {
      setError("通信エラーが発生しました");
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(url: string, e: React.MouseEvent) {
    e.stopPropagation();
    if (!confirm("この画像を削除しますか？")) return;
    await fetch(`/api/admin/media?url=${encodeURIComponent(url)}`, { method: "DELETE" });
    setBlobs((prev) => prev.filter((b) => b.url !== url));
    if (value === url) onChange("");
  }

  const isImage = /\.(png|jpe?g|gif|svg|webp|avif)$/i.test(value) || value.includes("blob.vercel-storage.com");

  return (
    <div className="space-y-2">
      {/* Input row */}
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="input flex-1 font-mono text-xs"
          placeholder={placeholder ?? "URLを入力、または「選択」から画像を選ぶ"}
        />
        <button
          type="button"
          onClick={openModal}
          className="shrink-0 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-600 transition hover:border-[#3D7FE0] hover:text-[#3D7FE0]"
        >
          📁 選択
        </button>
      </div>

      {/* Thumbnail preview */}
      {value && isImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={value} alt="preview" className="h-20 w-32 rounded-lg border border-gray-200 object-cover" />
      )}

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
        >
          <div className="flex h-[80vh] w-[90vw] max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <h2 className="text-base font-bold text-gray-900">メディアライブラリ</h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            {/* Upload zone */}
            <div className="border-b border-gray-100 px-6 py-4">
              {error && (
                <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">{error}</p>
              )}
              <div
                className={`flex cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed py-5 transition-colors ${uploading ? "border-[#3D7FE0] bg-[#3D7FE0]/5 text-[#3D7FE0]" : "border-gray-200 text-gray-400 hover:border-[#3D7FE0] hover:text-[#3D7FE0]"}`}
                onClick={() => !uploading && fileRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleUpload(f); }}
              >
                <span className="text-2xl">{uploading ? "⏳" : "📤"}</span>
                <span className="text-xs">{uploading ? "アップロード中..." : "クリックまたはドラッグ＆ドロップ"}</span>
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f); e.target.value = ""; }}
              />
            </div>

            {/* Grid */}
            <div className="flex-1 overflow-auto p-6">
              {loading ? (
                <p className="text-center text-sm text-gray-400">読み込み中...</p>
              ) : blobs.length === 0 ? (
                <p className="text-center text-sm text-gray-400">アップロードされた画像がありません</p>
              ) : (
                <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
                  {blobs.map((blob) => {
                    const name = blob.pathname.split("/").pop() ?? blob.pathname;
                    const selected = value === blob.url;
                    return (
                      <div key={blob.url} className="group relative">
                        <button
                          type="button"
                          onClick={() => { onChange(blob.url); setOpen(false); }}
                          className={`block w-full overflow-hidden rounded-xl border-2 transition-all ${selected ? "border-[#3D7FE0] shadow-md" : "border-transparent hover:border-gray-300"}`}
                        >
                          <div className="aspect-square overflow-hidden bg-gray-100">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={blob.url}
                              alt={name}
                              className="h-full w-full object-cover transition-transform group-hover:scale-105"
                            />
                          </div>
                        </button>
                        <p className="mt-1 truncate text-center text-xs text-gray-400" title={name}>{name}</p>
                        <p className="truncate text-center text-xs text-gray-300">{formatSize(blob.size)}</p>
                        {selected && (
                          <div className="absolute left-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#3D7FE0] text-[10px] text-white shadow">✓</div>
                        )}
                        <button
                          type="button"
                          onClick={(e) => handleDelete(blob.url, e)}
                          className="absolute -right-1 -top-1 hidden h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] text-white shadow group-hover:flex"
                        >
                          ✕
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
