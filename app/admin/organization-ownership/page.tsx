"use client";

import { useEffect, useState } from "react";
import { ExternalLink, Search, CheckCircle2, XCircle, HelpCircle } from "lucide-react";

type Application = {
  id:string;
  fullName:string;
  jobTitle:string;
  department:string;
  employmentType:string;
  associationDuration:string;
  phone:string|null;
  authorizationReason:string;
  officialProfileUrl:string|null;
  evidenceUrl:string|null;
  evidenceDescription:string|null;
  status:string;
  reviewNote:string|null;
  createdAt:string;
  organization:{id:string;name:string;slug:string;type:string;website:string;officialEmailDomain:string;country:string;status:string};
  applicant:{email:string;emailVerifiedAt:string|null;country:string|null};
};

export default function AdminOrganizationOwnershipPage(){
  const [applications,setApplications]=useState<Application[]>([]);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState("");
  const [note,setNote]=useState<Record<string,string>>({});
  const [busy,setBusy]=useState("");

  async function load(){
    setLoading(true); setError("");
    try{
      const res=await fetch("/api/admin/organization-ownership",{cache:"no-store"});
      const data=await res.json();
      if(!res.ok){setError(data.error||"Could not load applications.");return;}
      setApplications(data.applications);
    }catch{setError("Could not load applications.");}
    finally{setLoading(false);}
  }

  useEffect(()=>{load();},[]);

  async function review(id:string,action:"APPROVE"|"REJECT"|"MORE_INFORMATION_REQUIRED"){
    setBusy(id+action); setError("");
    try{
      const res=await fetch("/api/admin/organization-ownership",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({applicationId:id,action,reviewNote:note[id]||""})});
      const data=await res.json();
      if(!res.ok){setError(data.error||"Could not update application.");return;}
      await load();
    }catch{setError("Could not update application.");}
    finally{setBusy("");}
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-blue-600">XROVIA Administration</p>
          <h1 className="mt-1 text-3xl font-black text-slate-950">Organization ownership review</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">Review the organization, applicant position, official public information and authorization evidence before granting ownership.</p>
        </div>
        <a href="/admin" className="text-sm font-bold text-blue-600 hover:underline">Back to admin</a>
      </div>

      {error && <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}

      {loading ? <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-8 text-sm text-slate-500">Loading ownership applications...</div> :
      applications.length===0 ? <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">No ownership applications.</div> :
      <div className="mt-8 space-y-6">
        {applications.map(app=>(
          <article key={app.id} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">{app.organization.type.replaceAll("_"," ")}</span>
                    <span className={"rounded-full px-3 py-1 text-xs font-bold "+(app.status==="APPROVED"?"bg-emerald-50 text-emerald-700":app.status==="REJECTED"?"bg-red-50 text-red-700":"bg-amber-50 text-amber-700")}>{app.status.replaceAll("_"," ")}</span>
                  </div>
                  <h2 className="mt-3 text-2xl font-black text-slate-950">{app.organization.name}</h2>
                  <p className="mt-1 text-xs font-mono text-slate-500">{app.organization.slug} · {app.organization.website}</p>
                </div>
                <a href={"https://www.google.com/search?q="+encodeURIComponent(app.organization.name+" "+app.fullName+" "+app.jobTitle)} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50"><Search className="h-4 w-4"/>Search public web</a>
              </div>
            </div>

            <div className="grid gap-6 p-6 lg:grid-cols-2">
              <Info title="Applicant" rows={[
                ["Name",app.fullName],["Email",app.applicant.email],["Position",app.jobTitle],["Department",app.department],
                ["Relationship",app.employmentType],["Association",app.associationDuration],["Phone",app.phone||"Not provided"],
                ["Email verified",app.applicant.emailVerifiedAt?"Yes":"No"]
              ]}/>
              <Info title="Organization" rows={[
                ["Website",app.organization.website],["Official domain",app.organization.officialEmailDomain],["Country",app.organization.country],
                ["Current status",app.organization.status]
              ]}/>
            </div>

            <div className="grid gap-6 border-t border-slate-100 p-6 lg:grid-cols-2">
              <div>
                <h3 className="text-sm font-black text-slate-900">Authorization statement</h3>
                <p className="mt-2 whitespace-pre-wrap rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">{app.authorizationReason}</p>
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900">Public/evidence links</h3>
                <div className="mt-2 space-y-2 text-sm">
                  {app.officialProfileUrl && <a className="flex items-center gap-2 rounded-xl border border-slate-200 p-3 font-semibold text-blue-600 hover:bg-slate-50" href={app.officialProfileUrl} target="_blank" rel="noreferrer"><ExternalLink className="h-4 w-4"/>Official staff/profile page</a>}
                  {app.evidenceUrl && <a className="flex items-center gap-2 rounded-xl border border-slate-200 p-3 font-semibold text-blue-600 hover:bg-slate-50" href={app.evidenceUrl} target="_blank" rel="noreferrer"><ExternalLink className="h-4 w-4"/>Supporting evidence</a>}
                  {!app.officialProfileUrl && !app.evidenceUrl && <p className="rounded-xl bg-slate-50 p-3 text-slate-500">No external evidence link supplied.</p>}
                  {app.evidenceDescription && <p className="rounded-xl bg-slate-50 p-3 text-slate-600">{app.evidenceDescription}</p>}
                </div>
              </div>
            </div>

            {app.status!=="APPROVED" && app.status!=="REJECTED" && <div className="border-t border-slate-200 bg-slate-50 p-6">
              <label className="block text-sm font-bold text-slate-700">Review note</label>
              <textarea value={note[app.id]||""} onChange={e=>setNote(prev=>({...prev,[app.id]:e.target.value}))} rows={3} placeholder="Record what was verified, or what additional information is required." className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"/>
              <div className="mt-4 flex flex-wrap gap-3">
                <button disabled={!!busy} onClick={()=>review(app.id,"APPROVE")} className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white hover:bg-emerald-700 disabled:opacity-50"><CheckCircle2 className="h-4 w-4"/>Approve ownership</button>
                <button disabled={!!busy} onClick={()=>review(app.id,"MORE_INFORMATION_REQUIRED")} className="inline-flex items-center gap-2 rounded-xl border border-amber-300 bg-white px-4 py-3 text-sm font-bold text-amber-700 hover:bg-amber-50 disabled:opacity-50"><HelpCircle className="h-4 w-4"/>Request more information</button>
                <button disabled={!!busy} onClick={()=>review(app.id,"REJECT")} className="inline-flex items-center gap-2 rounded-xl border border-red-300 bg-white px-4 py-3 text-sm font-bold text-red-700 hover:bg-red-50 disabled:opacity-50"><XCircle className="h-4 w-4"/>Reject</button>
              </div>
            </div>}
          </article>
        ))}
      </div>}
    </main>
  );
}

function Info({title,rows}:{title:string;rows:string[][]}){
  return <div><h3 className="text-sm font-black text-slate-900">{title}</h3><dl className="mt-3 divide-y divide-slate-100 rounded-2xl border border-slate-200">{rows.map(([label,value])=><div key={label} className="grid grid-cols-[150px_1fr] gap-3 p-3 text-sm"><dt className="font-semibold text-slate-500">{label}</dt><dd className="break-words text-slate-800">{value}</dd></div>)}</dl></div>;
}
