import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const profile = await prisma.profile.findUnique({
      where: { userId: session.userId },
      select: {
        fullName: true,
        headline: true,
        location: true,
        about: true,
        photoUrl: true,
        professionalId: true,
        isPublic: true,
        verificationStatus: true,
        fullData: true,
        evidenceFiles: { select: { id: true } },
      },
    });

    if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

    const data: any = profile.fullData || {};
    const experiences = Array.isArray(data.experiences) ? data.experiences : [];
    const educations = Array.isArray(data.educations) ? data.educations : [];
    const skills = Array.isArray(data.skills) ? data.skills : [];
    const projects = Array.isArray(data.projects) ? data.projects : [];
    const achievements = Array.isArray(data.achievements) ? data.achievements : [];
    const connectedPlatforms = Array.isArray(data.connectedPlatforms) ? data.connectedPlatforms : [];
    const verificationRequests = Array.isArray(data.verificationRequests) ? data.verificationRequests : [];

    const checks = [
      { key: "identity", label: "Complete your identity", points: 12, done: Boolean(profile.fullName && profile.headline && profile.location) },
      { key: "summary", label: "Write a professional summary", points: 10, done: Boolean(profile.about && profile.about.trim().length >= 80) },
      { key: "education", label: "Add education", points: 12, done: educations.length > 0 },
      { key: "experience", label: "Add experience or internships", points: 12, done: experiences.length > 0 },
      { key: "skills", label: "Add at least 5 skills", points: 12, done: skills.length >= 5 },
      { key: "projects", label: "Showcase projects", points: 12, done: projects.length > 0 },
      { key: "proof", label: "Attach supporting evidence", points: 10, done: profile.evidenceFiles.length > 0 },
      { key: "verification", label: "Verify a record", points: 10, done: verificationRequests.some((r: any) => r.status === "VERIFIED") },
      { key: "presence", label: "Connect professional profiles", points: 5, done: connectedPlatforms.some((p: any) => Boolean(p?.url)) },
      { key: "achievements", label: "Add achievements or certifications", points: 5, done: achievements.length > 0 },
    ];

    const score = checks.reduce((sum, item) => sum + (item.done ? item.points : 0), 0);
    const actions = checks.filter((item) => !item.done).slice(0, 5);

    let level = "Getting started";
    if (score >= 85) level = "Strong profile";
    else if (score >= 65) level = "Good foundation";
    else if (score >= 40) level = "Building momentum";

    return NextResponse.json({
      profile: { professionalId: profile.professionalId, isPublic: profile.isPublic, verificationStatus: profile.verificationStatus, level },
      score,
      checks,
      actions,
      counts: {
        verified: verificationRequests.filter((r: any) => r.status === "VERIFIED").length,
        evidence: profile.evidenceFiles.length,
      },
    }, { headers: { "Cache-Control": "private, no-store" } });
  } catch (error) {
    console.error("Profile intelligence error:", error);
    return NextResponse.json({ error: "Failed to load profile intelligence" }, { status: 500 });
  }
}
