import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";

async function canManage(projectId: string, userId: string) {
  return prisma.collaborationMember.findFirst({
    where: { projectId, userId, status: "CONFIRMED", role: { in: ["Team Leader", "Co-Leader"] } },
  });
}

async function isConfirmedMember(projectId: string, userId: string) {
  return prisma.collaborationMember.findFirst({ where: { projectId, userId, status: "CONFIRMED" } });
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

  const manager = await canManage(projectId, session.userId);
  if (type === "JOIN_PROJECT" && project.members.some((m) => m.userId === session.userId && ["PENDING", "CONFIRMED"].includes(m.status))) {
    return NextResponse.json({ error: "You are already connected to this project." }, { status: 400 });
  }
  if (type === "ROLE_PROPOSAL" && !manager) {
    return NextResponse.json({ error: "Only the project leader can propose a responsibility for another member." }, { status: 403 });
  }
  if (type === "ADVISOR_ASSOCIATION" && !manager) {
    return NextResponse.json({ error: "Only the project leader can propose a faculty advisor or mentor association." }, { status: 403 });
  }

  const targetUserId = body.targetUserId ? String(body.targetUserId) : null;
  if ((type === "ROLE_PROPOSAL" || type === "ADVISOR_ASSOCIATION") && !targetUserId && !body.proposedEmail) {
    return NextResponse.json({ error: "Select an existing Professional ID or provide the person's details." }, { status: 400 });
  }

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

  if (type === "ADVISOR_ASSOCIATION") {
    const approvalUserIds = Array.from(new Set([
      ...project.members.filter((m) => m.status === "CONFIRMED").map((m) => m.userId),
      ...(targetUserId ? [targetUserId] : []),
    ]));
    if (approvalUserIds.length) {
      await prisma.collaborationRequestApproval.createMany({
        data: approvalUserIds.map((userId) => ({ requestId: created.id, userId })),
        skipDuplicates: true,
      });
    }
  }

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
        { approvals: { some: { userId: session.userId } } },
        { project: { members: { some: { userId: session.userId, status: "CONFIRMED", role: { in: ["Team Leader", "Co-Leader"] } } } } },
      ],
    },
    include: {
      project: { select: { id: true, name: true, status: true } },
      requester: { include: { profile: { select: { fullName: true, professionalId: true } } } },
      targetUser: { include: { profile: { select: { fullName: true, professionalId: true } } } },
      approvals: { include: { user: { include: { profile: { select: { fullName: true, professionalId: true } } } } } },
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
    include: { project: true, approvals: true },
  });
  if (!item || item.status !== "PENDING") return NextResponse.json({ error: "Request not found or already completed." }, { status: 404 });

  if (item.type === "ADVISOR_ASSOCIATION") {
    const approval = item.approvals.find((a) => a.userId === session.userId);
    if (!approval) return NextResponse.json({ error: "Only listed project members and the proposed advisor can review this association." }, { status: 403 });

    await prisma.collaborationRequestApproval.update({
      where: { id: approval.id },
      data: { status: decision === "APPROVE" ? "APPROVED" : "REJECTED", reviewedAt: new Date() },
    });

    if (decision === "REJECT") {
      const updated = await prisma.collaborationRequest.update({ where: { id: requestId }, data: { status: "REJECTED", reviewedById: session.userId, reviewedAt: new Date() } });
      return NextResponse.json({ request: updated, message: "Association rejected." });
    }

    const approvals = await prisma.collaborationRequestApproval.findMany({ where: { requestId } });
    const allApproved = approvals.length > 0 && approvals.every((a) => a.status === "APPROVED");
    if (!allApproved) {
      return NextResponse.json({ message: "Approval recorded. The association remains pending until every listed participant approves.", pendingApprovals: approvals.filter((a) => a.status === "PENDING").length });
    }

    const userId = item.targetUserId;
    if (userId) {
      await prisma.collaborationMember.upsert({
        where: { projectId_userId: { projectId: item.projectId, userId } },
        create: { projectId: item.projectId, userId, role: item.proposedRole || "Faculty Advisor", responsibility: item.proposedResponsibility || null, status: "CONFIRMED", confirmedAt: new Date() },
        update: { role: item.proposedRole || "Faculty Advisor", responsibility: item.proposedResponsibility || null, status: "CONFIRMED", confirmedAt: new Date() },
      });
    }

    const updated = await prisma.collaborationRequest.update({ where: { id: requestId }, data: { status: "APPROVED", reviewedById: session.userId, reviewedAt: new Date() } });
    await prisma.collaborationProject.update({ where: { id: item.projectId }, data: { status: "TEAM_CONFIRMED" } });
    return NextResponse.json({ request: updated, message: "Association confirmed by all required participants." });
  }

  const manager = await canManage(item.projectId, session.userId);
  if (!manager) return NextResponse.json({ error: "Only the project leader can review this request." }, { status: 403 });

  if (decision === "REJECT") {
    const updated = await prisma.collaborationRequest.update({ where: { id: requestId }, data: { status: "REJECTED", reviewedById: session.userId, reviewedAt: new Date() } });
    return NextResponse.json({ request: updated });
  }

  if (item.type === "JOIN_PROJECT" || item.type === "ROLE_PROPOSAL") {
    const userId = item.targetUserId || item.requesterId;
    await prisma.collaborationMember.upsert({
      where: { projectId_userId: { projectId: item.projectId, userId } },
      create: { projectId: item.projectId, userId, role: item.proposedRole || "Member", responsibility: item.proposedResponsibility || null, status: "CONFIRMED", confirmedAt: new Date() },
      update: { role: item.proposedRole || "Member", responsibility: item.proposedResponsibility || null, status: "CONFIRMED", confirmedAt: new Date() },
    });
    await prisma.collaborationProject.update({ where: { id: item.projectId }, data: { status: "TEAM_CONFIRMED" } });
  }

  const updated = await prisma.collaborationRequest.update({ where: { id: requestId }, data: { status: "APPROVED", reviewedById: session.userId, reviewedAt: new Date() } });
  return NextResponse.json({ request: updated });
}
