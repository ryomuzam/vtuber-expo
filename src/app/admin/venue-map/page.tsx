import AdminNav from "../_components/AdminNav";
import VenueMapEditor from "./_VenueMapEditor";
import { getVenueMapData } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function VenueMapPage() {
  const data = await getVenueMapData();
  return (
    <div className="flex h-screen">
      <AdminNav />
      <main className="flex-1 overflow-auto p-8">
        <h1 className="mb-2 text-2xl font-bold text-gray-900">会場マップ管理</h1>
        <p className="mb-6 text-sm text-gray-500">マップ上をクリックしてブースを追加。ピンをクリックして編集・削除できます。</p>
        <VenueMapEditor initialData={data} />
      </main>
    </div>
  );
}
