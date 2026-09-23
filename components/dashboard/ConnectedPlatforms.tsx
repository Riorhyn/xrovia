"use client";

import { useEffect, useState } from "react";
import { ExternalLink, Link2, Plus, Trash2, CheckCircle2 } from "lucide-react";

type Platform = { id:string; name:string; description:string; placeholder:string; url:string };

const DEFAULT_PLATFORMS: Platform[] = [
  {id:"linkedin",name:"LinkedIn",description:"Career, experience & professional network",placeholder:"https://linkedin.com/in/your-name",url:""},
  {id:"github",name:"GitHub",description:"Code, repositories & open-source work",placeholder:"https://github.com/username",url:""},
  {id:"scholar",name:"Google Scholar",description:"Research papers, citations & publications",placeholder:"https://scholar.google.com/citations?user=...",url:""},
  {id:"orcid",name:"ORCID",description:"Persistent researcher identity",placeholder:"https://orcid.org/0000-0000-0000-0000",url:""},
  {id:"researchgate",name:"ResearchGate",description:"Research profile & publications",placeholder:"https://researchgate.net/profile/...",url:""},
  {id:"portfolio",name:"Portfolio / Website",description:"Personal website and work",placeholder:"https://example.com",url:""},
  {id:"patents",name:"Google Patents",description:"Patents and intellectual property",placeholder:"https://patents.google.com/...",url:""},
];

export function ConnectedPlatforms() {
  const [platforms,setPlatforms]=useState<Platform[]>(DEFAULT_PLATFORMS);
  const [baseFullData,setBaseFullData]=useState<Record<string,any>>({});
  const [loading,setLoading]=useState(true);
  const [saving,setSaving]=useState(false);
  const [saved,setSaved]=useState(false);
  const [customName,setCustomName]=useState("");
  const [customUrl,setCustomUrl]=useState("");

  useEffect(()=>{(async()=>{
    try{
      const res=await fetch("/api/profile",{cache:"no-store"});
      if(!res.ok)return;
      const data=await res.json();
      const fullData=data.user?.profile?.fullData||{};
      const stored=Array.isArray(fullData.connectedPlatforms)?fullData.connectedPlatforms:[];
      const byId = new Map<string, Platform>(stored.map((p: any) => [String(p.id), { ...p }]));
      const defaults = DEFAULT_PLATFORMS.map((p) => {
        const storedPlatform = byId.get(p.id);
        return storedPlatform ? { ...p, ...storedPlatform } : { ...p };
      });
      const custom=stored.filter((p:Platform)=>!DEFAULT_PLATFORMS.some(d=>d.id===p.id));
      setPlatforms([...defaults,...custom]);
      setBaseFullData(fullData);
    }catch(e){console.error("Failed to load professional presence:",e)}
    finally{setLoading(false)}
  })()},[]);

  const savePlatforms=async(next:Platform[])=>{
    setPlatforms(next);setSaving(true);setSaved(false);
    try{
      const res=await fetch("/api/profile",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({fullData:{...baseFullData,connectedPlatforms:next}})});
      if(!res.ok)throw new Error("Save failed");
      const data=await res.json();
      if(data.user?.profile?.fullData)setBaseFullData(data.user.profile.fullData);
      setSaved(true);window.dispatchEvent(new Event("profile_updated"));window.setTimeout(()=>setSaved(false),1800);
    }catch(e){console.error("Failed to save professional presence:",e)}
    finally{setSaving(false)}
  };

  const update=(id:string,changes:Partial<Platform>)=>setPlatforms(current=>current.map(p=>p.id===id?{...p,...changes}:p));
  const saveOne=(id:string)=>savePlatforms(platforms.map(p=>p.id===id?{...p,url:p.url.trim(),description:p.description.trim()}:p));

  const addCustom=()=>{
    const name=customName.trim(), raw=customUrl.trim();
    if(!name||!raw)return;
    try{
      const url=new URL(raw.startsWith("http://") || raw.startsWith("https://") ? raw : `https://${raw}`);
      savePlatforms([...platforms,{id:`custom-${Date.now()}`,name,description:"Professional profile",placeholder:"https://...",url:url.toString()}]);
      setCustomName("");setCustomUrl("");
    }catch{}
  };

  return <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-blue-700"><Link2 className="h-3.5 w-3.5"/> Professional Presence</span>
        <h2 className="mt-3 text-xl font-black text-slate-900">All your professional platforms in one place</h2>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">Connect LinkedIn, GitHub, Google Scholar, ORCID, research profiles, your portfolio and other professional platforms to your XROVIA identity.</p>
      </div>
      {saved&&<span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600"><CheckCircle2 className="h-4 w-4"/> Saved</span>}
    </div>
    {loading?<div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">Loading your connected platforms...</div>:
    <>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {platforms.map(p=><div key={p.id} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 transition hover:border-blue-200 hover:bg-white hover:shadow-sm">
          <div className="flex items-start justify-between gap-3"><div className="min-w-0"><h3 className="text-sm font-extrabold text-slate-900">{p.name}</h3><p className="mt-1 text-xs text-slate-500">Caption shown on your public profile</p></div>{p.url&&<a href={p.url} target="_blank" rel="noreferrer" className="rounded-lg border border-slate-200 bg-white p-2 text-slate-500 hover:text-blue-600"><ExternalLink className="h-4 w-4"/></a>}</div>
          <input value={p.description} onChange={e=>update(p.id,{description:e.target.value})} placeholder="Short caption" className="mt-3 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-800 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"/>
          <div className="mt-2 flex gap-2"><input value={p.url} onChange={e=>update(p.id,{url:e.target.value})} placeholder={p.placeholder} className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-800 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"/><button type="button" onClick={()=>saveOne(p.id)} disabled={saving} className="rounded-xl bg-blue-600 px-3 text-xs font-bold text-white hover:bg-blue-700 disabled:opacity-50">Save</button>{p.id.startsWith("custom-")&&<button type="button" onClick={()=>savePlatforms(platforms.filter(x=>x.id!==p.id))} className="rounded-xl border border-red-100 bg-red-50 px-3 text-red-600"><Trash2 className="h-4 w-4"/></button>}</div>
          {p.url&&<p className="mt-2 text-[11px] font-semibold text-emerald-600">Connected to your XROVIA profile</p>}
        </div>)}
      </div>
      <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4"><p className="text-sm font-bold text-slate-800">Add another professional platform</p><div className="mt-3 grid gap-2 sm:grid-cols-[0.8fr_1.5fr_auto]"><input value={customName} onChange={e=>setCustomName(e.target.value)} placeholder="Platform name" className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none"/><input value={customUrl} onChange={e=>setCustomUrl(e.target.value)} placeholder="https://..." className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none"/><button type="button" onClick={addCustom} disabled={saving} className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50"><Plus className="h-4 w-4"/> Add</button></div></div>
      <p className="mt-4 text-[11px] leading-5 text-slate-400">Links and captions are saved to your XROVIA profile and will appear on your public Professional Presence section.</p>
    </>}
  </section>;
}
