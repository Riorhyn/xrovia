"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  Award,
  BadgeCheck,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  ClipboardList,
  CreditCard,
  FileCheck2,
  Fingerprint,
  GraduationCap,
  Handshake,
  Languages,
  Link2,
  LockKeyhole,
  QrCode,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
  Wrench,
} from "lucide-react";

const demo = {
  name: "Arjun Mehta",
  role: "Mechanical Design Engineer",
  location: "Chandigarh, India",
  id: "XRV-284731",
};

const sections = [
  {
    title: "Professional Identity",
    description: "Permanent identity, Professional ID and digital identity card.",
    icon: Fingerprint,
    links: [
      ["/professional-identity", "Professional Identity"],
      ["/digital-professional-profile", "Digital Professional Profile"],
    ],
    tags: ["Permanent ID", "Digital ID Card", "Shareable identity"],
  },
  {
    title: "Career Record Builder",
    description: "A structured record for education, work, skills, projects and achievements.",
    icon: ClipboardList,
    links: [
      ["/dashboard/builder", "Career Record Builder"],
      ["/career-portfolio", "Career Portfolio"],
    ],
    tags: ["Education", "Experience", "Projects", "Skills"],
  },
  {
    title: "Verification",
    description: "Credential and experience verification workflows.",
    icon: ShieldCheck,
    links: [
      ["/professional-profile", "Professional Profile"],
      ["/dashboard", "Verification Center"],
    ],
    tags: ["Education", "Employment", "Evidence", "Verification status"],
  },
  {
    title: "Public Profile",
    description: "A structured public professional record that can be shared by ID.",
    icon: BadgeCheck,
    links: [
      ["/professional-profile", "Professional Profile"],
      ["/search", "Search Professional ID"],
    ],
    tags: ["Public profile", "Search ID", "Profile sharing"],
  },
  {
    title: "Projects & Collaborations",
    description: "Connect projects with real XROVIA members, roles and responsibilities.",
    icon: Handshake,
    links: [
      ["/dashboard/collaborations", "Manage Collaborations"],
      ["/project/demo", "Project Example"],
    ],
    tags: ["Team leader", "Members", "Responsibilities", "Requests"],
  },
  {
    title: "Organizations",
    description: "Organization accounts, members, roles, invitations and verification.",
    icon: Building2,
    links: [
      ["/organization", "Organization Dashboard"],
      ["/organization/register", "Organization Registration"],
      ["/organization/claim", "Claim Organization"],
    ],
    tags: ["University", "Company", "Roles", "Invitations"],
  },
  {
    title: "Career Tools",
    description: "Career profiles, job resources and structured professional guidance.",
    icon: BriefcaseBusiness,
    links: [
      ["/career/job-search", "Career & Job Search"],
      ["/career/online-professional-identity", "Professional Identity Guide"],
      ["/career/technical-portfolio", "Technical Portfolio"],
    ],
    tags: ["Career profile", "Jobs", "Portfolio", "Guides"],
  },
  {
    title: "Member Experience",
    description: "Security, feedback, benefits and account controls.",
    icon: Sparkles,
    links: [
      ["/dashboard/security", "Security"],
      ["/feedback", "Feedback"],
    ],
    tags: ["Security", "Benefits", "Feedback", "Account"],
  },
];

const featureStrip = [
  ["Permanent Professional ID", Fingerprint],
  ["Digital ID Card", CreditCard],
  ["Verified Credentials", ShieldCheck],
  ["Career Record", ClipboardList],
  ["Education", GraduationCap],
  ["Certifications", Award],
  ["Skills", Wrench],
  ["Languages", Languages],
  ["Projects", FileCheck2],
  ["QR Sharing", QrCode],
  ["Privacy", LockKeyhole],
  ["Connections", Users],
  ["Professional Links", Link2],
  ["Search ID", Search],
];

export default function XroviaShowcasePage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="max-w-3xl">
            <span className="inline-flex rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-700">
              XROVIA Product Showcase
            </span>
            <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
              See what XROVIA does.
            </h1>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              A visual map of the user-facing XROVIA experience. The examples below use
              fictional demonstration data and point to the actual product screens.
            </p>
          </div>

          <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-950 p-6 text-white shadow-sm sm:p-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-300">Demo identity</p>
                <h2 className="mt-2 text-2xl font-black">{demo.name}</h2>
                <p className="mt-1 text-slate-300">{demo.role} · {demo.location}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Professional ID</p>
                <p className="mt-1 font-mono text-xl font-black text-blue-300">{demo.id}</p>
              </div>
            </div>
            <p className="mt-6 text-xs text-slate-400">
              Fictional demonstration profile — not a real person or credential record.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl gap-3 overflow-x-auto px-4 py-5 sm:px-6 lg:px-8">
          {featureStrip.map(([label, Icon]) => {
            const FeatureIcon = Icon as typeof Fingerprint;
            return (
              <div key={label as string} className="flex shrink-0 items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-bold text-slate-700">
                <FeatureIcon className="h-3.5 w-3.5 text-blue-600" />
                {label as string}
              </div>
            );
          })}
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-wider text-blue-600">User-facing features</p>
          <h2 className="mt-2 text-2xl font-black text-slate-950">Explore the actual XROVIA screens</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Admin tools are intentionally excluded. Each card groups related features so the
            showcase can be captured as a clean product walkthrough.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {sections.map((section, index) => {
            const Icon = section.icon;
            return (
              <article key={section.title} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-start gap-4 p-6 sm:p-7">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-lg font-black text-slate-900">{index + 1}. {section.title}</h3>
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-500">{section.description}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {section.tags.map((tag) => (
                        <span key={tag} className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-600">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="mt-6 flex flex-wrap gap-2">
                      {section.links.map(([href, label]) => (
                        <Link
                          key={href}
                          href={href}
                          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-3.5 py-2.5 text-xs font-bold text-white transition hover:bg-blue-700"
                        >
                          {label}
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <section className="mt-8 rounded-3xl border border-blue-100 bg-blue-50 p-6 sm:p-8">
          <h2 className="text-lg font-black text-slate-950">Screenshot plan</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            This page is the capture index. For the final promotional visual set, use the actual
            rendered XROVIA screens rather than fabricated UI. Authenticated screens should be
            opened with the fictional demo account and captured from the live application.
          </p>
        </section>
      </main>
    </div>
  );
}
