import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getSession } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Authentication required." }, { status: 401 });

  const memberships = await prisma.organizationMember.findMany({
    where: { userId: session.userId, status: "ACTIVE" },
    include: {
      organization: { select: { id: true, name: true, slug: true, status: true } },
    },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(
    {
      personal: { email: session.email },
      organizations: memberships.map((membership) => ({
        id: membership.organization.id,
        name: membership.organization.name,
        slug: membership.organization.slug,
        status: membership.organization.status,
        role:
          membership.organization.status === "VERIFIED" || membership.role !== "OWNER"
            ? membership.role
            : "REVIEWER",
      })),
    },
    { headers: { "Cache-Control": "private, no-store" } }
  );
}
