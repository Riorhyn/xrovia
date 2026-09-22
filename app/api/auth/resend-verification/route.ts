import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { randomInt } from "crypto";
import { prisma } from "@/lib/db/prisma";
import { sendVerificationEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Unable to resend verification code." },
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
      user.emailVerificationSentAt &&
      Date.now() - user.emailVerificationSentAt.getTime() < 60 * 1000
    ) {
      return NextResponse.json(
        { error: "Please wait 60 seconds before requesting another code." },
        { status: 429 }
      );
    }

    const verificationCode = String(randomInt(100000, 1000000));

    const verificationCodeHash = await bcrypt.hash(
      verificationCode,
      10
    );

    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    const sentAt = new Date();

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerificationCodeHash: verificationCodeHash,
        emailVerificationExpiresAt: expiresAt,
        emailVerificationSentAt: sentAt,
      },
    });

    try {
      await sendVerificationEmail(
        normalizedEmail,
        verificationCode
      );
    } catch (emailError) {
      console.error("Resend verification email error:", emailError);

      return NextResponse.json(
        { error: "Could not send verification email." },
        { status: 503 }
      );
    }

    return NextResponse.json({
      message: "A new verification code has been sent.",
    });
  } catch (err) {
    console.error("Resend verification error:", err);

    return NextResponse.json(
      { error: "Unable to resend verification code." },
      { status: 500 }
    );
  }
}
