import AdminNav from "../_components/AdminNav";
import TranslateForm from "./_TranslateForm";

export default function TranslatePage() {
  return (
    <div className="flex min-h-screen">
      <AdminNav />
      <main className="flex-1 overflow-auto p-8">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-gray-900">日英翻訳ツール</h1>
          <p className="mt-1 text-sm text-gray-500">日本語テキストを英語に翻訳します</p>
        </div>
        <TranslateForm />
      </main>
    </div>
  );
}
