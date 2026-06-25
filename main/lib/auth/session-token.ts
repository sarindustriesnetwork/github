import crypto from "crypto";
import { SESSION_COOKIE_NAME, SESSION_MAX_AGE_SECONDS } from "@/lib/auth/constants";

export { SESSION_COOKIE_NAME, SESSION_MAX_AGE_SECONDS };

export type SessionPayload = {
  sub: string;
  email: string;
  name: string;
  status: string;
  roles: string[];
  permissions: string[];
  source?: "database" | "fallback";
  iat: number;
  exp: number;
};

function getSecret() {
  return process.env.AUTH_SECRET || process.env.JWT_SECRET || "sar-industries-network-local-development-secret-change-before-production";
}

function encode(value: unknown) {
  return Buffer.from(JSON.stringify(value)).toString("base64url");
}

function decode<T>(value: string): T {
  return JSON.parse(Buffer.from(value, "base64url").toString("utf8")) as T;
}

function sign(data: string) {
  return crypto.createHmac("sha256", getSecret()).update(data).digest("base64url");
}

function safeEqual(a: string, b: string) {
  const aBuffer = Buffer.from(a);
  const bBuffer = Buffer.from(b);
  if (aBuffer.length !== bBuffer.length) return false;
  return crypto.timingSafeEqual(aBuffer, bBuffer);
}

export function createSessionToken(input: Omit<SessionPayload, "iat" | "exp">, maxAgeSeconds = SESSION_MAX_AGE_SECONDS) {
  const now = Math.floor(Date.now() / 1000);
  const payload: SessionPayload = {
    ...input,
    iat: now,
    exp: now + maxAgeSeconds
  };
  const body = encode(payload);
  const signature = sign(body);
  return `${body}.${signature}`;
}

export function verifySessionToken(token?: string | null): SessionPayload | null {
  if (!token || !token.includes(".")) return null;
  const [body, signature] = token.split(".");
  if (!body || !signature) return null;
  const expected = sign(body);
  if (!safeEqual(signature, expected)) return null;

  try {
    const payload = decode<SessionPayload>(body);
    const now = Math.floor(Date.now() / 1000);
    if (!payload.exp || payload.exp < now) return null;
    if (!payload.email || !payload.sub) return null;
    return payload;
  } catch {
    return null;
  }
}
