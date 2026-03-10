import { NextRequest, NextResponse } from "next/server";
import { addContactInquiry, getContactSettings } from "@/lib/data";

export async function POST(request: NextRequest) {
  try {
    const { email, inquiryType, message } = await request.json();

    if (!email || !inquiryType || !message) {
      return NextResponse.json({ error: "必須項目を入力してください" }, { status: 400 });
    }

    const settings = await getContactSettings();
    if (!settings.isPublic) {
      return NextResponse.json({ error: "現在受付を停止しています" }, { status: 403 });
    }

    await addContactInquiry({ email, inquiryType, message });
    return NextResponse.json({ ok: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : "送信に失敗しました";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
