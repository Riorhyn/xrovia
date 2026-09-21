import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth/session";

// 1. Fetch Profile Data from Neon Database
export async function GET() {
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let user = await prisma.user.findUnique({
      where: { id: session.userId },
      include: { profile: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // If user doesn't have a profile record yet, create a default one
    if (!user.profile) {
      const generatedProfessionalId = `PR-${Math.floor(100000 + Math.random() * 900000)}`;
      const newProfile = await prisma.profile.create({
        data: {
          userId: user.id,
          professionalId: generatedProfessionalId,
          fullName: user.email.split("@")[0], // Default name from email
          headline: "",
          location: "",
          about: "",
          photoUrl: "",
          fullData: {},
        },
      });
      user = { ...user, profile: newProfile };
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
    const { personal, ...restData } = body;

    const generatedProfessionalId = `PR-${Math.floor(100000 + Math.random() * 900000)}`;

    const updatedUser = await prisma.user.update({
      where: { id: session.userId },
      data: {
        profile: {
          upsert: {
            create: {
              professionalId: generatedProfessionalId,
              fullName: personal?.fullName || "Candidate",
              headline: personal?.headline || "",
              location: personal?.location || "",
              about: personal?.about || "",
              photoUrl: personal?.photoUrl || "",
              fullData: restData,
            },
            update: {
              fullName: personal?.fullName || undefined,
              headline: personal?.headline || "",
              location: personal?.location || "",
              about: personal?.about || "",
              photoUrl: personal?.photoUrl || "",
              fullData: restData,
            },
          },
        },
      },
      include: { profile: true },
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Save Profile Error:", error);
    return NextResponse.json({ error: "Failed to save profile" }, { status: 500 });
  }
}