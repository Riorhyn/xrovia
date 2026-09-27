import { NextResponse } from "next/server";
import { createHash } from "crypto";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db/prisma";
import { createSessionToken, setSessionCookie } from "@/lib/auth/session";

export async function GET(_: Request, { params }: { params: { token: string } }) {
  try {
    const tokenHash = createHash("sha256").update(params.token).digest("hex");
    const invite = await prisma.organizationInvite.findUnique({
      where: { tokenHash },
      include: { organization: { select: { id:true, name:true, slug:true, officialEmailDomain:true } } },
    });
    if (!invite || invite.status !== "PENDING" || invite.expiresAt < new Date()) {
      return NextResponse.json({ error: "This invitation is invalid or expired." }, { status: 404 });
    }
    const user = await prisma.user.findUnique({ where: { email: invite.email }, select: { id:true } });
    return NextResponse.json({
      organization: { name: invite.organization.name, slug: invite.organization.slug },
      email: invite.email,
      role: invite.role,
      existingAccount: Boolean(user),
    });
  } catch {
    return NextResponse.json({ error: "Could not load invitation." }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: { token: string } }) {
  try {
    const body = await req.json();
    const tokenHash = createHash("sha256").update(params.token).digest("hex");
    const invite = await prisma.organizationInvite.findUnique({
      where: { tokenHash },
      include: { organization: true },
    });
    if (!invite || invite.status !== "PENDING" || invite.expiresAt < new Date()) {
      return NextResponse.json({ error: "This invitation is invalid or expired." }, { status: 400 });
    }

    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");
    const fullName = String(body.fullName || "").trim();

    if (email !== invite.email) {
      return NextResponse.json({ error: "Use the exact invited organization email address." }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
    }

    let user = await prisma.user.findUnique({ where: { email } });
    if (user) {
      if (!(await bcrypt.compare(password, user.passwordHash))) {
        return NextResponse.json({ error: "Incorrect account password." }, { status: 401 });
      }
      await prisma.user.update({
        where: { id: user.id },
        data: {
          emailVerifiedAt: user.emailVerifiedAt || new Date(),
          emailVerificationCodeHash: null,
          emailVerificationExpiresAt: null,
          emailVerificationSentAt: null,
        },
      });
    } else {
      if (!fullName) {
        return NextResponse.json({ error: "Full name is required for a new staff account." }, { status: 400 });
      }
      user = await prisma.user.create({
        data: {
          email,
          passwordHash: await bcrypt.hash(password, 12),
          emailVerifiedAt: new Date(),
          country: invite.organization.country,
        },
      });
    }

    const existingMember = await prisma.organizationMember.findFirst({
      where: { organizationId: invite.organizationId, userId: user.id },
    });
    if (existingMember) {
      await prisma.organizationInvite.update({
        where: { id: invite.id },
        data: { status: "ACCEPTED", acceptedAt: new Date() },
      });
      return NextResponse.json({ error: "You are already a member of this organization." }, { status: 409 });
    }

    const member = await prisma.organizationMember.create({
      data: {
        organizationId: invite.organizationId,
        userId: user.id,
        role: invite.role,
        status: "ACTIVE",
      },
    });

    await prisma.organizationInvite.update({
      where: { id: invite.id },
      data: { status: "ACCEPTED", acceptedAt: new Date() },
    });

    const token = await createSessionToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      organizationId: invite.organizationId,
      organizationMemberId: member.id,
      organizationRole: member.role,
    });
    const response = NextResponse.json({ message: "Invitation accepted.", redirectTo: "/organization" });
    setSessionCookie(response, token);
    return response;
  } catch (error) {
    console.error("Organization invitation acceptance error:", error);
    return NextResponse.json({ error: "Could not accept this invitation." }, { status: 500 });
  }
}
