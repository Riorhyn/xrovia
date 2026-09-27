"use client";

import React, { useEffect, useState } from "react";

export function ProfileCompletionBar() {
  const [percentage, setPercentage] = useState(0);

  const loadCompletion = async () => {
    try {
      const res = await fetch("/api/profile/summary");
      if (!res.ok) return;
      const data = await res.json();
      setPercentage(Number(data.completion || 0));
    } catch (e) {
      console.error("Error loading profile completion:", e);
    }
  };

  useEffect(() => {
    loadCompletion();
    window.addEventListener("profile_updated", loadCompletion);
    return () => window.removeEventListener("profile_updated", loadCompletion);
  }, []);

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-sm font-black text-slate-900">Profile completion</h2>
          <p className="mt-0.5 text-[11px] text-slate-500">Keep the record useful by filling the important sections.</p>
        </div>
        <span className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 font-mono text-xs font-bold text-blue-700">
          {percentage}% complete
        </span>
      </div>
      <div
        className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-slate-100"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percentage}
        aria-label="Profile completion"
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-500"
          style={{ width: percentage + "%" }}
        />
      </div>
      <p className="mt-3 text-[11px] leading-5 text-slate-400">
        Add your photo, summary, achievements, publications, hobbies, and social links to reach 100%.
      </p>
    </section>
  );
}