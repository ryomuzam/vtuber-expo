import AdminNav from "../_components/AdminNav";
import { getAboutData } from "@/lib/data";
import AboutForm from "./_AboutForm";

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const data = await getAboutData();

  return (
    <div className="flex h-screen">
      <AdminNav />
      <main className="flex-1 overflow-auto p-8">
        <h1 className="mb-1 text-xl font-bold text-gray-800">カード管理</h1>
        <p className="mb-6 text-sm text-gray-500">
          「VTUBER EXPOの魅力」カードセクションを編集します。
        </p>
        <AboutForm initial={data} />
      </main>
    </div>
  );
}
