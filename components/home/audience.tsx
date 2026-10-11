"use client";

import React from "react";
import Link from "next/link";
import { User, Building2, CheckCircle2, ArrowRight, ShieldCheck, GraduationCap, Briefcase, Award } from "lucide-react";
import { Container, SectionHeader } from "./ui";

export function Audience() {
  return (
    <section id="for-organizations" className="scroll-mt-20 border-b border-slate-200/80 bg-white py-20 sm:py-28">
      <Container>
        <SectionHeader
          eyebrow="Platform Audiences"
          title="Empowering individuals and trusted institutions."
          description="Whether you are building your personal professional history or issuing verified credentials as an organization, XROVIA connects both sides."
        />

        <div className="mt-14 grid gap-8 lg:grid-cols-2">
          {/* Card 1: For Individuals */}
          <div className="flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-gradient-to-b from-slate-50/80 to-white p-6 shadow-sm sm:p-8 transition-all duration-300 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/5">
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-600/20">
                    <User className="h-6 w-6" />
                  </span>
                  <div>
                    <h3 className="text-xl font-extrabold text-slate-950">For Individuals</h3>
                    <p className="text-xs text-slate-500">Students, Graduates & Professionals</p>
                  </div>
                </div>
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 border border-blue-200">
                  Personal Identity
                </span>
              </div>

              <p className="mt-6 text-sm leading-relaxed text-slate-600">
                Establish one persistent digital record that reflects your complete professional trajectory—from coursework and team projects to certifications and leadership roles.
              </p>

              <ul className="mt-6 space-y-3 text-xs sm:text-sm font-medium text-slate-700">
                {[
                  "Claim your permanent XROVIA Professional ID (`PR-XXXXXX`)",
                  "Organize education, experience, skills, and projects in one hub",
                  "Attach evidence files and request institutional verification",
                  "Share your clean public profile via QR code or vanity URL",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-blue-600 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-100">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-md shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700"
              >
                <span>Create Your Identity</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Card 2: For Organizations */}
          <div className="flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-gradient-to-b from-slate-50/80 to-white p-6 shadow-sm sm:p-8 transition-all duration-300 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-500/5">
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-indigo-600 text-white shadow-md shadow-indigo-600/20">
                    <Building2 className="h-6 w-6" />
                  </span>
                  <div>
                    <h3 className="text-xl font-extrabold text-slate-950">For Organizations</h3>
                    <p className="text-xs text-slate-500">Universities, Employers & Training Bodies</p>
                  </div>
                </div>
                <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700 border border-indigo-200">
                  Institutional Hub
                </span>
              </div>

              <p className="mt-6 text-sm leading-relaxed text-slate-600">
                Validate achievements, issue verifiable digital credentials, and streamline candidate discovery with institutional authority.
              </p>

              <ul className="mt-6 space-y-3 text-xs sm:text-sm font-medium text-slate-700">
                {[
                  "Establish an officially verified organizational profile",
                  "Review and approve degree, employment, and training requests",
                  "Issue tamper-resistant digital credentials directly to member IDs",
                  "Connect organizational identity with verified student and employee records",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-indigo-600 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-100 flex items-center gap-3">
              <Link
                href="/organization/register"
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-slate-800"
              >
                <span>Register Organization</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/organization/login"
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
              >
                Org Login
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
