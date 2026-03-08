import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { getNews, upsertNewsItem, type NewsItem } from "@/lib/data";
import { revalidatePath } from "next/cache";

async function authenticate(request: NextRequest) {
  const token = request.cookies.get("admin_token")?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function GET(request: NextRequest) {
  const payload = await authenticate(request);
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const news = await getNews();
  return NextResponse.json(news);
}

export async function POST(request: NextRequest) {
  const payload = await authenticate(request);
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const item: NewsItem = await request.json();

    if (!item.slug || !/^[a-z0-9-]+$/.test(item.slug)) {
      return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
    }

    await upsertNewsItem(item);
    revalidatePath("/");
    revalidatePath("/en");

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Bad request";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
