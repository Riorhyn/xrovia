import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";

export async function GET(request: Request) {
  const session = await getSession();
  if (!session?.userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const query = new URL(request.url).searchParams.get("q")?.trim() || "";
  if (query.length < 2) return NextResponse.json({ users: [] });

  const users = await prisma.user.findMany({
    where: {
      id: { not: session.userId },
      profile: {
        OR: [
          { fullName: { contains: query, mode: "insensitive" } },
          { professionalId: { contains: query, mode: "insensitive" } },
        ],
      },
    },
    select: { id: true, profile: { select: { fullName: true, professionalId: true, headline: true, photoUrl: true } } },
    take: 10,
  });

  return NextResponse.json({ users });
}
