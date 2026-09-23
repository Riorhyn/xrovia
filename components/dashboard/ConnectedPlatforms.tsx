"use client";

import { useEffect, useState } from "react";
import { ExternalLink, Link2, Plus, Trash2, CheckCircle2 } from "lucide-react";

type Platform = {
  id: string;
  name: string;
  description: string;
  placeholder: string;
  url: string;
};

const DEFAULT_PLATFORMS: Platform[] = [
  { id: "linkedin", name: "LinkedIn", description: "Career, experience & professional network", placeholder: "https://linkedin.com/in/your-name", url: "" },
  { id: "github", name: "GitHub", description: "Code, repositories & open-source work", placeholder: "https://github.com/username", url: "" },
  { id: "scholar", name: "Google Scholar", description: "Research papers, citations & publications", placeholder: "https://scholar.google.com/citations?user=...", url: "" },
  { id: "orcid", name: "ORCID", description: "Persistent researcher identity", placeholder: "https://orcid.org/0000-0000-0000-0000", url: "" },
  { id: "researchgate", name: "ResearchGate", description: "Research profile & publications", placeholder: "https://researchgate.net/profile/...", url: "" },
  { id: "portfolio", name: "Portfolio / Website", description: "Personal website and work", placeholder: "https://example.com", url: "" },
  { id: "patents", name: "Google Patents", description: "Patents and intellectual property", placeholder: "https://patents.google.com/...", url: "" },
];

const STORAGE_KEY = "xrovia_connected_platforms";

export function ConnectedPlatforms() {
  const [platforms, setPlatforms] = useState<Platform[]>(DEFAULT_PLATFORMS);
  const [saved, setSaved] = useState(false);
  const [customName, setCustomName] = useState("");
  const [customUrl, setCustomUrl] = useState("");

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setPlatforms(JSON.parse(stored));
    } catch {
      // Keep the default platform list if stored data is unavailable.
    }
  }, []);

  const save = (next: Platform[]) => {
    setPlatforms(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1800);
  };

  const updateUrl = (id: string, url: string) => {
    save(platforms.map((platform) => (platform.id === id ? { ...platform, url } : platform)));
  };

  const addCustom = () => {
    const name = customName.trim();
    const url = customUrl.trim();
    if (!name || !url) return;
    try {
      const parsed = new URL(url);
      if (!["http:", "https:"].includes(parsed.protocol)) return;
    } catch {
      return;
    }
    save([...platforms, {
      id: `custom-${Date.now()}`,
      name,
      description: "Custom professional platform",
      placeholder: "https://...",
      url,
    }]);
    setCustomName("");
    setCustomUrl("");
  };

  const remove = (id: string) => save(platforms.filter((platform) => platform.id !== id));

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-blue-700">
            <Link2 className="h-3.5 w-3.5" /> Connected Professional Presence
          </span>
          <h2 className="mt-3 text-xl font-black text-slate-900">All your professional platforms in one place</h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
            Connect your LinkedIn, GitHub, Google Scholar, ORCID, research profile and portfolio to your XROVIA identity.
          </p>
        </div>
        {saved && (
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600">
            <CheckCircle2 className="h-4 w-4" /> Saved
          </span>
        )}
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {platforms.map((platform) => (
          <div key={platform.id} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 transition hover:border-blue-200 hover:bg-white hover:shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">{platform.name}</h3>
                <p className="mt-1 text-xs text-slate-500">{platform.description}</p>
              </div>
              {platform.url && (
                <a href={platform.url} target="_blank" rel="noreferrer" className="rounded-lg border border-slate-200 bg-white p-2 text-slate-500 hover:text-blue-600" aria-label={`Open ${platform.name}`}>
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
            </div>
            <div className="mt-3 flex gap-2">
              <input
                value={platform.url}
                onChange={(e) => setPlatforms((current) => current.map((item) => item.id === platform.id ? { ...item, url: e.target.value } : item))}
                onBlur={(e) => e.target.value.trim() && save(platforms.map((item) => item.id === platform.id ? { ...item, url: e.target.value.trim() } : item))}
                placeholder={platform.placeholder}
                className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-800 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
              {platform.id.startsWith("custom-") && (
                <button onClick={() => remove(platform.id)} className="rounded-xl border border-red-100 bg-red-50 px-3 text-red-600 hover:bg-red-100" aria-label={`Remove ${platform.name}`}>
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
            {platform.url && <p className="mt-2 text-[11px] font-semibold text-emerald-600">Connected to your XROVIA profile</p>}
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4">
        <p className="text-sm font-bold text-slate-800">Add another professional platform</p>
        <div className="mt-3 grid gap-2 sm:grid-cols-[0.8fr_1.5fr_auto]">
          <input value={customName} onChange={(e) => setCustomName(e.target.value)} placeholder="Platform name" className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
          <input value={customUrl} onChange={(e) => setCustomUrl(e.target.value)} placeholder="https://..." className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
          <button onClick={addCustom} className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white hover:bg-slate-800">
            <Plus className="h-4 w-4" /> Add
          </button>
        </div>
      </div>

      <p className="mt-4 text-[11px] leading-5 text-slate-400">
        XROVIA currently stores the professional links you provide. It does not automatically sign in to or modify these third-party accounts.
      </p>
    </section>
  );
}
