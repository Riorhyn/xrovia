import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { prisma } from "@/lib/db/prisma";
import { getSession } from "@/lib/auth/session";
import { sendVerificationInvitationEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session?.userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const type = String(body.type || "").trim().toUpperCase();
    const itemId = String(body.itemId || "").trim();
    const title = String(body.title || "").trim();
    const organizationName = String(body.organizationName || "").trim();
    const verifierEmail = String(body.verifierEmail || "").trim().toLowerCase();
    const verifierRole = String(body.verifierRole || "").trim();

    if (!type || !itemId || !title || !organizationName || !verifierEmail || !verifierRole) {
      return NextResponse.json({ error: "Record, organization, verifier email and verifier role are required." }, { status: 400 });
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(verifierEmail)) {
      return NextResponse.json({ error: "Enter a valid verifier email address." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id: session.userId } });
    const profile = await prisma.profile.findUnique({ where: { userId: session.userId } });
    if (!user || !profile) return NextResponse.json({ error: "Profile not found." }, { status: 404 });

    if (user.email.toLowerCase() === verifierEmail) {
      return NextResponse.json({ error: "You cannot use your own account email as the verifier." }, { status: 400 });
    }

    const fullData: any = profile.fullData || {};
    const requests = Array.isArray(fullData.verificationRequests) ? fullData.verificationRequests : [];
    const existing = requests.find((r: any) => r.itemId === itemId && r.type === type && r.status === "PENDING");
    if (existing) return NextResponse.json({ error: "A verification request for this record is already pending." }, { status: 409 });

    const token = randomBytes(32).toString("hex");
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://xrovia.com";
    const verificationUrl = `${baseUrl}/verify/${token}`;

    const request = {
      id: `VR-${randomBytes(6).toString("hex")}`,
      token,
      type,
      itemId,
      title,
      organizationName,
      verifierEmail,
      verifierRole,
      status: "PENDING",
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      verifiedAt: null,
      verifiedVerifierName: null,
      verifiedVerifierRole: null,
      verificationMethod: "EMAIL_INVITATION",
    };

    await sendVerificationInvitationEmail(
      verifierEmail,
      profile.fullName,
      organizationName,
      title,
      verificationUrl,
    );

    await prisma.profile.update({
      where: { id: profile.id },
      data: { fullData: { ...fullData, verificationRequests: [...requests, request] } },
    });

    return NextResponse.json({
      success: true,
      message: "Verification request sent to the verifier's email.",
      request: { ...request, token: undefined },
    });
  } catch (error) {
    console.error("Create verification request error:", error);
    return NextResponse.json({ error: "Unable to send verification request." }, { status: 500 });
  }
}
