import { Fingerprint, ShieldCheck, Link2, BriefcaseBusiness, FileCheck2, Users, GraduationCap, History, FolderKanban, type LucideIcon } from "lucide-react";

export const ROUTES = { home: "/", login: "/login", register: "/register", dashboard: "/dashboard", search: "/search" } as const;
export const SAMPLE_ID = "PR-159481";

export type Problem = { title: string; body: string; icon: LucideIcon };
export const PROBLEMS: Problem[] = [
  { title: "One place for your professional history", body: "Bring education, experience, projects, skills, certifications and achievements into one structured identity.", icon: FolderKanban },
  { title: "Show what you can prove", body: "Keep self-added information separate from details confirmed by organizations or people connected to your work.", icon: FileCheck2 },
  { title: "Keep the same identity as you grow", body: "Your Professional ID stays with you while your education, work and skills change over time.", icon: History },
];

export type Step = { title: string; body: string; icon: LucideIcon };
export const STEPS: Step[] = [
  { title: "Build", body: "Bring your education, experience, skills, projects, certifications and achievements into one professional record.", icon: BriefcaseBusiness },
  { title: "Verify", body: "Add evidence and request confirmation for the parts of your record where independent verification matters.", icon: ShieldCheck },
  { title: "Share", body: "Use one Professional ID and a public profile to present the information you choose to share.", icon: Link2 },
];

export type Feature = { title: string; description: string; icon: LucideIcon; label?: string };
export const FEATURES: Feature[] = [
  { title: "Permanent Professional ID", description: "One identity for your professional history, from your first qualification to the work you do later.", icon: Fingerprint, label: "Identity" },
  { title: "Career record", description: "Keep education, work, skills, projects, certifications and achievements connected in one place.", icon: BriefcaseBusiness, label: "Record" },
  { title: "Verification", description: "Show which information is self-added and which parts have been independently confirmed.", icon: ShieldCheck, label: "Trust" },
  { title: "Evidence", description: "Attach supporting material to the parts of your professional history that need context or proof.", icon: FileCheck2, label: "Proof" },
  { title: "Projects & collaborations", description: "Connect people, roles and responsibilities to the work you have actually done.", icon: Users, label: "Work" },
  { title: "Public profile", description: "Share a clear professional view without rebuilding the same information for every opportunity.", icon: Link2, label: "Sharing" },
];

export type AudienceItem = { title: string; icon: LucideIcon };
export const AUDIENCES: AudienceItem[] = [
  { title: "Students", icon: GraduationCap },
  { title: "Graduates", icon: BriefcaseBusiness },
  { title: "Working professionals", icon: History },
  { title: "Researchers & project teams", icon: Users },
];

export const WHY_XROVIA = PROBLEMS;
export const SEARCH_EXAMPLE = { id: SAMPLE_ID, name: "Alex Morgan", headline: "Product Design Engineer", verifiedItems: 6 };
