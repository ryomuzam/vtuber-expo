export const dynamic = "force-dynamic";

import AdminNav from "@/app/admin/_components/AdminNav";
import { getPrivacyPolicyData } from "@/lib/data";
import PrivacyEditor from "./_PrivacyEditor";

export default async function PrivacyPage() {
  const data = await getPrivacyPolicyData();

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminNav />
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl px-8 py-8">
          <h1 className="mb-1 text-xl font-bold text-gray-900">プライバシーポリシー</h1>
          <p className="mb-6 text-sm text-gray-500">公開ページ（/privacy）に表示される内容を編集できます</p>
          <PrivacyEditor initialContent={data.content} />
        </div>
      </main>
    </div>
  );
}
