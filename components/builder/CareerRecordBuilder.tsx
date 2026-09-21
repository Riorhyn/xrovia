"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import {
  User,
  MapPin,
  Briefcase,
  GraduationCap,
  FileText,
  ImageIcon,
  Plus,
  X,
  ShieldAlert,
  Save,
  CheckCircle2,
  ArrowLeft,
  Share2,
  Award,
  Upload,
  Heart,
  Globe,
  Trash2,
} from "lucide-react";

interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startYear: string;
  endYear: string;
}

interface AchievementItem {
  id: string;
  title: string;
  issuer: string;
  date: string;
}

interface DocumentItem {
  id: string;
  title: string;
  type: string;
  fileName: string;
}

export function CareerRecordBuilder() {
  const [isPending, startTransition] = useTransition();
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Form States
  const [personal, setPersonal] = useState({
    fullName: "Rajinder Singh",
    headline: "Mechanical Engineer",
    location: "India, Mohali",
    photoUrl: "",
    about: "This is test",
  });

  const [socials, setSocials] = useState({
    linkedin: "",
    github: "",
    website: "",
    twitter: "",
  });

  // Dynamic Lists
  const [skills, setSkills] = useState<string[]>(["CAD Design", "Thermal Analysis"]);
  const [skillInput, setSkillInput] = useState("");

  const [hobbies, setHobbies] = useState<string[]>(["3D Printing", "Robotics"]);
  const [hobbyInput, setHobbyInput] = useState("");

  const [experiences, setExperiences] = useState<ExperienceItem[]>([]);
  const [expForm, setExpForm] = useState({
    company: "",
    role: "",
    startDate: "",
    endDate: "",
    current: false,
    description: "",
  });

  const [educations, setEducations] = useState<EducationItem[]>([]);
  const [eduForm, setEduForm] = useState({
    institution: "",
    degree: "",
    fieldOfStudy: "",
    startYear: "",
    endYear: "",
  });

  const [achievements, setAchievements] = useState<AchievementItem[]>([]);
  const [achieveForm, setAchieveForm] = useState({ title: "", issuer: "", date: "" });

  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [docTitle, setDocTitle] = useState("");
  const [docType, setDocType] = useState("Degree/Diploma");

  // Handlers for Add/Remove
  const addSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const addHobby = (e: React.FormEvent) => {
    e.preventDefault();
    if (hobbyInput.trim() && !hobbies.includes(hobbyInput.trim())) {
      setHobbies([...hobbies, hobbyInput.trim()]);
      setHobbyInput("");
    }
  };

  const addExperience = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expForm.company || !expForm.role) return;
    setExperiences([...experiences, { ...expForm, id: Date.now().toString() }]);
    setExpForm({ company: "", role: "", startDate: "", endDate: "", current: false, description: "" });
  };

  const addEducation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eduForm.institution || !eduForm.degree) return;
    setEducations([...educations, { ...eduForm, id: Date.now().toString() }]);
    setEduForm({ institution: "", degree: "", fieldOfStudy: "", startYear: "", endYear: "" });
  };

  const addAchievement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!achieveForm.title) return;
    setAchievements([...achievements, { ...achieveForm, id: Date.now().toString() }]);
    setAchieveForm({ title: "", issuer: "", date: "" });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && docTitle.trim()) {
      setDocuments([
        ...documents,
        { id: Date.now().toString(), title: docTitle.trim(), type: docType, fileName: file.name },
      ]);
      setDocTitle("");
    }
  };

  const handleSaveAll = () => {
    startTransition(async () => {
      // API call to persist profile state
      setTimeout(() => {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      }, 500);
    });
  };

  return (
    <div className="min-h-screen bg-slate-50/50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-8">
        
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">Career Record Builder</h1>
            <p className="mt-1 text-sm text-slate-600 flex items-center gap-1.5">
              All entries are tagged as{" "}
              <span className="inline-flex items-center gap-1 font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 text-xs">
                <ShieldAlert className="h-3.5 w-3.5 text-amber-600" /> User-provided
              </span>{" "}
              until formal institution verification.
            </p>
          </div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </Link>
        </div>

        {/* 1. Personal Details */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4">Personal Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                value={personal.fullName}
                onChange={(e) => setPersonal({ ...personal, fullName: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Headline</label>
              <input
                type="text"
                value={personal.headline}
                onChange={(e) => setPersonal({ ...personal, headline: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Location</label>
              <input
                type="text"
                value={personal.location}
                onChange={(e) => setPersonal({ ...personal, location: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Photo URL</label>
              <input
                type="text"
                value={personal.photoUrl}
                onChange={(e) => setPersonal({ ...personal, photoUrl: e.target.value })}
                placeholder="https://..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Professional Summary (About)</label>
            <textarea
              rows={3}
              value={personal.about}
              onChange={(e) => setPersonal({ ...personal, about: e.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
        </div>

        {/* 2. Work Experience */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4 flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-blue-600" /> Work Experience
          </h2>

          {experiences.length > 0 && (
            <div className="space-y-3">
              {experiences.map((exp) => (
                <div key={exp.id} className="flex justify-between items-start rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{exp.role}</h3>
                    <p className="text-xs text-slate-600">{exp.company} • {exp.startDate} - {exp.current ? "Present" : exp.endDate}</p>
                    {exp.description && <p className="text-xs text-slate-500 mt-1">{exp.description}</p>}
                  </div>
                  <button onClick={() => setExperiences(experiences.filter((i) => i.id !== exp.id))} className="text-slate-400 hover:text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <form onSubmit={addExperience} className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <input type="text" placeholder="Company / Organization" value={expForm.company} onChange={(e) => setExpForm({ ...expForm, company: e.target.value })} className="rounded-xl border border-slate-200 px-3.5 py-2 text-sm" />
            <input type="text" placeholder="Job Title / Role" value={expForm.role} onChange={(e) => setExpForm({ ...expForm, role: e.target.value })} className="rounded-xl border border-slate-200 px-3.5 py-2 text-sm" />
            <input type="text" placeholder="Start Date (e.g. Jan 2022)" value={expForm.startDate} onChange={(e) => setExpForm({ ...expForm, startDate: e.target.value })} className="rounded-xl border border-slate-200 px-3.5 py-2 text-sm" />
            <input type="text" placeholder="End Date (or Leave empty if current)" value={expForm.endDate} onChange={(e) => setExpForm({ ...expForm, endDate: e.target.value })} className="rounded-xl border border-slate-200 px-3.5 py-2 text-sm" />
            <div className="sm:col-span-2">
              <button type="submit" className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800">
                <Plus className="h-4 w-4" /> Add Experience Entry
              </button>
            </div>
          </form>
        </div>

        {/* 3. Education & Studies */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4 flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-blue-600" /> Education & Academic Background
          </h2>

          {educations.length > 0 && (
            <div className="space-y-3">
              {educations.map((edu) => (
                <div key={edu.id} className="flex justify-between items-start rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{edu.degree} - {edu.fieldOfStudy}</h3>
                    <p className="text-xs text-slate-600">{edu.institution} • {edu.startYear} - {edu.endYear}</p>
                  </div>
                  <button onClick={() => setEducations(educations.filter((i) => i.id !== edu.id))} className="text-slate-400 hover:text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <form onSubmit={addEducation} className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <input type="text" placeholder="School / University" value={eduForm.institution} onChange={(e) => setEduForm({ ...eduForm, institution: e.target.value })} className="rounded-xl border border-slate-200 px-3.5 py-2 text-sm" />
            <input type="text" placeholder="Degree / Certificate" value={eduForm.degree} onChange={(e) => setEduForm({ ...eduForm, degree: e.target.value })} className="rounded-xl border border-slate-200 px-3.5 py-2 text-sm" />
            <input type="text" placeholder="Field of Study" value={eduForm.fieldOfStudy} onChange={(e) => setEduForm({ ...eduForm, fieldOfStudy: e.target.value })} className="rounded-xl border border-slate-200 px-3.5 py-2 text-sm" />
            <input type="text" placeholder="Years (e.g. 2018 - 2022)" value={eduForm.endYear} onChange={(e) => setEduForm({ ...eduForm, endYear: e.target.value })} className="rounded-xl border border-slate-200 px-3.5 py-2 text-sm" />
            <div className="sm:col-span-2">
              <button type="submit" className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800">
                <Plus className="h-4 w-4" /> Add Academic Record
              </button>
            </div>
          </form>
        </div>

        {/* 4. Achievements & Certifications */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4 flex items-center gap-2">
            <Award className="h-5 w-5 text-blue-600" /> Achievements & Certifications
          </h2>

          {achievements.length > 0 && (
            <div className="space-y-3">
              {achievements.map((ach) => (
                <div key={ach.id} className="flex justify-between items-start rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{ach.title}</h3>
                    <p className="text-xs text-slate-600">{ach.issuer} • {ach.date}</p>
                  </div>
                  <button onClick={() => setAchievements(achievements.filter((i) => i.id !== ach.id))} className="text-slate-400 hover:text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <form onSubmit={addAchievement} className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <input type="text" placeholder="Achievement / Certification Title" value={achieveForm.title} onChange={(e) => setAchieveForm({ ...achieveForm, title: e.target.value })} className="rounded-xl border border-slate-200 px-3.5 py-2 text-sm" />
            <input type="text" placeholder="Issuing Organization" value={achieveForm.issuer} onChange={(e) => setAchieveForm({ ...achieveForm, issuer: e.target.value })} className="rounded-xl border border-slate-200 px-3.5 py-2 text-sm" />
            <input type="text" placeholder="Issue Date" value={achieveForm.date} onChange={(e) => setAchieveForm({ ...achieveForm, date: e.target.value })} className="rounded-xl border border-slate-200 px-3.5 py-2 text-sm" />
            <div className="sm:col-span-3">
              <button type="submit" className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800">
                <Plus className="h-4 w-4" /> Add Achievement
              </button>
            </div>
          </form>
        </div>

        {/* 5. Skills & Hobbies */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900">Core Skills</h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((s) => (
                <span key={s} className="inline-flex items-center gap-1 rounded-lg border border-blue-100 bg-blue-50/60 px-2.5 py-1 text-xs font-bold text-blue-900">
                  {s} <button onClick={() => setSkills(skills.filter((i) => i !== s))}><X className="h-3 w-3" /></button>
                </span>
              ))}
            </div>
            <form onSubmit={addSkill} className="flex gap-2 pt-2">
              <input type="text" placeholder="Add skill" value={skillInput} onChange={(e) => setSkillInput(e.target.value)} className="w-full rounded-xl border border-slate-200 px-3 py-1.5 text-xs" />
              <button type="submit" className="rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-bold text-white">Add</button>
            </form>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
              <Heart className="h-4 w-4 text-pink-500" /> Hobbies & Interests
            </h2>
            <div className="flex flex-wrap gap-2">
              {hobbies.map((h) => (
                <span key={h} className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                  {h} <button onClick={() => setHobbies(hobbies.filter((i) => i !== h))}><X className="h-3 w-3" /></button>
                </span>
              ))}
            </div>
            <form onSubmit={addHobby} className="flex gap-2 pt-2">
              <input type="text" placeholder="Add hobby" value={hobbyInput} onChange={(e) => setHobbyInput(e.target.value)} className="w-full rounded-xl border border-slate-200 px-3 py-1.5 text-xs" />
              <button type="submit" className="rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-bold text-white">Add</button>
            </form>
          </div>
        </div>

        {/* 6. Social Media & Web Presence */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4 flex items-center gap-2">
            <Globe className="h-5 w-5 text-blue-600" /> Social Links & Portfolio
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input type="text" placeholder="LinkedIn URL" value={socials.linkedin} onChange={(e) => setSocials({ ...socials, linkedin: e.target.value })} className="rounded-xl border border-slate-200 px-3.5 py-2 text-sm" />
            <input type="text" placeholder="GitHub / Portfolio URL" value={socials.github} onChange={(e) => setSocials({ ...socials, github: e.target.value })} className="rounded-xl border border-slate-200 px-3.5 py-2 text-sm" />
            <input type="text" placeholder="Personal Website URL" value={socials.website} onChange={(e) => setSocials({ ...socials, website: e.target.value })} className="rounded-xl border border-slate-200 px-3.5 py-2 text-sm" />
            <input type="text" placeholder="Twitter / X Handle" value={socials.twitter} onChange={(e) => setSocials({ ...socials, twitter: e.target.value })} className="rounded-xl border border-slate-200 px-3.5 py-2 text-sm" />
          </div>
        </div>

        {/* 7. Upload Credentials / Verification Documents */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4 flex items-center gap-2">
            <Upload className="h-5 w-5 text-blue-600" /> Document Verification Vault
          </h2>

          {documents.length > 0 && (
            <div className="space-y-3">
              {documents.map((doc) => (
                <div key={doc.id} className="flex justify-between items-center rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{doc.title}</h4>
                      <p className="text-xs text-slate-500">{doc.type} • {doc.fileName}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-1 rounded border border-amber-200">
                    Pending Audit
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <input
              type="text"
              placeholder="Document Title (e.g. Degree Certificate)"
              value={docTitle}
              onChange={(e) => setDocTitle(e.target.value)}
              className="rounded-xl border border-slate-200 px-3.5 py-2 text-sm"
            />
            <select
              value={docType}
              onChange={(e) => setDocType(e.target.value)}
              className="rounded-xl border border-slate-200 px-3.5 py-2 text-sm bg-white"
            >
              <option value="Degree/Diploma">Degree / Diploma</option>
              <option value="Employment Letter">Employment Verification Letter</option>
              <option value="Certification">Professional Certification</option>
              <option value="ID Proof">Government ID Copy</option>
            </select>
            <label className="cursor-pointer inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50">
              <Upload className="h-4 w-4" /> Select & Attach File
              <input type="file" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>
        </div>

        {/* Global Action Footer */}
        <div className="flex items-center justify-between pt-4">
          {savedSuccess && (
            <span className="flex items-center gap-1.5 text-sm font-semibold text-emerald-700">
              <CheckCircle2 className="h-4 w-4" /> Career Record Updated!
            </span>
          )}
          <div className="flex gap-3 ml-auto">
            <button
              onClick={handleSaveAll}
              disabled={isPending}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-6 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-blue-800 disabled:opacity-50"
            >
              <Save className="h-4 w-4" /> {isPending ? "Saving Record..." : "Save Complete Record"}
            </button>
            <Link
              href="/dashboard"
              className="rounded-xl bg-slate-900 px-6 py-2.5 text-xs font-bold text-white shadow hover:bg-slate-800"
            >
              Finish & Return to Dashboard
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
} 