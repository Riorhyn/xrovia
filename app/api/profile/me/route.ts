import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await prisma.profile.findUnique({
    where: { userId: session.userId },
    include: {
      education: { orderBy: { startYear: "desc" } },
      experience: { orderBy: { startDate: "desc" } },
      skills: true,
      projects: true,
      certifications: true,
      achievements: true,
      socialLinks: true,
    },
  });

  if (!profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  return NextResponse.json(profile);
}

export async function PUT(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { fullName, headline, location, about, photoUrl, isPublic } = body;

  const updated = await prisma.profile.update({
    where: { userId: session.userId },
    data: {
      fullName,
      headline,
      location,
      about,
      photoUrl,
      ...(isPublic !== undefined ? { isPublic } : {}),
    },
  });

  return NextResponse.json(updated);
}