"use client";

import { useEffect, useState } from "react";

type AnalyticsData = {
  overview: {
    activeUsers: number;
    sessions: number;
    pageViews: number;
    bounceRate: number;
    avgSessionDuration: number;
    newUsers: number;
  };
  sources: { source: string; sessions: number }[];
  devices: { device: string; sessions: number }[];
  pages: { path: string; views: number }[];
};

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}分${s}秒`;
}

function formatPercent(rate: number) {
  return `${(rate * 100).toFixed(1)}%`;
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl bg-white p-5 shadow-sm">
      <p className="text-3xl font-bold text-[#3D7FE0]">{value}</p>
      <p className="mt-1 text-sm text-gray-500">{label}</p>
    </div>
  );
}

export default function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/analytics")
      .then((r) => r.json())
      .then((d) => {
        if (d.error) setError(d.error);
        else setData(d);
      })
      .catch(() => setError("データの取得に失敗しました"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-gray-500">読み込み中...</div>;
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
        エラー: {error}
      </div>
    );
  }

  if (!data) return null;

  const totalSessions = data.devices.reduce((s, d) => s + d.sessions, 0);

  return (
    <div className="space-y-8">
      {/* Overview */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <StatCard label="ユニークユーザー" value={data.overview.activeUsers.toLocaleString()} />
        <StatCard label="新規ユーザー" value={data.overview.newUsers.toLocaleString()} />
        <StatCard label="セッション数" value={data.overview.sessions.toLocaleString()} />
        <StatCard label="ページビュー" value={data.overview.pageViews.toLocaleString()} />
        <StatCard label="直帰率" value={formatPercent(data.overview.bounceRate)} />
        <StatCard label="平均滞在時間" value={formatDuration(data.overview.avgSessionDuration)} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Traffic Sources */}
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-bold text-gray-900">流入経路</h2>
          <div className="space-y-3">
            {data.sources.map((s) => {
              const max = data.sources[0]?.sessions ?? 1;
              return (
                <div key={s.source} className="flex items-center gap-3">
                  <span className="w-32 truncate text-sm text-gray-600">{s.source || "Direct"}</span>
                  <div className="flex-1 rounded-full bg-gray-100 h-2">
                    <div
                      className="h-2 rounded-full bg-[#3D7FE0]"
                      style={{ width: `${(s.sessions / max) * 100}%` }}
                    />
                  </div>
                  <span className="w-10 text-right text-sm font-medium text-gray-700">
                    {s.sessions}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Pages */}
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-bold text-gray-900">人気ページ</h2>
          <div className="space-y-3">
            {data.pages.map((p) => {
              const max = data.pages[0]?.views ?? 1;
              return (
                <div key={p.path} className="flex items-center gap-3">
                  <span className="w-32 truncate text-sm text-gray-600">{p.path}</span>
                  <div className="flex-1 rounded-full bg-gray-100 h-2">
                    <div
                      className="h-2 rounded-full bg-[#E040FB]"
                      style={{ width: `${(p.views / max) * 100}%` }}
                    />
                  </div>
                  <span className="w-10 text-right text-sm font-medium text-gray-700">
                    {p.views}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Devices */}
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-bold text-gray-900">デバイス</h2>
          <div className="space-y-3">
            {data.devices.map((d) => (
              <div key={d.device} className="flex items-center gap-3">
                <span className="w-24 text-sm text-gray-600 capitalize">{d.device}</span>
                <div className="flex-1 rounded-full bg-gray-100 h-2">
                  <div
                    className="h-2 rounded-full bg-green-400"
                    style={{ width: `${(d.sessions / totalSessions) * 100}%` }}
                  />
                </div>
                <span className="w-16 text-right text-sm text-gray-700">
                  {totalSessions > 0
                    ? `${((d.sessions / totalSessions) * 100).toFixed(0)}%`
                    : "0%"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
