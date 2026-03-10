export const dynamic = "force-dynamic";

import AdminNav from "../_components/AdminNav";
import Link from "next/link";
import { getNews } from "@/lib/data";
import NewsDeleteButton from "./_components/NewsDeleteButton";
import NewsPublicToggle from "./_components/NewsPublicToggle";
import NewsReorderButtons from "./_components/NewsReorderButtons";

export default async function NewsListPage() {
  const news = await getNews();
  const allSlugs = news.map((n) => n.slug);

  return (
    <div className="flex h-screen">
      <AdminNav />
      <main className="flex-1 overflow-auto p-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">ニュース一覧</h1>
          <Link href="/admin/news/new" className="btn-primary">
            ＋ 新規作成
          </Link>
        </div>

        <div className="rounded-xl bg-white shadow-sm">
          {news.length === 0 ? (
            <p className="px-6 py-12 text-center text-sm text-gray-400">記事がありません</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
                  <th className="px-6 py-3">順序</th>
                  <th className="px-6 py-3">公開</th>
                  <th className="px-6 py-3">日付</th>
                  <th className="px-6 py-3">スラッグ</th>
                  <th className="px-6 py-3">タイトル (JA)</th>
                  <th className="px-6 py-3 text-right">操作</th>
                </tr>
              </thead>
              <tbody>
                {news.map((item, i) => (
                  <tr key={item.slug} className="border-b border-gray-50 last:border-0">
                    <td className="px-6 py-4">
                      <NewsReorderButtons slug={item.slug} index={i} total={news.length} allSlugs={allSlugs} />
                    </td>
                    <td className="px-6 py-4">
                      <NewsPublicToggle slug={item.slug} initialIsPublic={item.isPublic !== false} />
                    </td>
                    <td className="px-6 py-4 text-gray-500">{item.date}</td>
                    <td className="px-6 py-4 font-mono text-xs text-gray-400">{item.slug}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">{item.title.ja}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/news/${item.slug}`}
                          className="rounded-md bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-200"
                        >
                          編集
                        </Link>
                        <NewsDeleteButton slug={item.slug} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}
