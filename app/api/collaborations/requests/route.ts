import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";

async function canManage(projectId: string, userId: string) {
  return prisma.collaborationMember.findFirst({
    where: { projectId, userId, status: "CONFIRMED", role: { in: ["Team Leader", "Co-Leader"] } },
  });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session?.userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const projectId = String(body.projectId || "");
  const type = String(body.type || "JOIN_PROJECT");
  if (!projectId) return NextResponse.json({ error: "Project is required." }, { status: 400 });

  const project = await prisma.collaborationProject.findUnique({ where: { id: projectId }, include: { members: true } });
  if (!project) return NextResponse.json({ error: "Project not found." }, { status: 404 });

  if (type === "JOIN_PROJECT") {
    if (project.members.some((m) => m.userId === session.userId && ["PENDING", "CONFIRMED"].includes(m.status))) {
      return NextResponse.json({ error: "You are already connected to this project." }, { status: 400 });
    }
  }

  if (type === "ROLE_PROPOSAL" || type === "ADVISOR_ASSOCIATION" || type === "LEADERSHIP_PROPOSAL") {
    const manager = await canManage(projectId, session.userId);
    if (!manager && type !== "LEADERSHIP_PROPOSAL") {
      return NextResponse.json({ error: "Only the project leader can approve or sponsor this relationship." }, { status: 403 });
    }
  }

  const targetUserId = body.targetUserId ? String(body.targetUserId) : null;
  if (targetUserId === session.userId) return NextResponse.json({ error: "You cannot target your own account." }, { status: 400 });

  const created = await prisma.collaborationRequest.create({
    data: {
      projectId,
      requesterId: session.userId,
      targetUserId,
      type: type as any,
      proposedRole: body.proposedRole ? String(body.proposedRole).trim() : null,
      proposedResponsibility: body.proposedResponsibility ? String(body.proposedResponsibility).trim() : null,
      proposedName: body.proposedName ? String(body.proposedName).trim() : null,
      proposedEmail: body.proposedEmail ? String(body.proposedEmail).trim() : null,
      note: body.note ? String(body.note).trim() : null,
    },
  });

  return NextResponse.json({ request: created }, { status: 201 });
}

export async function GET() {
  const session = await getSession();
  if (!session?.userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const requests = await prisma.collaborationRequest.findMany({
    where: {
      OR: [
        { requesterId: session.userId },
        { targetUserId: session.userId },
        { project: { members: { some: { userId: session.userId, status: "CONFIRMED", role: { in: ["Team Leader", "Co-Leader"] } } } } },
      ],
    },
    include: {
      project: { select: { id: true, name: true, status: true } },
      requester: { include: { profile: { select: { fullName: true, professionalId: true } } } },
      targetUser: { include: { profile: { select: { fullName: true, professionalId: true } } } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ requests });
}

export async function PATCH(request: Request) {
  const session = await getSession();
  if (!session?.userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const requestId = String(body.requestId || "");
  const decision = String(body.decision || "");
  if (!requestId || !["APPROVE", "REJECT"].includes(decision)) {
    return NextResponse.json({ error: "Invalid request decision." }, { status: 400 });
  }

  const item = await prisma.collaborationRequest.findUnique({
    where: { id: requestId },
    include: { project: true },
  });
  if (!item || item.status !== "PENDING") return NextResponse.json({ error: "Request not found or already reviewed." }, { status: 404 });

  const manager = await canManage(item.projectId, session.userId);
  const targetCanApprove = item.targetUserId === session.userId && item.type === "ADVISOR_ASSOCIATION";
  if (!manager && !targetCanApprove) return NextResponse.json({ error: "You are not authorized to review this request." }, { status: 403 });

  if (decision === "REJECT") {
    const updated = await prisma.collaborationRequest.update({ where: { id: requestId }, data: { status: "REJECTED", reviewedById: session.userId, reviewedAt: new Date() } });
    return NextResponse.json({ request: updated });
  }

  if (item.type === "JOIN_PROJECT" || item.type === "ROLE_PROPOSAL" || item.type === "ADVISOR_ASSOCIATION") {
    const role = item.proposedRole || (item.type === "ADVISOR_ASSOCIATION" ? "Faculty Advisor" : "Member");
    const responsibility = item.proposedResponsibility || null;
    const userId = item.targetUserId || item.requesterId;

    await prisma.collaborationMember.upsert({
      where: { projectId_userId: { projectId: item.projectId, userId } },
      create: { projectId: item.projectId, userId, role, responsibility, status: "CONFIRMED", confirmedAt: new Date() },
      update: { role, responsibility, status: "CONFIRMED", confirmedAt: new Date() },
    });
    await prisma.collaborationProject.update({ where: { id: item.projectId }, data: { status: "TEAM_CONFIRMED" } });
  }

  const updated = await prisma.collaborationRequest.update({ where: { id: requestId }, data: { status: "APPROVED", reviewedById: session.userId, reviewedAt: new Date() } });
  return NextResponse.json({ request: updated });
}
