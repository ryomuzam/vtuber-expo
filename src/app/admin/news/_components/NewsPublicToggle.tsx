"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  slug: string;
  initialIsPublic: boolean;
};

export default function NewsPublicToggle({ slug, initialIsPublic }: Props) {
  const router = useRouter();
  const [isPublic, setIsPublic] = useState(initialIsPublic);

  async function handleToggle() {
    const next = !isPublic;
    setIsPublic(next);
    try {
      const res = await fetch(`/api/admin/news/${slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublic: next }),
      });
      if (!res.ok) {
        setIsPublic(!next);
      } else {
        router.refresh();
      }
    } catch {
      setIsPublic(!next);
    }
  }

  return (
    <button
      onClick={handleToggle}
      className={`relative h-6 w-11 rounded-full transition-colors ${isPublic ? "bg-[#3D7FE0]" : "bg-gray-300"}`}
      title={isPublic ? "公開中" : "非公開"}
    >
      <span
        className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${isPublic ? "translate-x-5" : ""}`}
      />
    </button>
  );
}
