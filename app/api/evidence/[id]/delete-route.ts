import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getSession } from "@/lib/auth/session";

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getSession();
    if (!session?.userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const profile = await prisma.profile.findUnique({ where: { userId: session.userId }, select: { id: true } });
    if (!profile) return NextResponse.json({ error: "Profile not found." }, { status: 404 });

    const evidence = await prisma.evidenceFile.findFirst({ where: { id: params.id, profileId: profile.id } });
    if (!evidence) return NextResponse.json({ error: "Evidence not found." }, { status: 404 });

    await prisma.evidenceFile.delete({ where: { id: evidence.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Evidence delete error:", error);
    return NextResponse.json({ error: "Unable to delete evidence." }, { status: 500 });
  }
}
