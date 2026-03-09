import { NextResponse } from "next/server";
import { incrementShareCount } from "@/lib/data";

export async function POST() {
  await incrementShareCount();
  return NextResponse.json({ ok: true });
}
