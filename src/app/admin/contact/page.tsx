export const dynamic = "force-dynamic";

import AdminNav from "@/app/admin/_components/AdminNav";
import { getContactSettings, getContactInquiries } from "@/lib/data";
import ContactManager from "./_ContactManager";

export default async function ContactPage() {
  const [settings, inquiries] = await Promise.all([getContactSettings(), getContactInquiries()]);

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminNav />
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl px-8 py-8">
          <h1 className="mb-6 text-xl font-bold text-gray-900">問い合わせフォーム</h1>
          <ContactManager initialSettings={settings} initialInquiries={inquiries} />
        </div>
      </main>
    </div>
  );
}
