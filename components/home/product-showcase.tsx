"use client";

import React, { useState } from "react";
import { Container, SectionHeader } from "./ui";
import { ShieldCheck, Fingerprint, Award, Share2, Layers, Search, CheckCircle2, Building2, Users } from "lucide-react";

type ShowcaseTab = "idCard" | "verification" | "projects" | "sharing";

export function ProductShowcase() {
  const [activeTab, setActiveTab] = useState<ShowcaseTab>("idCard");

  return (
    <section className="border-b border-slate-200/80 bg-slate-900 py-20 text-white sm:py-28">
      <Container>
        <SectionHeader
          eyebrow="Product Showcase"
          title="Designed for modern professional presentation."
          description="A complete ecosystem for capturing, verifying, and sharing every milestone of your career."
          dark
        />

        {/* Navigation Tabs */}
        <div className="mt-10 flex flex-wrap gap-2.5 border-b border-slate-800 pb-6">
          {[
            { id: "idCard", label: "1. Digital ID Card", icon: Fingerprint },
            { id: "verification", label: "2. Verifiable Records", icon: ShieldCheck },
            { id: "projects", label: "3. Project & Collaboration", icon: Users },
            { id: "sharing", label: "4. Global Discovery", icon: Search },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as ShowcaseTab)}
              className={`flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold transition-all duration-200 ${
                activeTab === id
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                  : "bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* Tab Showcase Panels */}
        <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:items-center">
          {/* Left Text Explanation */}
          <div className="lg:col-span-5">
            {activeTab === "idCard" && (
              <div className="space-y-4">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-bold text-blue-400">
                  <Fingerprint className="h-3.5 w-3.5" /> Structured Digital Identity
                </span>
                <h3 className="text-2xl font-black text-white sm:text-3xl">One Permanent ID for Your History</h3>
                <p className="text-sm leading-relaxed text-slate-300">
                  Establish a single permanent digital identifier (`PR-XXXXXX`) that stays connected as you move between institutions and roles.
                </p>
                <ul className="space-y-2.5 pt-2 text-xs font-medium text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Standardized layout for instant readability
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Live profile strength tracking & updates
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Fast QR code scanning & mobile sharing
                  </li>
                </ul>
              </div>
            )}

            {activeTab === "verification" && (
              <div className="space-y-4">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400">
                  <ShieldCheck className="h-3.5 w-3.5" /> Authentic Proof
                </span>
                <h3 className="text-2xl font-black text-white sm:text-3xl">Independent Institutional Verification</h3>
                <p className="text-sm leading-relaxed text-slate-300">
                  Distinguish self-added claims from independently validated achievements. Universities, training centers, and employers confirm records directly.
                </p>
                <ul className="space-y-2.5 pt-2 text-xs font-medium text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Direct organization verification requests
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Evidence attachments (degrees, certificates, work samples)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Clear audit history for employers and reviewers
                  </li>
                </ul>
              </div>
            )}

            {activeTab === "projects" && (
              <div className="space-y-4">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-xs font-bold text-purple-400">
                  <Users className="h-3.5 w-3.5" /> Collaborative Proof
                </span>
                <h3 className="text-2xl font-black text-white sm:text-3xl">Showcase Real Work & Team Roles</h3>
                <p className="text-sm leading-relaxed text-slate-300">
                  Document complex multi-person projects with linked team roles, responsibilities, and verified co-contributor links.
                </p>
                <ul className="space-y-2.5 pt-2 text-xs font-medium text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Tag collaborators by unique Professional ID
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Peer confirmation for individual project contributions
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Rich evidence links (GitHub, live demos, publications)
                  </li>
                </ul>
              </div>
            )}

            {activeTab === "sharing" && (
              <div className="space-y-4">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-xs font-bold text-sky-400">
                  <Search className="h-3.5 w-3.5" /> Searchable Record
                </span>
                <h3 className="text-2xl font-black text-white sm:text-3xl">Instant Search & Public Profile</h3>
                <p className="text-sm leading-relaxed text-slate-300">
                  Share your public record with a clean vanity URL or allow recruiters and partners to locate your profile using your Professional ID.
                </p>
                <ul className="space-y-2.5 pt-2 text-xs font-medium text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Clean public landing page for your identity
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Granular privacy controls over shared details
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Accessible directly at `xrovia.com/[ID]`
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* Right Interface Visual Representation */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-slate-800 bg-slate-950 p-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-red-500/80" />
                  <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
                  <span className="h-3 w-3 rounded-full bg-green-500/80" />
                </div>
                <div className="rounded-lg bg-slate-900 px-3 py-1 font-mono text-[11px] text-slate-400 border border-slate-800">
                  https://xrovia.com/PR-159481
                </div>
              </div>

              <div className="mt-6 space-y-4 text-slate-200">
                <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Profile Identifier</span>
                    <p className="mt-0.5 font-mono text-lg font-black text-blue-400">PR-159481</p>
                  </div>
                  <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/20">
                    Active & Searchable
                  </span>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                      <Building2 className="h-4 w-4 text-blue-400" />
                      <span>Verified Education</span>
                    </div>
                    <p className="mt-2 text-xs font-semibold text-white">UC Berkeley — B.S. Mechanical Eng.</p>
                    <p className="mt-1 text-[10px] text-slate-400">Confirmed by Registrar • 2022</p>
                  </div>

                  <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                      <Award className="h-4 w-4 text-purple-400" />
                      <span>Key Certification</span>
                    </div>
                    <p className="mt-2 text-xs font-semibold text-white">CSWP SolidWorks Professional</p>
                    <p className="mt-1 text-[10px] text-slate-400">Issued by Dassault Systèmes</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
