import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const ADMIN_EMAIL = "wlctoartwold@gmail.com";
const ADMIN_PASSWORD = process.env.XROVIA_ADMIN_PASSWORD;

async function upsertTestOrganization(params: {
  name: string;
  slug: string;
  type: "UNIVERSITY" | "COMPANY" | "TRAINING_PROVIDER" | "PROFESSIONAL_BODY" | "OTHER";
  website: string;
  domain: string;
  country: string;
  status: "PENDING" | "VERIFIED" | "REJECTED";
  role: "OWNER" | "ADMIN" | "VERIFIER" | "REVIEWER";
  adminId: string;
}) {
  const organization = await prisma.organization.upsert({
    where: { slug: params.slug },
    update: {
      name: params.name,
      type: params.type,
      website: params.website,
      officialEmailDomain: params.domain,
      country: params.country,
      status: params.status,
      verifiedAt: params.status === "VERIFIED" ? new Date() : null,
    },
    create: {
      name: params.name,
      slug: params.slug,
      type: params.type,
      website: params.website,
      officialEmailDomain: params.domain,
      country: params.country,
      status: params.status,
      verifiedAt: params.status === "VERIFIED" ? new Date() : null,
    },
  });

  await prisma.organizationMember.upsert({
    where: {
      organizationId_userId: {
        organizationId: organization.id,
        userId: params.adminId,
      },
    },
    update: {
      role: params.role,
      status: "ACTIVE",
    },
    create: {
      organizationId: organization.id,
      userId: params.adminId,
      role: params.role,
      status: "ACTIVE",
    },
  });

  return organization;
}

async function upsertOwnershipApplication(params: {
  organizationId: string;
  applicantUserId: string;
  status: "UNDER_REVIEW" | "MORE_INFORMATION_REQUIRED" | "APPROVED" | "REJECTED";
  reviewNote?: string;
}) {
  const existing = await prisma.organizationOwnershipApplication.findFirst({
    where: {
      organizationId: params.organizationId,
      applicantUserId: params.applicantUserId,
    },
    orderBy: { createdAt: "desc" },
  });

  const data = {
    fullName: "XROVIA Test Administrator",
    jobTitle: "Platform Administrator",
    department: "XROVIA Testing",
    employmentType: "Platform administrator",
    associationDuration: "Test account",
    phone: "+91 9999999999",
    authorizationReason: "Seeded application for testing the XROVIA organization ownership review workflow.",
    officialProfileUrl: "https://xrovia.com",
    evidenceUrl: "https://xrovia.com",
    evidenceDescription: "Seeded test evidence.",
    status: params.status,
    reviewNote: params.reviewNote ?? null,
    reviewedById: null,
    reviewedAt: null,
  };

  if (existing) {
    return prisma.organizationOwnershipApplication.update({
      where: { id: existing.id },
      data,
    });
  }

  return prisma.organizationOwnershipApplication.create({
    data: {
      organizationId: params.organizationId,
      applicantUserId: params.applicantUserId,
      ...data,
    },
  });
}

async function main() {
  console.log("Seeding XROVIA database...");

  if (!ADMIN_PASSWORD) {
    throw new Error(
      "XROVIA_ADMIN_PASSWORD is required to seed the XROVIA test administrator."
    );
  }

  const adminPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);

  // Global XROVIA administrator/test account.
  const admin = await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: {
      passwordHash: adminPassword,
      role: "ADMIN",
      country: "India",
      emailVerifiedAt: new Date(),
      emailVerificationCodeHash: null,
      emailVerificationExpiresAt: null,
    },
    create: {
      email: ADMIN_EMAIL,
      passwordHash: adminPassword,
      role: "ADMIN",
      country: "India",
      emailVerifiedAt: new Date(),
      profile: {
        create: {
          professionalId: "XRV-ADMIN-001",
          fullName: "XROVIA Test Administrator",
          headline: "XROVIA Platform Administrator / Test Account",
          location: "India",
          about:
            "Dedicated XROVIA test administrator account for validating platform, organization, verification, moderation and ownership workflows.",
          isPublic: false,
          verificationStatus: "VERIFIED",
          verifiedAt: new Date(),
          verificationSource: "XROVIA test administrator",
        },
      },
    },
    include: { profile: true },
  });

  if (!admin.profile) {
    await prisma.profile.create({
      data: {
        userId: admin.id,
        professionalId: "XRV-ADMIN-001",
        fullName: "XROVIA Test Administrator",
        headline: "XROVIA Platform Administrator / Test Account",
        location: "India",
        isPublic: false,
        verificationStatus: "VERIFIED",
        verifiedAt: new Date(),
        verificationSource: "XROVIA test administrator",
      },
    });
  }

  // Organization fixtures so the same account can exercise different organization roles.
  const ownerOrg = await upsertTestOrganization({
    name: "XROVIA Test University",
    slug: "xrovia-test-university",
    type: "UNIVERSITY",
    website: "https://example.edu",
    domain: "example.edu",
    country: "India",
    status: "VERIFIED",
    role: "OWNER",
    adminId: admin.id,
  });

  const verifierOrg = await upsertTestOrganization({
    name: "XROVIA Test Company",
    slug: "xrovia-test-company",
    type: "COMPANY",
    website: "https://example.com",
    domain: "example.com",
    country: "India",
    status: "VERIFIED",
    role: "VERIFIER",
    adminId: admin.id,
  });

  const reviewerOrg = await upsertTestOrganization({
    name: "XROVIA Pending Organization",
    slug: "xrovia-pending-organization",
    type: "OTHER",
    website: "https://example.org",
    domain: "example.org",
    country: "India",
    status: "PENDING",
    role: "REVIEWER",
    adminId: admin.id,
  });

  // Seed review states for the global admin's ownership-review console.
  await upsertOwnershipApplication({
    organizationId: reviewerOrg.id,
    applicantUserId: admin.id,
    status: "UNDER_REVIEW",
  });

  const moreInfoOrg = await upsertTestOrganization({
    name: "XROVIA More Info Test Organization",
    slug: "xrovia-more-info-test",
    type: "TRAINING_PROVIDER",
    website: "https://example.net",
    domain: "example.net",
    country: "India",
    status: "PENDING",
    role: "REVIEWER",
    adminId: admin.id,
  });

  await upsertOwnershipApplication({
    organizationId: moreInfoOrg.id,
    applicantUserId: admin.id,
    status: "MORE_INFORMATION_REQUIRED",
    reviewNote: "Test state: provide additional authorization evidence.",
  });

  const rejectedOrg = await upsertTestOrganization({
    name: "XROVIA Rejected Test Organization",
    slug: "xrovia-rejected-test",
    type: "PROFESSIONAL_BODY",
    website: "https://example.co",
    domain: "example.co",
    country: "India",
    status: "PENDING",
    role: "REVIEWER",
    adminId: admin.id,
  });

  await upsertOwnershipApplication({
    organizationId: rejectedOrg.id,
    applicantUserId: admin.id,
    status: "REJECTED",
    reviewNote: "Test state: ownership evidence was not sufficient.",
  });

  // Demo benefits remain available for testing the member-benefits flow.
  await prisma.benefit.upsert({
    where: { id: "xrovia-demo-learning-benefit" },
    update: {},
    create: {
      id: "xrovia-demo-learning-benefit",
      business: "XROVIA Demo Learning Hub",
      category: "Tech",
      discount: "20% OFF",
      location: "Online",
      terms: "Demo benefit for testing.",
      expiry: new Date("2026-12-31"),
      isDemo: true,
    },
  });

  await prisma.benefit.upsert({
    where: { id: "xrovia-demo-cafe-benefit" },
    update: {},
    create: {
      id: "xrovia-demo-cafe-benefit",
      business: "XROVIA Demo Work Lounge",
      category: "Lifestyle",
      discount: "10% OFF",
      location: "Chandigarh",
      terms: "Demo benefit for testing.",
      expiry: new Date("2026-12-31"),
      isDemo: true,
    },
  });

  console.log("XROVIA seed completed.");
  console.log(`Admin: ${ADMIN_EMAIL}`);
  console.log(`Owner organization: ${ownerOrg.slug}`);
  console.log(`Verifier organization: ${verifierOrg.slug}`);
  console.log(`Reviewer organization: ${reviewerOrg.slug}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
