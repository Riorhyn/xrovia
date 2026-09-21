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
  ShieldAlert,
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
    isSample: true,
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

          setProfile({
            fullName: parsed.personal.fullName,
            headline: parsed.personal.headline || "Professional Headline",
            location: parsed.personal.location || "City, Country",
            about: parsed.personal.about || "Professional summary",
            photoUrl: parsed.personal.photoUrl || "",
            skills: skls.length ? skls : ["Core Competency"],
            educationCount: edus.length,
            educationSummary: edus[0] ? `${edus[0].degree}` : "No degree added",
            experienceCount: exps.length,
            experienceSummary: exps[0] ? `${exps[0].role}` : "No experience added",
            skillsCount: skls.length,
            skillsSummary: skls.slice(0, 2).join(", ") || "No skills listed",
            projectsCount: prjs.length,
            projectsSummary: prjs[0] ? `${prjs[0].title}` : "No projects added",
            professionalId: "PR-159481",
            isSample: false,
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
      <div className="mx-auto w-full max-w-sm rounded-[28px] border border-slate-100 bg-white p-5 shadow-xl space-y-5 text-slate-900 transition hover:shadow-2xl">
        
        {/* Top Header - ONLY 1 BADGE HERE */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="h-6 w-6 rounded-md bg-blue-600 flex items-center justify-center text-white font-black text-xs">
              X
            </div>
            <span className="text-xs font-black tracking-wider text-slate-900 uppercase">
              XROVIA
            </span>
          </div>

          {isVerified ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-3 py-0.5 text-[10px] font-bold text-white tracking-wide">
              <ShieldCheck className="h-3 w-3" /> Verified Record
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-2.5 py-0.5 text-[10px] font-bold text-amber-800 tracking-wide">
              <ShieldAlert className="h-3 w-3 text-amber-600" /> Self-Reported
            </span>
          )}
        </div>

        {/* User Details */}
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

          <button
            onClick={() => setShowQrModal(true)}
            className="p-1 bg-slate-50 hover:bg-blue-50 border border-slate-200 rounded-xl shrink-0 shadow-2xs transition group"
            title="Scan or Enlarge QR Code"
          >
            {shareUrl ? (
              <QRCodeSVG value={shareUrl} size={32} level="M" />
            ) : (
              <div className="h-8 w-8 bg-slate-200 rounded" />
            )}
          </button>
        </div>

        {/* Professional ID Banner */}
        <div className="rounded-2xl bg-blue-50/80 p-4 border border-blue-100/80">
          <p className="text-[10px] font-bold uppercase text-blue-600 tracking-wider">
            Professional ID
          </p>
          <p className="text-2xl font-black text-blue-600 tracking-tight font-mono mt-0.5">
            {profile.professionalId}
          </p>
        </div>

        {/* Primary Focus */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Primary focus
          </p>
          <p className="text-xs font-medium text-slate-800 mt-1 leading-relaxed">
            {profile.about}
          </p>
        </div>

        {/* Core Competencies */}
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

        {/* Clean 2x2 Metrics Grid (Inner Badges Removed) */}
        <div className="grid grid-cols-2 gap-2.5 pt-1">
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

        {/* Public Profile Link */}
        <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-2.5 flex items-center justify-between text-[11px]">
          <span className="flex items-center gap-1.5 font-bold text-slate-700">
            <Globe className="h-3.5 w-3.5 text-blue-600" /> Public profile
          </span>
          <span className="font-mono font-bold text-blue-600">/{profile.professionalId}</span>
        </div>

        <button
          onClick={() => setShowQrModal(true)}
          className="w-full text-[10px] text-center text-slate-400 font-medium hover:text-blue-600 cursor-pointer transition"
        >
          Click QR code to view, download, or share.
        </button>
      </div>

      {/* QR Code Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm rounded-3xl bg-white p-6 text-center shadow-2xl space-y-5 border border-slate-100">
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
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow hover:bg-blue-700 transition"
              >
                <Share2 className="h-4 w-4" /> Share Link
              </button>

              <button
                onClick={handleCopyLink}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-100 px-4 py-2.5 text-xs font-bold text-slate-800 hover:bg-slate-200 transition"
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