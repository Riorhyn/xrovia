import {
  // Navigation & Actions
  UserPlus,
  Fingerprint,
  ClipboardList,
  ShieldCheck,
  Share2,
  RefreshCw,
  // Problem Section
  Layers,
  Clock,
  FolderKanban,
  Zap,
  Repeat,
  UserCheck,
  // Features Section
  CreditCard,
  Globe,
  FileText,
  QrCode,
  Lock,
  // Audiences Section
  GraduationCap,
  Sparkles,
  Briefcase,
  Code2,
  Palette,
  Microscope,
  Compass,
  Search,
  // Benefits Section
  FileCheck2,
  History,
  Eye,
  type LucideIcon,
} from "lucide-react";

/** Global routes */
export const ROUTES = {
  home: "/",
  login: "/login",
  register: "/register",
  dashboard: "/dashboard",
  search: "/search",
} as const;

/** Example ID used across preview cards */
export const SAMPLE_ID = "PR-159481";

/** How It Works Steps */
export type Step = { title: string; body: string; icon: LucideIcon };

export const STEPS: Step[] = [
  {
    title: "Create your account",
    body: "Register for a Xrovia account with your details.",
    icon: UserPlus,
  },
  {
    title: "Get your Professional ID",
    body: "A unique ID such as PR-159481 is generated for you automatically and stays yours.",
    icon: Fingerprint,
  },
  {
    title: "Build your career record",
    body: "Add your headline, summary and skills, and keep your education, experience and projects together in one structured record.",
    icon: ClipboardList,
  },
  {
    title: "Verify your background",
    body: "Get education verified by your school, college, or university, and work experience verified by your employer.",
    icon: ShieldCheck,
  },
  {
    title: "Share your profile",
    body: "Give people your Professional ID so they can open your public profile. QR code sharing is coming soon.",
    icon: Share2,
  },
  {
    title: "Keep your record updated",
    body: "Return as you study, change roles or finish projects. Your ID stays the same while your record grows.",
    icon: RefreshCw,
  },
];

/** Problem Section Items */
export type Problem = { title: string; body: string; icon: LucideIcon };

export const PROBLEMS: Problem[] = [
  {
    title: "Your information lives in many places",
    body: "CV files, LinkedIn profiles, certificates and other documents each hold a piece of your story.",
    icon: Layers,
  },
  {
    title: "CVs go out of date",
    body: "A file you saved last year does not include what you did this year.",
    icon: Clock,
  },
  {
    title: "Achievements are hard to organize",
    body: "Roles, projects and skills pile up without a clear structure to keep them in.",
    icon: FolderKanban,
  },
  {
    title: "Others need quick access",
    body: "Employers and institutions may want to see a professional record without searching through attachments.",
    icon: Zap,
  },
  {
    title: "You re-enter the same details",
    body: "Many people retype their background into a new form or template every time they are asked.",
    icon: Repeat,
  },
  {
    title: "No single record follows you",
    body: "From student to professional, there is rarely one structured place that grows with every stage of a career.",
    icon: UserCheck,
  },
];

/** Features List */
export type Feature = {
  title: string;
  description: string;
  icon: LucideIcon;
  status: "live" | "soon";
};

export const FEATURES: Feature[] = [
  {
    title: "Permanent Professional ID",
    description:
      "Get a lifelong, tamper-proof ID like PR-159481 generated automatically upon registration.",
    icon: Fingerprint,
    status: "live",
  },
  {
    title: "Digital ID Card",
    description:
      "A sleek digital identity card displaying your verified credentials and essential background details.",
    icon: CreditCard,
    status: "live",
  },
  {
    title: "Verified Background",
    description:
      "Have your degrees, diplomas, and past job roles officially verified by universities and employers.",
    icon: ShieldCheck,
    status: "live",
  },
  {
    title: "Public Professional Profile",
    description:
      "Share your verified record with recruiters, universities, and partners via a clean, memorable URL.",
    icon: Globe,
    status: "live",
  },
  {
    title: "Structured CV View",
    description:
      "Instantly generate an executive-ready CV layout straight from your verified career history.",
    icon: FileText,
    status: "live",
  },
  {
    title: "Career Record Builder",
    description:
      "Organize education, employment history, skills, and projects in one centralized database.",
    icon: ClipboardList,
    status: "live",
  },
  {
    title: "Instant QR Sharing",
    description:
      "Let anyone scan your dynamic QR code to immediately view, verify, or download your profile.",
    icon: QrCode,
    status: "live",
  },
  {
    title: "Granular Privacy Controls",
    description:
      "Tailor exactly what details are visible publicly and what remains accessible only to verified entities.",
    icon: Lock,
    status: "soon",
  },
];

/** Target Audiences */
export type AudienceItem = {
  title: string;
  icon: LucideIcon;
};

export const AUDIENCES: AudienceItem[] = [
  { title: "University Students", icon: GraduationCap },
  { title: "Fresh Graduates", icon: Sparkles },
  { title: "Working Professionals", icon: Briefcase },
  { title: "Freelancers & Consultants", icon: UserCheck },
  { title: "Software & Field Engineers", icon: Code2 },
  { title: "Designers & Creatives", icon: Palette },
  { title: "Academic Researchers", icon: Microscope },
  { title: "Career Changers", icon: Compass },
  { title: "Active Job Seekers", icon: Search },
];

/** Platform Benefits */
export type BenefitItem = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export const BENEFITS: BenefitItem[] = [
  {
    title: "Unified Career Ledger",
    description:
      "Consolidate degrees, diplomas, employment history, and key skills into one structured, immutable digital record.",
    icon: Layers,
  },
  {
    title: "Verified Credentials",
    description:
      "Eliminate background check friction with official verification badges issued by universities and employers.",
    icon: ShieldCheck,
  },
  {
    title: "One Lifelong ID",
    description:
      "Share a single Professional ID (e.g., PR-159481) that stays permanently connected to you throughout your career.",
    icon: FileCheck2,
  },
  {
    title: "Automated CV Generation",
    description:
      "Instantly export executive-ready resumes directly from your verified background without re-typing data.",
    icon: Clock,
  },
  {
    title: "Instant QR & Link Sharing",
    description:
      "Allow recruiters and hiring managers to instantly view and audit your background via dynamic QR codes.",
    icon: Share2,
  },
  {
    title: "Continuous Record Growth",
    description:
      "Seamlessly attach new certifications, publications, and promotions as your professional journey evolves.",
    icon: History,
  },
  {
    title: "Recruiter-Ready Access",
    description:
      "Provide employers with direct, structured, and trustworthy proof of your qualifications in seconds.",
    icon: Eye,
  },
  {
    title: "Privacy & Data Ownership",
    description:
      "Maintain full control over your personal branding with customizable visibility settings for every entry.",
    icon: Lock,
  },
];
