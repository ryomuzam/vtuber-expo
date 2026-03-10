"use client";

const SHARE_TEXT = "VTUBER EXPO 2026";
const SHARE_URL = "https://vtuber-expo.com";
const HASHTAG = "VTUBEREXPO2026";

export default function ShareButton() {
  function handleShare() {
    // Track click
    fetch("/api/share-track", { method: "POST" }).catch(() => {});

    // Open X share dialog
    const params = new URLSearchParams({
      text: `${SHARE_TEXT}\n${SHARE_URL}\n#${HASHTAG}`,
    });
    window.open(`https://twitter.com/intent/tweet?${params}`, "_blank", "width=550,height=450");
  }

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-2 rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
    >
      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
      VTUBER EXPO 2026 でポスト
    </button>
  );
}
