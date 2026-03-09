import AdminNav from "@/app/admin/_components/AdminNav";
import { getSponsorPageData } from "@/lib/data";
import SponsorEditor from "./_SponsorEditor";

export default async function SponsorsPage() {
  const data = await getSponsorPageData();

  return (
    <div className="flex h-screen">
      <AdminNav />
      <main className="flex-1 overflow-auto p-8">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">スポンサー管理</h1>
        <SponsorEditor initial={data} />
      </main>
    </div>
  );
}
