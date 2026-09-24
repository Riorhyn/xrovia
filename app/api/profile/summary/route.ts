import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    type Row = { fullName: string; professionalId: string; experience: number; education: number; skills: number; projects: number; completion: number };
    const rows = await prisma.$queryRaw<Row[]>`
      SELECT p."fullName" AS "fullName", p."professionalId" AS "professionalId",
      COALESCE(jsonb_array_length(CASE WHEN jsonb_typeof(p."fullData"->'experiences') = 'array' THEN p."fullData"->'experiences' ELSE '[]'::jsonb END),0)::int AS "experience",
      COALESCE(jsonb_array_length(CASE WHEN jsonb_typeof(p."fullData"->'educations') = 'array' THEN p."fullData"->'educations' ELSE '[]'::jsonb END),0)::int AS "education",
      COALESCE(jsonb_array_length(CASE WHEN jsonb_typeof(p."fullData"->'skills') = 'array' THEN p."fullData"->'skills' ELSE '[]'::jsonb END),0)::int AS "skills",
      COALESCE(jsonb_array_length(CASE WHEN jsonb_typeof(p."fullData"->'projects') = 'array' THEN p."fullData"->'projects' ELSE '[]'::jsonb END),0)::int AS "projects",
      (
        CASE WHEN COALESCE(p."fullName",'') <> '' AND COALESCE(p."headline",'') <> '' THEN 1 ELSE 0 END +
        CASE WHEN COALESCE(p."photoUrl",'') <> '' THEN 1 ELSE 0 END +
        CASE WHEN COALESCE(p."about",'') <> '' THEN 1 ELSE 0 END +
        CASE WHEN jsonb_array_length(CASE WHEN jsonb_typeof(p."fullData"->'experiences')='array' THEN p."fullData"->'experiences' ELSE '[]'::jsonb END)>0 THEN 1 ELSE 0 END +
        CASE WHEN jsonb_array_length(CASE WHEN jsonb_typeof(p."fullData"->'educations')='array' THEN p."fullData"->'educations' ELSE '[]'::jsonb END)>0 THEN 1 ELSE 0 END +
        CASE WHEN jsonb_array_length(CASE WHEN jsonb_typeof(p."fullData"->'skills')='array' THEN p."fullData"->'skills' ELSE '[]'::jsonb END)>0 THEN 1 ELSE 0 END +
        CASE WHEN jsonb_array_length(CASE WHEN jsonb_typeof(p."fullData"->'projects')='array' THEN p."fullData"->'projects' ELSE '[]'::jsonb END)>0 THEN 1 ELSE 0 END +
        CASE WHEN jsonb_array_length(CASE WHEN jsonb_typeof(p."fullData"->'achievements')='array' THEN p."fullData"->'achievements' ELSE '[]'::jsonb END)>0 THEN 1 ELSE 0 END +
        CASE WHEN jsonb_array_length(CASE WHEN jsonb_typeof(p."fullData"->'publications')='array' THEN p."fullData"->'publications' ELSE '[]'::jsonb END)>0 THEN 1 ELSE 0 END +
        CASE WHEN jsonb_array_length(CASE WHEN jsonb_typeof(p."fullData"->'hobbies')='array' THEN p."fullData"->'hobbies' ELSE '[]'::jsonb END)>0 OR EXISTS (SELECT 1 FROM jsonb_each(CASE WHEN jsonb_typeof(p."fullData"->'socials')='object' THEN p."fullData"->'socials' ELSE '{}'::jsonb END) s WHERE COALESCE(s.value #>> '{}','') <> '') THEN 1 ELSE 0 END
      )::int AS "completion"
      FROM "Profile" p WHERE p."userId" = ${session.userId} LIMIT 1
    `;
    if (!rows[0]) return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    const row = rows[0];
    return NextResponse.json({ profile: { fullName: row.fullName, professionalId: row.professionalId }, counts: { experience: row.experience, education: row.education, skills: row.skills, projects: row.projects }, completion: Math.round((row.completion / 10) * 100) }, { headers: { "Cache-Control": "private, max-age=30, stale-while-revalidate=60" } });
  } catch (error) {
    console.error("Profile summary error:", error);
    return NextResponse.json({ error: "Failed to load profile summary" }, { status: 500 });
  }
}