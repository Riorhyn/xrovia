import { prisma } from "@/lib/db/prisma";
import { getSession } from "@/lib/auth/session";

export const ORGANIZATION_ROLES = ["OWNER", "ADMIN", "VERIFIER", "REVIEWER"] as const;
type OrganizationRole = (typeof ORGANIZATION_ROLES)[number];

export function canManageOrganization(role?: string) {
  return role === "OWNER" || role === "ADMIN";
}

export function canVerifyOrganizationRecords(role?: string) {
  return role === "OWNER" || role === "ADMIN" || role === "VERIFIER";
}

export async function getOrganizationAccess() {
  const session = await getSession();
  if (!session?.organizationId || !session.organizationMemberId || !session.organizationRole) {
    return null;
  }

  const member = await prisma.organizationMember.findFirst({
    where: {
      id: session.organizationMemberId,
      organizationId: session.organizationId,
      userId: session.userId,
      status: "ACTIVE",
    },
    include: { organization: true, user: true },
  });

  if (!member) return null;

  const effectiveRole =
    member.organization.status === "VERIFIED"
      ? member.role
      : member.role === "OWNER"
        ? "REVIEWER"
        : member.role;

  return {
    session,
    member: { ...member, role: effectiveRole },
    organization: member.organization,
  };
}