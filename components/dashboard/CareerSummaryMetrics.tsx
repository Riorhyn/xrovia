"use client";

import React, { useEffect, useState } from "react";
import { Briefcase, GraduationCap, Wrench, FolderGit2 } from "lucide-react";

export function CareerSummaryMetrics() {
  const [metrics, setMetrics] = useState({
    experiences: 0,
    educations: 0,
    skills: 0,
    projects: 0,
  });

  const loadMetrics = () => {
    const saved = localStorage.getItem("user_profile_data");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setMetrics({
          experiences: data.experiences?.length || 0,
          educations: data.educations?.length || 0,
          skills: data.skills?.length || 0,
          projects: data.projects?.length || 0,
        });
      } catch (e) {
        console.error(e);
      }
    }
  };

  useEffect(() => {
    loadMetrics();

    window.addEventListener("profile_updated", loadMetrics);
    window.addEventListener("storage", loadMetrics);
    window.addEventListener("focus", loadMetrics);

    return () => {
      window.removeEventListener("profile_updated", loadMetrics);
      window.removeEventListener("storage", loadMetrics);
      window.removeEventListener("focus", loadMetrics);
    };
  }, []);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
      <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
        Career Records Summary
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4 text-center space-y-1">
          <Briefcase className="h-5 w-5 text-blue-600 mx-auto" />
          <p className="text-2xl font-black text-slate-900">{metrics.experiences}</p>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Experience</p>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4 text-center space-y-1">
          <GraduationCap className="h-5 w-5 text-blue-600 mx-auto" />
          <p className="text-2xl font-black text-slate-900">{metrics.educations}</p>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Education</p>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4 text-center space-y-1">
          <Wrench className="h-5 w-5 text-blue-600 mx-auto" />
          <p className="text-2xl font-black text-slate-900">{metrics.skills}</p>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Skills</p>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4 text-center space-y-1">
          <FolderGit2 className="h-5 w-5 text-blue-600 mx-auto" />
          <p className="text-2xl font-black text-slate-900">{metrics.projects}</p>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Projects</p>
        </div>
      </div>
    </div>
  );
}