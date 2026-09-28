"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Edit3, ExternalLink, Lock, KeyRound, ArrowUpRight } from "lucide-react";
import { DigitalIdPreview } from "@/components/home/DigitalIdPreview";
import { CareerSummaryMetrics } from "@/components/dashboard/CareerSummaryMetrics";
import { ProfileCompletionBar } from "@/components/dashboard/ProfileCompletionBar";
import { ConnectedPlatforms } from "@/components/dashboard/ConnectedPlatforms";
import { CareerCommandCenter } from "@/components/dashboard/CareerCommandCenter";
import { VerificationCenter } from "@/components/dashboard/VerificationCenter";

export default function DashboardPage() {
  const [profile, setProfile] = useState({ fullName: "Candidate Name", professionalId: "PR-159481" });

  const loadDashboardData = async () => {
    try {
      const res = await fetch("/api/profile/summary");
      if (!res.ok) return;
      const data = await res.json();
      setProfile({
        fullName: data.profile?.fullName || "Candidate Name",
        professionalId: data.profile?.professionalId || "PR-159481",
      });
    } catch (error) {
      console.error("Failed to load dashboard profile:", error);
    }
  };

  useEffect(() => {
    loadDashboardData();
    window.addEventListener("profile_updated", loadDashboardData);
    window.addEventListener("focus", loadDashboardData);
    return () => {
      window.removeEventListener("profile_updated", loadDashboardData);
      window.removeEventListener("focus", loadDashboardData);
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50/80 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-6xl space-y-6 sm:space-y-8">
        <section className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-blue-50 blur-3xl" />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <span className="inline-flex rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-blue-700">
                Dashboard Overview
              </span>
              <h1 className="mt-3 truncate text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
                Welcome back, {profile.fullName}
              </h1>
              <p className="mt-2 flex flex-wrap items-center gap-2 text-sm text-slate-500">
                <span>Permanent Professional ID</span>
                <span className="rounded-lg border border-blue-100 bg-blue-50 px-2.5 py-1 font-mono text-xs font-bold text-blue-700">
                  {profile.professionalId}
                </span>
              </p>
            </div>

            <div className="relative flex flex-wrap items-center gap-2.5">
              <Link
                href={"/" + profile.professionalId}
                target="_blank"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50"
              >
                <ExternalLink className="h-4 w-4 text-slate-500" />
                View Profile
              </Link>
              <Link
                href="/dashboard/builder"
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-md"
              >
                <Edit3 className="h-4 w-4" />
                Edit Profile
              </Link>
              <Link
                href="/dashboard/security"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-900 px-3.5 py-2.5 text-xs font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-800"
              >
                <KeyRound className="h-4 w-4" />
                Password
              </Link>
            </div>
          </div>
        </section>

        <ProfileCompletionBar />
        <CareerCommandCenter />

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-blue-600">Projects & Collaborations</p>
              <h2 className="mt-1 text-lg font-black text-slate-900">Connect your professional work with the people behind it</h2>
              <p className="mt-1 text-sm leading-6 text-slate-500">Create project teams, assign responsibilities and manage confirmed collaboration relationships.</p>
            </div>
            <Link href="/dashboard/collaborations" className="inline-flex shrink-0 items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-blue-700">
              Manage Projects
            </Link>
          </div>
        </section>

        <div className="grid items-start gap-6 lg:grid-cols-12 lg:gap-8">
          <div className="space-y-3 lg:col-span-5">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">Your Digital ID Card</h2>
              <ArrowUpRight className="h-4 w-4 text-slate-300" aria-hidden="true" />
            </div>
            <div className="rounded-[2rem] border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
              <DigitalIdPreview />
            </div>
          </div>

          <div className="space-y-6 lg:col-span-7">
            <CareerSummaryMetrics />
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold text-slate-700">
                <Lock className="h-3.5 w-3.5" />
                Privacy controls
              </div>
              <h3 className="mt-4 text-base font-black text-slate-900">You control your public profile</h3>
              <p className="mt-1.5 text-sm leading-6 text-slate-500">
                Use the Career Command Center above to switch your Professional ID profile between public and private. Uploaded evidence files remain private.
              </p>
            </div>
          </div>
        </div>

        <VerificationCenter />
        <ConnectedPlatforms />
      </div>
    </div>
  );
}