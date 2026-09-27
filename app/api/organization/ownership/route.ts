import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getSession } from "@/lib/auth/session";

export async function GET(req: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Sign in required." }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const organizationId = searchParams.get("organizationId") || session.organizationId;
    if (!organizationId) return NextResponse.json({ error: "Organization is required." }, { status: 400 });

    const application = await prisma.organizationOwnershipApplication.findFirst({
      where: { organizationId, applicantUserId: session.userId },
      orderBy: { createdAt: "desc" },
    });

    const organization = await prisma.organization.findUnique({
      where: { id: organizationId },
      select: { id: true, name: true, slug: true, type: true, website: true, officialEmailDomain: true, country: true, status: true },
    });

    if (!organization) return NextResponse.json({ error: "Organization not found." }, { status: 404 });

    return NextResponse.json({ organization, application }, { headers: { "Cache-Control": "private, no-store" } });
  } catch (error) {
    console.error("Organization ownership GET error:", error);
    return NextResponse.json({ error: "Could not load ownership application." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Sign in required." }, { status: 401 });

    const body = await req.json();
    const organizationId = String(body.organizationId || "").trim();
    const fullName = String(body.fullName || "").trim();
    const jobTitle = String(body.jobTitle || "").trim();
    const department = String(body.department || "").trim();
    const employmentType = String(body.employmentType || "").trim();
    const associationDuration = String(body.associationDuration || "").trim();
    const phone = String(body.phone || "").trim();
    const authorizationReason = String(body.authorizationReason || "").trim();
    const officialProfileUrl = String(body.officialProfileUrl || "").trim();
    const evidenceUrl = String(body.evidenceUrl || "").trim();
    const evidenceDescription = String(body.evidenceDescription || "").trim();

    if (!organizationId || !fullName || !jobTitle || !department || !employmentType || !associationDuration || !authorizationReason) {
      return NextResponse.json({ error: "Please complete all required ownership and authorization details." }, { status: 400 });
    }

    const organization = await prisma.organization.findUnique({ where: { id: organizationId } });
    if (!organization) return NextResponse.json({ error: "Organization not found." }, { status: 404 });

    const emailDomain = session.email.split("@")[1]?.toLowerCase();
    if (!emailDomain || !(emailDomain === organization.officialEmailDomain || emailDomain.endsWith("." + organization.officialEmailDomain))) {
      return NextResponse.json({ error: "Your verified email must use the organization's official domain." }, { status: 400 });
    }

    const existingOwner = await prisma.organizationMember.findFirst({
      where: { organizationId, userId: session.userId, role: "OWNER", status: "ACTIVE" },
    });
    if (existingOwner) return NextResponse.json({ error: "You are already an organization owner." }, { status: 409 });

    const existing = await prisma.organizationOwnershipApplication.findFirst({
      where: {
        organizationId,
        applicantUserId: session.userId,
        status: { in: ["UNDER_REVIEW", "MORE_INFORMATION_REQUIRED"] },
      },
    });
    if (existing) return NextResponse.json({ error: "You already have an ownership application under review.", application: existing }, { status: 409 });

    const application = await prisma.organizationOwnershipApplication.create({
      data: {
        organizationId,
        applicantUserId: session.userId,
        fullName,
        jobTitle,
        department,
        employmentType,
        associationDuration,
        phone: phone || null,
        authorizationReason,
        officialProfileUrl: officialProfileUrl || null,
        evidenceUrl: evidenceUrl || null,
        evidenceDescription: evidenceDescription || null,
      },
    });

    return NextResponse.json({ message: "Ownership application submitted for XROVIA review.", application }, { status: 201 });
  } catch (error) {
    console.error("Organization ownership POST error:", error);
    return NextResponse.json({ error: "Could not submit the ownership application." }, { status: 500 });
  }
}
