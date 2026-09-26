"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, CheckCircle2, Copy, Eye, Lock, ShieldCheck, Sparkles } from "lucide-react";

type Action = { key: string; label: string; points: number; done: boolean };
type Intelligence = {
  profile: { professionalId: string; isPublic: boolean; level: string };
  score: number;
  actions: Action[];
  counts: { verified: number; evidence: number };
};

const actionLinks: Record<string, string> = {
  identity: "/dashboard/builder",
  summary: "/dashboard/builder",
  education: "/dashboard/builder",
  experience: "/dashboard/builder",
  skills: "/dashboard/builder",
  projects: "/dashboard/builder",
  proof: "/dashboard/builder",
  verification: "/dashboard/builder",
  presence: "/dashboard",
  achievements: "/dashboard/builder",
};

export function CareerCommandCenter() {
  const [data, setData] = useState<Intelligence | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [visibilitySaving, setVisibilitySaving] = useState(false);

  const load = async () => {
    try {
      const res = await fetch("/api/profile/intelligence", { cache: "no-store" });
      if (!res.ok) return;
      setData(await res.json());
    } catch (error) {
      console.error("Failed to load career command center:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    window.addEventListener("profile_updated", load);
    return () => window.removeEventListener("profile_updated", load);
  }, []);

  const copyLink = async () => {
    if (!data?.profile.professionalId) return;
    const link = window.location.origin + "/" + data.profile.professionalId;
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch (error) {
      console.error("Unable to copy profile link:", error);
    }
  };

  const setVisibility = async () => {
    if (!data) return;
    setVisibilitySaving(true);
    try {
      const res = await fetch("/api/profile/visibility", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublic: !data.profile.isPublic }),
      });
      if (!res.ok) throw new Error("Unable to update visibility");
      setData((current) => current ? { ...current, profile: { ...current.profile, isPublic: !current.profile.isPublic } } : current);
      window.dispatchEvent(new Event("profile_updated"));
    } catch (error) {
      console.error("Visibility update failed:", error);
    } finally {
      setVisibilitySaving(false);
    }
  };

  if (loading) return <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><div className="h-24 animate-pulse rounded-2xl bg-slate-100" /></div>;
  if (!data) return null;

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-blue-700"><Sparkles className="h-3.5 w-3.5" /> Career Command Center</div>
          <h2 className="mt-3 text-xl font-black text-slate-900">Turn your profile into something useful.</h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">XROVIA checks what is missing, helps you improve the record, and keeps sharing and verification in one place.</p>
        </div>
        <div className="shrink-0 rounded-2xl border border-slate-200 bg-slate-50 p-4 min-w-[220px]">
          <div className="flex items-end justify-between gap-3"><div><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Profile health</p><p className="mt-1 text-3xl font-black text-slate-900">{data.score}<span className="text-sm text-slate-400">/100</span></p></div><span className="text-xs font-bold text-blue-700">{data.profile.level}</span></div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200"><div className="h-full rounded-full bg-blue-600 transition-all" style={{ width: data.score + "%" }} /></div>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4"><p className="text-lg font-black text-slate-900">{data.counts.verified}</p><p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Verified records</p></div>
        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4"><p className="text-lg font-black text-slate-900">{data.counts.evidence}</p><p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Evidence files</p></div>
        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4"><p className="text-lg font-black text-slate-900">{data.profile.professionalId}</p><p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Professional ID</p></div>
        <button type="button" onClick={setVisibility} disabled={visibilitySaving} className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-left hover:bg-white hover:border-blue-200 transition disabled:opacity-60">
          <div className="flex items-center gap-2 text-slate-900"><span className={"h-2.5 w-2.5 rounded-full " + (data.profile.isPublic ? "bg-emerald-500" : "bg-slate-400")} /><span className="text-sm font-black">{data.profile.isPublic ? "Public" : "Private"}</span></div>
          <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">Profile visibility</p>
        </button>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-2xl border border-slate-200 p-5">
          <div className="flex items-center justify-between gap-3"><div><h3 className="text-sm font-black text-slate-900">Your next actions</h3><p className="mt-1 text-xs text-slate-500">Do these in order to make the profile more useful.</p></div><CheckCircle2 className="h-5 w-5 text-blue-600" /></div>
          {data.actions.length === 0 ? <div className="mt-4 rounded-xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-800">Your core profile is complete. Keep records updated and verified as your career changes.</div> :
            <div className="mt-4 space-y-2">{data.actions.map((action) => <Link key={action.key} href={actionLinks[action.key] || "/dashboard/builder"} className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 hover:border-blue-200 hover:bg-white transition"><span className="text-xs font-bold text-slate-800">{action.label}</span><ArrowRight className="h-4 w-4 shrink-0 text-slate-400" /></Link>)}</div>}
        </div>

        <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-5">
          <div className="flex items-center gap-2 text-blue-800"><ShieldCheck className="h-5 w-5" /><h3 className="text-sm font-black">Share your identity</h3></div>
          <p className="mt-2 text-xs leading-5 text-slate-600">Your Professional ID can be shared with employers, universities, collaborators, or anyone who needs your professional record.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link href={"/" + data.profile.professionalId} target="_blank" className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-700"><Eye className="h-4 w-4" /> View profile</Link>
            <button type="button" onClick={copyLink} className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-white px-4 py-2.5 text-xs font-bold text-blue-800 hover:bg-blue-50"><Copy className="h-4 w-4" /> {copied ? "Copied" : "Copy link"}</button>
          </div>
          <div className="mt-4 flex items-center gap-2 text-[11px] text-slate-500"><Lock className="h-3.5 w-3.5" /> Evidence is private to you unless explicitly shared.</div>
        </div>
      </div>
    </section>
  );
}
