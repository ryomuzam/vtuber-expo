import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { put } from "@vercel/blob";

async function authenticate(request: NextRequest) {
  const token = request.cookies.get("admin_token")?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function POST(request: NextRequest) {
  const payload = await authenticate(request);
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file || file.size === 0) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Sanitize filename: keep alphanumeric, dots, hyphens; add timestamp suffix
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "bin";
    const base = file.name
      .replace(/\.[^.]+$/, "")
      .replace(/[^a-zA-Z0-9._-]/g, "_")
      .slice(0, 60);
    const filename = `${base}_${Date.now()}.${ext}`;

    const blob = await put(`media/${filename}`, file, {
      access: "public",
      contentType: file.type,
    });

    return NextResponse.json({ url: blob.url, pathname: blob.pathname });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
