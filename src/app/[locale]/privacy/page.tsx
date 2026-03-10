export const dynamic = "force-dynamic";

import { setRequestLocale } from "next-intl/server";
import Link from "next/link";
import { getPrivacyPolicyData } from "@/lib/data";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const data = await getPrivacyPolicyData();

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#0a0a1a] pt-24 pb-20">
        <div className="pointer-events-none fixed left-[-10%] top-[-10%] h-[500px] w-[500px] rounded-full bg-[#3D7FE0]/10 blur-[120px]" />
        <div className="pointer-events-none fixed bottom-[-10%] right-[-10%] h-[400px] w-[400px] rounded-full bg-[#E040FB]/10 blur-[120px]" />

        <div className="relative mx-auto max-w-3xl px-4">
          <div className="mb-10">
            <Link
              href="/"
              className="mb-6 inline-flex items-center gap-1 text-sm text-[#3D7FE0] hover:text-[#C94BEA] transition-colors"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              トップに戻る
            </Link>
            <h1 className="mt-4 text-3xl font-bold text-white">プライバシーポリシー</h1>
            {data.updatedAt && (
              <p className="mt-2 text-sm text-white/30">
                最終更新：{new Date(data.updatedAt).toLocaleDateString("ja-JP")}
              </p>
            )}
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
            {data.content ? (
              <div className="whitespace-pre-wrap text-sm leading-relaxed text-white/70">
                {data.content}
              </div>
            ) : (
              <p className="text-center text-sm text-white/30">
                プライバシーポリシーは現在準備中です
              </p>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
