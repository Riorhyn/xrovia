import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/auth/session";

export async function POST(req: Request) {
  try {
    const { fullName, email, password, country } = await req.json();

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

    // Throw error if email is already taken
    if (existingUser) {
      return NextResponse.json(
        {
          error: "An account with this email already exists. Please log in.",
          isAlreadyRegistered: true,
        },
        { status: 409 }
      );
    }

    // 2. Generate new Professional ID
    const randomDigits = Math.floor(100000 + Math.random() * 900000);
    const professionalId = `PR-${randomDigits}`;

    // 3. Create new user record
    const newUser = await prisma.user.create({
      data: {
        email: normalizedEmail,
        password, // Ensure password hashing (e.g. bcrypt) in production
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

    // 4. Create authentication session for new user
    await createSession(newUser.id);

    return NextResponse.json(
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
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to create account. Please try again." },
      { status: 500 }
    );
  }
}