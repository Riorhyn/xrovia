import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const evidence = await prisma.evidenceFile.findUnique({
      where: { id: params.id },
      include: { profile: { select: { isPublic: true } } },
    });

    if (!evidence || !evidence.profile.isPublic) {
      return NextResponse.json({ error: "Evidence not found." }, { status: 404 });
    }

    return new NextResponse(evidence.data, {
      status: 200,
      headers: {
        "Content-Type": evidence.mimeType,
        "Content-Length": String(evidence.size),
        "Content-Disposition": `inline; filename="${encodeURIComponent(evidence.fileName)}"`,
        "Cache-Control": "public, max-age=3600",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("Evidence fetch error:", error);
    return NextResponse.json({ error: "Unable to load evidence." }, { status: 500 });
  }
}
