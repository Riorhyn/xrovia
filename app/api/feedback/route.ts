import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/db/prisma";
import { uploadToGoogleCloudStorage, deleteFromGoogleCloudStorage } from "@/lib/storage/google-cloud";

export const runtime = "nodejs";
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MAX_FILES = 5;
const allowedTypes = new Set(["application/pdf","application/msword","application/vnd.openxmlformats-officedocument.wordprocessingml.document","application/vnd.ms-powerpoint","application/vnd.openxmlformats-officedocument.presentationml.presentation","application/vnd.ms-excel","application/vnd.openxmlformats-officedocument.spreadsheetml.sheet","text/plain","image/jpeg","image/png","image/webp"]);

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const type = String(formData.get("type") || "").trim().toUpperCase();
    const message = String(formData.get("message") || "").trim();
    const email = String(formData.get("email") || "").trim().toLowerCase();
    const pageUrl = String(formData.get("pageUrl") || "").trim();
    const files = formData.getAll("files").filter((value): value is File => value instanceof File && value.size > 0);

    if (!new Set(["PROBLEM","IDEA","FEATURE","FEEDBACK"]).has(type)) return NextResponse.json({ error: "Please choose a feedback type." }, { status: 400 });
    if (message.length < 5 || message.length > 5000) return NextResponse.json({ error: "Please enter between 5 and 5000 characters." }, { status: 400 });
    if (email && (!email.includes("@") || email.length > 254)) return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    if (files.length > MAX_FILES) return NextResponse.json({ error: "You can attach up to 5 files." }, { status: 400 });
    for (const file of files) {
      if (!allowedTypes.has(file.type)) return NextResponse.json({ error: "Unsupported attachment type. Use images, PDF, Word, PowerPoint, Excel or TXT files." }, { status: 400 });
      if (file.size > MAX_FILE_SIZE) return NextResponse.json({ error: "Each attachment must be 10 MB or smaller." }, { status: 400 });
    }

    const uploaded: Array<{ fileName: string; mimeType: string; size: number; storageKey: string }> = [];
    try {
      for (const file of files) {
        const storageKey = "feedback/" + crypto.randomUUID() + "-" + file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        await uploadToGoogleCloudStorage(storageKey, Buffer.from(await file.arrayBuffer()), file.type);
        uploaded.push({ fileName: file.name, mimeType: file.type, size: file.size, storageKey });
      }
      const feedback = await prisma.feedback.create({ data: { type, message, email: email || null, pageUrl: pageUrl || null, attachments: { create: uploaded } }, select: { id: true } });
      return NextResponse.json({ success: true, id: feedback.id });
    } catch (error) {
      await Promise.all(uploaded.map((file) => deleteFromGoogleCloudStorage(file.storageKey).catch(() => undefined)));
      throw error;
    }
  } catch (error) {
    console.error("Feedback submission error:", error);
    return NextResponse.json({ error: "Unable to submit feedback right now." }, { status: 500 });
  }
}