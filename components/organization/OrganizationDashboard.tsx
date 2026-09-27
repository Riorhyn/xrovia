"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Building2, ShieldCheck, UserPlus, Users, CheckCircle2, Clock3, Trash2, FileCheck2 } from "lucide-react";

type Member = {
  id:string;
  role:"OWNER"|"ADMIN"|"VERIFIER"|"REVIEWER";
  status:string;
  user:{id:string;email:string;emailVerifiedAt:string|null};
};

type Org = {id:string;name:string;slug:string;type:string;status:string;website:string;country:string;role:string};
type OwnershipApplication = { id:string; status:string; reviewNote:string|null; createdAt:string };

export default function OrganizationDashboard() {
  const [org,setOrg]=useState<Org|null>(null);
  const [members,setMembers]=useState<Member[]>([]);
  const [application,setApplication]=useState<OwnershipApplication|null>(null);
  const [email,setEmail]=useState("");
  const [role,setRole]=useState("VERIFIER");
  const [message,setMessage]=useState("");
  const [error,setError]=useState("");
  const [loading,setLoading]=useState(false);

  async function load(){
    const res=await fetch("/api/organization/members",{cache:"no-store"});
    const data=await res.json();
    if(!res.ok){setError(data.error||"Unable to load organization.");return;}
    setOrg(data.organization); setMembers(data.members);

    const ownershipRes=await fetch("/api/organization/ownership",{cache:"no-store"});
    const ownershipData=await ownershipRes.json();
    if(ownershipRes.ok) setApplication(ownershipData.application || null);
  }

  useEffect(()=>{load();},[]);

  async function invite(e:React.FormEvent){
    e.preventDefault(); setError(""); setMessage(""); setLoading(true);
    try{
      const res=await fetch("/api/organization/invite",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email,role})});
      const data=await res.json();
      if(!res.ok){setError(data.error||"Could not send invitation.");return;}
      setMessage("Invitation sent to "+data.email+"."); setEmail("");
    }catch{setError("Could not send invitation.");}
    finally{setLoading(false);}
  }

  async function changeRole(memberId:string,newRole:string){
    setError(""); setMessage("");
    const res=await fetch("/api/organization/members",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({memberId,role:newRole})});
    const data=await res.json();
    if(!res.ok){setError(data.error||"Could not update role.");return;}
    setMembers(prev=>prev.map(m=>m.id===memberId?{...m,role:newRole as Member["role"]}:m));
    setMessage("Member role updated.");
  }

  async function removeMember(memberId:string){
    if(!confirm("Remove this member from the organization?")) return;
    setError(""); setMessage("");
    const res=await fetch("/api/organization/members",{method:"DELETE",headers:{"Content-Type":"application/json"},body:JSON.stringify({memberId})});
    const data=await res.json();
    if(!res.ok){setError(data.error||"Could not remove member.");return;}
    setMembers(prev=>prev.map(m=>m.id===memberId?{...m,status:"REMOVED"}:m));
    setMessage("Member removed.");
  }

  if(error && !org) return <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">{error}</div>;
  if(!org) return <div className="rounded-2xl border border-slate-200 bg-white p-8 text-sm text-slate-500">Loading organization workspace...</div>;

  const canManage=org.role==="OWNER"||org.role==="ADMIN";
  const isOwner=org.role==="OWNER";
  const activeMembers=members.filter(m=>m.status==="ACTIVE").length;
  const verifiers=members.filter(m=>m.status==="ACTIVE"&&(m.role==="OWNER"||m.role==="ADMIN"||m.role==="VERIFIER")).length;

  const applicationLabel =
    application?.status==="UNDER_REVIEW" ? "Ownership application under review" :
    application?.status==="MORE_INFORMATION_REQUIRED" ? "More information requested" :
    application?.status==="APPROVED" ? "Ownership approved" :
    application?.status==="REJECTED" ? "Ownership application rejected" : "";

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-blue-50 blur-3xl" aria-hidden="true"/>
        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-blue-700"><Building2 className="h-3.5 w-3.5"/>{org.type.replaceAll("_"," ")}</div>
            <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950">{org.name}</h1>
            <p className="mt-1 font-mono text-xs text-slate-500">{org.slug}</p>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">Organization workspace. Registration does not automatically grant ownership; organization ownership is verified separately by XROVIA.</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-800">{org.status==="VERIFIED"?<CheckCircle2 className="h-4 w-4 text-emerald-600"/>:<Clock3 className="h-4 w-4 text-amber-600"/>}{org.status==="VERIFIED"?"Verified organization":"Verification pending"}</div>
            <p className="mt-1 text-xs text-slate-500">XROVIA organization status</p>
          </div>
        </div>
      </section>

      {!isOwner && org.status !== "VERIFIED" && (
        <section className="rounded-3xl border border-blue-100 bg-blue-50 p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-blue-600"><FileCheck2 className="h-5 w-5"/></div>
              <div>
                <h2 className="text-lg font-black text-slate-900">Apply for organization ownership</h2>
                <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600">Provide your position, department, authorization details and supporting evidence. XROVIA will review the organization and your authority before granting ownership.</p>
                {applicationLabel && <p className="mt-2 text-xs font-bold text-blue-700">{applicationLabel}{application?.reviewNote ? " — " + application.reviewNote : ""}</p>}
              </div>
            </div>
            {!application || application.status==="REJECTED" ? (
              <Link href="/organization/ownership" className="inline-flex shrink-0 items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700">
                {application?.status==="REJECTED" ? "Apply again" : "Apply for ownership"}
              </Link>
            ) : application.status==="MORE_INFORMATION_REQUIRED" ? (
              <Link href="/organization/ownership" className="inline-flex shrink-0 items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700">Update application</Link>
            ) : null}
          </div>
        </section>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat icon={<Users className="h-5 w-5"/>} label="Active members" value={String(activeMembers)}/>
        <Stat icon={<ShieldCheck className="h-5 w-5"/>} label="Verification-capable members" value={String(verifiers)}/>
        <Stat icon={<Building2 className="h-5 w-5"/>} label="Country" value={org.country}/>
      </div>

      {canManage && <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
        <div className="flex items-start gap-3"><div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-600"><UserPlus className="h-5 w-5"/></div><div><h2 className="text-lg font-black text-slate-900">Add organization staff</h2><p className="mt-1 text-sm leading-6 text-slate-500">Invite an authorized person using their official organization email. They will get their own login and only the permissions assigned to their role.</p></div></div>
        <form onSubmit={invite} className="mt-5 grid gap-3 md:grid-cols-[1fr_190px_auto]">
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required placeholder="name@organization.edu" className="rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"/>
          <select value={role} onChange={e=>setRole(e.target.value)} className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900"><option value="ADMIN">Admin</option><option value="VERIFIER">Verifier</option><option value="REVIEWER">Reviewer</option></select>
          <button disabled={loading} className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-50"><UserPlus className="h-4 w-4"/>{loading?"Sending...":"Send invite"}</button>
        </form>
      </section>}

      {message && <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm font-medium text-emerald-700">{message}</div>}
      {error && <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700">{error}</div>}

      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-6"><h2 className="text-lg font-black text-slate-900">Organization members</h2><p className="mt-1 text-sm text-slate-500">Every staff member has an individual login. Permissions are controlled by organization role.</p></div>
        <div className="divide-y divide-slate-100">
          {members.map(member=><div key={member.id} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0"><p className="truncate text-sm font-bold text-slate-900">{member.user.email}</p><p className="mt-1 text-xs text-slate-500">{member.status==="ACTIVE"?"Active":"Removed"} · {member.user.emailVerifiedAt?"Email verified":"Email not verified"}</p></div>
            <div className="flex flex-wrap items-center gap-2">
              {member.role==="OWNER"?<span className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-bold text-white">Owner</span>:canManage?<><select value={member.role} disabled={member.status!=="ACTIVE"} onChange={e=>changeRole(member.id,e.target.value)} className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-700"><option value="ADMIN">Admin</option><option value="VERIFIER">Verifier</option><option value="REVIEWER">Reviewer</option></select>{member.status==="ACTIVE"&&<button onClick={()=>removeMember(member.id)} title="Remove member" className="rounded-lg border border-red-200 p-2 text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4"/></button>}</>:<span className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700">{member.role}</span>}
            </div>
          </div>)}
        </div>
      </section>
    </div>
  );
}

function Stat({icon,label,value}:{icon:React.ReactNode;label:string;value:string}){
  return <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center gap-2 text-blue-600">{icon}<span className="text-xs font-bold uppercase tracking-wider text-slate-500">{label}</span></div><p className="mt-3 text-2xl font-black text-slate-950">{value}</p></div>;
}
