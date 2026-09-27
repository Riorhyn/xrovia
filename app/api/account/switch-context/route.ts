import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getSession, createSessionToken, setSessionCookie } from "@/lib/auth/session";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Authentication required." }, { status: 401 });

    const body = await req.json();
    const type = String(body?.type || "").toUpperCase();

    if (type === "PERSONAL") {
      const token = await createSessionToken({ userId: session.userId, email: session.email, role: session.role });
      const response = NextResponse.json({ success: true, context: "PERSONAL" });
      setSessionCookie(response, token);
      return response;
    }

    if (type !== "ORGANIZATION" || !body?.organizationId) {
      return NextResponse.json({ error: "Invalid account context." }, { status: 400 });
    }

    const membership = await prisma.organizationMember.findFirst({
      where: { organizationId: String(body.organizationId), userId: session.userId, status: "ACTIVE" },
      include: { organization: { select: { id: true, status: true } } },
    });

    if (!membership) {
      return NextResponse.json({ error: "You are not a member of this organization." }, { status: 403 });
    }

    const effectiveRole =
      membership.organization.status === "VERIFIED"
        ? membership.role
        : membership.role === "OWNER"
          ? "REVIEWER"
          : membership.role;

    const token = await createSessionToken({
      userId: session.userId,
      email: session.email,
      role: session.role,
      organizationId: membership.organization.id,
      organizationMemberId: membership.id,
      organizationRole: effectiveRole,
    });

    const response = NextResponse.json({
      success: true,
      context: "ORGANIZATION",
      organizationId: membership.organization.id,
      role: effectiveRole,
    });
    setSessionCookie(response, token);
    return response;
  } catch (error) {
    console.error("Account context switch error:", error);
    return NextResponse.json({ error: "Could not switch account context." }, { status: 500 });
  }
}
