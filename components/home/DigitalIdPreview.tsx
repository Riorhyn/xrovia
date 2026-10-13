"use client";

import React, { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Briefcase, CheckCircle2, Copy, FolderGit2, GraduationCap, MapPin, Share2, ShieldCheck, Wrench, X, Sparkles } from "lucide-react";

const DEMO_PROFILE = {
  fullName: "Alex Morgan",
  headline: "Product Design Engineer",
  location: "San Francisco, CA",
  about: "Mechanical engineer focused on product design, manufacturing systems, and sustainable hardware engineering.",
  skills: ["SolidWorks", "GD&T", "Manufacturing", "Python", "CAD / CAM"],
  professionalId: "XR-159481",
  verifiedCount: 6,
};

export function DigitalIdPreview() {
  const [profile, setProfile] = useState(DEMO_PROFILE);
  const [showQrModal, setShowQrModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"card" | "verified">("card");

  React.useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/profile/summary");
        if (res.ok) {
          const data = await res.json();
          if (data.profile?.fullName) {
            setProfile({
              fullName: data.profile.fullName,
              headline: data.profile.headline || "Professional Member",
              location: data.profile.location || "Verified Location",
              about: data.profile.about || "Digital Professional Identity on XROVIA.",
              skills: Array.isArray(data.profile.skills) && data.profile.skills.length > 0
                ? data.profile.skills.map((s: any) => typeof s === "string" ? s : s.name).slice(0, 5)
                : ["Verified Record", "Professional ID"],
              professionalId: data.profile.professionalId || "XR-159481",
              verifiedCount: data.profile.verificationStatus === "VERIFIED" ? 8 : 4,
            });
          }
        }
      } catch {
        // Fallback to sample demo profile when unauthenticated
      }
    })();
  }, []);

  const shareUrl = typeof window !== "undefined" ? window.location.origin + "/" + profile.professionalId : "https://xrovia.com/XR-159481";

  const recordItems = [
    { label: "Education", count: "01", summary: "B.E. Mechanical Engineering", Icon: GraduationCap, status: "Verified" },
    { label: "Experience", count: "05+", summary: "Product Design Engineer", Icon: Briefcase, status: "Verified" },
    { label: "Skills", count: "12", summary: "CAD · GD&T · Manufacturing", Icon: Wrench, status: "Self-added" },
    { label: "Projects", count: "08", summary: "Solar tracking system", Icon: FolderGit2, status: "Collaborative" },
  ];

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: `${profile.fullName}'s Professional ID`, text: `View ${profile.fullName}'s verified professional identity.`, url: shareUrl });
      } catch {
        // user cancelled or share failed
      }
    } else {
      await handleCopyLink();
    }
  };

  return (
    <>
      <div className="mx-auto w-full max-w-sm overflow-hidden rounded-[2rem] border border-slate-200/90 bg-white text-slate-900 shadow-2xl shadow-slate-900/10 transition-all duration-300">
        {/* Header Ribbon */}
        <div className="border-b border-slate-100 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 p-5 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono text-[10px] font-extrabold uppercase tracking-widest text-slate-300">Permanent ID</span>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300 backdrop-blur-md">
              <ShieldCheck className="h-3 w-3 text-emerald-400" /> Verified Record
            </span>
          </div>

          <div className="mt-5 flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 font-black text-sm text-white shadow-md shadow-blue-500/20">
                {profile.fullName?.[0]?.toUpperCase() || "X"}
              </div>
              <div className="min-w-0">
                <h3 className="truncate text-base font-extrabold text-white">{profile.fullName}</h3>
                <p className="mt-0.5 truncate text-xs text-slate-300">{profile.headline}</p>
                <p className="mt-1 flex items-center gap-1 truncate text-[11px] text-slate-400">
                  <MapPin className="h-3 w-3 text-blue-400" /> {profile.location}
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowQrModal(true)}
              className="shrink-0 rounded-xl border border-white/10 bg-white/10 p-2 text-white shadow-sm transition hover:border-white/20 hover:bg-white/20"
              title="View Identity QR Code"
              aria-label="View Identity QR Code"
            >
              <QRCodeSVG value={shareUrl} size={30} level="M" />
            </button>
          </div>

          {/* Unique ID Badge */}
          <div className="mt-5 rounded-2xl border border-white/10 bg-gradient-to-r from-blue-600 to-indigo-600 p-3.5 text-white shadow-lg shadow-blue-600/25">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-blue-100">XROVIA Unique ID</p>
              <span className="rounded-full bg-white/15 px-2 py-0.5 text-[9px] font-bold tracking-wider text-white">Active</span>
            </div>
            <p className="mt-1 font-mono text-xl font-black tracking-tight text-white">{profile.professionalId}</p>
          </div>
        </div>

        {/* Card Interactive Tabs & Body */}
        <div className="p-5">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <button
              onClick={() => setActiveTab("card")}
              className={`rounded-lg px-3 py-1 text-xs font-bold transition ${activeTab === "card" ? "bg-blue-50 text-blue-700" : "text-slate-500 hover:text-slate-900"}`}
            >
              Identity Record
            </button>
            <button
              onClick={() => setActiveTab("verified")}
              className={`rounded-lg px-3 py-1 text-xs font-bold transition ${activeTab === "verified" ? "bg-blue-50 text-blue-700" : "text-slate-500 hover:text-slate-900"}`}
            >
              Verification ({profile.verifiedCount})
            </button>
          </div>

          {activeTab === "card" ? (
            <div className="mt-4 space-y-4">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-slate-400">Professional Summary</p>
                <p className="mt-1 line-clamp-2 text-xs font-medium leading-relaxed text-slate-700">{profile.about}</p>
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-slate-400">Core Capabilities</p>
                  <span className="text-[10px] font-bold text-blue-600">Verified Skills</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {profile.skills.map((skill) => (
                    <span key={skill} className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-bold text-slate-800">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {recordItems.map(({ label, count, summary, Icon, status }) => (
                  <div
                    key={label}
                    className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-2.5 transition duration-200 hover:border-blue-300 hover:bg-white hover:shadow-md"
                  >
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-[11px] font-bold text-slate-800">
                        <Icon className="h-3.5 w-3.5 text-blue-600" />
                        {label}
                      </span>
                      <span className="text-xs font-black text-slate-900">{count}</span>
                    </div>
                    <p className="mt-1 line-clamp-1 text-[10px] font-medium text-slate-600">{summary}</p>
                    <span
                      className={`mt-1.5 inline-flex rounded-full px-1.5 py-0.5 text-[8px] font-bold ${
                        status === "Verified"
                          ? "bg-emerald-50 text-emerald-700"
                          : status === "Collaborative"
                          ? "bg-blue-50 text-blue-700"
                          : "bg-slate-200 text-slate-700"
                      }`}
                    >
                      {status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="mt-4 space-y-2.5">
              {[
                { title: "Degree Verification", issuer: "University of California", status: "Verified by Registrar", date: "2022" },
                { title: "Employment Verification", issuer: "Apex Hardware Systems", status: "Verified by HR", date: "2023 - Present" },
                { title: "Project Proof", issuer: "Solar Tracker Hardware", status: "4 Peer Collaborators", date: "2024" },
              ].map((v) => (
                <div key={v.title} className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs">
                  <div className="flex items-center justify-between font-bold text-slate-900">
                    <span>{v.title}</span>
                    <span className="text-[10px] font-semibold text-slate-500">{v.date}</span>
                  </div>
                  <p className="mt-0.5 text-[11px] text-slate-600">{v.issuer}</p>
                  <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-bold text-emerald-700">
                    <ShieldCheck className="h-3 w-3" /> {v.status}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Record Health Footer */}
          <div className="mt-4 rounded-xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50/50 p-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 font-bold text-slate-800">
                <Sparkles className="h-3.5 w-3.5 text-blue-600" /> Identity Record Health
              </span>
              <span className="font-extrabold text-blue-700">92% Complete</span>
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-blue-200/60">
              <div className="h-full w-[92%] rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-1000" />
            </div>
          </div>
        </div>
      </div>

      {/* QR Share Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-md">
          <div className="relative w-full max-w-sm space-y-5 rounded-[2rem] border border-slate-100 bg-white p-6 text-center shadow-2xl">
            <button
              onClick={() => setShowQrModal(false)}
              className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-800"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>
            <div>
              <span className="text-xs font-extrabold uppercase tracking-[0.14em] text-blue-600">Scan Professional ID</span>
              <h3 className="mt-1 text-lg font-black text-slate-950">{DEMO_PROFILE.fullName}</h3>
              <p className="font-mono text-xs font-bold text-slate-500">{DEMO_PROFILE.professionalId}</p>
            </div>
            <div className="mx-auto flex h-52 w-52 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-inner">
              <QRCodeSVG value={shareUrl} size={176} level="H" includeMargin />
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={handleNativeShare}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-blue-700"
              >
                <Share2 className="h-4 w-4" /> Share Link
              </button>
              <button
                onClick={handleCopyLink}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-100 px-4 py-2.5 text-xs font-bold text-slate-800 hover:bg-slate-200"
              >
                {copied ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copied!" : "Copy Link"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
