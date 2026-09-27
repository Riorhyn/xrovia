import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db/prisma";
import { createSessionToken, setSessionCookie } from "@/lib/auth/session";

export async function POST(req: Request) {
  try {
    const { slug, email, password } = await req.json();
    const normalizedEmail = String(email || "").trim().toLowerCase();
    const normalizedSlug = String(slug || "").trim().toLowerCase();

    if (!normalizedSlug || !normalizedEmail || !password) {
      return NextResponse.json({ error: "Organization ID, email, and password are required." }, { status: 400 });
    }

    const organization = await prisma.organization.findUnique({
      where: { slug: normalizedSlug },
      include: {
        members: {
          where: { status: "ACTIVE", user: { email: normalizedEmail } },
          include: { user: true },
        },
      },
    });

    if (!organization || organization.members.length === 0) {
      return NextResponse.json({ error: "No active organization access was found for these details." }, { status: 401 });
    }

    const member = organization.members[0];
    if (!member.user.passwordHash || !(await bcrypt.compare(password, member.user.passwordHash))) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }

    if (!member.user.emailVerifiedAt && member.user.emailVerificationCodeHash) {
      return NextResponse.json({
        error: "Please verify your XROVIA account email before signing in.",
        needsVerification: true,
        email: member.user.email,
      }, { status: 403 });
    }

    const token = await createSessionToken({
      userId: member.user.id,
      email: member.user.email,
      role: member.user.role,
      organizationId: organization.id,
      organizationMemberId: member.id,
      organizationRole: member.role,
    });

    const response = NextResponse.json({
      message: "Organization login successful.",
      organization: {
        id: organization.id,
        name: organization.name,
        slug: organization.slug,
        status: organization.status,
        role: member.role,
      },
    });
    setSessionCookie(response, token);
    return response;
  } catch (error) {
    console.error("Organization login error:", error);
    return NextResponse.json({ error: "Internal server error. Please try again." }, { status: 500 });
  }
}
