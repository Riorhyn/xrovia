"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Edit3,
  ExternalLink,
  FileText,
  ShieldCheck,
  Lock,
  Briefcase,
  GraduationCap,
  Wrench,
  FolderGit2,
  ShieldAlert,
} from "lucide-react";

export default function DashboardPage() {
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  async function fetchDashboard() {
    try {
      const response = await fetch("/api/profile", {
        method: "GET",
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch profile");
      }

      console.log("Dashboard profile data:", data);

      setProfileData(data.user);
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }

  fetchDashboard();
}, []);

  const profile = profileData?.profile || {};
const fullData = profile.fullData || {};

const fullName = profile.fullName || "Candidate Name";
const professionalId = profile.professionalId || "Not assigned";
const headline = profile.headline || "Professional Headline";
const location = profile.location || "Location not provided";
const photoUrl = profile.photoUrl || "";

const experiences = Array.isArray(fullData.experiences)
  ? fullData.experiences
  : [];

const educations = Array.isArray(fullData.educations)
  ? fullData.educations
  : [];

const skills = Array.isArray(fullData.skills)
  ? fullData.skills
  : [];

const projects = Array.isArray(fullData.projects)
  ? fullData.projects
  : [];

  // Calculate dynamic completion percentage
  let completedCount = 0;
  if (fullName && fullName !== "Candidate Name") completedCount++;
  if (experiences.length > 0) completedCount++;
  if (educations.length > 0) completedCount++;
  if (skills.length > 0) completedCount++;
  if (projects.length > 0) completedCount++;
  const completionPercentage = Math.round((completedCount / 5) * 100);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-sm font-bold text-slate-500 animate-pulse">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        
        {/* Top Header Card */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Dashboard Overview
            </span>
            <h1 className="mt-1 text-2xl font-black text-slate-900 sm:text-3xl">
              Welcome Back, {fullName}
            </h1>
            <p className="mt-1 text-sm text-slate-500 flex items-center gap-2">
              <span>Permanent Professional ID:</span>
              <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                {professionalId}
              </span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href={`/${professionalId}`}
              target="_blank"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
            >
              <ExternalLink className="h-4 w-4 text-slate-500" />
              View Public Profile
            </Link>

            <Link
              href="/dashboard/builder"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition"
            >
              <Edit3 className="h-4 w-4" />
              Edit Profile
            </Link>

            <button className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition">
              <FileText className="h-4 w-4" />
              CV View
            </button>
          </div>
        </div>

        {/* Live Profile Completion Status Bar */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
          <div className="flex justify-between items-center text-xs font-bold">
            <span className="text-slate-700">Profile Completion Status</span>
            <span className="text-blue-600 font-mono">{completionPercentage}% Completed</span>
          </div>
          <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-600 transition-all duration-500 rounded-full" 
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Live Digital ID Card */}
          <div className="lg:col-span-5 space-y-3">
            <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
              Your Digital ID Card
            </h2>
            
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">XROVIA ID</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[10px] font-bold text-amber-800 border border-amber-200">
                  <ShieldAlert className="h-3 w-3 text-amber-600" /> Self-Reported
                </span>
              </div>

              <div className="flex items-center gap-4 py-2">
                <div className="h-16 w-16 rounded-2xl bg-blue-600 text-white font-black text-xl flex items-center justify-center overflow-hidden shrink-0">
                  {photoUrl ? (
                    <img src={photoUrl} alt={fullName} className="h-full w-full object-cover" />
                  ) : (
                    <span>{fullName?.[0]?.toUpperCase() || "U"}</span>
                  )}
                </div>
                <div className="overflow-hidden">
                  <h3 className="text-sm font-bold text-slate-900 truncate">{fullName}</h3>
                  <p className="text-xs text-slate-500 truncate">{headline}</p>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">{location}</p>
                </div>
              </div>

              <div className="rounded-2xl bg-slate-50 p-3 border border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[9px] font-bold uppercase text-slate-400 block">Professional ID</span>
                  <span className="text-xs font-black font-mono text-slate-800">{professionalId}</span>
                </div>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  Active
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Live Career Records Summary */}
          <div className="lg:col-span-7 space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Career Records Summary</h2>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4 text-center space-y-1">
                  <Briefcase className="h-5 w-5 text-blue-600 mx-auto mb-1" />
                  <p className="text-2xl font-black text-slate-900 font-mono">{experiences.length}</p>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Experience</p>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4 text-center space-y-1">
                  <GraduationCap className="h-5 w-5 text-blue-600 mx-auto mb-1" />
                  <p className="text-2xl font-black text-slate-900 font-mono">{educations.length}</p>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Education</p>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4 text-center space-y-1">
                  <Wrench className="h-5 w-5 text-blue-600 mx-auto mb-1" />
                  <p className="text-2xl font-black text-slate-900 font-mono">{skills.length}</p>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Skills</p>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4 text-center space-y-1">
                  <FolderGit2 className="h-5 w-5 text-blue-600 mx-auto mb-1" />
                  <p className="text-2xl font-black text-slate-900 font-mono">{projects.length}</p>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Projects</p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 w-fit px-3 py-1 rounded-full text-xs font-bold border border-emerald-200">
                <ShieldCheck className="h-4 w-4" /> Profile Status: PUBLIC
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Privacy & Public Visibility</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Anyone with your Professional ID (<span className="font-mono text-slate-700 font-bold">{professionalId}</span>) or direct QR link can inspect your verified records.
                </p>
              </div>
              <button className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-xl transition">
                <Lock className="h-3.5 w-3.5" /> Manage Privacy Settings
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}