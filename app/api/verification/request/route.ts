import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { prisma } from "@/lib/db/prisma";
import { getSession } from "@/lib/auth/session";
import { sendVerificationInvitationEmail } from "@/lib/email";
import { isAllowedVerifierRole, isOfficialVerifierEmail, normalizeVerifierRole } from "@/lib/verification/policy";

const normalizeOrganization = (value: string) => value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "");

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session?.userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const body = await req.json();
    const type = String(body.type || "").trim().toUpperCase();
    const itemId = String(body.itemId || "").trim();
    const organizationName = String(body.organizationName || "").trim();
    const verifierEmail = String(body.verifierEmail || "").trim().toLowerCase();
    const verifierRole = normalizeVerifierRole(String(body.verifierRole || ""));

    if (!type || !itemId || !organizationName || !verifierEmail || !verifierRole) return NextResponse.json({ error: "Record, organization, official email and verifier role are required." }, { status: 400 });
    if (type !== "EDUCATION" && type !== "EXPERIENCE") return NextResponse.json({ error: "Only education and work-experience records can be institutionally verified." }, { status: 400 });
    if (!isOfficialVerifierEmail(verifierEmail)) return NextResponse.json({ error: "Use an official institutional or company email. Personal email providers are not accepted." }, { status: 400 });
    if (!isAllowedVerifierRole(type, verifierRole)) return NextResponse.json({ error: type === "EDUCATION" ? "Education verification requires an eligible senior academic role such as Professor, Dean, Principal, Registrar or equivalent." : "Work-experience verification requires an eligible Manager-level or higher role." }, { status: 403 });

    const user = await prisma.user.findUnique({ where: { id: session.userId } });
    const profile = await prisma.profile.findUnique({ where: { userId: session.userId } });
    if (!user || !profile) return NextResponse.json({ error: "Profile not found." }, { status: 404 });
    if (user.email.toLowerCase() === verifierEmail) return NextResponse.json({ error: "You cannot use your own account email as the verifier." }, { status: 400 });

    const fullData: any = profile.fullData || {};
    const records = type === "EDUCATION" ? fullData.educations : fullData.experiences;
    const record = Array.isArray(records) ? records.find((entry: any) => String(entry.id) === itemId) : null;
    if (!record) return NextResponse.json({ error: "The selected career record was not found on your profile." }, { status: 404 });
    const canonicalOrganization = type === "EDUCATION" ? String(record.institution || "").trim() : String(record.company || "").trim();
    if (!canonicalOrganization) return NextResponse.json({ error: "Add the institution or employer to this record before requesting verification." }, { status: 400 });
    if (normalizeOrganization(organizationName) !== normalizeOrganization(canonicalOrganization)) return NextResponse.json({ error: "The organization must match the institution or employer on the selected record." }, { status: 400 });

    const title = type === "EDUCATION" ? [record.degree, record.field || record.fieldOfStudy].filter(Boolean).join(" — ") : [record.jobTitle || record.role, record.company].filter(Boolean).join(" — ");
    const requests = Array.isArray(fullData.verificationRequests) ? fullData.verificationRequests : [];
    const existing = requests.find((r: any) => r.itemId === itemId && r.type === type && r.status === "PENDING");
    if (existing) return NextResponse.json({ error: "A verification request for this record is already pending." }, { status: 409 });

    const token = randomBytes(32).toString("hex");
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://xrovia.com";
    const verificationUrl = baseUrl + "/verify/" + token;
    const request = {
      id: "VR-" + randomBytes(6).toString("hex"),
      token, type, itemId, title, organizationName: canonicalOrganization, verifierEmail, verifierRole,
      status: "PENDING", createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      verifiedAt: null, verifiedVerifierName: null, verifiedVerifierRole: null,
      verifierIdType: null, verifierIdHash: null, verifierIdLast4: null,
      verificationMethod: "EMAIL_INVITATION",
    };

    await sendVerificationInvitationEmail(verifierEmail, profile.fullName, canonicalOrganization, title, verificationUrl);
    await prisma.profile.update({ where: { id: profile.id }, data: { fullData: { ...fullData, verificationRequests: [...requests, request] } } });
    return NextResponse.json({ success: true, message: "Verification request sent to the official email.", request: { ...request, token: undefined } });
  } catch (error) {
    console.error("Create verification request error:", error);
    return NextResponse.json({ error: "Unable to send verification request." }, { status: 500 });
  }
}
