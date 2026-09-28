import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const professionalId = decodeURIComponent(id).toUpperCase();

    const profile = await prisma.profile.findUnique({
      where: { professionalId },
    });

    if (!profile || !profile.isPublic) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      );
    }

    const collaborationProjects = await prisma.collaborationProject.findMany({
      where: {
        status: { in: ["SELF_REPORTED", "TEAM_CONFIRMED", "ORGANIZATION_VERIFIED"] },
        members: { some: { userId: profile.userId, status: "CONFIRMED" } },
      },
      include: {
        members: {
          where: { status: "CONFIRMED" },
          include: { user: { include: { profile: { select: { fullName: true, professionalId: true, isPublic: true } } } } },
          orderBy: { createdAt: "asc" },
        },
      },
      orderBy: { updatedAt: "desc" },
      take: 20,
    });

    const publicCollaborations = collaborationProjects.map((project) => ({
      ...project,
      members: project.members.filter((member) => member.user.profile?.isPublic),
    }));

    return NextResponse.json(
      { profile, collaborationProjects: publicCollaborations },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error("Public profile error:", error);

    return NextResponse.json(
      { error: "Failed to load public profile" },
      { status: 500 }
    );
  }
}
