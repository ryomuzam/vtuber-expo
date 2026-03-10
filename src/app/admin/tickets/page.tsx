import AdminNav from "../_components/AdminNav";
import TicketEditor from "./_TicketEditor";
import { getTicketData } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function TicketsPage() {
  const data = await getTicketData();

  return (
    <div className="flex min-h-screen">
      <AdminNav />
      <main className="flex-1 overflow-auto p-8">
        <h1 className="mb-2 text-2xl font-bold text-gray-900">チケット販売</h1>
        <p className="mb-8 text-sm text-gray-500">チケットの種類・価格・購入URLを管理できます</p>
        <TicketEditor initialData={data} />
      </main>
    </div>
  );
}
