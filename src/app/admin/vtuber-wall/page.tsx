import AdminNav from "../_components/AdminNav";
import { getVTuberWallData } from "@/lib/data";
import VTuberWallForm from "./_VTuberWallForm";

export const dynamic = "force-dynamic";

export default async function VTuberWallPage() {
  const data = await getVTuberWallData();

  return (
    <div className="flex h-screen">
      <AdminNav />
      <main className="flex-1 overflow-auto p-8">
        <h1 className="mb-1 text-xl font-bold text-gray-800">VTuberウォール</h1>
        <p className="mb-6 text-sm text-gray-500">
          参加型VTuberウォールの募集セクションを管理します。
        </p>
        <VTuberWallForm initial={data} />
      </main>
    </div>
  );
}
