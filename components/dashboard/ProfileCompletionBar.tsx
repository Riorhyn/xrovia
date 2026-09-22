"use client";

import React, { useEffect, useState } from "react";

export function ProfileCompletionBar() {
  const [percentage, setPercentage] = useState(0);

  const calculateCompletion = async () => {
  try {
    const res = await fetch("/api/profile");

    if (!res.ok) return;

    const data = await res.json();

    const profile = data.user?.profile || {};
    const fullData = profile.fullData || {};

    const personal = fullData.personal || {
      fullName: profile.fullName || "",
      headline: profile.headline || "",
      photoUrl: profile.photoUrl || "",
      about: profile.about || "",
    };

    let totalSections = 10;
    let completedSections = 0;

    if (personal.fullName && personal.headline) completedSections++;
    if (personal.photoUrl) completedSections++;
    if (personal.about) completedSections++;
    if ((fullData.experiences || []).length > 0) completedSections++;
    if ((fullData.educations || []).length > 0) completedSections++;
    if ((fullData.skills || []).length > 0) completedSections++;
    if ((fullData.projects || []).length > 0) completedSections++;
    if ((fullData.achievements || []).length > 0) completedSections++;
    if ((fullData.publications || []).length > 0) completedSections++;

    if (
      (fullData.hobbies || []).length > 0 ||
      Object.values(fullData.socials || {}).some(Boolean)
    ) {
      completedSections++;
    }

    setPercentage(
      Math.round((completedSections / totalSections) * 100)
    );
  } catch (e) {
    console.error("Error calculating profile completion:", e);
  }
};

  useEffect(() => {
    calculateCompletion();
    window.addEventListener("profile_updated", calculateCompletion);
    window.addEventListener("storage", calculateCompletion);
    window.addEventListener("focus", calculateCompletion);

    return () => {
      window.removeEventListener("profile_updated", calculateCompletion);
      window.removeEventListener("storage", calculateCompletion);
      window.removeEventListener("focus", calculateCompletion);
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
      <p className="text-[11px] text-slate-400">
        Add your photo, summary, achievements, publications, hobbies, and social links to reach 100%.
      </p>
    </div>
  );
}
