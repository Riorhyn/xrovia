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
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
      <div className="flex justify-between items-center text-xs font-bold"><span className="text-slate-700">Profile Completion Status</span><span className="text-blue-600 font-mono">{percentage}% Completed</span></div>
      <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-blue-600 transition-all duration-500 rounded-full" style={{ width: percentage + "%" }} /></div>
      <p className="text-[11px] text-slate-400">Add your photo, summary, achievements, publications, hobbies, and social links to reach 100%.</p>
    </div>
  );
}
