"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Edit3, ExternalLink, ShieldCheck, Lock, KeyRound } from "lucide-react";
import { DigitalIdPreview } from "@/components/home/DigitalIdPreview";
import { CareerSummaryMetrics } from "@/components/dashboard/CareerSummaryMetrics";
import { ProfileCompletionBar } from "@/components/dashboard/ProfileCompletionBar";
import { ConnectedPlatforms } from "@/components/dashboard/ConnectedPlatforms";

export default function DashboardPage() {
  const [profile, setProfile] = useState({fullName:"Candidate Name",professionalId:"PR-159481"});
  const loadDashboardData = async () => {
    try {
      const res=await fetch("/api/profile"); if(!res.ok)return;
      const data=await res.json(); const dbProfile=data.user?.profile||{};
      setProfile({fullName:dbProfile.fullName||data.user?.name||data.user?.email?.split("@")[0]||"Candidate Name",professionalId:dbProfile.professionalId||"PR-159481"});
    } catch(error){console.error("Failed to load dashboard profile:",error);}
  };
  useEffect(()=>{loadDashboardData();window.addEventListener("profile_updated",loadDashboardData);window.addEventListener("storage",loadDashboardData);window.addEventListener("focus",loadDashboardData);return()=>{window.removeEventListener("profile_updated",loadDashboardData);window.removeEventListener("storage",loadDashboardData);window.removeEventListener("focus",loadDashboardData);};},[]);

  return (
    <div className="min-h-screen bg-slate-50/50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div><span className="text-xs font-bold uppercase tracking-wider text-blue-600">Dashboard Overview</span>
            <h1 className="mt-1 text-2xl font-black text-slate-900 sm:text-3xl">Welcome Back, {profile.fullName}</h1>
            <p className="mt-1 text-sm text-slate-500 flex items-center gap-2"><span>Permanent Professional ID:</span><span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">{profile.professionalId}</span></p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link href={`/${profile.professionalId}`} target="_blank" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"><ExternalLink className="h-4 w-4 text-slate-500"/>View Public Profile</Link>
            <Link href="/dashboard/builder" className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition"><Edit3 className="h-4 w-4"/>Edit Profile</Link>
            <Link href="/dashboard/security" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition"><KeyRound className="h-4 w-4"/>Change Password</Link>
          </div>
        </div>
        <ProfileCompletionBar />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 space-y-3"><h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Your Digital ID Card</h2><DigitalIdPreview /></div>
          <div className="lg:col-span-7 space-y-6">
            <CareerSummaryMetrics />
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 w-fit px-3 py-1 rounded-full text-xs font-bold border border-emerald-200"><ShieldCheck className="h-4 w-4"/> Profile Status: PUBLIC</div>
              <div><h3 className="text-sm font-bold text-slate-900">Privacy & Public Visibility</h3><p className="text-xs text-slate-500 mt-1 leading-relaxed">Anyone with your Professional ID (<span className="font-mono text-slate-700 font-bold">{profile.professionalId}</span>) or direct QR link can inspect your verified records.</p></div>
              <button className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-xl transition"><Lock className="h-3.5 w-3.5"/> Manage Privacy Settings</button>
            </div>
          </div>
        </div>
        <ConnectedPlatforms />
      </div>
    </div>
  );
}