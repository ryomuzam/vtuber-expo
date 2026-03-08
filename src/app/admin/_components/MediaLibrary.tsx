"use client";

import { useState, useRef, useCallback, useEffect } from "react";

type BlobItem = {
  url: string;
  pathname: string;
  size: number;
  uploadedAt: string;
};

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)}KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)}MB`;
}

export default function MediaLibrary() {
  const [blobs, setBlobs] = useState<BlobItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchBlobs = useCallback(async () => {
    setError("");
    try {
      const res = await fetch("/api/admin/media");
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "読み込みに失敗しました");
        return;
      }
      setBlobs(data.blobs ?? []);
    } catch {
      setError("通信エラーが発生しました");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchBlobs(); }, [fetchBlobs]);

  async function handleUpload(files: FileList) {
    setUploading(true);
    setError("");
    try {
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/admin/media/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (!res.ok) { setError(data.error ?? "アップロードに失敗しました"); break; }
      }
      await fetchBlobs();
    } catch {
      setError("通信エラーが発生しました");
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(url: string) {
    if (!confirm("この画像を削除しますか？")) return;
    await fetch(`/api/admin/media?url=${encodeURIComponent(url)}`, { method: "DELETE" });
    setBlobs((prev) => prev.filter((b) => b.url !== url));
  }

  function copyUrl(url: string) {
    navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(""), 2000);
  }

  return (
    <div className="space-y-6">
      {/* Upload zone */}
      <div
        className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed py-10 transition-colors ${uploading ? "border-[#3D7FE0] bg-[#3D7FE0]/5 text-[#3D7FE0]" : "border-gray-200 text-gray-400 hover:border-[#3D7FE0] hover:text-[#3D7FE0]"}`}
        onClick={() => !uploading && fileRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); if (e.dataTransfer.files.length) handleUpload(e.dataTransfer.files); }}
      >
        <span className="text-4xl">{uploading ? "⏳" : "📤"}</span>
        <p className="text-sm font-medium">{uploading ? "アップロード中..." : "クリックまたはドラッグ＆ドロップ"}</p>
        <p className="text-xs text-gray-300">PNG / JPG / GIF / SVG / WebP</p>
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => { if (e.target.files?.length) handleUpload(e.target.files); e.target.value = ""; }}
      />

      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
      )}

      {/* Grid */}
      {loading ? (
        <p className="text-center text-sm text-gray-400">読み込み中...</p>
      ) : blobs.length === 0 ? (
        <p className="text-center text-sm text-gray-400">アップロードされた画像がありません</p>
      ) : (
        <>
          <p className="text-xs text-gray-400">{blobs.length} 件</p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {blobs.map((blob) => {
              const name = blob.pathname.split("/").pop() ?? blob.pathname;
              return (
                <div key={blob.url} className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                  <div className="aspect-square overflow-hidden bg-gray-50">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={blob.url}
                      alt={name}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <div className="p-2">
                    <p className="truncate text-xs font-medium text-gray-700" title={name}>{name}</p>
                    <p className="text-xs text-gray-400">{formatSize(blob.size)}</p>
                    <div className="mt-2 flex gap-1">
                      <button
                        onClick={() => copyUrl(blob.url)}
                        className={`flex-1 rounded-md px-2 py-1 text-xs font-medium transition ${copied === blob.url ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                      >
                        {copied === blob.url ? "コピー済" : "URLコピー"}
                      </button>
                      <button
                        onClick={() => handleDelete(blob.url)}
                        className="rounded-md bg-red-50 px-2 py-1 text-xs text-red-500 hover:bg-red-100"
                      >
                        削除
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
