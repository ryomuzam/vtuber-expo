import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { getNews, setNews, upsertNewsItem, type NewsItem } from "@/lib/data";
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

export async function PUT(request: NextRequest) {
  const payload = await authenticate(request);
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { slugs } = await request.json() as { slugs: string[] };
    if (!Array.isArray(slugs)) {
      return NextResponse.json({ error: "slugs array required" }, { status: 400 });
    }

    const news = await getNews();
    const bySlug = new Map(news.map((n) => [n.slug, n]));
    const reordered = slugs.map((s) => bySlug.get(s)).filter(Boolean) as NewsItem[];

    // Append any items not in the slugs array (safety)
    for (const n of news) {
      if (!slugs.includes(n.slug)) reordered.push(n);
    }

    await setNews(reordered);
    revalidatePath("/");
    revalidatePath("/en");
    return NextResponse.json({ ok: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Bad request";
    return NextResponse.json({ error: message }, { status: 400 });
  }
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
