"use client";

const platformLogo = (id: string) => {
  const logos: Record<string, string> = {
    linkedin: "https://cdn.simpleicons.org/linkedin/0A66C2",
    github: "https://cdn.simpleicons.org/github/181717",
    scholar: "https://cdn.simpleicons.org/googlescholar/4285F4",
    orcid: "https://cdn.simpleicons.org/orcid/A6CE39",
    researchgate: "https://cdn.simpleicons.org/researchgate/00CCBB",
    portfolio: "https://cdn.simpleicons.org/googlechrome/4285F4",
    patents: "https://cdn.simpleicons.org/google/4285F4",
  };
  return logos[id.toLowerCase()] || null;
};



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
  Linkedin,
  GraduationCap as GraduationCapIcon,
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
      const verificationRequests = Array.isArray(fullData.verificationRequests)
        ? fullData.verificationRequests
        : [];

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
        verificationRequests,
        evidenceFiles: dbProfile.evidenceFiles || [],

        professionalId:
          dbProfile.professionalId || id.toUpperCase(),
      });

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
    <div className="min-h-screen bg-white px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-5">

        {/* Navigation */}
        <div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-xs font-semibold text-blue-600 hover:text-blue-700 transition"
          >
            <ArrowLeft className="h-4 w-4" />
            Home
          </Link>
        </div>

        {/* Profile Header */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="h-24 bg-gradient-to-r from-blue-50 via-indigo-50 to-sky-100 border-b border-blue-100" />
          <div className="px-5 pb-6 sm:px-8">
            <div className="-mt-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex items-end gap-4">
                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-4 border-white bg-blue-100 text-2xl font-black text-blue-700 shadow-md flex items-center justify-center">
                  {profile.personal?.photoUrl ? (
                    <img src={profile.personal.photoUrl} alt={profile.personal.fullName} className="h-full w-full object-cover" />
                  ) : <span>{initials}</span>}
                </div>
                <div className="pb-1">
                  <h1 className="text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">{profile.personal?.fullName || "Candidate Name"}</h1>
                  <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-slate-600">
                    <Briefcase className="h-4 w-4 text-blue-600" />
                    {profile.personal?.headline || "Professional Headline"}
                  </p>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                    <MapPin className="h-3.5 w-3.5" /> {profile.personal?.location || "Location Not Provided"}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 sm:pb-1">
                <div className="rounded-xl border border-blue-100 bg-blue-50 px-3 py-2">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Professional ID</p>
                  <p className="font-mono text-xs font-black text-slate-800">{profile.professionalId}</p>
                </div>
                <div className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold ${profile.educations?.length + profile.experiences?.length > 0 && profile.educations?.every((item:any)=>profile.verificationRequests?.some((r:any)=>r.type==="EDUCATION"&&r.itemId===String(item.id)&&r.status==="VERIFIED")) && profile.experiences?.every((item:any)=>profile.verificationRequests?.some((r:any)=>r.type==="EXPERIENCE"&&r.itemId===String(item.id)&&r.status==="VERIFIED")) ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-amber-200 bg-amber-50 text-amber-700"}`}>
                  {profile.educations?.length + profile.experiences?.length > 0 && profile.educations?.every((item:any)=>profile.verificationRequests?.some((r:any)=>r.type==="EDUCATION"&&r.itemId===String(item.id)&&r.status==="VERIFIED")) && profile.experiences?.every((item:any)=>profile.verificationRequests?.some((r:any)=>r.type==="EXPERIENCE"&&r.itemId===String(item.id)&&r.status==="VERIFIED")) ? <ShieldCheck className="h-3.5 w-3.5" /> : <ShieldAlert className="h-3.5 w-3.5" />}
                  {profile.educations?.length + profile.experiences?.length > 0 && profile.educations?.every((item:any)=>profile.verificationRequests?.some((r:any)=>r.type==="EDUCATION"&&r.itemId===String(item.id)&&r.status==="VERIFIED")) && profile.experiences?.every((item:any)=>profile.verificationRequests?.some((r:any)=>r.type==="EXPERIENCE"&&r.itemId===String(item.id)&&r.status==="VERIFIED")) ? "Verified" : "Self-Reported"}
                </div>
              </div>
            </div>

            {profile.personal?.about && (
              <div className="mt-6 max-w-3xl">
                <p className="text-sm leading-7 text-slate-600">{profile.personal.about}</p>
              </div>
            )}

            <div className="mt-5 grid grid-cols-2 gap-2 border-t border-slate-100 pt-4 sm:grid-cols-4">
              {[
                ["Experience", profile.experiences?.length || 0],
                ["Education", profile.educations?.length || 0],
                ["Projects", profile.projects?.length || 0],
                ["Platforms", profile.connectedPlatforms?.filter((p:any)=>p.url).length || 0],
              ].map(([label,value]) => (
                <div key={String(label)} className="rounded-xl bg-blue-50/60 px-4 py-3">
                  <p className="text-lg font-black text-slate-900">{value}</p>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Core Competencies */}
        {profile.skills?.length > 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm space-y-4">
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
          <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm space-y-5">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-blue-600" />
              Work Experience
            </h2>

            <div className="space-y-4">
              {profile.experiences.map(
                (exp: any, i: number) => (
                  <div
                    key={i}
                    className="rounded-xl border border-slate-100 bg-white p-4 space-y-1"
                  >
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-slate-900">
                          {exp.role}
                        </h3>
                        {profile.verificationRequests?.some(
                          (r: any) =>
                            r.type === "EXPERIENCE" &&
                            r.itemId === String(exp.id) &&
                            r.status === "VERIFIED"
                        ) && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-bold text-emerald-700 border border-emerald-200">
                            <ShieldCheck className="h-3 w-3" />
                            Verified
                          </span>
                        )}
                      </div>

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

                    {profile.evidenceFiles?.filter((f: any) => f.itemType === "EXPERIENCE" && f.itemId === String(exp.id)).length > 0 && (
                      <div className="pt-2 mt-2 border-t border-slate-200/60">
                        <p className="text-[10px] font-black uppercase tracking-wider text-blue-600 mb-2">Evidence</p>
                        <div className="flex flex-wrap gap-2">
                          {profile.evidenceFiles.filter((f: any) => f.itemType === "EXPERIENCE" && f.itemId === String(exp.id)).map((file: any) => (
                            <a key={file.id} href={`/api/evidence/${file.id}`} target="_blank" rel="noopener noreferrer" className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[10px] font-semibold text-slate-600 hover:border-blue-200 hover:text-blue-600 truncate max-w-[190px]">
                              {file.fileName}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {/* Academic Background */}
        {profile.educations?.length > 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-blue-600" />
              Academic Background
            </h2>

            <div className="space-y-4">
              {profile.educations.map(
                (edu: any, i: number) => (
                  <div
                    key={i}
                    className="rounded-xl border border-slate-100 bg-white p-4 space-y-1"
                  >
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-slate-900">
                          {edu.degree}
                          {edu.fieldOfStudy
                            ? ` - ${edu.fieldOfStudy}`
                            : ""}
                        </h3>
                        {profile.verificationRequests?.some(
                          (r: any) =>
                            r.type === "EDUCATION" &&
                            r.itemId === String(edu.id) &&
                            r.status === "VERIFIED"
                        ) && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-bold text-emerald-700 border border-emerald-200">
                            <ShieldCheck className="h-3 w-3" />
                            Verified
                          </span>
                        )}
                      </div>

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

                    {profile.evidenceFiles?.filter((f: any) => f.itemType === "EDUCATION" && f.itemId === String(edu.id)).length > 0 && (
                      <div className="pt-2 mt-2 border-t border-slate-200/60">
                        <p className="text-[10px] font-black uppercase tracking-wider text-blue-600 mb-2">Evidence</p>
                        <div className="flex flex-wrap gap-2">
                          {profile.evidenceFiles.filter((f: any) => f.itemType === "EDUCATION" && f.itemId === String(edu.id)).map((file: any) => (
                            <a key={file.id} href={`/api/evidence/${file.id}`} target="_blank" rel="noopener noreferrer" className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[10px] font-semibold text-slate-600 hover:border-blue-200 hover:text-blue-600 truncate max-w-[190px]">
                              {file.fileName}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {/* Key Projects */}
        {profile.projects?.length > 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <FolderGit2 className="h-5 w-5 text-blue-600" />
              Key Projects
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {profile.projects.map(
                (proj: any, i: number) => (
                  <div
                    key={i}
                    className="rounded-xl border border-slate-100 bg-white p-4 flex flex-col justify-between space-y-3"
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
                          <p className="text-[10px] font-black uppercase tracking-wider text-blue-600 mb-2">
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
          <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex items-start gap-3 border-b border-slate-100 pb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <Link2 className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">Professional Presence</h2>
                <p className="mt-1 text-xs text-slate-500">One place to explore this professional identity across connected platforms.</p>
              </div>
            </div>

            <div className="space-y-2">
              {profile.connectedPlatforms.filter((p: any) => p.url).map((platform: any) => {
                const logo = platformLogo(String(platform.id));
                return (
                  <div key={platform.id} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/40 px-4 py-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
                      {logo ? <img src={logo} alt="" className="h-5 w-5" /> : <span className="text-sm font-black text-slate-500">{String(platform.name || "P").slice(0,1).toUpperCase()}</span>}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-extrabold text-slate-900">{platform.name}</h3>
                      {platform.showSpecialMessage && platform.specialMessage?.trim() ? (
                        <p className="mt-1 text-[11px] leading-5 text-slate-500">{platform.specialMessage.trim()}</p>
                      ) : (
                        <p className="mt-1 truncate text-[11px] text-slate-500">{platform.description || "Professional profile"}</p>
                      )}
                    </div>
                    <a href={formatExternalUrl(platform.url)} target="_blank" rel="noopener noreferrer" className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-[10px] font-bold text-slate-700 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700">
                      View <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Certifications & Achievements */}
        {profile.achievements?.length > 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Award className="h-5 w-5 text-blue-600" />
              Certifications & Honors
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {profile.achievements.map(
                (ach: any, i: number) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 rounded-xl border border-slate-100 bg-white p-4"
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
                          <p className="text-[10px] font-black uppercase tracking-wider text-blue-600 mb-2">Evidence</p>
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
