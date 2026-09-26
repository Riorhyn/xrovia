"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, FileText, Loader2, Save, ShieldCheck, Upload } from "lucide-react";

type Personal = { fullName: string; headline: string; location: string; about: string };
type ProfileData = {
  personal?: Partial<Personal>;
  skills?: string[];
  experiences?: any[];
  educations?: any[];
  projects?: any[];
  achievements?: any[];
  publications?: any[];
  socials?: Record<string, string>;
  hobbies?: string[];
  languages?: string[];
};

const emptyProfile: ProfileData = {
  personal: { fullName: "", headline: "", location: "", about: "" },
  skills: [], experiences: [], educations: [], projects: [], achievements: [], publications: [],
};

const text = (value: unknown) => (typeof value === "string" ? value.trim() : "");

const normalizeExperience = (item: any) => ({ id: crypto.randomUUID(), company: text(item.company), role: text(item.role), startDate: text(item.startDate), endDate: text(item.endDate), current: Boolean(item.current), description: text(item.description) });
const normalizeEducation = (item: any) => ({ id: crypto.randomUUID(), institution: text(item.institution), degree: text(item.degree), fieldOfStudy: text(item.fieldOfStudy), startDate: text(item.startDate), endDate: text(item.endDate), current: Boolean(item.current) });
const normalizeProject = (item: any) => ({ id: crypto.randomUUID(), title: text(item.title), role: text(item.role), link: text(item.link), imageUrl: "", description: text(item.description) });
const normalizeAchievement = (item: any) => ({ id: crypto.randomUUID(), title: text(item.title), issuer: text(item.issuer), date: text(item.date), certificateUrl: text(item.certificateUrl) });
const normalizePublication = (item: any) => ({ id: crypto.randomUUID(), title: text(item.title), publisher: text(item.publisher), link: text(item.link) });

function mergeProfile(current: ProfileData, imported: ProfileData): ProfileData {
  const currentPersonal = { ...emptyProfile.personal, ...(current.personal || {}) };
  const importedPersonal = imported.personal || {};
  const skills = Array.from(new Set([...(current.skills || []), ...(imported.skills || []).map(text).filter(Boolean)]));

  const existingExperiences = Array.isArray(current.experiences) ? current.experiences : [];
  const importedExperiences = Array.isArray(imported.experiences) ? imported.experiences.map(normalizeExperience).filter((x) => x.company || x.role) : [];
  const experienceKeys = new Set(existingExperiences.map((x: any) => text(x.company).toLowerCase() + "|" + text(x.role).toLowerCase()));
  const experiences = [...existingExperiences, ...importedExperiences.filter((x) => {
    const key = x.company.toLowerCase() + "|" + x.role.toLowerCase();
    if (experienceKeys.has(key)) return false;
    experienceKeys.add(key); return true;
  })];

  const existingEducations = Array.isArray(current.educations) ? current.educations : [];
  const importedEducations = Array.isArray(imported.educations) ? imported.educations.map(normalizeEducation).filter((x) => x.institution || x.degree) : [];
  const educationKeys = new Set(existingEducations.map((x: any) => text(x.institution).toLowerCase() + "|" + text(x.degree).toLowerCase()));
  const educations = [...existingEducations, ...importedEducations.filter((x) => {
    const key = x.institution.toLowerCase() + "|" + x.degree.toLowerCase();
    if (educationKeys.has(key)) return false;
    educationKeys.add(key); return true;
  })];

  const existingProjects = Array.isArray(current.projects) ? current.projects : [];
  const importedProjects = Array.isArray(imported.projects) ? imported.projects.map(normalizeProject).filter((x) => x.title) : [];
  const projectKeys = new Set(existingProjects.map((x: any) => text(x.title).toLowerCase()));
  const projects = [...existingProjects, ...importedProjects.filter((x) => {
    const key = x.title.toLowerCase();
    if (projectKeys.has(key)) return false;
    projectKeys.add(key); return true;
  })];

  const existingAchievements = Array.isArray(current.achievements) ? current.achievements : [];
  const importedAchievements = Array.isArray(imported.achievements) ? imported.achievements.map(normalizeAchievement).filter((x) => x.title) : [];
  const achievementKeys = new Set(existingAchievements.map((x: any) => text(x.title).toLowerCase()));
  const achievements = [...existingAchievements, ...importedAchievements.filter((x) => {
    const key = x.title.toLowerCase();
    if (achievementKeys.has(key)) return false;
    achievementKeys.add(key); return true;
  })];

  const existingPublications = Array.isArray(current.publications) ? current.publications : [];
  const importedPublications = Array.isArray(imported.publications) ? imported.publications.map(normalizePublication).filter((x) => x.title) : [];
  const publicationKeys = new Set(existingPublications.map((x: any) => text(x.title).toLowerCase()));
  const publications = [...existingPublications, ...importedPublications.filter((x) => {
    const key = x.title.toLowerCase();
    if (publicationKeys.has(key)) return false;
    publicationKeys.add(key); return true;
  })];

  return {
    ...current,
    personal: {
      ...currentPersonal,
      fullName: text(importedPersonal.fullName) || currentPersonal.fullName,
      headline: text(importedPersonal.headline) || currentPersonal.headline,
      location: text(importedPersonal.location) || currentPersonal.location,
      about: text(importedPersonal.about) || currentPersonal.about,
    },
    skills, experiences, educations, projects, achievements, publications,
  };
}

export default function ImportCvPage() {
  const [currentProfile, setCurrentProfile] = useState<ProfileData>(emptyProfile);
  const [draft, setDraft] = useState<ProfileData | null>(null);
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(true);
  const [parsing, setParsing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/profile", { cache: "no-store" });
        if (!res.ok) throw new Error("Unable to load your profile.");
        const data = await res.json();
        const profile = data.user?.profile;
        const fullData = profile?.fullData && typeof profile.fullData === "object" ? profile.fullData : {};
        setCurrentProfile({
          ...emptyProfile, ...fullData,
          personal: { ...emptyProfile.personal, fullName: profile?.fullName || "", headline: profile?.headline || "", location: profile?.location || "", about: profile?.about || "", photoUrl: profile?.photoUrl || "" },
        });
      } catch (e: any) {
        setError(e?.message || "Unable to load your profile.");
      } finally { setLoading(false); }
    })();
  }, []);

  const handleFile = async (file: File) => {
    setError(""); setSaved(false); setDraft(null); setFileName(file.name);
    if (file.size > 10 * 1024 * 1024) { setError("CV files must be 10 MB or smaller."); return; }
    const allowed = ["application/pdf", "image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) { setError("Please upload a PDF, JPG, PNG, or WEBP CV."); return; }

    setParsing(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/parse-cv", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unable to parse CV.");
      setDraft(data.profile || emptyProfile);
    } catch (e: any) {
      setError(e?.message || "Unable to parse CV.");
    } finally { setParsing(false); }
  };

  const saveImported = async () => {
    if (!draft) return;
    setSaving(true); setError("");
    try {
      const merged = mergeProfile(currentProfile, draft);
      const res = await fetch("/api/profile", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(merged) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unable to save imported profile.");
      localStorage.setItem("user_profile_data", JSON.stringify(merged));
      window.dispatchEvent(new Event("profile_updated"));
      window.dispatchEvent(new Event("storage"));
      setCurrentProfile(merged); setDraft(null); setSaved(true);
    } catch (e: any) {
      setError(e?.message || "Unable to save imported profile.");
    } finally { setSaving(false); }
  };

  const importedCounts = draft ? {
    skills: draft.skills?.length || 0, experiences: draft.experiences?.length || 0, educations: draft.educations?.length || 0,
    projects: draft.projects?.length || 0, achievements: draft.achievements?.length || 0, publications: draft.publications?.length || 0,
  } : null;

  return (
    <div className="min-h-screen bg-slate-50/50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600"><FileText className="h-4 w-4" /> Career record import</div>
            <h1 className="mt-1 text-3xl font-black text-slate-900">Import your CV</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-500">Upload an existing CV and XROVIA will turn it into a structured draft. Nothing is saved until you review and approve it.</p>
          </div>
          <Link href="/dashboard" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50"><ArrowLeft className="h-4 w-4" /> Dashboard</Link>
        </div>

        <div className="rounded-3xl border border-blue-100 bg-blue-50/70 p-5 flex gap-3">
          <ShieldCheck className="h-5 w-5 shrink-0 text-blue-600 mt-0.5" />
          <div><p className="text-sm font-bold text-slate-900">Review before saving</p><p className="mt-1 text-xs leading-relaxed text-slate-600">Imported information is treated as a draft. XROVIA does not mark imported claims as verified.</p></div>
        </div>

        {error && <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</div>}
        {saved && <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 flex items-center gap-2"><CheckCircle2 className="h-4 w-4" />Imported information was added to your career record.</div>}

        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
          <label className="flex min-h-48 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/60 px-6 text-center hover:border-blue-400 hover:bg-blue-50/40 transition">
            <input type="file" accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => { const file = e.target.files?.[0]; if (file) handleFile(file); e.currentTarget.value = ""; }} />
            {parsing ? <><Loader2 className="h-8 w-8 animate-spin text-blue-600" /><span className="mt-3 text-sm font-bold text-slate-900">Reading your CV...</span><span className="mt-1 text-xs text-slate-500">This may take a few seconds.</span></> : <><Upload className="h-8 w-8 text-slate-400" /><span className="mt-3 text-sm font-bold text-slate-900">Upload PDF or image CV</span><span className="mt-1 text-xs text-slate-500">Maximum 10 MB</span></>}
          </label>
          {fileName && <p className="mt-3 text-xs font-semibold text-slate-600">Selected: {fileName}</p>}
        </div>

        {loading && <div className="rounded-2xl bg-white border border-slate-200 p-5 text-sm text-slate-500">Loading your existing profile...</div>}

        {draft && importedCounts && <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div><h2 className="text-lg font-black text-slate-900">Review extracted information</h2><p className="mt-1 text-xs text-slate-500">Check the draft before importing it into your existing record.</p></div>
            <span className="inline-flex w-fit rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700 border border-amber-200">Draft only</span>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {Object.entries(importedCounts).map(([key, value]) => <div key={key} className="rounded-2xl bg-slate-50 border border-slate-100 p-4"><p className="text-2xl font-black text-slate-900">{value}</p><p className="mt-1 text-[11px] font-bold uppercase tracking-wide text-slate-500">{key}</p></div>)}
          </div>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <section className="rounded-2xl border border-slate-200 p-4"><h3 className="text-sm font-bold text-slate-900">Personal details</h3><div className="mt-3 space-y-2 text-sm"><p><span className="font-semibold">Name:</span> {text(draft.personal?.fullName) || "Not found"}</p><p><span className="font-semibold">Headline:</span> {text(draft.personal?.headline) || "Not found"}</p><p><span className="font-semibold">Location:</span> {text(draft.personal?.location) || "Not found"}</p><p><span className="font-semibold">About:</span> {text(draft.personal?.about) || "Not found"}</p></div></section>
            <section className="rounded-2xl border border-slate-200 p-4"><h3 className="text-sm font-bold text-slate-900">Skills</h3><div className="mt-3 flex flex-wrap gap-2">{(draft.skills || []).length ? draft.skills!.map((skill, i) => <span key={skill + "-" + i} className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">{skill}</span>) : <span className="text-xs text-slate-500">No skills detected.</span>}</div></section>
            <section className="rounded-2xl border border-slate-200 p-4"><h3 className="text-sm font-bold text-slate-900">Experience</h3><div className="mt-3 space-y-3">{(draft.experiences || []).length ? draft.experiences!.map((item: any, i) => <div key={i} className="text-sm"><p className="font-bold text-slate-900">{item.role || "Role"} {item.company ? "at " + item.company : ""}</p><p className="text-xs text-slate-500">{item.startDate || ""}{item.endDate ? " → " + item.endDate : item.current ? " → Present" : ""}</p>{item.description && <p className="mt-1 text-xs leading-relaxed text-slate-600">{item.description}</p>}</div>) : <span className="text-xs text-slate-500">No experience detected.</span>}</div></section>
            <section className="rounded-2xl border border-slate-200 p-4"><h3 className="text-sm font-bold text-slate-900">Education</h3><div className="mt-3 space-y-3">{(draft.educations || []).length ? draft.educations!.map((item: any, i) => <div key={i} className="text-sm"><p className="font-bold text-slate-900">{item.degree || "Degree"}{item.fieldOfStudy ? " — " + item.fieldOfStudy : ""}</p><p className="text-xs text-slate-500">{item.institution || ""}</p><p className="text-xs text-slate-500">{item.startDate || ""}{item.endDate ? " → " + item.endDate : item.current ? " → Present" : ""}</p></div>) : <span className="text-xs text-slate-500">No education detected.</span>}</div></section>
            <section className="rounded-2xl border border-slate-200 p-4"><h3 className="text-sm font-bold text-slate-900">Projects</h3><div className="mt-3 space-y-3">{(draft.projects || []).length ? draft.projects!.map((item: any, i) => <div key={i} className="text-sm"><p className="font-bold text-slate-900">{item.title || "Project"}</p>{item.role && <p className="text-xs text-slate-500">{item.role}</p>}{item.description && <p className="mt-1 text-xs leading-relaxed text-slate-600">{item.description}</p>}</div>) : <span className="text-xs text-slate-500">No projects detected.</span>}</div></section>
            <section className="rounded-2xl border border-slate-200 p-4"><h3 className="text-sm font-bold text-slate-900">Achievements & publications</h3><p className="mt-3 text-xs text-slate-600">{importedCounts.achievements} achievement(s) and {importedCounts.publications} publication(s) detected.</p></section>
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button type="button" onClick={() => setDraft(null)} className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-xs font-bold text-slate-700 hover:bg-slate-50">Discard draft</button>
            <button type="button" onClick={saveImported} disabled={saving} className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-xs font-bold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}{saving ? "Importing..." : "Review complete — Import into XROVIA"}</button>
          </div>
        </div>}
      </div>
    </div>
  );
}
