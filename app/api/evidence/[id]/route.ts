import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getSession } from "@/lib/auth/session";
import { deleteFromGoogleCloudStorage, downloadFromGoogleCloudStorage } from "@/lib/storage/google-cloud";

export const runtime = "nodejs";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getSession();
    if (!session?.userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const evidence = await prisma.evidenceFile.findFirst({
      where: { id: params.id, profile: { userId: session.userId } },
      select: { id: true, fileName: true, mimeType: true, size: true, data: true, storageKey: true },
    });
    if (!evidence) return NextResponse.json({ error: "Evidence not found." }, { status: 404 });

    if (evidence.storageKey) {
      const response = await downloadFromGoogleCloudStorage(evidence.storageKey);
      return new NextResponse(response.body, { status: 200, headers: { "Content-Type": evidence.mimeType, "Content-Length": String(evidence.size), "Content-Disposition": 'inline; filename="' + encodeURIComponent(evidence.fileName) + '"', "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff" } });
    }

    if (!evidence.data) return NextResponse.json({ error: "Evidence file is unavailable." }, { status: 404 });
    return new NextResponse(new Uint8Array(evidence.data), { status: 200, headers: { "Content-Type": evidence.mimeType, "Content-Length": String(evidence.size), "Content-Disposition": 'inline; filename="' + encodeURIComponent(evidence.fileName) + '"', "Cache-Control": "public, max-age=3600", "X-Content-Type-Options": "nosniff" } });
  } catch (error) {
    console.error("Evidence fetch error:", error);
    return NextResponse.json({ error: "Unable to load evidence." }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getSession();
    if (!session?.userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const profile = await prisma.profile.findUnique({ where: { userId: session.userId }, select: { id: true } });
    if (!profile) return NextResponse.json({ error: "Profile not found." }, { status: 404 });
    const evidence = await prisma.evidenceFile.findFirst({ where: { id: params.id, profileId: profile.id } });
    if (!evidence) return NextResponse.json({ error: "Evidence not found." }, { status: 404 });
    if (evidence.storageKey) await deleteFromGoogleCloudStorage(evidence.storageKey);
    await prisma.evidenceFile.delete({ where: { id: evidence.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Evidence delete error:", error);
    return NextResponse.json({ error: "Unable to delete evidence." }, { status: 500 });
  }
}