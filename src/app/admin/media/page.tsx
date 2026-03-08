import AdminNav from "../_components/AdminNav";
import MediaLibrary from "../_components/MediaLibrary";

export default function MediaPage() {
  return (
    <div className="flex h-screen">
      <AdminNav />
      <main className="flex-1 overflow-auto p-8">
        <h1 className="mb-2 text-2xl font-bold text-gray-900">メディアライブラリ</h1>
        <p className="mb-6 text-sm text-gray-500">画像をアップロードして管理します</p>
        <MediaLibrary />
      </main>
    </div>
  );
}
