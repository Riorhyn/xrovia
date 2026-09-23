import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

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
    return NextResponse.json({
      request: { id: request.id, type: request.type, title: request.title, verifierName: request.verifierName, status: request.status, createdAt: request.createdAt, verifiedAt: request.verifiedAt },
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
    const verifierEmail = String(body.verifierEmail || "").trim();
    if (!verifierName || !verifierEmail) return NextResponse.json({ error: "Verifier name and email are required." }, { status: 400 });

    const found = await findRequest(params.token);
    if (!found) return NextResponse.json({ error: "Verification request not found." }, { status: 404 });
    if (found.requests[found.index].status === "VERIFIED") return NextResponse.json({ message: "Already verified." });

    found.requests[found.index] = { ...found.requests[found.index], status: "VERIFIED", verifierName, verifierEmail, verifiedAt: new Date().toISOString() };
    await prisma.profile.update({ where: { id: found.profile.id }, data: { fullData: { ...found.data, verificationRequests: found.requests } } });
    return NextResponse.json({ success: true, message: "Record verified successfully." });
  } catch (error) {
    console.error("Confirm verification error:", error);
    return NextResponse.json({ error: "Unable to verify this record." }, { status: 500 });
  }
}
