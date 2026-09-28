import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";

export async function GET() {
  const session = await getSession();
  if (!session?.userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const projects = await prisma.collaborationProject.findMany({
    where: { OR: [{ createdById: session.userId }, { members: { some: { userId: session.userId, status: { in: ["PENDING", "CONFIRMED"] } } } }] },
    include: {
      createdBy: { include: { profile: { select: { fullName: true, professionalId: true, photoUrl: true } } } },
      members: { include: { user: { include: { profile: { select: { fullName: true, professionalId: true, photoUrl: true } } } } }, orderBy: { createdAt: "asc" } },
    },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json({ projects });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session?.userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const name = String(body.name || "").trim();
  if (!name) return NextResponse.json({ error: "Project name is required." }, { status: 400 });

  const project = await prisma.collaborationProject.create({
    data: {
      name,
      description: body.description ? String(body.description).trim() : null,
      startDate: body.startDate ? new Date(body.startDate) : null,
      endDate: body.endDate ? new Date(body.endDate) : null,
      projectUrl: body.projectUrl ? String(body.projectUrl).trim() : null,
      createdById: session.userId,
      members: {
        create: {
          userId: session.userId,
          role: "Team Leader",
          responsibility: body.responsibility ? String(body.responsibility).trim() : "Project leadership and coordination",
          status: "CONFIRMED",
          confirmedAt: new Date(),
        },
      },
    },
    include: { members: true },
  });

  return NextResponse.json({ project }, { status: 201 });
}
