import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret && process.env.NODE_ENV === "production") {
  throw new Error("JWT_SECRET must be configured in production.");
}

const SECRET_KEY = new TextEncoder().encode(
  jwtSecret || "xrovia-local-development-secret-only"
);

export interface AuthSession {
  userId: string;
  email: string;
  role: "USER" | "ADMIN";
  organizationId?: string;
  organizationMemberId?: string;
  organizationRole?: "OWNER" | "ADMIN" | "VERIFIER" | "REVIEWER";
}

export async function createSessionToken(
  payload: AuthSession
): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(SECRET_KEY);
}

export async function verifySessionToken(
  token: string
): Promise<AuthSession | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);

    return {
      userId: payload.userId as string,
      email: payload.email as string,
      role: payload.role as "USER" | "ADMIN",
      organizationId: payload.organizationId as string | undefined,
      organizationMemberId: payload.organizationMemberId as string | undefined,
      organizationRole: payload.organizationRole as AuthSession["organizationRole"],
    };
  } catch {
    return null;
  }
}

export async function getSession(): Promise<AuthSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("provia_session")?.value;

  if (!token) {
    return null;
  }

  return verifySessionToken(token);
}

export function setSessionCookie(
  response: NextResponse,
  token: string
): void {
  response.cookies.set({
    name: "provia_session",
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export function clearSessionCookie(response: NextResponse): void {
  response.cookies.set({
    name: "provia_session",
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}
export const createSession = createSessionToken;