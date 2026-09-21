
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db/prisma";
import {
  createSessionToken,
  setSessionCookie,
} from "@/lib/auth/session";

export async function POST(req: Request) {
  try {
    const { fullName, email, password, country } =
      await req.json();

    if (!email || !password || !fullName) {
      return NextResponse.json(
        { error: "Name, email, and password are required." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // 1. Check if user already exists
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

    // 2. Generate a new Professional ID
    const randomDigits = Math.floor(
      100000 + Math.random() * 900000
    );
    const professionalId = `PR-${randomDigits}`;

    // 3. Hash the password
    const passwordHash = await bcrypt.hash(password, 12);

    // 4. Create the user and profile
    const newUser = await prisma.user.create({
      data: {
        email: normalizedEmail,
        passwordHash,
        profile: {
          create: {
            fullName,
            location: country || "",
            professionalId,
          },
        },
      },
      include: { profile: true },
    });

    // 5. Create a session
    const token = await createSessionToken({
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role,
    });

    // 6. Set the session cookie
    const response = NextResponse.json(
      {
        message: "Account created successfully",
        user: {
          id: newUser.id,
          email: newUser.email,
          professionalId: newUser.profile?.professionalId,
        },
      },
      { status: 201 }
    );

    setSessionCookie(response, token);

    return response;
  } catch (err) {
    console.error("Registration error:", err);

    return NextResponse.json(
      { error: "Failed to create account. Please try again." },
      { status: 500 }
    );
  }
}