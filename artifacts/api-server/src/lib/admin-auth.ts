import crypto from "node:crypto";
import type { Request, Response, NextFunction } from "express";

const COOKIE_NAME = "blaze_admin_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 12; // 12 hours

function getSessionSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    throw new Error(
      "ADMIN_SESSION_SECRET is not set. Refusing to sign admin sessions.",
    );
  }
  return secret;
}

function getAdminPassword(): string | null {
  const value = process.env.ADMIN_PASSWORD;
  return value && value.length > 0 ? value : null;
}

function sign(payload: string): string {
  return crypto
    .createHmac("sha256", getSessionSecret())
    .update(payload)
    .digest("base64url");
}

function timingSafeEqualString(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}

export function checkPassword(candidate: string): boolean {
  const expected = getAdminPassword();
  if (!expected) return false;
  return timingSafeEqualString(candidate, expected);
}

export function isPasswordConfigured(): boolean {
  return getAdminPassword() !== null;
}

export function buildSessionToken(): string {
  const expiresAt = Date.now() + SESSION_TTL_MS;
  const payload = `admin.${expiresAt}`;
  return `${payload}.${sign(payload)}`;
}

function verifySessionToken(token: string): boolean {
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [scope, expiresAtStr, signature] = parts;
  if (scope !== "admin") return false;

  const expiresAt = Number(expiresAtStr);
  if (!Number.isFinite(expiresAt) || expiresAt < Date.now()) return false;

  const payload = `${scope}.${expiresAtStr}`;
  let expectedSignature: string;
  try {
    expectedSignature = sign(payload);
  } catch {
    return false;
  }
  return timingSafeEqualString(signature, expectedSignature);
}

export function readSession(req: Request): boolean {
  const token = (req as Request & { cookies?: Record<string, string> }).cookies?.[
    COOKIE_NAME
  ];
  if (!token) return false;
  return verifySessionToken(token);
}

function cookieOptions() {
  const isProduction = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_TTL_MS,
  };
}

export function setSessionCookie(res: Response, token: string): void {
  res.cookie(COOKIE_NAME, token, cookieOptions());
}

export function clearSessionCookie(res: Response): void {
  res.clearCookie(COOKIE_NAME, { ...cookieOptions(), maxAge: undefined });
}

export function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (readSession(req)) {
    next();
    return;
  }
  res.status(401).json({ error: "Not authenticated" });
}
