import { NextResponse } from "next/server";
import { createHash } from "crypto";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db/prisma";

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json();

    if (!token || typeof token !== "string" || !password || typeof password !== "string") {
      return NextResponse.json({ error: "Reset token and password are required." }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
    }

    const tokenHash = createHash("sha256").update(token).digest("hex");
    const user = await prisma.user.findFirst({
      where: {
        passwordResetTokenHash: tokenHash,
        passwordResetExpiresAt: { gt: new Date() },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "This password reset link is invalid or expired." }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        passwordResetTokenHash: null,
        passwordResetExpiresAt: null,
      },
    });

    return NextResponse.json({ message: "Password changed successfully." });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json({ error: "Unable to reset password." }, { status: 500 });
  }
}
