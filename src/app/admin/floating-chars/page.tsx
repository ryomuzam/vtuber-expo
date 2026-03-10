import AdminNav from "../_components/AdminNav";
import { getFloatingCharsData } from "@/lib/data";
import FloatingCharsForm from "./_FloatingCharsForm";

export const dynamic = "force-dynamic";

export default async function FloatingCharsPage() {
  const data = await getFloatingCharsData();

  return (
    <div className="flex h-screen">
      <AdminNav />
      <main className="flex-1 overflow-auto p-8">
        <h1 className="mb-1 text-xl font-bold text-gray-800">浮遊キャラクター</h1>
        <p className="mb-6 text-sm text-gray-500">
          LP背景に浮遊するキャラクター画像を管理します。
        </p>
        <FloatingCharsForm initial={data} />
      </main>
    </div>
  );
}
