import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { ReportSchema } from "@/lib/validation/profile-schemas";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    const body = await req.json();
    const parsed = ReportSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid report payload" }, { status: 400 });
    }

    const { profileId, reason, details } = parsed.data;

    const report = await prisma.report.create({
      data: {
        profileId,
        reporterId: session ? session.userId : null,
        reason,
        details: details || "",
      },
    });

    return NextResponse.json({ success: true, reportId: report.id });
  } catch (err) {
    return NextResponse.json({ error: "Unable to submit report" }, { status: 500 });
  }
}