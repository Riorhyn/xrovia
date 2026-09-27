import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { randomInt } from "crypto";
import { prisma } from "@/lib/db/prisma";
import { sendVerificationEmail } from "@/lib/email";

const PERSONAL_EMAIL_DOMAINS = new Set([
  "gmail.com", "googlemail.com", "yahoo.com", "yahoo.co.in", "outlook.com",
  "hotmail.com", "live.com", "msn.com", "icloud.com", "me.com", "proton.me",
  "protonmail.com", "mail.com", "aol.com", "gmx.com", "zoho.com",
]);

const TYPES = new Set(["UNIVERSITY", "COMPANY", "TRAINING_PROVIDER", "PROFESSIONAL_BODY", "OTHER"]);

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 70);
}

function getDomain(value: string) {
  return value.trim().toLowerCase().replace(/^https?:\/\//, "").split("/")[0].replace(/^www\./, "");
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = String(body.name || "").trim();
    const type = String(body.type || "").trim().toUpperCase();
    const website = String(body.website || "").trim();
    const officialEmail = String(body.officialEmail || "").trim().toLowerCase();
    const country = String(body.country || "").trim();
    const password = String(body.password || "");

    if (!name || !type || !website || !officialEmail || !country || !password) {
      return NextResponse.json({ error: "Organization name, type, website, official email, country, and password are required." }, { status: 400 });
    }
    if (!TYPES.has(type)) {
      return NextResponse.json({ error: "Choose a valid organization type." }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
    }

    let websiteUrl: URL;
    try {
      websiteUrl = new URL(/^https?:\/\//i.test(website) ? website : "https://" + website);
    } catch {
      return NextResponse.json({ error: "Enter a valid organization website." }, { status: 400 });
    }

    const emailMatch = officialEmail.match(/^[^@\s]+@([^@\s]+)$/);
    if (!emailMatch) {
      return NextResponse.json({ error: "Enter a valid official organization email." }, { status: 400 });
    }

    const emailDomain = getDomain(officialEmail);
    const websiteDomain = getDomain(websiteUrl.hostname);
    if (PERSONAL_EMAIL_DOMAINS.has(emailDomain)) {
      return NextResponse.json({ error: "Organization registration requires an official organization email, not a personal email provider." }, { status: 400 });
    }
    if (!(emailDomain === websiteDomain || emailDomain.endsWith("." + websiteDomain))) {
      return NextResponse.json({ error: "Your official email domain must match the organization website domain." }, { status: 400 });
    }

    const baseSlug = slugify(name) || "organization";
    let slug = baseSlug;
    for (let i = 0; i < 5; i++) {
      const existingSlug = await prisma.organization.findUnique({ where: { slug } });
      if (!existingSlug) break;
      slug = baseSlug + "-" + randomInt(1000, 9999);
    }
    if (await prisma.organization.findUnique({ where: { slug } })) {
      return NextResponse.json({ error: "Could not create a unique organization identifier. Please try again." }, { status: 409 });
    }

    let user = await prisma.user.findUnique({ where: { email: officialEmail } });
    let needsEmailVerification = false;

    if (user) {
      const passwordMatches = await bcrypt.compare(password, user.passwordHash);
      if (!passwordMatches) {
        return NextResponse.json({ error: "An XROVIA account already uses this email. Sign in with that account or use a different official organization email." }, { status: 409 });
      }
      const existingMembership = await prisma.organizationMember.findFirst({
        where: { userId: user.id, organization: { officialEmailDomain: emailDomain } },
      });
      if (existingMembership) {
        return NextResponse.json({ error: "This account is already connected to an organization." }, { status: 409 });
      }
      needsEmailVerification = !user.emailVerifiedAt;
    } else {
      const passwordHash = await bcrypt.hash(password, 12);
      user = await prisma.user.create({
        data: {
          email: officialEmail,
          passwordHash,
          country,
        },
      });
      needsEmailVerification = true;
    }

    const organization = await prisma.organization.create({
      data: {
        name,
        slug,
        type: type as "UNIVERSITY" | "COMPANY" | "TRAINING_PROVIDER" | "PROFESSIONAL_BODY" | "OTHER",
        website: websiteUrl.toString().replace(/\/$/, ""),
        officialEmailDomain: websiteDomain,
        country,
        members: {
          create: {
            userId: user.id,
            role: "OWNER",
            jobTitle: "Organization Owner",
          },
        },
      },
      select: { id: true, name: true, slug: true, status: true },
    });

    if (needsEmailVerification) {
      const verificationCode = String(randomInt(100000, 1000000));
      const verificationCodeHash = await bcrypt.hash(verificationCode, 10);
      await prisma.user.update({
        where: { id: user.id },
        data: {
          emailVerificationCodeHash: verificationCodeHash,
          emailVerificationExpiresAt: new Date(Date.now() + 10 * 60 * 1000),
          emailVerificationSentAt: new Date(),
        },
      });
      try {
        await sendVerificationEmail(officialEmail, verificationCode);
      } catch (emailError) {
        await prisma.organization.delete({ where: { id: organization.id } });
        if (!user.emailVerifiedAt && !user.profile) {
          await prisma.user.delete({ where: { id: user.id } }).catch(() => {});
        }
        throw emailError;
      }
    }

    return NextResponse.json({
      message: needsEmailVerification ? "Organization created. Verify your email to continue." : "Organization created.",
      email: officialEmail,
      organization: { id: organization.id, name: organization.name, slug: organization.slug, status: organization.status },
      needsEmailVerification,
    }, { status: 201 });
  } catch (error) {
    console.error("Organization registration error:", error);
    return NextResponse.json({ error: "Could not create the organization account. Please try again." }, { status: 500 });
  }
}
