import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { randomInt } from "crypto";
import { prisma } from "@/lib/db/prisma";
import { sendVerificationEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const { fullName, email, password, country } = await req.json();

    if (!email || !password || !fullName || !country) {
      return NextResponse.json(
        { error: "Name, email, password, and country are required." },
        { status: 400 }
      );
    }

    if (typeof password !== "string" || password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          error:
            "An account with this email already exists. Please log in.",
          isAlreadyRegistered: true,
        },
        { status: 409 }
      );
    }

    const randomDigits = randomInt(100000, 1000000);
    const professionalId = `PR-${randomDigits}`;

    const passwordHash = await bcrypt.hash(password, 12);

    const verificationCode = String(randomInt(100000, 1000000));
    const verificationCodeHash = await bcrypt.hash(
      verificationCode,
      10
    );

    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    const sentAt = new Date();

    const newUser = await prisma.user.create({
      data: {
        email: normalizedEmail,
        passwordHash,
        emailVerificationCodeHash: verificationCodeHash,
        emailVerificationExpiresAt: expiresAt,
        emailVerificationSentAt: sentAt,
        profile: {
          create: {
            fullName: fullName.trim(),
            location: country.trim(),
            professionalId,
            fullData: {},
          },
        },
      },
      include: { profile: true },
    });

    try {
      await sendVerificationEmail(
        normalizedEmail,
        verificationCode
      );
    } catch (emailError) {
      await prisma.user.delete({
        where: { id: newUser.id },
      });

      console.error("Verification email error:", emailError);

      const details =
        emailError instanceof Error
          ? emailError.message
          : String(emailError);

      return NextResponse.json(
        {
          error: "We could not send the verification email.",
          details,
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      {
        message: "Verification code sent.",
        email: normalizedEmail,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Registration error:", err);

    return NextResponse.json(
      {
        error: "Failed to create account. Please try again.",
      },
      { status: 500 }
    );
  }
}
