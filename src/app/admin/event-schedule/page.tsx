import AdminNav from "../_components/AdminNav";
import ScheduleEditor from "./_ScheduleEditor";
import { getEventScheduleData } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function EventSchedulePage() {
  const data = await getEventScheduleData();
  return (
    <div className="flex h-screen">
      <AdminNav />
      <main className="flex-1 overflow-auto p-8">
        <h1 className="mb-2 text-2xl font-bold text-gray-900">イベントスケジュール管理</h1>
        <p className="mb-6 text-sm text-gray-500">DAY1・DAY2のタイムスケジュールを編集できます。</p>
        <ScheduleEditor initialData={data} />
      </main>
    </div>
  );
}
