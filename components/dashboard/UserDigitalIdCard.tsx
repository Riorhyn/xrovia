"use client";

import React, { useEffect, useState } from "react";
import { QrCode, GraduationCap, Briefcase, Wrench, FolderGit2, Globe } from "lucide-react";

export function UserDigitalIdCard() {
  const [profile, setProfile] = useState({
    fullName: "Alex Morgan",
    headline: "Structural engineer",
    location: "Toronto, Canada",
    about: "Bridge and building design",
    photoUrl: "",
    skills: ["Structural analysis", "AutoCAD", "Project planning", "Report writing"],
    educationCount: 0,
    educationSummary: "No degree added",
    experienceCount: 0,
    experienceSummary: "No experience added",
    skillsCount: 0,
    skillsSummary: "No skills listed",
    projectsCount: 0,
    projectsSummary: "No projects added",
    professionalId: "PR-159481",
  });

  const loadProfile = () => {
    const saved = localStorage.getItem("user_profile_data");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.personal) {
          const eduCount = parsed.educations?.length || 0;
          const expCount = parsed.experiences?.length || 0;
          const sklCount = parsed.skills?.length || 0;
          const prjCount = parsed.projects?.length || 0;

          const firstEdu = parsed.educations?.[0]
            ? `${parsed.educations[0].degree || ""}, ${parsed.educations[0].fieldOfStudy || ""}`.trim()
            : "No degree added";

          const firstExp = parsed.experiences?.[0]
            ? `${parsed.experiences[0].role || ""}`.trim()
            : "No experience added";

          const topSkills = parsed.skills?.length
            ? parsed.skills.slice(0, 2).join(", ")
            : "No skills listed";

          const firstProj = parsed.projects?.[0]
            ? `${parsed.projects[0].title || ""}`.trim()
            : "No projects added";

          setProfile({
            fullName: parsed.personal.fullName || "Your Full Name",
            headline: parsed.personal.headline || "Professional Headline",
            location: parsed.personal.location || "City, Country",
            about: parsed.personal.about || "Professional summary / primary focus",
            photoUrl: parsed.personal.photoUrl || "",
            skills: parsed.skills?.length ? parsed.skills : ["Core Competency"],
            educationCount: eduCount,
            educationSummary: firstEdu,
            experienceCount: expCount,
            experienceSummary: firstExp,
            skillsCount: sklCount,
            skillsSummary: topSkills,
            projectsCount: prjCount,
            projectsSummary: firstProj,
            professionalId: "PR-159481",
          });
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  useEffect(() => {
    loadProfile();

    window.addEventListener("profile_updated", loadProfile);
    window.addEventListener("storage", loadProfile);
    window.addEventListener("focus", loadProfile);

    return () => {
      window.removeEventListener("profile_updated", loadProfile);
      window.removeEventListener("storage", loadProfile);
      window.removeEventListener("focus", loadProfile);
    };
  }, []);

  const initials = profile.fullName
    ? profile.fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "AM";

  return (
    <div className="mx-auto w-full max-w-sm rounded-[36px] bg-slate-900 p-3 shadow-2xl ring-1 ring-slate-800">
      {/* Top Phone Mock Speaker Bar */}
      <div className="mx-auto mb-3 h-1.5 w-16 rounded-full bg-slate-700/80" />

      {/* Main Card Content Outer Wrapper */}
      <div className="rounded-[28px] bg-white p-5 shadow-sm space-y-5 text-slate-900">
        
        {/* Top Branding Pill Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="h-6 w-6 rounded-md bg-blue-600 flex items-center justify-center text-white font-black text-xs">
              X
            </div>
            <span className="text-xs font-black tracking-wider text-slate-900 uppercase">
              XROVIA
            </span>
          </div>
          <span className="rounded-full bg-slate-900 px-3 py-1 text-[10px] font-bold text-white tracking-wide">
            Verified Record
          </span>
        </div>

        {/* User Info & Avatar */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative h-12 w-12 rounded-full bg-blue-100 text-blue-800 font-extrabold text-sm flex items-center justify-center shrink-0 overflow-hidden border border-blue-200">
              {profile.photoUrl ? (
                <img
                  src={profile.photoUrl}
                  alt={profile.fullName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span>{initials}</span>
              )}
            </div>
            <div className="min-w-0">
              <h3 className="text-base font-bold text-slate-900 truncate leading-snug">
                {profile.fullName}
              </h3>
              <p className="text-xs text-slate-500 truncate">{profile.headline}</p>
              <p className="text-[11px] text-slate-400 truncate">{profile.location}</p>
            </div>
          </div>

          <div className="p-1 bg-white border border-slate-100 rounded-lg shrink-0 shadow-2xs">
            <QrCode className="h-8 w-8 text-slate-900" />
          </div>
        </div>

        {/* Large Professional ID Blue Hero Banner */}
        <div className="rounded-2xl bg-blue-50/80 p-4 border border-blue-100/80">
          <p className="text-[10px] font-bold uppercase text-blue-600 tracking-wider">
            Professional ID
          </p>
          <p className="text-2xl font-black text-blue-600 tracking-tight font-mono mt-0.5">
            {profile.professionalId}
          </p>
        </div>

        {/* Primary Focus / Summary */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Primary focus
          </p>
          <p className="text-xs font-medium text-slate-800 mt-1 leading-relaxed">
            {profile.about}
          </p>
        </div>

        {/* Core Competencies Pills */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Core competencies
          </p>
          <div className="flex flex-wrap gap-1.5">
            {profile.skills.slice(0, 4).map((skill) => (
              <span
                key={skill}
                className="rounded-full bg-slate-50 border border-slate-200 px-3 py-1 text-[10px] font-semibold text-slate-700"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* 2x2 Category Metrics Cards */}
        <div className="grid grid-cols-2 gap-2.5 pt-1">
          {/* Education Box */}
          <div className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-2.5 space-y-1">
            <div className="flex items-center justify-between text-slate-600">
              <span className="flex items-center gap-1 text-[11px] font-bold text-slate-700">
                <GraduationCap className="h-3.5 w-3.5 text-blue-600" /> Education
              </span>
              <span className="text-xs font-black text-blue-600">{profile.educationCount}</span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium truncate">
              {profile.educationSummary}
            </p>
          </div>

          {/* Experience Box */}
          <div className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-2.5 space-y-1">
            <div className="flex items-center justify-between text-slate-600">
              <span className="flex items-center gap-1 text-[11px] font-bold text-slate-700">
                <Briefcase className="h-3.5 w-3.5 text-blue-600" /> Experience
              </span>
              <span className="text-xs font-black text-blue-600">{profile.experienceCount}</span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium truncate">
              {profile.experienceSummary}
            </p>
          </div>

          {/* Skills Box */}
          <div className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-2.5 space-y-1">
            <div className="flex items-center justify-between text-slate-600">
              <span className="flex items-center gap-1 text-[11px] font-bold text-slate-700">
                <Wrench className="h-3.5 w-3.5 text-blue-600" /> Skills
              </span>
              <span className="text-xs font-black text-blue-600">{profile.skillsCount}</span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium truncate">
              {profile.skillsSummary}
            </p>
          </div>

          {/* Projects Box */}
          <div className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-2.5 space-y-1">
            <div className="flex items-center justify-between text-slate-600">
              <span className="flex items-center gap-1 text-[11px] font-bold text-slate-700">
                <FolderGit2 className="h-3.5 w-3.5 text-blue-600" /> Projects
              </span>
              <span className="text-xs font-black text-blue-600">{profile.projectsCount}</span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium truncate">
              {profile.projectsSummary}
            </p>
          </div>
        </div>

        {/* Public Profile Link Banner */}
        <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-2.5 flex items-center justify-between text-[11px]">
          <span className="flex items-center gap-1.5 font-bold text-slate-700">
            <Globe className="h-3.5 w-3.5 text-blue-600" /> Public profile
          </span>
          <span className="font-mono font-bold text-blue-600">/{profile.professionalId}</span>
        </div>

        <p className="text-[10px] text-center text-slate-400 font-medium">
          Click QR code to view, download, or share.
        </p>
      </div>
    </div>
  );
}