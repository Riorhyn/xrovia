"use client";

import React, { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Briefcase, Check, CheckCircle2, Copy, FolderGit2, GraduationCap, MapPin, Share2, ShieldCheck, Wrench, X } from "lucide-react";

const DEMO_PROFILE = {
  fullName: "Alex Morgan",
  headline: "Product Design Engineer",
  location: "San Francisco, CA",
  about: "Mechanical engineer focused on product design, manufacturing and sustainable systems.",
  skills: ["SolidWorks", "GD&T", "Manufacturing", "Python"],
  professionalId: "PR-159481",
};

export function DigitalIdPreview() {
  const [showQrModal, setShowQrModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [strengthVisible, setStrengthVisible] = useState(false);
  const shareUrl = typeof window !== "undefined" ? window.location.origin + "/" + DEMO_PROFILE.professionalId : "https://xrovia.com/PR-159481";

  useEffect(() => {
    const el = document.getElementById("record-strength-bar");
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setStrengthVisible(true); observer.disconnect(); } }, { threshold: 0.5 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const recordItems = [
    { label: "Education", count: "01", summary: "B.E. Mechanical Engineering", Icon: GraduationCap, status: "Verified" },
    { label: "Experience", count: "05+", summary: "Product Design Engineer", Icon: Briefcase, status: "Verified" },
    { label: "Skills", count: "12", summary: "CAD · GD&T · Manufacturing", Icon: Wrench, status: "Self-added" },
    { label: "Projects", count: "08", summary: "Solar tracking system", Icon: FolderGit2, status: "Collaborative" },
  ];

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: DEMO_PROFILE.fullName + "'s Professional ID", text: "View " + DEMO_PROFILE.fullName + "'s professional record.", url: shareUrl });
    } else {
      await handleCopyLink();
    }
  };

  return (
    <>
      <div className="mx-auto w-full max-w-sm overflow-hidden rounded-[1.75rem] border border-slate-200/90 bg-white text-slate-900 shadow-xl shadow-slate-300/20">
        <div className="border-b border-slate-100 bg-gradient-to-br from-white via-white to-blue-50/60 p-5">
          <div className="flex items-center justify-between">
            <img src="/ChatGPT Image Sep 27, 2026, 04_14_14 PM.png" alt="XROVIA" className="h-7 w-auto object-contain" />
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700"><ShieldCheck className="h-3 w-3" /> Profile verified</span>
          </div>
          <div className="mt-5 flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-blue-100 bg-blue-50 font-extrabold text-sm text-blue-800">AM</div>
              <div className="min-w-0">
                <h3 className="truncate text-base font-bold leading-tight text-slate-950">{DEMO_PROFILE.fullName}</h3>
                <p className="mt-0.5 truncate text-xs text-slate-500">{DEMO_PROFILE.headline}</p>
                <p className="mt-1 flex items-center gap-1 truncate text-[11px] text-slate-400"><MapPin className="h-3 w-3" /> {DEMO_PROFILE.location}</p>
              </div>
            </div>
            <button onClick={() => setShowQrModal(true)} className="shrink-0 rounded-xl border border-slate-200 bg-white p-1.5 shadow-sm hover:border-blue-200 hover:bg-blue-50" title="View QR code"><QRCodeSVG value={shareUrl} size={32} level="M" /></button>
          </div>
          <div className="mt-5 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 p-4 text-white shadow-lg shadow-blue-600/15">
            <div className="flex items-center justify-between"><p className="text-[10px] font-bold uppercase tracking-[0.14em] text-blue-100">Professional ID</p><span className="rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[10px] font-bold text-blue-50">Active</span></div>
            <p className="mt-1.5 font-mono text-xl font-black tracking-tight">{DEMO_PROFILE.professionalId}</p>
          </div>
        </div>
        <div className="space-y-5 p-5">
          <div><p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">Professional focus</p><p className="mt-1 line-clamp-2 text-xs font-medium leading-relaxed text-slate-700">{DEMO_PROFILE.about}</p></div>
          <div>
            <div className="mb-2 flex items-center justify-between"><p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">Core skills</p><span className="text-[10px] font-semibold text-slate-400">12 skills</span></div>
            <div className="flex flex-wrap gap-1.5">{DEMO_PROFILE.skills.map(skill => <span key={skill} className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-bold text-slate-700">{skill}</span>)}</div>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            {recordItems.map(({label,count,summary,Icon,status}) => (
              <div key={label} className="min-h-[76px] rounded-xl border border-slate-200/80 bg-slate-50/60 p-3 transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50/40 hover:shadow-md">
                <div className="flex items-center justify-between gap-2"><span className="flex items-center gap-1.5 text-[11px] font-bold text-slate-800"><Icon className="h-3.5 w-3.5 text-blue-600" />{label}</span><span className="text-xs font-black text-blue-600">{count}</span></div>
                <p className="mt-2 line-clamp-2 text-[10px] font-semibold leading-tight text-slate-600">{summary}</p>
                <span className={`mt-2 inline-flex rounded-full px-1.5 py-0.5 text-[8px] font-bold ${status === "Verified" ? "bg-emerald-50 text-emerald-700" : status === "Collaborative" ? "bg-blue-50 text-blue-700" : "bg-slate-200 text-slate-600"}`}>{status}</span>
              </div>
            ))}
          </div>
          <div className="rounded-xl border border-blue-100 bg-blue-50/60 px-3 py-2.5 text-[11px]" id="record-strength-bar">
            <div className="flex items-center justify-between"><span className="font-bold text-slate-700">Record strength</span><span className="font-black text-blue-700">Strong</span></div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-blue-100"><div className={`h-full rounded-full bg-blue-600 transition-[width] duration-1000 ease-out ${strengthVisible ? "w-[82%]" : "w-0"}`} /></div>
          </div>
        </div>
      </div>

      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/65 p-4 backdrop-blur-md">
          <div className="relative w-full max-w-sm space-y-5 rounded-[2rem] border border-slate-100 bg-white p-6 text-center shadow-2xl">
            <button onClick={() => setShowQrModal(false)} className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-100" aria-label="Close QR code"><X className="h-5 w-5" /></button>
            <div><span className="text-xs font-extrabold uppercase tracking-[0.14em] text-blue-600">Professional ID QR</span><h3 className="mt-1 text-lg font-black text-slate-950">{DEMO_PROFILE.fullName}</h3><p className="font-mono text-xs font-bold text-slate-500">{DEMO_PROFILE.professionalId}</p></div>
            <div className="mx-auto flex h-52 w-52 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 p-4"><QRCodeSVG value={shareUrl} size={176} level="H" includeMargin /></div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button onClick={handleNativeShare} className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white"><Share2 className="h-4 w-4" /> Share Link</button>
              <button onClick={handleCopyLink} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-100 px-4 py-2.5 text-xs font-bold text-slate-800">{copied ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}{copied ? "Copied!" : "Copy Link"}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
