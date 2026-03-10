import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { getNewsItem, upsertNewsItem, deleteNewsItem, type NewsItem } from "@/lib/data";
import { revalidatePath } from "next/cache";

async function authenticate(request: NextRequest) {
  const token = request.cookies.get("admin_token")?.value;
  if (!token) return null;
  return verifyToken(token);
}

type Params = { params: Promise<{ slug: string }> };

export async function GET(request: NextRequest, { params }: Params) {
  const payload = await authenticate(request);
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { slug } = await params;
  const item = await getNewsItem(slug);
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(item);
}

export async function PUT(request: NextRequest, { params }: Params) {
  const payload = await authenticate(request);
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { slug } = await params;

  if (!/^[a-z0-9-]+$/.test(slug)) {
    return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
  }

  try {
    const item: NewsItem = await request.json();
    item.slug = slug; // ensure slug matches URL
    await upsertNewsItem(item);
    revalidatePath("/");
    revalidatePath("/en");
    revalidatePath(`/news/${slug}`);
    revalidatePath(`/en/news/${slug}`);
    return NextResponse.json({ ok: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Bad request";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const payload = await authenticate(request);
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { slug } = await params;
  const item = await getNewsItem(slug);
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });

  try {
    const body = await request.json();
    if (typeof body.isPublic === "boolean") {
      item.isPublic = body.isPublic;
    }
    await upsertNewsItem(item);
    revalidatePath("/");
    revalidatePath("/en");
    return NextResponse.json({ ok: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Bad request";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  const payload = await authenticate(request);
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { slug } = await params;

  if (!/^[a-z0-9-]+$/.test(slug)) {
    return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
  }

  await deleteNewsItem(slug);
  revalidatePath("/");
  revalidatePath("/en");

  return NextResponse.json({ ok: true });
}
