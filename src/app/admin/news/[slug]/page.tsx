import { notFound } from "next/navigation";
import AdminNav from "../../_components/AdminNav";
import NewsForm from "../../_components/NewsForm";
import { getNewsItem } from "@/lib/data";

type Props = { params: Promise<{ slug: string }> };

export default async function NewsEditPage({ params }: Props) {
  const { slug } = await params;
  const item = await getNewsItem(slug);
  if (!item) notFound();

  return (
    <div className="flex h-screen">
      <AdminNav />
      <main className="flex-1 overflow-auto p-8">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">ニュース編集</h1>
        <div className="max-w-3xl rounded-xl bg-white p-8 shadow-sm">
          <NewsForm initial={item} />
        </div>
      </main>
    </div>
  );
}
