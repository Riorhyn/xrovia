"use client";

import React, { useEffect, useState } from "react";

export function ProfileCompletionBar() {
  const [percentage, setPercentage] = useState(0);

  const calculateCompletion = () => {
    const saved = localStorage.getItem("user_profile_data");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        
        let totalSections = 10;
        let completedSections = 0;

        // 1. Full Name & Headline
        if (parsed.personal?.fullName && parsed.personal?.headline) completedSections++;
        // 2. Profile Photo
        if (parsed.personal?.photoUrl) completedSections++;
        // 3. About Summary / Primary Focus
        if (parsed.personal?.about) completedSections++;
        // 4. Work Experience
        if ((parsed.experiences || []).length > 0) completedSections++;
        // 5. Education
        if ((parsed.educations || []).length > 0) completedSections++;
        // 6. Skills
        if ((parsed.skills || []).length > 0) completedSections++;
        // 7. Projects
        if ((parsed.projects || []).length > 0) completedSections++;
        // 8. Achievements / Certifications
        if ((parsed.achievements || []).length > 0) completedSections++;
        // 9. Publications
        if ((parsed.publications || []).length > 0) completedSections++;
        // 10. Social Links or Hobbies
        if (
          (parsed.hobbies || []).length > 0 || 
          (parsed.socials && Object.values(parsed.socials).some(Boolean))
        ) {
          completedSections++;
        }

        const calculated = Math.round((completedSections / totalSections) * 100);
        setPercentage(calculated);
      } catch (e) {
        console.error("Error calculating profile completion:", e);
      }
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
