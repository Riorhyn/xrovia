import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getOrganizationAccess, canManageOrganization } from "@/lib/organization/access";

const EDITABLE_ROLES = new Set(["ADMIN", "VERIFIER", "REVIEWER"]);

export async function GET() {
  try {
    const access = await getOrganizationAccess();
    if (!access) return NextResponse.json({ error: "Organization access required." }, { status: 401 });

    const members = await prisma.organizationMember.findMany({
      where: { organizationId: access.organization.id },
      include: { user: { select: { id:true, email:true, emailVerifiedAt:true, createdAt:true } } },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({
      organization: {
        id: access.organization.id,
        name: access.organization.name,
        slug: access.organization.slug,
        type: access.organization.type,
        status: access.organization.status,
        website: access.organization.website,
        country: access.organization.country,
        role: access.member.role,
      },
      members,
    }, { headers: { "Cache-Control": "private, no-store" } });
  } catch (error) {
    console.error("Organization members GET error:", error);
    return NextResponse.json({ error: "Could not load organization data." }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const access = await getOrganizationAccess();
    if (!access || !canManageOrganization(access.member.role)) {
      return NextResponse.json({ error: "You do not have permission to manage members." }, { status: 403 });
    }

    const { memberId, role } = await req.json();
    if (!memberId || !EDITABLE_ROLES.has(String(role))) {
      return NextResponse.json({ error: "Invalid member role update." }, { status: 400 });
    }

    const target = await prisma.organizationMember.findFirst({
      where: { id: String(memberId), organizationId: access.organization.id },
    });
    if (!target) return NextResponse.json({ error: "Member not found." }, { status: 404 });
    if (target.role === "OWNER") return NextResponse.json({ error: "The Organization Owner cannot be changed here." }, { status: 400 });
    if (target.id === access.member.id) return NextResponse.json({ error: "You cannot change your own organization role." }, { status: 400 });

    const updated = await prisma.organizationMember.update({
      where: { id: target.id },
      data: { role: String(role) as "ADMIN" | "VERIFIER" | "REVIEWER" },
    });
    return NextResponse.json({ member: updated });
  } catch (error) {
    console.error("Organization member PATCH error:", error);
    return NextResponse.json({ error: "Could not update member role." }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const access = await getOrganizationAccess();
    if (!access || !canManageOrganization(access.member.role)) {
      return NextResponse.json({ error: "You do not have permission to remove members." }, { status: 403 });
    }
    const { memberId } = await req.json();
    const target = await prisma.organizationMember.findFirst({
      where: { id: String(memberId), organizationId: access.organization.id },
    });
    if (!target) return NextResponse.json({ error: "Member not found." }, { status: 404 });
    if (target.role === "OWNER") return NextResponse.json({ error: "The Organization Owner cannot be removed." }, { status: 400 });
    if (target.id === access.member.id) return NextResponse.json({ error: "You cannot remove yourself." }, { status: 400 });

    await prisma.organizationMember.update({ where: { id: target.id }, data: { status: "REMOVED" } });
    return NextResponse.json({ message: "Member removed." });
  } catch (error) {
    console.error("Organization member DELETE error:", error);
    return NextResponse.json({ error: "Could not remove member." }, { status: 500 });
  }
}
