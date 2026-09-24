import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getSession } from "@/lib/auth/session";

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        email: true,
        role: true,
        country: true,
        profile: {
          include: {
            evidenceFiles: {
              select: { id: true, itemType: true, itemId: true, fileName: true, mimeType: true, size: true, storageKey: true, createdAt: true },
              orderBy: { createdAt: "asc" },
            },
          },
        },
      },
    });

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    return NextResponse.json({ user }, { headers: { "Cache-Control": "private, no-store" } });
  } catch (error: any) {
    console.error("GET Profile Error:", error);
    return NextResponse.json({ error: "Failed to fetch profile", detail: String(error?.message || error) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session?.userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const payload = body.fullData ? body.fullData : body;
    const { personal } = payload;
    const existingProfile = await prisma.profile.findUnique({ where: { userId: session.userId } });
    const professionalId = existingProfile?.professionalId || "PR-" + Math.floor(100000 + Math.random() * 900000);

    const updatedUser = await prisma.user.update({
      where: { id: session.userId },
      data: {
        profile: {
          upsert: {
            create: { professionalId, fullName: personal?.fullName || "Candidate", headline: personal?.headline || "", location: personal?.location || "", about: personal?.about || "", photoUrl: personal?.photoUrl || "", fullData: payload },
            update: { fullName: personal?.fullName || undefined, headline: personal?.headline || "", location: personal?.location || "", about: personal?.about || "", photoUrl: personal?.photoUrl || "", fullData: payload },
          },
        },
      },
      select: { id: true, email: true, role: true, profile: true },
    });

    return NextResponse.json({ success: true, user: updatedUser }, { status: 200 });
  } catch (error) {
    console.error("Save Profile Error:", error);
    return NextResponse.json({ error: "Failed to save profile" }, { status: 500 });
  }
}
