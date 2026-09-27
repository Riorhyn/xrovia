import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getSession } from "@/lib/auth/session";

async function requireAdmin() {
  const session = await getSession();
  return session?.role === "ADMIN" ? session : null;
}

export async function GET() {
  try {
    const session = await requireAdmin();
    if (!session) return NextResponse.json({ error: "Admin access required." }, { status: 403 });

    const applications = await prisma.organizationOwnershipApplication.findMany({
      include: {
        organization: true,
        applicant: { select: { id: true, email: true, emailVerifiedAt: true, country: true, createdAt: true } },
        reviewedBy: { select: { email: true } },
      },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({ applications }, { headers: { "Cache-Control": "private, no-store" } });
  } catch (error) {
    console.error("Admin ownership GET error:", error);
    return NextResponse.json({ error: "Could not load ownership applications." }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await requireAdmin();
    if (!session) return NextResponse.json({ error: "Admin access required." }, { status: 403 });

    const body = await req.json();
    const applicationId = String(body.applicationId || "").trim();
    const action = String(body.action || "").trim().toUpperCase();
    const reviewNote = String(body.reviewNote || "").trim();

    if (!applicationId || !["APPROVE", "REJECT", "MORE_INFORMATION_REQUIRED"].includes(action)) {
      return NextResponse.json({ error: "Invalid ownership review action." }, { status: 400 });
    }

    const application = await prisma.organizationOwnershipApplication.findUnique({
      where: { id: applicationId },
      include: { organization: true },
    });
    if (!application) return NextResponse.json({ error: "Ownership application not found." }, { status: 404 });

    if (action === "APPROVE") {
      const result = await prisma.$transaction(async (tx) => {
        const membership = await tx.organizationMember.findUnique({
          where: { organizationId_userId: { organizationId: application.organizationId, userId: application.applicantUserId } },
        });

        if (membership) {
          await tx.organizationMember.update({
            where: { id: membership.id },
            data: { role: "OWNER", status: "ACTIVE", jobTitle: application.jobTitle },
          });
        } else {
          await tx.organizationMember.create({
            data: {
              organizationId: application.organizationId,
              userId: application.applicantUserId,
              role: "OWNER",
              status: "ACTIVE",
              jobTitle: application.jobTitle,
            },
          });
        }

        await tx.organization.update({
          where: { id: application.organizationId },
          data: { status: "VERIFIED", verifiedAt: new Date() },
        });

        return tx.organizationOwnershipApplication.update({
          where: { id: application.id },
          data: { status: "APPROVED", reviewNote: reviewNote || "Ownership approved by XROVIA.", reviewedById: session.userId, reviewedAt: new Date() },
        });
      });

      return NextResponse.json({ message: "Ownership approved and organization verified.", application: result });
    }

    const status = action === "REJECT" ? "REJECTED" : "MORE_INFORMATION_REQUIRED";
    const updated = await prisma.organizationOwnershipApplication.update({
      where: { id: application.id },
      data: {
        status,
        reviewNote: reviewNote || (action === "REJECT" ? "Ownership application was not approved." : "Please provide additional verification information."),
        reviewedById: session.userId,
        reviewedAt: new Date(),
      },
    });

    return NextResponse.json({ message: action === "REJECT" ? "Ownership application rejected." : "More information requested.", application: updated });
  } catch (error) {
    console.error("Admin ownership PATCH error:", error);
    return NextResponse.json({ error: "Could not update ownership application." }, { status: 500 });
  }
}
