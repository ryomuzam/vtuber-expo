import AdminNav from "../../_components/AdminNav";
import NewsForm from "../../_components/NewsForm";

export default function NewsNewPage() {
  return (
    <div className="flex h-screen">
      <AdminNav />
      <main className="flex-1 overflow-auto p-8">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">ニュース新規作成</h1>
        <div className="max-w-3xl rounded-xl bg-white p-8 shadow-sm">
          <NewsForm isNew />
        </div>
      </main>
    </div>
  );
}
