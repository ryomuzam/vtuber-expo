import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { list, del } from "@vercel/blob";

async function authenticate(request: NextRequest) {
  const token = request.cookies.get("admin_token")?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function GET(request: NextRequest) {
  const payload = await authenticate(request);
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { blobs } = await list({ prefix: "media/" });
    return NextResponse.json({ blobs });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to list media";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const payload = await authenticate(request);
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = request.nextUrl.searchParams.get("url");
  if (!url) return NextResponse.json({ error: "url required" }, { status: 400 });

  try {
    await del(url);
    return NextResponse.json({ ok: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to delete";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
