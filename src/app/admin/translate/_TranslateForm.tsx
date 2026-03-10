"use client";

import { useState } from "react";

export default function TranslateForm() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleTranslate() {
    if (!input.trim()) return;
    setLoading(true);
    setOutput("");
    try {
      const res = await fetch("/api/admin/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input }),
      });
      const data = await res.json();
      if (res.ok) {
        setOutput(data.translated);
      } else {
        setOutput(`エラー: ${data.error}`);
      }
    } catch {
      setOutput("通信エラーが発生しました");
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy() {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <p className="mb-4 text-sm text-gray-500">
          日本語テキストを入力すると、英語に自動翻訳されます。翻訳結果をコピーして各管理ページの英語欄に貼り付けてください。
        </p>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Japanese input */}
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="rounded bg-red-100 px-2 py-0.5 text-xs font-bold text-red-600">JA</span>
              <span className="text-sm font-medium text-gray-700">日本語（入力）</span>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={12}
              placeholder="翻訳したい日本語テキストを入力してください&#10;&#10;例:&#10;オープニングステージ&#10;VTuber EXPO 2026 開幕セレモニー"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#3D7FE0] focus:ring-1 focus:ring-[#3D7FE0]"
            />
          </div>

          {/* English output */}
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="rounded bg-blue-100 px-2 py-0.5 text-xs font-bold text-blue-600">EN</span>
              <span className="text-sm font-medium text-gray-700">English（翻訳結果）</span>
              {output && (
                <button
                  onClick={handleCopy}
                  className="ml-auto flex items-center gap-1 rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600 transition hover:bg-gray-200"
                >
                  {copied ? (
                    <>
                      <svg className="h-3.5 w-3.5 text-green-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      コピー済み
                    </>
                  ) : (
                    <>
                      <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9.75a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
                      </svg>
                      コピー
                    </>
                  )}
                </button>
              )}
            </div>
            <textarea
              value={output}
              readOnly
              rows={12}
              placeholder="翻訳結果がここに表示されます"
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none"
            />
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={handleTranslate}
            disabled={loading || !input.trim()}
            className="rounded-lg bg-[#3D7FE0] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#3070cc] disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                翻訳中...
              </span>
            ) : (
              "翻訳する"
            )}
          </button>
          <button
            onClick={() => { setInput(""); setOutput(""); }}
            className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-500 transition hover:bg-gray-50"
          >
            クリア
          </button>
        </div>
      </div>

      {/* Tips */}
      <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-5">
        <h3 className="mb-2 text-sm font-bold text-[#3D7FE0]">使い方</h3>
        <ul className="space-y-1.5 text-sm text-gray-600">
          <li>1. 左側に日本語テキストを入力し「翻訳する」をクリック</li>
          <li>2. 右側に英語の翻訳結果が表示されます</li>
          <li>3.「コピー」ボタンで翻訳結果をコピー</li>
          <li>4. 各管理ページ（スケジュール、3つの魅力など）の英語欄に貼り付け</li>
        </ul>
        <p className="mt-3 text-xs text-gray-400">
          ※ 無料翻訳APIを使用しているため、専門用語や固有名詞は手動で修正してください
        </p>
      </div>
    </div>
  );
}
