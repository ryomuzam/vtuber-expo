import AdminNav from "../_components/AdminNav";
import OverviewForm from "./_OverviewForm";
import { getOverviewData } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function OverviewPage() {
  const data = await getOverviewData();

  return (
    <div className="flex h-screen">
      <AdminNav />
      <main className="flex-1 overflow-auto p-8">
        <h1 className="mb-2 text-2xl font-bold text-gray-900">開催概要の編集</h1>
        <p className="mb-8 text-sm text-gray-500">日本語・英語のイベント情報を編集できます</p>
        <OverviewForm initialData={data} />
      </main>
    </div>
  );
}
