import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const skill = await prisma.skill.findFirst({
      where: {
        id: params.id,
        profile: {
          userId: session.userId,
        },
      },
    });

    if (!skill) {
      return NextResponse.json(
        { error: "Skill not found" },
        { status: 404 }
      );
    }

    await prisma.skill.delete({
      where: { id: skill.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete skill error:", error);

    return NextResponse.json(
      { error: "Unable to delete skill" },
      { status: 500 }
    );
  }
}