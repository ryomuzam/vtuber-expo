export const dynamic = "force-dynamic";

import AdminNav from "./_components/AdminNav";
import Link from "next/link";
import { getNews, getHeroSlides, getAgencies, getSponsors, getTieups, getSponsorPageData, getShareStats } from "@/lib/data";

export default async function AdminDashboard() {
  const [news, slides, agencies, sponsors, tieups, sponsorPage, shareStats] = await Promise.all([
    getNews(),
    getHeroSlides(),
    getAgencies(),
    getSponsors(),
    getTieups(),
    getSponsorPageData(),
    getShareStats(),
  ]);

  const today = new Date().toISOString().split("T")[0];
  const todayShares = shareStats.daily[today] ?? 0;

  const stats = [
    { label: "ニュース記事", count: news.length, href: "/admin/news" },
    { label: "ヒーロースライド", count: slides.length, href: "/admin/hero" },
    { label: "事務所ロゴ", count: agencies.length, href: "/admin/logos" },
    { label: "協賛ロゴ", count: sponsors.length, href: "/admin/logos" },
    { label: "タイアップ", count: tieups.length, href: "/admin/logos" },
    { label: "スポンサー", count: sponsorPage.sponsors.length, href: "/admin/sponsors" },
  ];

  return (
    <div className="flex h-screen">
      <AdminNav />
      <main className="flex-1 overflow-auto p-8">
        <h1 className="mb-2 text-2xl font-bold text-gray-900">ダッシュボード</h1>
        <p className="mb-8 text-sm text-gray-500">VTUBER EXPO 2026 コンテンツ管理</p>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {stats.map(({ label, count, href }) => (
            <Link
              key={label}
              href={href}
              className="rounded-xl bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              <p className="text-3xl font-bold text-[#3D7FE0]">{count}</p>
              <p className="mt-1 text-sm text-gray-500">{label}</p>
            </Link>
          ))}
        </div>

        {/* X Share Stats */}
        <div className="mt-8 rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-bold text-gray-900">X シェアボタン 統計</h2>
          <div className="flex gap-8">
            <div>
              <p className="text-3xl font-bold text-[#3D7FE0]">{shareStats.total}</p>
              <p className="mt-1 text-sm text-gray-500">累計クリック数</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-[#3D7FE0]">{todayShares}</p>
              <p className="mt-1 text-sm text-gray-500">本日のクリック数</p>
            </div>
          </div>
          {Object.keys(shareStats.daily).length > 0 && (
            <div className="mt-4">
              <p className="mb-2 text-xs font-medium text-gray-500">直近の推移</p>
              <div className="space-y-1">
                {Object.entries(shareStats.daily)
                  .sort(([a], [b]) => b.localeCompare(a))
                  .slice(0, 7)
                  .map(([date, count]) => (
                    <div key={date} className="flex items-center gap-3">
                      <span className="w-24 text-xs text-gray-500">{date}</span>
                      <div className="flex-1 rounded-full bg-gray-100 h-2">
                        <div
                          className="h-2 rounded-full bg-[#3D7FE0]"
                          style={{ width: `${Math.min(100, (count / Math.max(...Object.values(shareStats.daily))) * 100)}%` }}
                        />
                      </div>
                      <span className="w-6 text-right text-xs font-medium text-gray-700">{count}</span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <Link
            href="/admin/news/new"
            className="flex items-center gap-3 rounded-xl bg-white p-5 shadow-sm transition hover:shadow-md"
          >
            <svg className="h-6 w-6 shrink-0 text-[#3D7FE0]" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z" />
            </svg>
            <div>
              <p className="font-semibold text-gray-900">ニュースを追加</p>
              <p className="text-xs text-gray-400">新しい記事を作成</p>
            </div>
          </Link>
          <Link
            href="/admin/hero"
            className="flex items-center gap-3 rounded-xl bg-white p-5 shadow-sm transition hover:shadow-md"
          >
            <svg className="h-6 w-6 shrink-0 text-[#3D7FE0]" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
            <div>
              <p className="font-semibold text-gray-900">スライドを管理</p>
              <p className="text-xs text-gray-400">ヒーロー画像の編集</p>
            </div>
          </Link>
          <Link
            href="/admin/logos"
            className="flex items-center gap-3 rounded-xl bg-white p-5 shadow-sm transition hover:shadow-md"
          >
            <svg className="h-6 w-6 shrink-0 text-[#3D7FE0]" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
            </svg>
            <div>
              <p className="font-semibold text-gray-900">ロゴを管理</p>
              <p className="text-xs text-gray-400">事務所・協賛・タイアップ</p>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}
