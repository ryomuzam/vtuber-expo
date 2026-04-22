import { SignJWT, jwtVerify } from "jose";
import { timingSafeEqual } from "crypto";
import { createHash } from "crypto";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? "dev-secret-change-in-production-32chars!!"
);

export const ADMIN_SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7日
const ADMIN_SESSION_REFRESH_THRESHOLD_SECONDS = 60 * 60 * 24 * 2; // 残り2日以下になったら延長

export async function signToken(payload: Record<string, unknown>): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${ADMIN_SESSION_MAX_AGE_SECONDS}s`)
    .sign(JWT_SECRET);
}

export function shouldRefreshToken(payload: Record<string, unknown>): boolean {
  const exp = typeof payload.exp === "number" ? payload.exp : 0;
  const now = Math.floor(Date.now() / 1000);
  return exp - now < ADMIN_SESSION_REFRESH_THRESHOLD_SECONDS;
}

export async function verifyToken(token: string): Promise<Record<string, unknown> | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as Record<string, unknown>;
  } catch {
    return null;
  }
}

function sha256(str: string): Buffer {
  return createHash("sha256").update(str).digest();
}

export function verifyPassword(input: string, expected: string): boolean {
  const inputHash = sha256(input);
  const expectedHash = sha256(expected);
  if (inputHash.length !== expectedHash.length) return false;
  return timingSafeEqual(inputHash, expectedHash);
}
