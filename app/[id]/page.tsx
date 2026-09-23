"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Briefcase,
  GraduationCap,
  MapPin,
  ShieldAlert,
  ShieldCheck,
  FolderGit2,
  Award,
  ExternalLink,
  Link2,
} from "lucide-react";

// Format external URLs so they open outside Next.js router
const formatExternalUrl = (url?: string) => {
  if (!url) return "#";

  const trimmed = url.trim();

  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://")
  ) {
    return trimmed;
  }

  return `https://${trimmed}`;
};

export default function PublicProfilePage() {
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [profile, setProfile] = useState<any>({
    personal: {
      fullName: "",
      headline: "",
      location: "",
      about: "",
      photoUrl: "",
    },
    skills: [],
    hobbies: [],
    languages: [],
    experiences: [],
    educations: [],
    projects: [],
    achievements: [],
    publications: [],
    connectedPlatforms: [],
    verificationRequests: [],
    evidenceFiles: [],
    professionalId: "",
  });

  const loadData = async () => {
    try {
      setIsLoading(true);
      setNotFound(false);

      const id = window.location.pathname
        .split("/")
        .filter(Boolean)
        .pop();

      if (!id) {
        setNotFound(true);
        return;
      }

      const res = await fetch(
        `/api/public-profile/${encodeURIComponent(id)}`,
        {
          cache: "no-store",
        }
      );

      if (!res.ok) {
        setNotFound(true);
        return;
      }

      const data = await res.json();

      const dbProfile = data.profile;

      if (!dbProfile) {
        setNotFound(true);
        return;
      }

      const fullData = dbProfile.fullData || {};

      setProfile({
        personal: {
          fullName: dbProfile.fullName || "Candidate Name",
          headline:
            dbProfile.headline || "Professional Headline",
          location:
            dbProfile.location || "Location Not Provided",
          about: dbProfile.about || "",
          photoUrl: dbProfile.photoUrl || "",
        },

        skills: fullData.skills || [],
        hobbies: fullData.hobbies || [],
        languages: fullData.languages || [],
        experiences: fullData.experiences || [],
        educations: fullData.educations || [],
        projects: fullData.projects || [],
        achievements: fullData.achievements || [],
        publications: fullData.publications || [],
        connectedPlatforms: fullData.connectedPlatforms || [],
        verificationRequests: fullData.verificationRequests || [],
        evidenceFiles: dbProfile.evidenceFiles || [],

        professionalId:
          dbProfile.professionalId || id.toUpperCase(),
      });

      setIsVerified(
        dbProfile.verificationStatus === "VERIFIED"
      );
    } catch (error) {
      console.error("Error loading public profile:", error);
      setNotFound(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const initials = profile.personal?.fullName
    ? profile.personal.fullName
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "C";

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50/50 py-20 px-4">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
            <p className="mt-4 text-sm font-semibold text-slate-600">
              Loading professional profile...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Profile not found
  if (notFound) {
    return (
      <div className="min-h-screen bg-slate-50/50 py-20 px-4">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600">
              <ShieldAlert className="h-8 w-8" />
            </div>

            <h1 className="mt-5 text-2xl font-black text-slate-900">
              Profile Not Found
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              The Professional ID you entered does not match a
              public profile.
            </p>

            <Link
              href="/search"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-blue-700 transition"
            >
              <ArrowLeft className="h-4 w-4" />
              Search Another ID
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-6">

        {/* Navigation & Verification Status Bar */}
        <div className="flex items-center justify-between">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition"
          >
            <ArrowLeft className="h-4 w-4" />
            Home
          </Link>

          {isVerified ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-200 shadow-2xs">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              Permanent Record Verified
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-800 border border-amber-200 shadow-2xs">
              <ShieldAlert className="h-4 w-4 text-amber-600" />
              Self-Reported Record
            </span>
          )}
        </div>

        {/* Hero Card */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">

            <div className="flex items-center sm:items-start gap-4">
              <div className="relative h-20 w-20 rounded-2xl bg-blue-600 text-white font-black text-2xl flex items-center justify-center shrink-0 overflow-hidden shadow-sm">

                {profile.personal?.photoUrl ? (
                  <img
                    src={profile.personal.photoUrl}
                    alt={profile.personal.fullName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span>{initials}</span>
                )}

              </div>

              <div className="space-y-1">
                <h1 className="text-2xl font-black text-slate-900">
                  {profile.personal?.fullName ||
                    "Candidate Name"}
                </h1>

                <p className="text-sm font-semibold text-slate-600 flex items-center gap-1.5">
                  <Briefcase className="h-4 w-4 text-blue-600 shrink-0" />
                  {profile.personal?.headline ||
                    "Professional Headline"}
                </p>

                <p className="text-xs text-slate-400 flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  {profile.personal?.location ||
                    "Location Not Provided"}
                </p>
              </div>
            </div>

            {/* Professional ID */}
            <div className="rounded-xl bg-blue-50/80 px-3.5 py-1.5 border border-blue-100 self-start">
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">
                Professional ID
              </span>

              <span className="text-xs font-mono font-black text-blue-900">
                {profile.professionalId}
              </span>
            </div>
          </div>

          {/* About Summary */}
          {profile.personal?.about && (
            <div className="border-t border-slate-100 pt-5">
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                About / Summary
              </h2>

              <p className="text-sm text-slate-700 leading-relaxed">
                {profile.personal.about}
              </p>
            </div>
          )}
        </div>

        {/* Verified Career Records */}
        {profile.verificationRequests?.some((r: any) => (r.type === "EDUCATION" || r.type === "EXPERIENCE") && r.status === "VERIFIED") && (
          <div className="rounded-3xl border border-emerald-200 bg-emerald-50/40 p-6 sm:p-8 shadow-sm space-y-4">
            <div className="flex items-start gap-3 border-b border-emerald-100 pb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700"><ShieldCheck className="h-5 w-5" /></div>
              <div><h2 className="text-base font-black text-slate-900">Verified Career Records</h2><p className="mt-1 text-xs text-slate-600">Records below have been confirmed through a XROVIA verification request.</p></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {profile.verificationRequests.filter((r: any) => (r.type === "EDUCATION" || r.type === "EXPERIENCE") && r.status === "VERIFIED").map((r: any) => (
                <div key={r.id} className="rounded-2xl border border-emerald-200 bg-white p-4">
                  <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-emerald-600" /><span className="text-[10px] font-black uppercase tracking-wider text-emerald-700">Verified</span></div>
                  <h3 className="mt-2 text-sm font-bold text-slate-900">{r.title}</h3>
                  <p className="mt-1 text-xs text-slate-500">{r.type}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Core Competencies */}
        {profile.skills?.length > 0 && (
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm space-y-3">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              Core Competencies
            </h2>

            <div className="flex flex-wrap gap-2">
              {profile.skills.map(
                (skill: string, i: number) => (
                  <span
                    key={`${skill}-${i}`}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-blue-100 bg-blue-50/60 px-3 py-1 text-xs font-bold text-blue-900"
                  >
                    <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />
                    {skill}
                  </span>
                )
              )}
            </div>
          </div>
        )}

        {/* Work Experience */}
        {profile.experiences?.length > 0 && (
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-blue-600" />
              Work Experience
            </h2>

            <div className="space-y-4">
              {profile.experiences.map(
                (exp: any, i: number) => (
                  <div
                    key={i}
                    className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4 space-y-1"
                  >
                    <div className="flex justify-between items-start">
                      <h3 className="text-sm font-bold text-slate-900">
                        {exp.role}
                      </h3>

                      <span className="text-[10px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                        {exp.startDate} -{" "}
                        {exp.current
                          ? "Present"
                          : exp.endDate}
                      </span>
                    </div>

                    <p className="text-xs font-semibold text-blue-700">
                      {exp.company}
                    </p>

                    {exp.description && (
                      <p className="text-xs text-slate-600 mt-1.5">
                        {exp.description}
                      </p>
                    )}
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {/* Academic Background */}
        {profile.educations?.length > 0 && (
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-blue-600" />
              Academic Background
            </h2>

            <div className="space-y-4">
              {profile.educations.map(
                (edu: any, i: number) => (
                  <div
                    key={i}
                    className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4 space-y-1"
                  >
                    <div className="flex justify-between items-start">
                      <h3 className="text-sm font-bold text-slate-900">
                        {edu.degree}
                        {edu.fieldOfStudy
                          ? ` - ${edu.fieldOfStudy}`
                          : ""}
                      </h3>

                      <span className="text-[10px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                        {edu.startDate} -{" "}
                        {edu.current
                          ? "Present"
                          : edu.endDate}
                      </span>
                    </div>

                    <p className="text-xs font-semibold text-blue-700">
                      {edu.institution}
                    </p>
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {/* Key Projects */}
        {profile.projects?.length > 0 && (
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <FolderGit2 className="h-5 w-5 text-blue-600" />
              Key Projects
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {profile.projects.map(
                (proj: any, i: number) => (
                  <div
                    key={i}
                    className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4 flex flex-col justify-between space-y-3"
                  >
                    <div className="space-y-2">

                      {proj.imageUrl && (
                        <div className="aspect-video w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                          <img
                            src={proj.imageUrl}
                            alt={proj.title}
                            className="h-full w-full object-cover object-center"
                          />
                        </div>
                      )}

                      <h3 className="text-sm font-bold text-slate-900">
                        {proj.title}
                      </h3>

                      <p className="text-xs text-slate-600">
                        {proj.role}
                      </p>

                      {proj.description && (
                        <p className="text-xs text-slate-500 line-clamp-2">
                          {proj.description}
                        </p>
                      )}

                      {profile.evidenceFiles?.filter((f: any) => f.itemType === "PROJECT" && f.itemId === String(proj.id)).length > 0 && (
                        <div className="pt-2 border-t border-slate-200/60">
                          <p className="text-[10px] font-black uppercase tracking-wider text-emerald-700 mb-2">
                            Evidence
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {profile.evidenceFiles.filter((f: any) => f.itemType === "PROJECT" && f.itemId === String(proj.id)).map((file: any) => (
                              <a key={file.id} href={`/api/evidence/${file.id}`} target="_blank" rel="noopener noreferrer" className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[10px] font-semibold text-slate-600 hover:border-blue-200 hover:text-blue-600 truncate max-w-[190px]">
                                {file.fileName}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {proj.link && (
                      <a
                        href={formatExternalUrl(proj.link)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 font-bold inline-flex items-center gap-1 hover:underline pt-2 border-t border-slate-200/60"
                      >
                        View Project
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {/* Connected Professional Presence */}
        {profile.connectedPlatforms?.some((p: any) => p.url) && (
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm space-y-5">
            <div className="flex items-start gap-3 border-b border-slate-100 pb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600"><Link2 className="h-5 w-5" /></div>
              <div><h2 className="text-base font-bold text-slate-900">Professional Presence</h2><p className="mt-1 text-xs text-slate-500">Explore this professional identity across connected platforms.</p></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {profile.connectedPlatforms.filter((p: any) => p.url).map((platform: any) => (
                <a key={platform.id} href={formatExternalUrl(platform.url)} target="_blank" rel="noopener noreferrer" className="group rounded-2xl border border-slate-200 bg-slate-50/60 p-4 transition hover:border-blue-200 hover:bg-white hover:shadow-sm">
                  <div className="flex items-center justify-between gap-3"><div><h3 className="text-sm font-extrabold text-slate-900">{platform.name}</h3><p className="mt-1 text-xs text-slate-500">{platform.description}</p></div><ExternalLink className="h-4 w-4 shrink-0 text-slate-400 group-hover:text-blue-600" /></div>
                  <p className="mt-3 truncate text-[11px] font-semibold text-blue-600">{platform.url}</p>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Certifications & Achievements */}
        {profile.achievements?.length > 0 && (
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Award className="h-5 w-5 text-blue-600" />
              Certifications & Honors
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {profile.achievements.map(
                (ach: any, i: number) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50/50 p-4"
                  >
                    {ach.certificateUrl && (
                      <img
                        src={ach.certificateUrl}
                        alt={ach.title}
                        className="h-12 w-12 object-cover rounded-xl border border-slate-200 shrink-0"
                      />
                    )}

                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        {ach.title}
                      </h3>

                      <p className="text-xs text-slate-600">
                        {ach.issuer} • {ach.date}
                      </p>

                      {profile.evidenceFiles?.filter((f: any) => f.itemType === "ACHIEVEMENT" && f.itemId === String(ach.id)).length > 0 && (
                        <div className="mt-2">
                          <p className="text-[10px] font-black uppercase tracking-wider text-emerald-700 mb-2">Evidence</p>
                          <div className="flex flex-wrap gap-2">
                            {profile.evidenceFiles.filter((f: any) => f.itemType === "ACHIEVEMENT" && f.itemId === String(ach.id)).map((file: any) => (
                              <a key={file.id} href={`/api/evidence/${file.id}`} target="_blank" rel="noopener noreferrer" className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[10px] font-semibold text-slate-600 hover:border-blue-200 hover:text-blue-600 truncate max-w-[190px]">
                                {file.fileName}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
