export const dynamic = "force-dynamic";

import AdminNav from "../_components/AdminNav";
import LogosForm from "../_components/LogosForm";
import { getAgencies, getSponsors, getTieups, getMarqueeSettings } from "@/lib/data";

export default async function LogosPage() {
  const [agencies, sponsors, tieups, marquee] = await Promise.all([
    getAgencies(),
    getSponsors(),
    getTieups(),
    getMarqueeSettings(),
  ]);

  return (
    <div className="flex h-screen">
      <AdminNav />
      <main className="flex-1 overflow-auto p-8">
        <h1 className="mb-2 text-2xl font-bold text-gray-900">ロゴ管理</h1>
        <p className="mb-6 text-sm text-gray-500">事務所・協賛企業・タイアップのロゴを管理します</p>
        <LogosForm initial={{ agencies, sponsors, tieups, marquee }} />
      </main>
    </div>
  );
}
