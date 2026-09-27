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

  const metrics = [
    { label: "Experience", value: counts.experience, Icon: Briefcase },
    { label: "Education", value: counts.education, Icon: GraduationCap },
    { label: "Skills", value: counts.skills, Icon: Wrench },
    { label: "Projects", value: counts.projects, Icon: FolderGit2 },
  ];

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Career records summary</h2>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {metrics.map(({ label, value, Icon }) => (
          <div
            key={label}
            className="group rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4 text-center transition hover:-translate-y-0.5 hover:border-blue-100 hover:bg-white hover:shadow-sm"
          >
            <div className="mx-auto grid h-9 w-9 place-items-center rounded-xl bg-blue-50 text-blue-600 ring-1 ring-blue-100/80 transition group-hover:bg-blue-600 group-hover:text-white">
              <Icon className="h-4 w-4" aria-hidden="true" />
            </div>
            <p className="mt-3 font-mono text-2xl font-black tabular-nums text-slate-950">{value}</p>
            <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">{label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}