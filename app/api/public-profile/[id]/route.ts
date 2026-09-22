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
      where: {
        professionalId,
      },
    });

    if (!profile || !profile.isPublic) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { profile },
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
