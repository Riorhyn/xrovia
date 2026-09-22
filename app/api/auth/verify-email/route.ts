import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db/prisma";
import {
  createSessionToken,
  setSessionCookie,
} from "@/lib/auth/session";

export async function POST(req: Request) {
  try {
    const { email, code } = await req.json();

    if (!email || !code) {
      return NextResponse.json(
        { error: "Email and verification code are required." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedCode = String(code).trim();

    if (!/^\d{6}$/.test(normalizedCode)) {
      return NextResponse.json(
        { error: "Enter the 6-digit verification code." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      include: { profile: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid verification request." },
        { status: 400 }
      );
    }

    if (user.emailVerifiedAt) {
      return NextResponse.json(
        { error: "Email is already verified." },
        { status: 400 }
      );
    }

    if (
      !user.emailVerificationCodeHash ||
      !user.emailVerificationExpiresAt
    ) {
      return NextResponse.json(
        { error: "No active verification code. Please request a new one." },
        { status: 400 }
      );
    }

    if (new Date() > user.emailVerificationExpiresAt) {
      return NextResponse.json(
        { error: "Verification code expired. Please request a new one." },
        { status: 400 }
      );
    }

    const validCode = await bcrypt.compare(
      normalizedCode,
      user.emailVerificationCodeHash
    );

    if (!validCode) {
      return NextResponse.json(
        { error: "Invalid verification code." },
        { status: 400 }
      );
    }

    const verifiedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerifiedAt: new Date(),
        emailVerificationCodeHash: null,
        emailVerificationExpiresAt: null,
        emailVerificationSentAt: null,
      },
      include: { profile: true },
    });

    const token = await createSessionToken({
      userId: verifiedUser.id,
      email: verifiedUser.email,
      role: verifiedUser.role,
    });

    const response = NextResponse.json(
      {
        message: "Email verified successfully.",
        user: {
          id: verifiedUser.id,
          email: verifiedUser.email,
          professionalId:
            verifiedUser.profile?.professionalId,
        },
      },
      { status: 200 }
    );

    setSessionCookie(response, token);

    return response;
  } catch (err) {
    console.error("Email verification error:", err);

    return NextResponse.json(
      { error: "Verification failed. Please try again." },
      { status: 500 }
    );
  }
}
