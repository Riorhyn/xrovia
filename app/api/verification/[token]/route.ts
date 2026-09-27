import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { hashVerifierId, isAllowedVerifierRole, isOfficialVerifierEmail, maskVerifierId, normalizeVerifierRole } from "@/lib/verification/policy";

async function findRequest(token: string) {
  const profiles = await prisma.profile.findMany({ take: 100 });
  for (const profile of profiles) {
    const data: any = profile.fullData || {};
    const requests = Array.isArray(data.verificationRequests) ? data.verificationRequests : [];
    const index = requests.findIndex((r: any) => r.token === token);
    if (index >= 0) return { profile, data, requests, index };
  }
  return null;
}

export async function GET(_req: Request, { params }: { params: { token: string } }) {
  try {
    const found = await findRequest(params.token);
    if (!found) return NextResponse.json({ error: "Verification request not found." }, { status: 404 });
    const request = found.requests[found.index];
    if (request.expiresAt && new Date(request.expiresAt).getTime() < Date.now() && request.status === "PENDING") return NextResponse.json({ error: "This verification request has expired." }, { status: 410 });
    return NextResponse.json({
      request: { id: request.id, type: request.type, title: request.title, organizationName: request.organizationName, verifierEmail: request.verifierEmail, verifierRole: request.verifierRole, status: request.status, createdAt: request.createdAt, expiresAt: request.expiresAt, verifiedAt: request.verifiedAt },
      profile: { fullName: found.profile.fullName, professionalId: found.profile.professionalId, headline: found.profile.headline },
    });
  } catch (error) {
    console.error("Get verification request error:", error);
    return NextResponse.json({ error: "Unable to load verification request." }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: { token: string } }) {
  try {
    const body = await req.json().catch(() => ({}));
    const verifierName = String(body.verifierName || "").trim();
    const verifierEmail = String(body.verifierEmail || "").trim().toLowerCase();
    const verifierRole = normalizeVerifierRole(String(body.verifierRole || ""));
    const verifierIdType = String(body.verifierIdType || "").trim();
    const verifierIdNumber = String(body.verifierIdNumber || "").trim();
    const attested = body.attested === true;

    if (!verifierName || !verifierEmail || !verifierRole || !verifierIdType || !verifierIdNumber || !attested) return NextResponse.json({ error: "Official email, full name, role, personal ID details and confirmation are required." }, { status: 400 });
    if (!isOfficialVerifierEmail(verifierEmail)) return NextResponse.json({ error: "Use the official institutional or company email associated with this verification request." }, { status: 400 });
    if (verifierIdNumber.length < 4 || verifierIdNumber.length > 64) return NextResponse.json({ error: "Enter a valid personal ID number." }, { status: 400 });

    const found = await findRequest(params.token);
    if (!found) return NextResponse.json({ error: "Verification request not found." }, { status: 404 });
    const request = found.requests[found.index];
    if (request.status === "VERIFIED") return NextResponse.json({ message: "Already verified." });
    if (request.status !== "PENDING") return NextResponse.json({ error: "This verification request is no longer active." }, { status: 400 });
    if (request.expiresAt && new Date(request.expiresAt).getTime() < Date.now()) return NextResponse.json({ error: "This verification request has expired." }, { status: 410 });
    if (verifierEmail !== String(request.verifierEmail || "").toLowerCase()) return NextResponse.json({ error: "The email entered does not match the official email address that received this verification request." }, { status: 403 });
    if (!isAllowedVerifierRole(request.type, verifierRole)) return NextResponse.json({ error: request.type === "EDUCATION" ? "This education record can only be verified by an eligible senior academic representative." : "This work record can only be verified by an eligible Manager-level or higher representative." }, { status: 403 });
    if (normalizeVerifierRole(request.verifierRole) !== verifierRole) return NextResponse.json({ error: "The verifier role does not match the role specified in the verification request." }, { status: 403 });

    const verifierIdHash = hashVerifierId(verifierIdType, verifierIdNumber);
    found.requests[found.index] = {
      ...request,
      status: "VERIFIED",
      verifiedVerifierName: verifierName,
      verifiedVerifierEmail: verifierEmail,
      verifiedVerifierRole: verifierRole,
      verifierIdType,
      verifierIdHash,
      verifierIdLast4: maskVerifierId(verifierIdNumber),
      verifiedAt: new Date().toISOString(),
      verificationMethod: "OFFICIAL_EMAIL_AND_ID_ATTESTATION",
    };

    await prisma.profile.update({ where: { id: found.profile.id }, data: { fullData: { ...found.data, verificationRequests: found.requests } } });
    return NextResponse.json({ success: true, message: "Record verified successfully." });
  } catch (error) {
    console.error("Confirm verification error:", error);
    return NextResponse.json({ error: "Unable to verify this record." }, { status: 500 });
  }
}
