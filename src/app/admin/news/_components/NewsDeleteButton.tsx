"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewsDeleteButton({ slug }: { slug: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm(`「${slug}」を削除しますか？`)) return;
    setLoading(true);
    try {
      await fetch(`/api/admin/news/${slug}`, { method: "DELETE" });
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="rounded-md bg-red-50 px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-100 disabled:opacity-50"
    >
      {loading ? "..." : "削除"}
    </button>
  );
}
