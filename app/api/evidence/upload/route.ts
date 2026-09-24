import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/db/prisma";
import { getSession } from "@/lib/auth/session";
import { uploadToGoogleCloudStorage, deleteFromGoogleCloudStorage } from "@/lib/storage/google-cloud";

export const runtime = "nodejs";
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MAX_FILES_PER_ITEM = 10;
const allowedTypes = new Set(["application/pdf","application/msword","application/vnd.openxmlformats-officedocument.wordprocessingml.document","application/vnd.ms-powerpoint","application/vnd.openxmlformats-officedocument.presentationml.presentation","application/vnd.ms-excel","application/vnd.openxmlformats-officedocument.spreadsheetml.sheet","text/plain","image/jpeg","image/png","image/webp","image/gif"]);

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session?.userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const formData = await req.formData();
    const file = formData.get("file");
    const itemType = String(formData.get("itemType") || "").trim().toUpperCase();
    const itemId = String(formData.get("itemId") || "").trim();
    if (!(file instanceof File) || !itemType || !itemId) return NextResponse.json({ error: "File, record type and record ID are required." }, { status: 400 });
    if (!allowedTypes.has(file.type)) return NextResponse.json({ error: "Unsupported file type. Use JPG, PNG, WEBP, GIF, PDF, Word, PowerPoint, Excel or TXT." }, { status: 400 });
    if (file.size <= 0 || file.size > MAX_FILE_SIZE) return NextResponse.json({ error: "Each evidence file must be between 1 byte and 5 MB." }, { status: 400 });

    const profile = await prisma.profile.findUnique({ where: { userId: session.userId }, select: { id: true } });
    if (!profile) return NextResponse.json({ error: "Profile not found." }, { status: 404 });
    const count = await prisma.evidenceFile.count({ where: { profileId: profile.id, itemType, itemId } });
    if (count >= MAX_FILES_PER_ITEM) return NextResponse.json({ error: "You can attach up to 10 evidence files to one record." }, { status: 400 });

    const data = Buffer.from(await file.arrayBuffer());
    const storageKey = "evidence/" + profile.id + "/" + crypto.randomUUID() + "-" + file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    await uploadToGoogleCloudStorage(storageKey, data, file.type);

    try {
      const evidence = await prisma.evidenceFile.create({
        data: { profileId: profile.id, itemType, itemId, fileName: file.name, mimeType: file.type, size: file.size, storageKey },
        select: { id: true, itemType: true, itemId: true, fileName: true, mimeType: true, size: true, createdAt: true },
      });
      return NextResponse.json({ success: true, evidence: { ...evidence, url: "/api/evidence/" + evidence.id } });
    } catch (dbError) {
      await deleteFromGoogleCloudStorage(storageKey).catch(() => undefined);
      throw dbError;
    }
  } catch (error) {
    console.error("Evidence upload error:", error);
    return NextResponse.json({ error: "Unable to upload evidence." }, { status: 500 });
  }
}