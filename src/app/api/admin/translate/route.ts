import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

async function authenticate(request: NextRequest) {
  const token = request.cookies.get("admin_token")?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function POST(req: NextRequest) {
  const payload = await authenticate(req);
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { text } = await req.json();
    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "text is required" }, { status: 400 });
    }

    // Split into lines, translate each non-empty line, preserve structure
    const lines = text.split("\n");
    const translated: string[] = [];

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) {
        translated.push("");
        continue;
      }

      const res = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(trimmed)}&langpair=ja|en`
      );

      if (!res.ok) {
        translated.push(trimmed);
        continue;
      }

      const data = await res.json();
      const translatedText = data.responseData?.translatedText ?? trimmed;

      // MyMemory returns all-caps when it can't translate well — fallback to original
      if (translatedText === trimmed || translatedText === trimmed.toUpperCase()) {
        translated.push(trimmed);
      } else {
        translated.push(translatedText);
      }
    }

    return NextResponse.json({ translated: translated.join("\n") });
  } catch {
    return NextResponse.json({ error: "Translation failed" }, { status: 500 });
  }
}
