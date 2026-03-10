import AdminNav from "../_components/AdminNav";
import SocialForm from "./_SocialForm";
import { getSocialLinks } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function SocialPage() {
  const data = await getSocialLinks();

  return (
    <div className="flex min-h-screen">
      <AdminNav />
      <main className="flex-1 overflow-auto p-8">
        <h1 className="mb-2 text-2xl font-bold text-gray-900">SNSリンクの設定</h1>
        <p className="mb-8 text-sm text-gray-500">SNSリンクの追加・削除・公開設定ができます</p>
        <SocialForm initialData={data} />
      </main>
    </div>
  );
}
