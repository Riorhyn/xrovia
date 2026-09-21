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
  BookOpen,
  Languages,
  Heart,
  Globe,
  ExternalLink,
} from "lucide-react";

export default function PublicProfilePage() {
  const [isVerified, setIsVerified] = useState(false);
  const [profile, setProfile] = useState<any>({
    personal: {
      fullName: "Rajinder Singh",
      headline: "Mechanical Engineer",
      location: "Mohali, India",
      about:
        "Passionate Mechanical Engineer specializing in CAD design, thermal systems, and modern prototyping.",
      photoUrl: "",
    },
    skills: ["CAD Design", "Thermal Analysis", "AutoCAD", "Prototyping"],
    hobbies: [],
    languages: [],
    experiences: [],
    educations: [],
    projects: [],
    achievements: [],
    publications: [],
  });

  const loadData = () => {
    const saved = localStorage.getItem("user_profile_data");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.personal) {
          setProfile(parsed);
          setIsVerified(Boolean(parsed.isVerified));
        }
      } catch (e) {
        console.error("Error reading profile data:", e);
      }
    }
  };

  useEffect(() => {
    loadData();

    window.addEventListener("profile_updated", loadData);
    window.addEventListener("storage", loadData);

    return () => {
      window.removeEventListener("profile_updated", loadData);
      window.removeEventListener("storage", loadData);
    };
  }, []);

  const initials = profile.personal?.fullName
    ? profile.personal.fullName
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "RS";

  return (
    <div className="min-h-screen bg-slate-50/50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-6">
        
        {/* Navigation & Verification Status Bar */}
        <div className="flex items-center justify-between">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition"
          >
            <ArrowLeft className="h-4 w-4" /> Home
          </Link>

          {isVerified ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-200 shadow-2xs">
              <ShieldCheck className="h-4 w-4 text-emerald-600" /> Permanent Record Verified
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-800 border border-amber-200 shadow-2xs">
              <ShieldAlert className="h-4 w-4 text-amber-600" /> Self-Reported Record
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
                  {profile.personal?.fullName || "Candidate Name"}
                </h1>
                <p className="text-sm font-semibold text-slate-600 flex items-center gap-1.5">
                  <Briefcase className="h-4 w-4 text-blue-600 shrink-0" />
                  {profile.personal?.headline || "Professional Headline"}
                </p>
                <p className="text-xs text-slate-400 flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  {profile.personal?.location || "Location Not Provided"}
                </p>
              </div>
            </div>

            <div className="rounded-xl bg-blue-50/80 px-3.5 py-1.5 border border-blue-100 self-start">
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">
                Professional ID
              </span>
              <span className="text-xs font-mono font-black text-blue-900">
                PR-159481
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

        {/* Core Competencies */}
        {profile.skills?.length > 0 && (
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm space-y-3">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              Core Competencies
            </h2>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill: string) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-blue-100 bg-blue-50/60 px-3 py-1 text-xs font-bold text-blue-900"
                >
                  <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Work Experience Section */}
        {profile.experiences?.length > 0 && (
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-blue-600" /> Work Experience
            </h2>
            <div className="space-y-4">
              {profile.experiences.map((exp: any, i: number) => (
                <div
                  key={i}
                  className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4 space-y-1"
                >
                  <div className="flex justify-between items-start">
                    <h3 className="text-sm font-bold text-slate-900">
                      {exp.role}
                    </h3>
                    <span className="text-[10px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                      {exp.startDate} - {exp.current ? "Present" : exp.endDate}
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
              ))}
            </div>
          </div>
        )}

        {/* Academic Background */}
        {profile.educations?.length > 0 && (
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-blue-600" /> Academic Background
            </h2>
            <div className="space-y-4">
              {profile.educations.map((edu: any, i: number) => (
                <div
                  key={i}
                  className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4 space-y-1"
                >
                  <div className="flex justify-between items-start">
                    <h3 className="text-sm font-bold text-slate-900">
                      {edu.degree} - {edu.fieldOfStudy}
                    </h3>
                    <span className="text-[10px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                      {edu.startDate} - {edu.current ? "Present" : edu.endDate}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-blue-700">
                    {edu.institution}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {profile.projects?.length > 0 && (
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <FolderGit2 className="h-5 w-5 text-blue-600" /> Key Projects
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {profile.projects.map((proj: any, i: number) => (
                <div
                  key={i}
                  className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4 space-y-2"
                >
                  {proj.imageUrl && (
                    <img
                      src={proj.imageUrl}
                      alt={proj.title}
                      className="h-28 w-full object-cover rounded-xl border border-slate-200"
                    />
                  )}
                  <h3 className="text-sm font-bold text-slate-900">
                    {proj.title}
                  </h3>
                  <p className="text-xs text-slate-600">{proj.role}</p>
                  {proj.description && (
                    <p className="text-xs text-slate-500 line-clamp-2">
                      {proj.description}
                    </p>
                  )}
                  {proj.link && (
                    <a
                      href={proj.link}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-blue-600 font-bold inline-flex items-center gap-1 hover:underline pt-1"
                    >
                      View Project <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications & Achievements */}
        {profile.achievements?.length > 0 && (
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Award className="h-5 w-5 text-blue-600" /> Certifications & Honors
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {profile.achievements.map((ach: any, i: number) => (
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
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}