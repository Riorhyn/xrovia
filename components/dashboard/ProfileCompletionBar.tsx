"use client";

import React, { useEffect, useState } from "react";

export function ProfileCompletionBar() {
  const [percentage, setPercentage] = useState(0);

  const calculateCompletion = () => {
    const saved = localStorage.getItem("user_profile_data");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        let completed = 0;
        if (parsed.personal?.fullName && parsed.personal?.headline) completed++;
        if ((parsed.experiences || []).length > 0) completed++;
        if ((parsed.educations || []).length > 0) completed++;
        if ((parsed.skills || []).length > 0) completed++;
        if ((parsed.projects || []).length > 0) completed++;
        setPercentage(Math.round((completed / 5) * 100));
      } catch (e) {
        console.error("Error calculating completion:", e);
      }
    }
  };

  useEffect(() => {
    calculateCompletion();
    window.addEventListener("profile_updated", calculateCompletion);
    window.addEventListener("storage", calculateCompletion);
    return () => {
      window.removeEventListener("profile_updated", calculateCompletion);
      window.removeEventListener("storage", calculateCompletion);
    };
  }, []);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
      <div className="flex justify-between items-center text-xs font-bold">
        <span className="text-slate-700">Profile Completion Status</span>
        <span className="text-blue-600 font-mono">{percentage}% Completed</span>
      </div>
      <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
        <div 
          className="h-full bg-blue-600 transition-all duration-500 rounded-full" 
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
