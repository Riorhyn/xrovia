interface CompletionProfile {
  fullName?: string | null;
  headline?: string | null;
  about?: string | null;
  photoUrl?: string | null;
  education?: any[];
  experience?: any[];
  skills?: any[];
  projects?: any[];
  certifications?: any[];
  socialLinks?: any[];
}

export function calculateProfileCompletion(profile: CompletionProfile | null): {
  percentage: number;
  missingSections: string[];
} {
  if (!profile) return { percentage: 0, missingSections: ["All sections missing"] };

  const checks = [
    { name: "Personal headline", passed: !!profile.headline },
    { name: "About summary", passed: !!profile.about && profile.about.length > 20 },
    { name: "Profile photo", passed: !!profile.photoUrl },
    { name: "Education record", passed: (profile.education?.length ?? 0) > 0 },
    { name: "Work experience", passed: (profile.experience?.length ?? 0) > 0 },
    { name: "Skills (at least 3)", passed: (profile.skills?.length ?? 0) >= 3 },
    { name: "Projects or achievements", passed: (profile.projects?.length ?? 0) > 0 || (profile.certifications?.length ?? 0) > 0 },
  ];

  const passedCount = checks.filter((c) => c.passed).length;
  const percentage = Math.round((passedCount / checks.length) * 100);
  const missingSections = checks.filter((c) => !c.passed).map((c) => c.name);

  return { percentage, missingSections };
}