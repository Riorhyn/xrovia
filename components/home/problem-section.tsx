"use client";

import React from "react";
import { Container, SectionHeader } from "./ui";
import { XCircle, CheckCircle2, FileText, Fingerprint, RefreshCw, ShieldAlert, ShieldCheck, Search } from "lucide-react";

export function ProblemSection() {
  return (
    <section id="why-xrovia" className="scroll-mt-20 border-b border-slate-200/80 bg-slate-50/50 py-20 sm:py-28">
      <Container>
        <SectionHeader
          eyebrow="Why XROVIA"
          title="Identity instead of another document."
          description="Resumes and CVs are static PDF files created repeatedly for every application. XROVIA establishes a persistent, structured professional identity that grows with you."
        />

        {/* Visual Comparison Grid */}
        <div className="mt-14 grid gap-8 lg:grid-cols-2">
          {/* Traditional Resume Card */}
          <div className="rounded-3xl border border-red-200/70 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-red-50 text-red-600 border border-red-100">
                  <FileText className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-slate-950">Traditional Resumes & CVs</h3>
                  <p className="text-xs text-slate-500">Static, fragmented document files</p>
                </div>
              </div>
              <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-700 border border-red-200/60">
                Legacy Approach
              </span>
            </div>

            <ul className="mt-6 space-y-4">
              {[
                { title: "Constant Document Recreation", desc: "Must be reformatted and rebuilt for every single job application or opportunity." },
                { title: "Unverified Self-Claims", desc: "Employers and institutions cannot easily verify education or project claims without lengthy background checks." },
                { title: "Lost Work Context", desc: "Complex team projects, collaborative research, and individual contributions get collapsed into bullet points." },
                { title: "No Discovery Potential", desc: "Static PDFs sit on hard drives or inbox attachments rather than being discoverable." },
              ].map(({ title, desc }) => (
                <li key={title} className="flex items-start gap-3 text-xs sm:text-sm">
                  <XCircle className="h-5 w-5 shrink-0 text-red-500 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-950">{title}: </span>
                    <span className="text-slate-600">{desc}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* XROVIA Digital Identity Card */}
          <div className="rounded-3xl border border-blue-200 bg-white p-6 shadow-lg shadow-blue-500/5 sm:p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 h-32 w-32 bg-blue-100/50 rounded-bl-full blur-2xl -z-10" />

            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-600/20">
                  <Fingerprint className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-slate-950">XROVIA Digital Identity</h3>
                  <p className="text-xs text-blue-700 font-semibold">Structured, permanent Professional ID</p>
                </div>
              </div>
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 border border-blue-200">
                Next Standard
              </span>
            </div>

            <ul className="mt-6 space-y-4">
              {[
                { title: "One Permanent Identifier", desc: "Your Professional ID (`PR-XXXXXX`) stays with you throughout your entire career trajectory." },
                { title: "Authentic Verification Status", desc: "Clear distinction between self-added info, peer collaboration, and institutional confirmation." },
                { title: "Rich Project & Evidence Linking", desc: "Attach actual proof, team roles, and verifiable credentials to every record item." },
                { title: "Searchable & Instantly Shareable", desc: "Share via QR code, direct link, or allow recruiters and partners to discover your record." },
              ].map(({ title, desc }) => (
                <li key={title} className="flex items-start gap-3 text-xs sm:text-sm">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-950">{title}: </span>
                    <span className="text-slate-600">{desc}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
