"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  slug: string;
  index: number;
  total: number;
  allSlugs: string[];
};

export default function NewsReorderButtons({ slug, index, total, allSlugs }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function move(direction: "up" | "down") {
    const swap = direction === "up" ? index - 1 : index + 1;
    if (swap < 0 || swap >= total) return;

    const newOrder = [...allSlugs];
    [newOrder[index], newOrder[swap]] = [newOrder[swap], newOrder[index]];

    setLoading(true);
    try {
      await fetch("/api/admin/news", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slugs: newOrder }),
      });
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex gap-1">
      <button
        onClick={() => move("up")}
        disabled={loading || index === 0}
        className="rounded-md bg-gray-100 px-2 py-1 text-xs disabled:opacity-30"
      >
        ▲
      </button>
      <button
        onClick={() => move("down")}
        disabled={loading || index === total - 1}
        className="rounded-md bg-gray-100 px-2 py-1 text-xs disabled:opacity-30"
      >
        ▼
      </button>
    </div>
  );
}
