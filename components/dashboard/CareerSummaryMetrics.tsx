"use client";

import React, { useEffect, useState } from "react";
import { Briefcase, GraduationCap, Wrench, FolderGit2 } from "lucide-react";

export function CareerSummaryMetrics() {
  const [counts, setCounts] = useState({ experience: 0, education: 0, skills: 0, projects: 0 });

  const loadCounts = async () => {
    try {
      const res = await fetch("/api/profile/summary");
      if (!res.ok) return;
      const data = await res.json();
      setCounts(data.counts || { experience: 0, education: 0, skills: 0, projects: 0 });
    } catch (e) {
      console.error("Error loading profile summary:", e);
    }
  };

  useEffect(() => {
    loadCounts();
    window.addEventListener("profile_updated", loadCounts);
    return () => window.removeEventListener("profile_updated", loadCounts);
  }, []);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
      <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Career Records Summary</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4 text-center space-y-1"><Briefcase className="h-5 w-5 text-blue-600 mx-auto mb-1" /><p className="text-2xl font-black text-slate-900 font-mono">{counts.experience}</p><p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Experience</p></div>
        <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4 text-center space-y-1"><GraduationCap className="h-5 w-5 text-blue-600 mx-auto mb-1" /><p className="text-2xl font-black text-slate-900 font-mono">{counts.education}</p><p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Education</p></div>
        <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4 text-center space-y-1"><Wrench className="h-5 w-5 text-blue-600 mx-auto mb-1" /><p className="text-2xl font-black text-slate-900 font-mono">{counts.skills}</p><p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Skills</p></div>
        <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4 text-center space-y-1"><FolderGit2 className="h-5 w-5 text-blue-600 mx-auto mb-1" /><p className="text-2xl font-black text-slate-900 font-mono">{counts.projects}</p><p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Projects</p></div>
      </div>
    </div>
  );
}
