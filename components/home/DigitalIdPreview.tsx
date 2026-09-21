"use client";

import React, { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  GraduationCap,
  Briefcase,
  Wrench,
  FolderGit2,
  Globe,
  X,
  Share2,
  Copy,
  Check,
  ShieldCheck,
  MapPin,
  Sparkles,
} from "lucide-react";

export function DigitalIdPreview() {
  const [showQrModal, setShowQrModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [isVerified, setIsVerified] = useState(false);

  const [profile, setProfile] = useState({
    fullName: "Alex Morgan",
    headline: "Structural engineer",
    location: "Toronto, Canada",
    about: "Bridge and building design",
    photoUrl: "",
    skills: ["Structural analysis", "AutoCAD", "Project planning"],
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
        setIsVerified(Boolean(parsed.isVerified));

        if (parsed.personal && parsed.personal.fullName) {
          const edus = parsed.educations || [];
          const exps = parsed.experiences || [];
          const skls = parsed.skills || [];
          const prjs = parsed.projects || [];

          // Format Education (e.g., "BE - Mechanical engineering")
          const eduSummary = edus[0]
            ? [edus[0].degree, edus[0].fieldOfStudy].filter(Boolean).join(" - ")
            : "No degree added";

          // Format Experience (e.g., "JE at Gilard")
          const expSummary = exps[0]
            ? [exps[0].role, exps[0].company].filter(Boolean).join(" at ")
            : "No experience added";

          // Format Skills (e.g., "AutoCAD, SolidWorks, ANSYS")
          const sklSummary = skls.length
            ? skls.slice(0, 3).join(", ")
            : "No skills listed";

          // Format Projects
          const prjSummary = prjs[0]
            ? `${prjs[0].title}${prjs[0].role ? ` (${prjs[0].role})` : ""}`
            : "No projects added";

          setProfile({
            fullName: parsed.personal.fullName,
            headline: parsed.personal.headline || "Professional Headline",
            location: parsed.personal.location || "City, Country",
            about: parsed.personal.about || "Professional summary",
            photoUrl: parsed.personal.photoUrl || "",
            skills: skls.length ? skls : ["Core Competency"],
            educationCount: edus.length,
            educationSummary: eduSummary,
            experienceCount: exps.length,
            experienceSummary: expSummary,
            skillsCount: skls.length,
            skillsSummary: sklSummary,
            projectsCount: prjs.length,
            projectsSummary: prjSummary,
            professionalId: "PR-159481",
          });
        }
      } catch (e) {
        console.error("Failed to load profile:", e);
      }
    }
  };

  useEffect(() => {
    loadProfile();
    if (typeof window !== "undefined") {
      setShareUrl(`${window.location.origin}/PR-159481`);
    }

    window.addEventListener("profile_updated", loadProfile);
    window.addEventListener("storage", loadProfile);
    window.addEventListener("focus", loadProfile);

    return () => {
      window.removeEventListener("profile_updated", loadProfile);
      window.removeEventListener("storage", loadProfile);
      window.removeEventListener("focus", loadProfile);
    };
  }, []);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${profile.fullName}'s Professional ID`,
          text: `Inspect record for ${profile.fullName} (${profile.professionalId})`,
          url: shareUrl,
        });
      } catch (e) {
        console.error("Share error:", e);
      }
    } else {
      handleCopyLink();
    }
  };

  const initials = profile.fullName
    ? profile.fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "AM";

  return (
    <>
      {/* Outer Card Container with Soft Glassmorphic Glow */}
      <div className="relative mx-auto w-full max-w-sm rounded-[32px] border border-slate-200/80 bg-white/95 p-6 shadow-2xl shadow-blue-950/10 backdrop-blur-xl transition-all duration-300 hover:shadow-blue-900/15 space-y-5 overflow-hidden">
        
        {/* Decorative Background Mesh Accent */}
        <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-gradient-to-tr from-blue-500/10 via-indigo-500/10 to-transparent blur-2xl pointer-events-none" />

        {/* 1. Header Bar: Brand & Verification Pill */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white font-black text-xs shadow-md shadow-blue-500/20">
              X
            </div>
            <span className="text-xs font-black tracking-widest text-slate-900 uppercase">
              XROVIA
            </span>
          </div>

          {isVerified ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 text-[10px] font-bold text-emerald-700 backdrop-blur-md">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> Verified
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 px-3 py-1 text-[10px] font-bold text-amber-800 backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" /> Self-Reported
            </span>
          )}
        </div>

        {/* 2. User Profile Showcase */}
        <div className="relative z-10 flex items-start justify-between gap-3 pt-1">
          <div className="flex items-center gap-3.5">
            {/* Avatar with Gradient Border Ring */}
            <div className="p-0.5 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-slate-200 shadow-md">
              <div className="relative h-13 w-13 rounded-[14px] bg-slate-900 text-white font-black text-sm flex items-center justify-center overflow-hidden shrink-0">
                {profile.photoUrl ? (
                  <img
                    src={profile.photoUrl}
                    alt={profile.fullName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="tracking-wider">{initials}</span>
                )}
              </div>
            </div>

            <div className="min-w-0 space-y-0.5">
              <h3 className="text-lg font-black text-slate-900 truncate tracking-tight leading-tight">
                {profile.fullName}
              </h3>
              <p className="text-xs font-semibold text-slate-600 truncate">{profile.headline}</p>
              <p className="text-[11px] font-medium text-slate-400 truncate flex items-center gap-1">
                <MapPin className="h-3 w-3 text-slate-400" /> {profile.location}
              </p>
            </div>
          </div>

          {/* Interactive QR Code Button */}
          <button
            onClick={() => setShowQrModal(true)}
            className="p-1.5 bg-slate-50 hover:bg-blue-50/80 border border-slate-200/80 rounded-2xl shrink-0 shadow-xs transition duration-200 hover:scale-105"
            title="Scan or Enlarge QR Code"
          >
            {shareUrl ? (
              <QRCodeSVG value={shareUrl} size={36} level="M" />
            ) : (
              <div className="h-9 w-9 bg-slate-200 rounded-xl" />
            )}
          </button>
        </div>

        {/* 3. Dark Metallic Professional ID Card Banner */}
        <div className="relative z-10 overflow-hidden rounded-2xl bg-slate-950 p-4 border border-slate-800 shadow-lg text-white">
          <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-blue-600/20 to-transparent pointer-events-none" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[9px] font-extrabold uppercase text-blue-400 tracking-widest flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-blue-400" /> Professional ID
              </p>
              <p className="text-2xl font-black text-white tracking-tight font-mono mt-0.5">
                {profile.professionalId}
              </p>
            </div>
            <div className="text-right">
              <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block">Status</span>
              <span className="text-[11px] font-bold text-emerald-400">Active</span>
            </div>
          </div>
        </div>

        {/* 4. Primary Focus Section */}
        <div className="relative z-10 space-y-1">
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
            Primary focus
          </p>
          <p className="text-xs font-medium text-slate-700 leading-relaxed line-clamp-2">
            {profile.about}
          </p>
        </div>

        {/* 5. Core Competencies */}
        <div className="relative z-10 space-y-1.5">
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
            Core competencies
          </p>
          <div className="flex flex-wrap gap-1.5">
            {profile.skills.slice(0, 4).map((skill) => (
              <span
                key={skill}
                className="rounded-xl bg-slate-100/80 border border-slate-200/60 px-3 py-1 text-[10px] font-bold text-slate-700 shadow-2xs hover:bg-slate-200/60 transition"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* 6. Aesthetically Refined 2x2 Record Summary Grid */}
        <div className="relative z-10 grid grid-cols-2 gap-2.5 pt-1">
          {/* Education Block */}
          <div className="rounded-2xl border border-slate-200/70 bg-gradient-to-br from-slate-50 to-blue-50/30 p-3 space-y-1 transition hover:border-blue-300">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-[11px] font-black text-slate-800">
                <GraduationCap className="h-3.5 w-3.5 text-blue-600" /> Education
              </span>
              <span className="text-xs font-black text-blue-600 bg-blue-100/80 px-1.5 py-0.5 rounded-md">
                {profile.educationCount}
              </span>
            </div>
            <p className="text-[11px] text-slate-700 font-semibold leading-snug line-clamp-2">
              {profile.educationSummary}
            </p>
          </div>

          {/* Experience Block */}
          <div className="rounded-2xl border border-slate-200/70 bg-gradient-to-br from-slate-50 to-blue-50/30 p-3 space-y-1 transition hover:border-blue-300">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-[11px] font-black text-slate-800">
                <Briefcase className="h-3.5 w-3.5 text-blue-600" /> Experience
              </span>
              <span className="text-xs font-black text-blue-600 bg-blue-100/80 px-1.5 py-0.5 rounded-md">
                {profile.experienceCount}
              </span>
            </div>
            <p className="text-[11px] text-slate-700 font-semibold leading-snug line-clamp-2">
              {profile.experienceSummary}
            </p>
          </div>

          {/* Skills Block */}
          <div className="rounded-2xl border border-slate-200/70 bg-gradient-to-br from-slate-50 to-blue-50/30 p-3 space-y-1 transition hover:border-blue-300">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-[11px] font-black text-slate-800">
                <Wrench className="h-3.5 w-3.5 text-blue-600" /> Skills
              </span>
              <span className="text-xs font-black text-blue-600 bg-blue-100/80 px-1.5 py-0.5 rounded-md">
                {profile.skillsCount}
              </span>
            </div>
            <p className="text-[11px] text-slate-700 font-semibold leading-snug line-clamp-2">
              {profile.skillsSummary}
            </p>
          </div>

          {/* Projects Block */}
          <div className="rounded-2xl border border-slate-200/70 bg-gradient-to-br from-slate-50 to-blue-50/30 p-3 space-y-1 transition hover:border-blue-300">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-[11px] font-black text-slate-800">
                <FolderGit2 className="h-3.5 w-3.5 text-blue-600" /> Projects
              </span>
              <span className="text-xs font-black text-blue-600 bg-blue-100/80 px-1.5 py-0.5 rounded-md">
                {profile.projectsCount}
              </span>
            </div>
            <p className="text-[11px] text-slate-700 font-semibold leading-snug line-clamp-2">
              {profile.projectsSummary}
            </p>
          </div>
        </div>

        {/* 7. Footer Profile Link Badge */}
        <div className="relative z-10 rounded-2xl border border-blue-200/60 bg-blue-50/60 p-2.5 flex items-center justify-between text-[11px]">
          <span className="flex items-center gap-1.5 font-black text-slate-800">
            <Globe className="h-3.5 w-3.5 text-blue-600" /> Public Profile
          </span>
          <span className="font-mono font-bold text-blue-700 bg-white px-2 py-0.5 rounded-lg border border-blue-200/80">
            /{profile.professionalId}
          </span>
        </div>

        <button
          onClick={() => setShowQrModal(true)}
          className="relative z-10 w-full text-[10px] text-center text-slate-400 font-bold hover:text-blue-600 cursor-pointer transition tracking-wide"
        >
          Click QR code to view, download, or share.
        </button>
      </div>

      {/* Enlarged Modal for QR Code */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm rounded-[32px] bg-white p-6 text-center shadow-2xl space-y-5 border border-slate-100">
            <button
              onClick={() => setShowQrModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 transition"
            >
              <X className="h-5 w-5" />
            </button>

            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-blue-600">
                Permanent Record QR Code
              </span>
              <h3 className="text-lg font-black text-slate-900 mt-1">{profile.fullName}</h3>
              <p className="text-xs font-mono font-bold text-slate-500">{profile.professionalId}</p>
            </div>

            <div className="mx-auto w-52 h-52 bg-slate-50 rounded-2xl border border-slate-200 p-4 flex items-center justify-center shadow-inner">
              {shareUrl && <QRCodeSVG value={shareUrl} size={176} level="H" includeMargin={true} />}
            </div>

            <p className="text-xs text-slate-500">
              Scan this QR code using any smartphone camera to inspect profile records.
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={handleNativeShare}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-700 transition"
              >
                <Share2 className="h-4 w-4" /> Share Link
              </button>

              <button
                onClick={handleCopyLink}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-100 px-4 py-2.5 text-xs font-bold text-slate-800 hover:bg-slate-200 transition"
              >
                {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copied!" : "Copy Link"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}