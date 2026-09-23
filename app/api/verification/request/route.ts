import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { prisma } from "@/lib/db/prisma";
import { getSession } from "@/lib/auth/session";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session?.userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const body = await req.json();
    const type = String(body.type || "").trim();
    const itemId = String(body.itemId || "").trim();
    const title = String(body.title || "").trim();
    const verifierName = String(body.verifierName || "").trim();
    const verifierEmail = String(body.verifierEmail || "").trim();
    if (!type || !itemId || !title || !verifierName || !verifierEmail) return NextResponse.json({ error: "All verification request fields are required." }, { status: 400 });

    const profile = await prisma.profile.findUnique({ where: { userId: session.userId } });
    if (!profile) return NextResponse.json({ error: "Profile not found." }, { status: 404 });

    const fullData: any = profile.fullData || {};
    const requests = Array.isArray(fullData.verificationRequests) ? fullData.verificationRequests : [];
    const existing = requests.find((r: any) => r.itemId === itemId && r.type === type && r.status === "PENDING");
    if (existing) return NextResponse.json({ request: existing, alreadyExists: true });

    const token = randomBytes(24).toString("hex");
    const request = { id: `VR-${randomBytes(6).toString("hex")}`, token, type, itemId, title, verifierName, verifierEmail, status: "PENDING", createdAt: new Date().toISOString(), verifiedAt: null };
    await prisma.profile.update({ where: { id: profile.id }, data: { fullData: { ...fullData, verificationRequests: [...requests, request] } } });
    return NextResponse.json({ success: true, request, verificationUrl: `/verify/${token}` });
  } catch (error) {
    console.error("Create verification request error:", error);
    return NextResponse.json({ error: "Unable to create verification request." }, { status: 500 });
  }
}
