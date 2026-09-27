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
  MapPin,
} from "lucide-react";

export function DigitalIdPreview() {
  const [showQrModal, setShowQrModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [isVerified, setIsVerified] = useState(false);

  const [profile, setProfile] = useState({
    fullName: "Candidate Name",
    headline: "Professional Headline",
    location: "Location not provided",
    about: "Professional summary",
    photoUrl: "",
    skills: ["Core Competency"],
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

  const loadProfile = async () => {
    try {
      const res = await fetch("/api/profile");

      if (!res.ok) return;

      const data = await res.json();
      const dbProfile = data.user?.profile || {};
      const fullData = dbProfile.fullData || {};

      const edus = fullData.educations || [];
      const exps = fullData.experiences || [];
      const skls = fullData.skills || [];
      const prjs = fullData.projects || [];

      const eduSummary = edus[0]
        ? [edus[0].degree, edus[0].fieldOfStudy].filter(Boolean).join(" - ")
        : "No degree added";

      const expSummary = exps[0]
        ? [exps[0].role, exps[0].company].filter(Boolean).join(" at ")
        : "No experience added";

      const sklSummary = skls.length ? skls.slice(0, 3).join(", ") : "No skills listed";
      const prjSummary = prjs[0] ? prjs[0].title : "No projects added";

      setProfile({
        fullName: dbProfile.fullName || "Candidate Name",
        headline: dbProfile.headline || "Professional Headline",
        location: dbProfile.location || "Location not provided",
        about: dbProfile.about || "Professional summary",
        photoUrl: dbProfile.photoUrl || "",
        skills: skls.length ? skls : ["Core Competency"],
        educationCount: edus.length,
        educationSummary: eduSummary,
        experienceCount: exps.length,
        experienceSummary: expSummary,
        skillsCount: skls.length,
        skillsSummary: sklSummary,
        projectsCount: prjs.length,
        projectsSummary: prjSummary,
        professionalId: dbProfile.professionalId || "PR-159481",
      });

      localStorage.setItem("user_profile_data", JSON.stringify(fullData));
    } catch (e) {
      console.error("Database profile read error:", e);
    }
  };

  useEffect(() => {
    loadProfile();

    window.addEventListener("profile_updated", loadProfile);
    window.addEventListener("storage", loadProfile);

    return () => {
      window.removeEventListener("profile_updated", loadProfile);
      window.removeEventListener("storage", loadProfile);
    };
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && profile.professionalId) {
      setShareUrl(window.location.origin + "/" + profile.professionalId);
    }
  }, [profile.professionalId]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: profile.fullName + "'s Professional ID",
          text: "Inspect record for " + profile.fullName + " (" + profile.professionalId + ")",
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
    ? profile.fullName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "C";

  const recordItems = [
    { label: "Education", count: profile.educationCount, summary: profile.educationSummary, Icon: GraduationCap },
    { label: "Experience", count: profile.experienceCount, summary: profile.experienceSummary, Icon: Briefcase },
    { label: "Skills", count: profile.skillsCount, summary: profile.skillsSummary, Icon: Wrench },
    { label: "Projects", count: profile.projectsCount, summary: profile.projectsSummary, Icon: FolderGit2 },
  ];

  return (
    <>
      <div className="mx-auto w-full max-w-sm overflow-hidden rounded-[1.75rem] border border-slate-200/90 bg-white text-slate-900 shadow-xl shadow-slate-300/20">
        <div className="border-b border-slate-100 bg-gradient-to-br from-white via-white to-blue-50/60 p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-xs font-black tracking-wider text-white shadow-sm">
                X
              </div>
              <span className="text-xs font-black uppercase tracking-[0.14em] text-slate-900">XROVIA</span>
            </div>

            {isVerified ? (
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
                <ShieldCheck className="h-3 w-3" /> Verified
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[10px] font-bold text-amber-800">
                <ShieldAlert className="h-3 w-3" /> Self-Reported
              </span>
            )}
          </div>

          <div className="mt-5 flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-2xl border border-blue-100 bg-blue-50 font-extrabold text-sm text-blue-800 shadow-sm">
                {profile.photoUrl ? (
                  <img src={profile.photoUrl} alt={profile.fullName} className="h-full w-full object-cover" />
                ) : (
                  <span>{initials}</span>
                )}
              </div>
              <div className="min-w-0">
                <h3 className="truncate text-base font-bold leading-tight text-slate-950">{profile.fullName}</h3>
                <p className="mt-0.5 truncate text-xs text-slate-500">{profile.headline}</p>
                <p className="mt-1 flex items-center gap-1 truncate text-[11px] text-slate-400">
                  <MapPin className="h-3 w-3 shrink-0" /> {profile.location}
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowQrModal(true)}
              className="shrink-0 rounded-xl border border-slate-200 bg-white p-1.5 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:shadow"
              title="Scan or Enlarge QR Code"
            >
              {shareUrl ? <QRCodeSVG value={shareUrl} size={32} level="M" /> : <div className="h-8 w-8 rounded bg-slate-200" />}
            </button>
          </div>

          <div className="mt-5 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 p-4 text-white shadow-lg shadow-blue-600/15">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-blue-100">Professional ID</p>
              <span className="rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[10px] font-bold text-blue-50">Active</span>
            </div>
            <p className="mt-1.5 font-mono text-xl font-black tracking-tight">{profile.professionalId}</p>
          </div>
        </div>

        <div className="space-y-5 p-5">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">Primary focus</p>
            <p className="mt-1 line-clamp-2 text-xs font-medium leading-relaxed text-slate-700">{profile.about}</p>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">Core competencies</p>
              <span className="text-[10px] font-semibold text-slate-400">{profile.skillsCount} skills</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {profile.skills.slice(0, 4).map((skill) => (
                <span key={skill} className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-bold text-slate-700">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {recordItems.map(({ label, count, summary, Icon }) => (
              <div key={label} className="min-h-[68px] rounded-xl border border-slate-200/80 bg-slate-50/60 p-3 transition hover:border-blue-100 hover:bg-white">
                <div className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-1.5 text-[11px] font-bold text-slate-800">
                    <Icon className="h-3.5 w-3.5 shrink-0 text-blue-600" /> {label}
                  </span>
                  <span className="text-xs font-black text-blue-600">{count}</span>
                </div>
                <p className="mt-2 line-clamp-2 text-[10px] font-semibold leading-tight text-slate-600">{summary}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between rounded-xl border border-blue-100 bg-blue-50/60 px-3 py-2.5 text-[11px]">
            <span className="flex items-center gap-1.5 font-bold text-slate-700">
              <Globe className="h-3.5 w-3.5 text-blue-600" /> Public Profile
            </span>
            <span className="font-mono font-bold text-blue-700">/{profile.professionalId}</span>
          </div>
        </div>
      </div>

      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/65 p-4 backdrop-blur-md">
          <div className="relative w-full max-w-sm space-y-5 rounded-[2rem] border border-slate-100 bg-white p-6 text-center shadow-2xl">
            <button
              onClick={() => setShowQrModal(false)}
              className="absolute right-4 top-4 rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              aria-label="Close QR code"
            >
              <X className="h-5 w-5" />
            </button>
            <div>
              <span className="text-xs font-extrabold uppercase tracking-[0.14em] text-blue-600">Professional ID QR</span>
              <h3 className="mt-1 text-lg font-black text-slate-950">{profile.fullName}</h3>
              <p className="font-mono text-xs font-bold text-slate-500">{profile.professionalId}</p>
            </div>
            <div className="mx-auto flex h-52 w-52 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-inner">
              {shareUrl && <QRCodeSVG value={shareUrl} size={176} level="H" includeMargin />}
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button onClick={handleNativeShare} className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm shadow-blue-600/20 transition hover:bg-blue-700">
                <Share2 className="h-4 w-4" /> Share Link
              </button>
              <button onClick={handleCopyLink} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-100 px-4 py-2.5 text-xs font-bold text-slate-800 transition hover:bg-slate-200">
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