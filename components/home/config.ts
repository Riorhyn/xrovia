import {
  Fingerprint,
  ShieldCheck,
  Link2,
  History,
  Users,
  Building2,
  FileCheck2,
  Search,
  ArrowRight,
  BriefcaseBusiness,
  GraduationCap,
  FolderKanban,
  type LucideIcon,
} from "lucide-react";

export const ROUTES = {
  home: "/",
  login: "/login",
  register: "/register",
  dashboard: "/dashboard",
  search: "/search",
} as const;

export const SAMPLE_ID = "PR-159481";

export type Problem = { title: string; body: string; icon: LucideIcon };
export const PROBLEMS: Problem[] = [
  {
    title: "Your professional story is scattered",
    body: "Education, work, projects, certificates and evidence live in different places. Your history gets rebuilt whenever someone asks for it.",
    icon: FolderKanban,
  },
  {
    title: "A claim is not the same as proof",
    body: "A CV or profile can say what you did. It does not automatically show which parts were confirmed by the people or organizations involved.",
    icon: FileCheck2,
  },
  {
    title: "Your record keeps changing",
    body: "A career is not a document you finish once. New work, skills, projects and qualifications keep getting added.",
    icon: History,
  },
  {
    title: "The people behind your work disappear",
    body: "Projects often become a line on a CV even though the real story includes roles, collaborators, responsibilities and organizations.",
    icon: Users,
  },
];

export type Step = { title: string; body: string; icon: LucideIcon };
export const STEPS: Step[] = [
  {
    title: "Create one Professional ID",
    body: "Start one professional record instead of another document that becomes outdated.",
    icon: Fingerprint,
  },
  {
    title: "Build your career record",
    body: "Add education, experience, skills, projects, certifications, achievements and supporting evidence.",
    icon: BriefcaseBusiness,
  },
  {
    title: "Add confirmation where it matters",
    body: "Request verification or collaboration confirmation from relevant people and organizations.",
    icon: ShieldCheck,
  },
  {
    title: "Share the record",
    body: "Give someone your Professional ID or public profile when they need to understand your background.",
    icon: Link2,
  },
  {
    title: "Keep it alive",
    body: "Your ID stays the same while your professional history grows and changes.",
    icon: History,
  },
];

export type Feature = {
  title: string;
  description: string;
  icon: LucideIcon;
  label?: string;
};
export const FEATURES: Feature[] = [
  {
    title: "One permanent Professional ID",
    description: "A single identity that stays with your professional record as it grows.",
    icon: Fingerprint,
    label: "Identity",
  },
  {
    title: "Structured career record",
    description: "Keep education, work, skills, projects, certifications and achievements connected instead of scattered.",
    icon: BriefcaseBusiness,
    label: "Record",
  },
  {
    title: "Verification",
    description: "Separate information you entered yourself from information that has been independently confirmed.",
    icon: ShieldCheck,
    label: "Trust",
  },
  {
    title: "Projects & collaborations",
    description: "Connect people to real work through roles, responsibilities and mutual confirmation.",
    icon: Users,
    label: "Relationships",
  },
  {
    title: "Evidence",
    description: "Attach supporting material to parts of your professional history where evidence is useful.",
    icon: FileCheck2,
    label: "Evidence",
  },
  {
    title: "Public professional profile",
    description: "Share a readable version of your record without sending a folder of separate files.",
    icon: Link2,
    label: "Sharing",
  },
];

export type AudienceItem = { title: string; icon: LucideIcon };
export const AUDIENCES: AudienceItem[] = [
  { title: "Students building their first record", icon: GraduationCap },
  { title: "Graduates entering professional life", icon: BriefcaseBusiness },
  { title: "Professionals growing a long-term record", icon: History },
  { title: "Researchers and project teams", icon: Users },
  { title: "Organizations verifying people and work", icon: Building2 },
];

export const WHY_XROVIA = [
  {
    title: "Not another profile",
    body: "The profile is only the surface. The underlying idea is a structured record that can grow, connect to evidence and carry confirmation.",
    icon: Fingerprint,
  },
  {
    title: "Not a replacement for credentials",
    body: "XROVIA can sit alongside certificates, institutional records and existing professional platforms rather than pretending to replace them.",
    icon: ShieldCheck,
  },
  {
    title: "Built around the record",
    body: "Your career is a timeline of education, work, projects, skills, relationships and evidence—not a single frozen document.",
    icon: History,
  },
  {
    title: "Useful before you need a job",
    body: "The record starts while you are learning and working, so you do not have to reconstruct your professional history later.",
    icon: ArrowRight,
  },
];

export const SEARCH_EXAMPLE = {
  id: SAMPLE_ID,
  name: "Example Professional",
  headline: "Mechanical Engineer",
  verifiedItems: 3,
};
