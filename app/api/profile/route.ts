import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth/session";

// 1. Fetch Profile Data from Neon Database on Login
export async function GET() {
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      include: {
        profile: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("GET Profile Error:", error);
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

// 2. Save Profile Data to Neon Database
export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { personal } = body;

    // Generate a random 6-digit Professional ID for new profiles
    const generatedProfessionalId = `PR-${Math.floor(100000 + Math.random() * 900000)}`;

    const updatedUser = await prisma.user.update({
      where: { id: session.userId },
      data: {
        name: personal?.fullName || undefined,
        profile: {
          upsert: {
            create: {
              professionalId: generatedProfessionalId,
              fullName: personal?.fullName || "User",
              headline: personal?.headline || "",
              location: personal?.location || "",
              about: personal?.about || "",
              photoUrl: personal?.photoUrl || "",
            },
            update: {
              fullName: personal?.fullName || undefined,
              headline: personal?.headline || "",
              location: personal?.location || "",
              about: personal?.about || "",
              photoUrl: personal?.photoUrl || "",
            },
          },
        },
      },
      include: {
        profile: true,
      },
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Save Profile Error:", error);
    return NextResponse.json({ error: "Failed to save profile" }, { status: 500 });
  }
}