"use client";

import React, { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import {
  Briefcase,
  GraduationCap,
  Plus,
  X,
  ShieldCheck,
  Save,
  CheckCircle2,
  ArrowLeft,
  Upload,
  Heart,
  Globe,
  Trash2,
  Camera,
  FolderGit2,
  Edit2,
  Award,
  BookOpen,
  Languages,
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
  startDate: string;
  endDate: string;
  current: boolean;
}

interface ProjectItem {
  id: string;
  title: string;
  role: string;
  link: string;
  imageUrl?: string;
  description: string;
}

interface AchievementItem {
  id: string;
  title: string;
  issuer: string;
  date: string;
  certificateUrl?: string;
}

interface PublicationItem {
  id: string;
  title: string;
  publisher: string;
  link: string;
}

export default function BuilderPage() {
  const [isPending, startTransition] = useTransition();
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showSocials, setShowSocials] = useState(false);

  // Core Personal Details
  const [personal, setPersonal] = useState({
    fullName: "",
    headline: "",
    location: "",
    photoUrl: "",
    about: "",
  });

  const [socials, setSocials] = useState({
    linkedin: "",
    github: "",
    website: "",
    twitter: "",
  });

  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");

  const [hobbies, setHobbies] = useState<string[]>([]);
  const [hobbyInput, setHobbyInput] = useState("");

  const [languages, setLanguages] = useState<string[]>([]);
  const [langInput, setLangInput] = useState("");

  // Experience State + Editing tracking
  const [experiences, setExperiences] = useState<ExperienceItem[]>([]);
  const [editingExpId, setEditingExpId] = useState<string | null>(null);
  const [expForm, setExpForm] = useState({
    company: "",
    role: "",
    startDate: "",
    endDate: "",
    current: false,
    description: "",
  });

  // Education State + Editing tracking
  const [educations, setEducations] = useState<EducationItem[]>([]);
  const [editingEduId, setEditingEduId] = useState<string | null>(null);
  const [eduForm, setEduForm] = useState({
    institution: "",
    degree: "",
    fieldOfStudy: "",
    startDate: "",
    endDate: "",
    current: false,
  });

  // Projects State + Editing tracking
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [editingProjId, setEditingProjId] = useState<string | null>(null);
  const [projForm, setProjForm] = useState({
    title: "",
    role: "",
    link: "",
    imageUrl: "",
    description: "",
  });

  // Achievements & Certificates
  const [achievements, setAchievements] = useState<AchievementItem[]>([]);
  const [achieveForm, setAchieveForm] = useState({
    title: "",
    issuer: "",
    date: "",
    certificateUrl: "",
  });

  // Publications
  const [publications, setPublications] = useState<PublicationItem[]>([]);
  const [pubForm, setPubForm] = useState({ title: "", publisher: "", link: "" });

  // Load persisted state from LocalStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("user_profile_data");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.personal) setPersonal(parsed.personal);
        if (parsed.socials) {
          setSocials(parsed.socials);
          if (Object.values(parsed.socials).some((val) => Boolean(val))) {
            setShowSocials(true);
          }
        }
        if (parsed.skills) setSkills(parsed.skills);
        if (parsed.hobbies) setHobbies(parsed.hobbies);
        if (parsed.languages) setLanguages(parsed.languages);
        if (parsed.experiences) setExperiences(parsed.experiences);
        if (parsed.educations) setEducations(parsed.educations);
        if (parsed.projects) setProjects(parsed.projects);
        if (parsed.achievements) setAchievements(parsed.achievements);
        if (parsed.publications) setPublications(parsed.publications);
      } catch (e) {
        console.error("Local storage load error:", e);
      }
    }
  }, []);

  const saveToLocalStorage = (data: any) => {
    localStorage.setItem("user_profile_data", JSON.stringify(data));
    window.dispatchEvent(new Event("profile_updated"));
  };

  // Personal Photo Upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPersonal((prev) => ({ ...prev, photoUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Project Image Upload
  const handleProjectImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProjForm((prev) => ({ ...prev, imageUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Certificate Image Upload
  const handleCertImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAchieveForm((prev) => ({ ...prev, certificateUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Experience Add / Edit Handlers
  const handleAddOrUpdateExperience = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expForm.company || !expForm.role) return;

    if (editingExpId) {
      setExperiences(experiences.map((exp) => (exp.id === editingExpId ? { ...expForm, id: editingExpId } : exp)));
      setEditingExpId(null);
    } else {
      setExperiences([...experiences, { ...expForm, id: Date.now().toString() }]);
    }
    setExpForm({ company: "", role: "", startDate: "", endDate: "", current: false, description: "" });
  };

  const startEditExperience = (exp: ExperienceItem) => {
    setEditingExpId(exp.id);
    setExpForm({
      company: exp.company,
      role: exp.role,
      startDate: exp.startDate,
      endDate: exp.endDate,
      current: exp.current,
      description: exp.description,
    });
  };

  // Education Add / Edit Handlers
  const handleAddOrUpdateEducation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eduForm.institution || !eduForm.degree) return;

    if (editingEduId) {
      setEducations(educations.map((edu) => (edu.id === editingEduId ? { ...eduForm, id: editingEduId } : edu)));
      setEditingEduId(null);
    } else {
      setEducations([...educations, { ...eduForm, id: Date.now().toString() }]);
    }
    setEduForm({ institution: "", degree: "", fieldOfStudy: "", startDate: "", endDate: "", current: false });
  };

  const startEditEducation = (edu: EducationItem) => {
    setEditingEduId(edu.id);
    setEduForm({
      institution: edu.institution,
      degree: edu.degree,
      fieldOfStudy: edu.fieldOfStudy,
      startDate: edu.startDate,
      endDate: edu.endDate,
      current: edu.current,
    });
  };

  // Project Add / Edit Handlers
  const handleAddOrUpdateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projForm.title) return;

    if (editingProjId) {
      setProjects(projects.map((p) => (p.id === editingProjId ? { ...projForm, id: editingProjId } : p)));
      setEditingProjId(null);
    } else {
      setProjects([...projects, { ...projForm, id: Date.now().toString() }]);
    }
    setProjForm({ title: "", role: "", link: "", imageUrl: "", description: "" });
  };

  const startEditProject = (proj: ProjectItem) => {
    setEditingProjId(proj.id);
    setProjForm({
      title: proj.title,
      role: proj.role,
      link: proj.link,
      imageUrl: proj.imageUrl || "",
      description: proj.description,
    });
  };

  // Add Certificate / Achievement
  const addAchievement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!achieveForm.title) return;
    setAchievements([...achievements, { ...achieveForm, id: Date.now().toString() }]);
    setAchieveForm({ title: "", issuer: "", date: "", certificateUrl: "" });
  };

  // Add Publication
  const addPublication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pubForm.title) return;
    setPublications([...publications, { ...pubForm, id: Date.now().toString() }]);
    setPubForm({ title: "", publisher: "", link: "" });
  };

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

  const addLanguage = (e: React.FormEvent) => {
    e.preventDefault();
    if (langInput.trim() && !languages.includes(langInput.trim())) {
      setLanguages([...languages, langInput.trim()]);
      setLangInput("");
    }
  };

  const handleSaveAll = () => {
    startTransition(async () => {
      const payload = {
        personal,
        socials,
        skills,
        hobbies,
        languages,
        experiences,
        educations,
        projects,
        achievements,
        publications,
      };
      
      localStorage.setItem("user_profile_data", JSON.stringify(payload));
      
      window.dispatchEvent(new Event("profile_updated"));
      window.dispatchEvent(new Event("storage"));

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    });
  };

  return (
    <div className="min-h-screen bg-slate-50/50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-8">
        
        {/* Header Bar */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Career Record Builder</h1>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">Record Status:</span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200/80">
                <ShieldCheck className="h-3.5 w-3.5 text-amber-600" /> Self-Reported
              </span>
              <span className="text-xs text-slate-400 hidden sm:inline">• Pending institutional verification</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50 transition"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Dashboard
            </Link>
          </div>
        </div>

        {/* 1. Personal Details */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4">Personal Details</h2>

          <div className="flex items-center gap-6 pb-2">
            <div className="relative h-20 w-20 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
              {personal.photoUrl ? (
                <img src={personal.photoUrl} alt="Profile" className="h-full w-full object-cover" />
              ) : (
                <Camera className="h-7 w-7 text-slate-400" />
              )}
            </div>
            <div>
              <label className="cursor-pointer inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow hover:bg-slate-800 transition">
                <Upload className="h-3.5 w-3.5" /> Upload Photo
                <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
              </label>
              <p className="mt-1.5 text-xs text-slate-500">JPG, PNG or WEBP up to 5MB.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                placeholder="Full Name"
                value={personal.fullName}
                onChange={(e) => setPersonal({ ...personal, fullName: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Headline</label>
              <input
                type="text"
                placeholder="Job Title / Professional Headline"
                value={personal.headline}
                onChange={(e) => setPersonal({ ...personal, headline: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Location</label>
              <input
                type="text"
                placeholder="City, Country"
                value={personal.location}
                onChange={(e) => setPersonal({ ...personal, location: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Professional Summary (About)</label>
            <textarea
              rows={3}
              placeholder="Career summary..."
              value={personal.about}
              onChange={(e) => setPersonal({ ...personal, about: e.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm"
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
                <div key={exp.id} className="flex justify-between items-start rounded-xl border border-slate-200 bg-slate-50/60 p-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{exp.role}</h3>
                    <p className="text-xs text-slate-600">
                      {exp.company} • {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                    </p>
                    {exp.description && <p className="text-xs text-slate-500 mt-1">{exp.description}</p>}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => startEditExperience(exp)}
                      className="p-1 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      title="Edit Experience"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setExperiences(experiences.filter((i) => i.id !== exp.id))}
                      className="p-1 text-slate-400 hover:text-red-600 transition"
                      title="Delete Experience"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <form onSubmit={handleAddOrUpdateExperience} className="space-y-4 pt-2">
            <p className="text-xs font-bold uppercase text-slate-400">
              {editingExpId ? "Edit Experience Entry" : "Add Experience Entry"}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input type="text" placeholder="Company Name" value={expForm.company} onChange={(e) => setExpForm({ ...expForm, company: e.target.value })} className="rounded-xl border border-slate-200 px-3.5 py-2 text-sm" />
              <input type="text" placeholder="Job Title / Role" value={expForm.role} onChange={(e) => setExpForm({ ...expForm, role: e.target.value })} className="rounded-xl border border-slate-200 px-3.5 py-2 text-sm" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">Start Date</label>
                <input type="date" value={expForm.startDate} onChange={(e) => setExpForm({ ...expForm, startDate: e.target.value })} className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm bg-white" />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">End Date</label>
                <input type="date" disabled={expForm.current} value={expForm.endDate} onChange={(e) => setExpForm({ ...expForm, endDate: e.target.value })} className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm bg-white disabled:bg-slate-100" />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input type="checkbox" id="currentRole" checked={expForm.current} onChange={(e) => setExpForm({ ...expForm, current: e.target.checked, endDate: e.target.checked ? "" : expForm.endDate })} className="h-4 w-4 text-blue-600" />
              <label htmlFor="currentRole" className="text-xs font-semibold text-slate-700">Currently working in this role</label>
            </div>

            <button type="submit" className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white">
              <Plus className="h-4 w-4" /> {editingExpId ? "Update Experience" : "Add Experience"}
            </button>
          </form>
        </div>

        {/* 3. Education & Studies */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4 flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-blue-600" /> Education
          </h2>

          {educations.length > 0 && (
            <div className="space-y-3">
              {educations.map((edu) => (
                <div key={edu.id} className="flex justify-between items-start rounded-xl border border-slate-200 bg-slate-50/60 p-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{edu.degree} - {edu.fieldOfStudy}</h3>
                    <p className="text-xs text-slate-600">
                      {edu.institution} • {edu.startDate} - {edu.current ? "Present" : edu.endDate}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => startEditEducation(edu)} className="p-1 text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Edit Education">
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button onClick={() => setEducations(educations.filter((i) => i.id !== edu.id))} className="p-1 text-slate-400 hover:text-red-600 transition" title="Delete Education">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <form onSubmit={handleAddOrUpdateEducation} className="space-y-4 pt-2">
            <p className="text-xs font-bold uppercase text-slate-400">
              {editingEduId ? "Edit Education Entry" : "Add Academic Record"}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <input type="text" placeholder="School / University" value={eduForm.institution} onChange={(e) => setEduForm({ ...eduForm, institution: e.target.value })} className="rounded-xl border border-slate-200 px-3.5 py-2 text-sm" />
              <input type="text" placeholder="Degree / Certificate" value={eduForm.degree} onChange={(e) => setEduForm({ ...eduForm, degree: e.target.value })} className="rounded-xl border border-slate-200 px-3.5 py-2 text-sm" />
              <input type="text" placeholder="Field of Study" value={eduForm.fieldOfStudy} onChange={(e) => setEduForm({ ...eduForm, fieldOfStudy: e.target.value })} className="rounded-xl border border-slate-200 px-3.5 py-2 text-sm" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">Start Date</label>
                <input type="date" value={eduForm.startDate} onChange={(e) => setEduForm({ ...eduForm, startDate: e.target.value })} className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm bg-white" />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">End Date</label>
                <input type="date" disabled={eduForm.current} value={eduForm.endDate} onChange={(e) => setEduForm({ ...eduForm, endDate: e.target.value })} className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm bg-white disabled:bg-slate-100" />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input type="checkbox" id="currentEdu" checked={eduForm.current} onChange={(e) => setEduForm({ ...eduForm, current: e.target.checked, endDate: e.target.checked ? "" : eduForm.endDate })} className="h-4 w-4 text-blue-600" />
              <label htmlFor="currentEdu" className="text-xs font-semibold text-slate-700">Currently studying here</label>
            </div>

            <button type="submit" className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white">
              <Plus className="h-4 w-4" /> {editingEduId ? "Update Education" : "Add Education"}
            </button>
          </form>
        </div>

        {/* 4. Projects */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4 flex items-center gap-2">
            <FolderGit2 className="h-5 w-5 text-blue-600" /> Projects & Portfolio
          </h2>

          {projects.length > 0 && (
            <div className="space-y-3">
              {projects.map((p) => (
                <div key={p.id} className="flex justify-between items-start rounded-xl border border-slate-200 bg-slate-50/60 p-4 gap-4">
                  <div className="flex items-center gap-3">
                    {p.imageUrl && (
                      <img src={p.imageUrl} alt={p.title} className="h-12 w-12 rounded-lg object-cover border border-slate-200" />
                    )}
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{p.title}</h3>
                      <p className="text-xs text-slate-600">{p.role}</p>
                      {p.link && <a href={p.link} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline mt-0.5 inline-block">{p.link}</a>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => startEditProject(p)} className="p-1 text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Edit Project">
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button onClick={() => setProjects(projects.filter((i) => i.id !== p.id))} className="p-1 text-slate-400 hover:text-red-600 transition" title="Delete Project">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <form onSubmit={handleAddOrUpdateProject} className="space-y-4 pt-2">
            <p className="text-xs font-bold uppercase text-slate-400">
              {editingProjId ? "Edit Project" : "Add Project Entry"}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input type="text" placeholder="Project Title" value={projForm.title} onChange={(e) => setProjForm({ ...projForm, title: e.target.value })} className="rounded-xl border border-slate-200 px-3.5 py-2 text-sm" />
              <input type="text" placeholder="Your Role (e.g. Lead Designer)" value={projForm.role} onChange={(e) => setProjForm({ ...projForm, role: e.target.value })} className="rounded-xl border border-slate-200 px-3.5 py-2 text-sm" />
            </div>

            <input type="text" placeholder="Project Link / URL" value={projForm.link} onChange={(e) => setProjForm({ ...projForm, link: e.target.value })} className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm" />

            <div className="flex items-center gap-4">
              <label className="cursor-pointer inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100">
                <Upload className="h-3.5 w-3.5 text-blue-600" /> Upload Project Preview Photo
                <input type="file" accept="image/*" onChange={handleProjectImageUpload} className="hidden" />
              </label>
              {projForm.imageUrl && <span className="text-xs text-emerald-600 font-semibold">Image attached</span>}
            </div>

            <button type="submit" className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white">
              <Plus className="h-4 w-4" /> {editingProjId ? "Update Project" : "Add Project"}
            </button>
          </form>
        </div>

        {/* 5. Certificates & Achievements */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4 flex items-center gap-2">
            <Award className="h-5 w-5 text-blue-600" /> Achievements & Certifications
          </h2>

          {achievements.length > 0 && (
            <div className="space-y-3">
              {achievements.map((ach) => (
                <div key={ach.id} className="flex justify-between items-center rounded-xl border border-slate-200 bg-slate-50/60 p-4">
                  <div className="flex items-center gap-3">
                    {ach.certificateUrl && (
                      <img src={ach.certificateUrl} alt={ach.title} className="h-10 w-10 rounded-lg object-cover border border-slate-200" />
                    )}
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{ach.title}</h3>
                      <p className="text-xs text-slate-600">{ach.issuer} • {ach.date}</p>
                    </div>
                  </div>
                  <button onClick={() => setAchievements(achievements.filter((i) => i.id !== ach.id))} className="text-slate-400 hover:text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <form onSubmit={addAchievement} className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <input type="text" placeholder="Certificate / Achievement Title" value={achieveForm.title} onChange={(e) => setAchieveForm({ ...achieveForm, title: e.target.value })} className="rounded-xl border border-slate-200 px-3.5 py-2 text-sm" />
              <input type="text" placeholder="Issuing Organization" value={achieveForm.issuer} onChange={(e) => setAchieveForm({ ...achieveForm, issuer: e.target.value })} className="rounded-xl border border-slate-200 px-3.5 py-2 text-sm" />
              <input type="date" value={achieveForm.date} onChange={(e) => setAchieveForm({ ...achieveForm, date: e.target.value })} className="rounded-xl border border-slate-200 px-3.5 py-2 text-sm bg-white" />
            </div>

            <div className="flex items-center gap-4">
              <label className="cursor-pointer inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100">
                <Upload className="h-3.5 w-3.5 text-blue-600" /> Upload Certificate Proof / Badge
                <input type="file" accept="image/*" onChange={handleCertImageUpload} className="hidden" />
              </label>
              {achieveForm.certificateUrl && <span className="text-xs text-emerald-600 font-semibold">Proof attached</span>}
            </div>

            <button type="submit" className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white">
              <Plus className="h-4 w-4" /> Add Achievement
            </button>
          </form>
        </div>

        {/* 6. Social Links Toggle */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Globe className="h-5 w-5 text-blue-600" /> Social Links & Links
            </h2>
            <button
              onClick={() => setShowSocials(!showSocials)}
              className="text-xs font-bold text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition"
            >
              {showSocials ? "Hide Form" : "+ Add Social Links"}
            </button>
          </div>

          {showSocials && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <input type="text" placeholder="LinkedIn URL" value={socials.linkedin} onChange={(e) => setSocials({ ...socials, linkedin: e.target.value })} className="rounded-xl border border-slate-200 px-3.5 py-2 text-sm" />
              <input type="text" placeholder="GitHub / Portfolio URL" value={socials.github} onChange={(e) => setSocials({ ...socials, github: e.target.value })} className="rounded-xl border border-slate-200 px-3.5 py-2 text-sm" />
              <input type="text" placeholder="Personal Website URL" value={socials.website} onChange={(e) => setSocials({ ...socials, website: e.target.value })} className="rounded-xl border border-slate-200 px-3.5 py-2 text-sm" />
              <input type="text" placeholder="Twitter / X Handle" value={socials.twitter} onChange={(e) => setSocials({ ...socials, twitter: e.target.value })} className="rounded-xl border border-slate-200 px-3.5 py-2 text-sm" />
            </div>
          )}
        </div>

        {/* 7. Skills, Hobbies & Languages Spoken */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Skills */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-900">Core Skills</h2>
            <div className="flex flex-wrap gap-1.5">
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

          {/* Languages */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Languages className="h-4 w-4 text-blue-600" /> Languages
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {languages.map((l) => (
                <span key={l} className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                  {l} <button onClick={() => setLanguages(languages.filter((i) => i !== l))}><X className="h-3 w-3" /></button>
                </span>
              ))}
            </div>
            <form onSubmit={addLanguage} className="flex gap-2 pt-2">
              <input type="text" placeholder="Add language" value={langInput} onChange={(e) => setLangInput(e.target.value)} className="w-full rounded-xl border border-slate-200 px-3 py-1.5 text-xs" />
              <button type="submit" className="rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-bold text-white">Add</button>
            </form>
          </div>

          {/* Hobbies */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Heart className="h-4 w-4 text-pink-500" /> Hobbies
            </h2>
            <div className="flex flex-wrap gap-1.5">
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

        {/* 8. Research Publications Section */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-600" /> Publications & Research Papers
          </h2>

          {publications.length > 0 && (
            <div className="space-y-3">
              {publications.map((pub) => (
                <div key={pub.id} className="flex justify-between items-center rounded-xl border border-slate-200 bg-slate-50/60 p-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{pub.title}</h3>
                    <p className="text-xs text-slate-600">{pub.publisher}</p>
                  </div>
                  <button onClick={() => setPublications(publications.filter((i) => i.id !== pub.id))} className="text-slate-400 hover:text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <form onSubmit={addPublication} className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <input type="text" placeholder="Paper / Publication Title" value={pubForm.title} onChange={(e) => setPubForm({ ...pubForm, title: e.target.value })} className="rounded-xl border border-slate-200 px-3.5 py-2 text-sm" />
            <input type="text" placeholder="Journal / Publisher" value={pubForm.publisher} onChange={(e) => setPubForm({ ...pubForm, publisher: e.target.value })} className="rounded-xl border border-slate-200 px-3.5 py-2 text-sm" />
            <input type="text" placeholder="DOI / Link URL" value={pubForm.link} onChange={(e) => setPubForm({ ...pubForm, link: e.target.value })} className="rounded-xl border border-slate-200 px-3.5 py-2 text-sm" />
            <div className="sm:col-span-3">
              <button type="submit" className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white">
                <Plus className="h-4 w-4" /> Add Publication
              </button>
            </div>
          </form>
        </div>

        {/* Action Footer */}
        <div className="flex items-center justify-between pt-4">
          {savedSuccess && (
            <span className="flex items-center gap-1.5 text-sm font-semibold text-emerald-700">
              <CheckCircle2 className="h-4 w-4" /> Record Saved!
            </span>
          )}
          <div className="flex gap-3 ml-auto">
            <button
              onClick={handleSaveAll}
              disabled={isPending}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-6 py-2.5 text-xs font-bold text-white shadow hover:bg-blue-800"
            >
              <Save className="h-4 w-4" /> Save Record
            </button>
            <Link
              href="/dashboard"
              className="rounded-xl bg-slate-900 px-6 py-2.5 text-xs font-bold text-white shadow hover:bg-slate-800"
            >
              Return to Dashboard
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}