"use client";

import React, { useEffect, useState } from "react";
import { ShieldAlert } from "lucide-react";

export function UserDigitalIdCard() {
  const [profile, setProfile] = useState({
    fullName: "Candidate Name",
    headline: "Professional Headline",
    location: "Location not provided",
    photoUrl: "",
    professionalId: "PR-159481",
  });

  const loadData = () => {
    const saved = localStorage.getItem("user_profile_data");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.personal) {
          setProfile({
            fullName: parsed.personal.fullName || "Candidate Name",
            headline: parsed.personal.headline || "Professional Headline",
            location: parsed.personal.location || "Location not provided",
            photoUrl: parsed.personal.photoUrl || "",
            professionalId: "PR-159481",
          });
        }
      } catch (e) {
        console.error("Error loading ID card:", e);
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

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
      <div className="flex justify-between items-start">
        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">XROVIA ID</span>
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[10px] font-bold text-amber-800 border border-amber-200">
          <ShieldAlert className="h-3 w-3 text-amber-600" /> Self-Reported
        </span>
      </div>

      <div className="flex items-center gap-4 py-2">
        <div className="h-16 w-16 rounded-2xl bg-blue-600 text-white font-black text-xl flex items-center justify-center overflow-hidden shrink-0">
          {profile.photoUrl ? (
            <img src={profile.photoUrl} alt={profile.fullName} className="h-full w-full object-cover" />
          ) : (
            <span>{profile.fullName?.[0]?.toUpperCase() || "U"}</span>
          )}
        </div>
        <div className="overflow-hidden">
          <h3 className="text-sm font-bold text-slate-900 truncate">{profile.fullName}</h3>
          <p className="text-xs text-slate-500 truncate">{profile.headline}</p>
          <p className="text-[11px] text-slate-400 truncate mt-0.5">{profile.location}</p>
        </div>
      </div>

      <div className="rounded-2xl bg-slate-50 p-3 border border-slate-100 flex items-center justify-between">
        <div>
          <span className="text-[9px] font-bold uppercase text-slate-400 block">Professional ID</span>
          <span className="text-xs font-black font-mono text-slate-800">{profile.professionalId}</span>
        </div>
        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
          Active
        </span>
      </div>
    </div>
  );
}
