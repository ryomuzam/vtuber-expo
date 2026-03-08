import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import {
  getAgencies, setAgencies,
  getSponsors, setSponsors,
  getTieups, setTieups,
  type Agency, type Sponsor, type Tieup,
} from "@/lib/data";
import { revalidatePath } from "next/cache";

async function authenticate(request: NextRequest) {
  const token = request.cookies.get("admin_token")?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function GET(request: NextRequest) {
  const payload = await authenticate(request);
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [agencies, sponsors, tieups] = await Promise.all([
    getAgencies(),
    getSponsors(),
    getTieups(),
  ]);

  return NextResponse.json({ agencies, sponsors, tieups });
}

type LogosPayload = {
  agencies?: Agency[];
  sponsors?: Sponsor[];
  tieups?: Tieup[];
};

export async function PUT(request: NextRequest) {
  const payload = await authenticate(request);
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body: LogosPayload = await request.json();
    await Promise.all([
      body.agencies !== undefined ? setAgencies(body.agencies) : Promise.resolve(),
      body.sponsors !== undefined ? setSponsors(body.sponsors) : Promise.resolve(),
      body.tieups !== undefined ? setTieups(body.tieups) : Promise.resolve(),
    ]);
    revalidatePath("/");
    revalidatePath("/en");
    return NextResponse.json({ ok: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Bad request";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
