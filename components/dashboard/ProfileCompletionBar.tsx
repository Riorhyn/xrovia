"use client";

import React, { useEffect, useState } from "react";

export function ProfileCompletionBar() {
  const [percentage, setPercentage] = useState(0);
  const [missingSections, setMissingSections] = useState<string[]>([]);

  const calculateCompletion = () => {
    const saved = localStorage.getItem("user_profile_data");
    if (!saved) {
      setPercentage(10);
      setMissingSections(["Personal Info", "Experience", "Education", "Skills"]);
      return;
    }

    try {
      const data = JSON.parse(saved);
      let score = 0;
      const missing: string[] = [];

      // Personal Details (20%)
      if (data.personal?.fullName && data.personal?.headline) {
        score += 20;
      } else {
        missing.push("Personal Details");
      }

      // Profile Photo (10%)
      if (data.personal?.photoUrl) {
        score += 10;
      } else {
        missing.push("Profile Photo");
      }

      // Work Experience (20%)
      if (data.experiences && data.experiences.length > 0) {
        score += 20;
      } else {
        missing.push("Work Experience");
      }

      // Education (20%)
      if (data.educations && data.educations.length > 0) {
        score += 20;
      } else {
        missing.push("Education");
      }

      // Skills (15%)
      if (data.skills && data.skills.length > 0) {
        score += 15;
      } else {
        missing.push("Skills");
      }

      // Projects or Achievements (15%)
      if ((data.projects && data.projects.length > 0) || (data.achievements && data.achievements.length > 0)) {
        score += 15;
      } else {
        missing.push("Projects / Achievements");
      }

      setPercentage(score);
      setMissingSections(missing);
    } catch (e) {
      console.error(e);
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
        <span className="text-blue-700 font-extrabold">{percentage}% Completed</span>
      </div>

      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-600 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <p className="text-xs text-slate-500">
        {percentage === 100 ? (
          <span className="text-slate-700 font-bold">
            🎉 Your profile is 100% complete! Records are marked as self-reported until verified by institutions.
          </span>
        ) : (
          <>
            <span className="font-semibold text-slate-700">Suggested sections to complete:</span>{" "}
            {missingSections.join(", ")}.
          </>
        )}
      </p>
    </div>
  );
}