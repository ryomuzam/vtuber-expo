export const dynamic = "force-dynamic";

import AdminNav from "../_components/AdminNav";
import HeroForm from "../_components/HeroForm";
import { getHeroSlides } from "@/lib/data";

export default async function HeroPage() {
  const slides = await getHeroSlides();

  return (
    <div className="flex h-screen">
      <AdminNav />
      <main className="flex-1 overflow-auto p-8">
        <h1 className="mb-2 text-2xl font-bold text-gray-900">ヒーロースライド管理</h1>
        <p className="mb-6 text-sm text-gray-500">スライドの順序変更・画像パスの編集ができます</p>
        <div className="max-w-2xl">
          <HeroForm initial={slides} />
        </div>
      </main>
    </div>
  );
}
