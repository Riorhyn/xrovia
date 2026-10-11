"use client";

import React from "react";
import { ShieldCheck, UserPlus, FileCheck2, Share2, ArrowRight } from "lucide-react";
import { Container, SectionHeader } from "./ui";

const WORKFLOW_STEPS = [
  {
    step: "01",
    title: "Create Your Unique Identity",
    description: "Register your account and claim a permanent XROVIA Professional ID (`PR-XXXXXX`) that remains yours across institutions and career transitions.",
    icon: UserPlus,
    badge: "Create",
  },
  {
    step: "02",
    title: "Build Your Career Record",
    description: "Add education history, work experience, technical skills, certifications, and portfolio projects into a single structured record.",
    icon: FileCheck2,
    badge: "Build",
  },
  {
    step: "03",
    title: "Request Verification & Proof",
    description: "Attach supporting evidence or send verification requests to institutions and project collaborators to validate your record.",
    icon: ShieldCheck,
    badge: "Verify",
  },
  {
    step: "04",
    title: "Share & Enable Discovery",
    description: "Present your verified public identity using your unique ID, QR code, or direct link whenever opportunities arise.",
    icon: Share2,
    badge: "Share",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-20 border-b border-slate-200/80 bg-white py-20 sm:py-28">
      <Container>
        <SectionHeader
          eyebrow="How XROVIA Works"
          title="A clear 4-step journey to an authentic digital record."
          description="Establish your permanent identity once, enrich it as your career evolves, and share it anywhere with confidence."
        />

        {/* 4 Steps Grid */}
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {WORKFLOW_STEPS.map(({ step, title, description, icon: Icon, badge }, index) => (
            <div
              key={step}
              className="group relative flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-slate-50/60 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:bg-white hover:shadow-xl hover:shadow-blue-500/5"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 font-extrabold group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="font-mono text-2xl font-black text-slate-300 group-hover:text-blue-600 transition-colors">
                    {step}
                  </span>
                </div>

                <span className="mt-6 inline-block rounded-full border border-blue-100 bg-blue-50/80 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-blue-700">
                  Step {step} — {badge}
                </span>

                <h3 className="mt-2 text-lg font-bold text-slate-950">{title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600">{description}</p>
              </div>

              {index < WORKFLOW_STEPS.length - 1 && (
                <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                  <ArrowRight className="h-5 w-5 text-slate-300" />
                </div>
              )}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
