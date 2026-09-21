import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { SkillSchema } from "@/lib/validation/profile-schemas";

export async function POST(req: Request) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const parsed = SkillSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid skill name" },
        { status: 400 }
      );
    }

    const profile = await prisma.profile.findUnique({
      where: { userId: session.userId },
    });

    if (!profile) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      );
    }

    const skill = await prisma.skill.create({
      data: {
        name: parsed.data.name,
        profileId: profile.id,
      },
    });

    return NextResponse.json(skill, { status: 201 });
  } catch (error) {
    console.error("Add skill error:", error);

    return NextResponse.json(
      { error: "Unable to add skill" },
      { status: 500 }
    );
  }
}