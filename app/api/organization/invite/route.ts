import { NextResponse } from "next/server";
import { createHash, randomBytes } from "crypto";
import { prisma } from "@/lib/db/prisma";
import { getOrganizationAccess, canManageOrganization } from "@/lib/organization/access";
import { sendOrganizationInviteEmail } from "@/lib/email";

const ROLES = new Set(["ADMIN", "VERIFIER", "REVIEWER"]);

export async function POST(req: Request) {
  try {
    const access = await getOrganizationAccess();
    if (!access || !canManageOrganization(access.member.role)) {
      return NextResponse.json({ error: "You do not have permission to invite organization members." }, { status: 403 });
    }

    const { email, role } = await req.json();
    const normalizedEmail = String(email || "").trim().toLowerCase();
    const normalizedRole = String(role || "").trim().toUpperCase();

    if (!normalizedEmail || !/^[^@\s]+@[^@\s]+$/.test(normalizedEmail)) {
      return NextResponse.json({ error: "Enter a valid work email." }, { status: 400 });
    }
    if (!ROLES.has(normalizedRole)) {
      return NextResponse.json({ error: "Choose a valid organization role." }, { status: 400 });
    }
    if (access.member.role === "ADMIN" && normalizedRole === "ADMIN") {
      return NextResponse.json({ error: "Only the Organization Owner can invite another organization Admin." }, { status: 403 });
    }

    const domain = normalizedEmail.split("@")[1];
    if (!(domain === access.organization.officialEmailDomain || domain.endsWith("." + access.organization.officialEmailDomain))) {
      return NextResponse.json({ error: "The invited email must use the organization's official email domain." }, { status: 400 });
    }

    const existingMember = await prisma.organizationMember.findFirst({
      where: { organizationId: access.organization.id, user: { email: normalizedEmail } },
    });
    if (existingMember) {
      return NextResponse.json({ error: "This person is already a member of the organization." }, { status: 409 });
    }

    await prisma.organizationInvite.updateMany({
      where: { organizationId: access.organization.id, email: normalizedEmail, status: "PENDING" },
      data: { status: "REVOKED" },
    });

    const token = randomBytes(32).toString("hex");
    const tokenHash = createHash("sha256").update(token).digest("hex");
    const invite = await prisma.organizationInvite.create({
      data: {
        organizationId: access.organization.id,
        email: normalizedEmail,
        role: normalizedRole as "ADMIN" | "VERIFIER" | "REVIEWER",
        tokenHash,
        expiresAt: new Date(Date.now() + 72 * 60 * 60 * 1000),
      },
    });

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://xrovia.com";
    const inviteUrl = baseUrl + "/organization/invite/" + encodeURIComponent(token);
    try {
      await sendOrganizationInviteEmail(normalizedEmail, access.organization.name, normalizedRole, inviteUrl);
    } catch (emailError) {
      await prisma.organizationInvite.delete({ where: { id: invite.id } });
      throw emailError;
    }

    return NextResponse.json({ message: "Invitation sent.", email: normalizedEmail, role: normalizedRole });
  } catch (error) {
    console.error("Organization invite error:", error);
    return NextResponse.json({ error: "Could not send the invitation." }, { status: 500 });
  }
}
