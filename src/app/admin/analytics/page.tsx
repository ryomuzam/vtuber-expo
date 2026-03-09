import AdminNav from "@/app/admin/_components/AdminNav";
import AnalyticsDashboard from "./_AnalyticsDashboard";

export const dynamic = "force-dynamic";

export default function AnalyticsPage() {
  return (
    <div className="flex h-screen">
      <AdminNav />
      <main className="flex-1 overflow-auto p-8">
        <h1 className="mb-2 text-2xl font-bold text-gray-900">アクセス解析</h1>
        <p className="mb-6 text-sm text-gray-500">過去30日間のデータ（Google Analytics 4）</p>
        <AnalyticsDashboard />
      </main>
    </div>
  );
}
