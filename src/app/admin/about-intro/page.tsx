import AdminNav from "../_components/AdminNav";
import { getAboutIntroData } from "@/lib/data";
import AboutIntroForm from "./_AboutIntroForm";

export const dynamic = "force-dynamic";

export default async function AboutIntroPage() {
  const data = await getAboutIntroData();

  return (
    <div className="flex h-screen">
      <AdminNav />
      <main className="flex-1 overflow-auto p-8">
        <h1 className="mb-1 text-xl font-bold text-gray-800">VTUBER EXPOとは</h1>
        <p className="mb-6 text-sm text-gray-500">
          「About VTUBER EXPO 世界初開催 VTUBER EXPOとは」セクションのテキストを編集します。
        </p>
        <AboutIntroForm initial={data} />
      </main>
    </div>
  );
}
