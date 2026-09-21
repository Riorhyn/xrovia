"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, CheckCircle2 } from "lucide-react";

export default function ProfileBuilderPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Form states
  const [personal, setPersonal] = useState({
    fullName: "",
    headline: "",
    location: "",
    about: "",
    photoUrl: "",
  });

  const [skills, setSkills] = useState<{ id?: string; name: string }[]>([]);
  const [newSkill, setNewSkill] = useState("");

  const [education, setEducation] = useState<any[]>([]);
  const [newEdu, setNewEdu] = useState({
    degree: "",
    field: "",
    institution: "",
    startYear: new Date().getFullYear() - 4,
    endYear: new Date().getFullYear(),
  });

  const [experience, setExperience] = useState<any[]>([]);
  const [newExp, setNewExp] = useState({
    company: "",
    jobTitle: "",
    startDate: "",
    endDate: "",
    isCurrent: false,
    description: "",
  });

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch("/api/profile/me");
        if (res.ok) {
          const data = await res.json();
          setPersonal({
            fullName: data.fullName || "",
            headline: data.headline || "",
            location: data.location || "",
            about: data.about || "",
            photoUrl: data.photoUrl || "",
          });
          setSkills(data.skills || []);
          setEducation(data.education || []);
          setExperience(data.experience || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handleSavePersonal = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    try {
      const res = await fetch("/api/profile/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(personal),
      });

      if (res.ok) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.trim()) return;

    try {
      const res = await fetch("/api/profile/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newSkill.trim() }),
      });
      if (res.ok) {
        const item = await res.json();
        setSkills([...skills, item]);
        setNewSkill("");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteSkill = async (id?: string) => {
    if (!id) return;
    try {
      const res = await fetch(`/api/profile/skills/${id}`, { method: "DELETE" });
      if (res.ok) {
        setSkills(skills.filter((s) => s.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-sm text-slate-500">Loading your profile record...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-10">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Career Record Builder</h1>
        <p className="text-sm text-slate-500 mt-1">
          All added entries are tagged as <span className="font-semibold text-amber-600">🟡 User-provided</span> until formal institution verification is requested in future phases.
        </p>
      </div>

      {/* Personal Information */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Personal Details</h2>
        <form onSubmit={handleSavePersonal} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                value={personal.fullName}
                onChange={(e) => setPersonal({ ...personal, fullName: e.target.value })}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Headline</label>
              <input
                type="text"
                value={personal.headline}
                onChange={(e) => setPersonal({ ...personal, headline: e.target.value })}
                placeholder="e.g. Mechanical Engineer | Robotics"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Location</label>
              <input
                type="text"
                value={personal.location}
                onChange={(e) => setPersonal({ ...personal, location: e.target.value })}
                placeholder="e.g. San Francisco, CA"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Photo URL</label>
              <input
                type="url"
                value={personal.photoUrl}
                onChange={(e) => setPersonal({ ...personal, photoUrl: e.target.value })}
                placeholder="https://..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Professional Summary (About)</label>
            <textarea
              rows={4}
              value={personal.about}
              onChange={(e) => setPersonal({ ...personal, about: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-sm disabled:opacity-50 transition"
            >
              {saving ? "Saving..." : "Save Personal Details"}
            </button>
            {savedSuccess && (
              <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
                <CheckCircle2 className="w-4 h-4" /> Saved successfully
              </span>
            )}
          </div>
        </form>
      </div>

      {/* Skills Manager */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 mb-2">Core Skills</h2>
        <div className="flex flex-wrap gap-2 mb-4">
          {skills.map((skill) => (
            <span
              key={skill.id}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-800 text-xs font-medium rounded-lg border border-slate-200"
            >
              {skill.name}
              <button
                type="button"
                onClick={() => handleDeleteSkill(skill.id)}
                className="text-slate-400 hover:text-rose-600"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </span>
          ))}
          {skills.length === 0 && <span className="text-xs text-slate-400">No skills added yet.</span>}
        </div>

        <form onSubmit={handleAddSkill} className="flex gap-2 max-w-sm">
          <input
            type="text"
            placeholder="Add skill (e.g. Python)"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            className="flex-1 px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
          />
          <button
            type="submit"
            className="px-3 py-1.5 bg-slate-800 text-white rounded-lg text-xs font-medium hover:bg-slate-900"
          >
            Add
          </button>
        </form>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => router.push("/dashboard")}
          className="px-6 py-2.5 bg-slate-900 text-white text-sm font-semibold rounded-xl hover:bg-slate-800"
        >
          Finish & Return to Dashboard
        </button>
      </div>
    </div>
  );
}