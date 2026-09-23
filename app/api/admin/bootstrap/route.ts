import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function POST(req: Request) {
  try {
    const configuredSecret = process.env.ADMIN_BOOTSTRAP_SECRET;

    if (!configuredSecret) {
      return NextResponse.json(
        { error: "Admin bootstrap is not configured." },
        { status: 503 }
      );
    }

    const body = await req.json();
    const email = String(body.email || "").trim().toLowerCase();
    const secret = String(body.secret || "");

    if (!email || !secret) {
      return NextResponse.json(
        { error: "Email and bootstrap secret are required." },
        { status: 400 }
      );
    }

    if (secret !== configuredSecret) {
      return NextResponse.json({ error: "Invalid bootstrap secret." }, { status: 403 });
    }

    const adminCount = await prisma.user.count({ where: { role: "ADMIN" } });

    if (adminCount > 0) {
      return NextResponse.json(
        { error: "An administrator already exists. Bootstrap is disabled." },
        { status: 409 }
      );
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json(
        { error: "No account was found with that email." },
        { status: 404 }
      );
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { role: "ADMIN" },
    });

    return NextResponse.json({
      message: "Account promoted to ADMIN successfully. You can now use /admin/login.",
    });
  } catch (error) {
    console.error("Admin bootstrap error:", error);
    return NextResponse.json(
      { error: "Internal server error. Please try again." },
      { status: 500 }
    );
  }
}
