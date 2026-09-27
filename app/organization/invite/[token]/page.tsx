import Image from "next/image";
"use client";

import { useEffect, useState } from "react";

type InviteInfo = { organization:{name:string;slug:string}; email:string; role:string; existingAccount:boolean };

export default function OrganizationInvitePage({ params }: { params:{token:string} }) {
  const [info,setInfo]=useState<InviteInfo|null>(null);
  const [fullName,setFullName]=useState("");
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [error,setError]=useState("");
  const [loading,setLoading]=useState(false);

  useEffect(()=>{
    fetch("/api/organization/invite/"+encodeURIComponent(params.token))
      .then(async r=>{const d=await r.json(); if(!r.ok) throw new Error(d.error||"Invitation unavailable"); setInfo(d); setEmail(d.email);})
      .catch(e=>setError(e.message));
  },[params.token]);

  async function submit(e:React.FormEvent){
    e.preventDefault(); setError(""); setLoading(true);
    try{
      const res=await fetch("/api/organization/invite/"+encodeURIComponent(params.token),{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({fullName,email,password})
      });
      const data=await res.json();
      if(!res.ok){setError(data.error||"Could not accept invitation.");return;}
      window.location.href=data.redirectTo||"/organization";
    }catch{setError("Something went wrong. Please try again.");}
    finally{setLoading(false);}
  }

  return (
    <main className="mx-auto max-w-lg px-4 py-16">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-7">
          <Image src="/xrovia-logo-mark.webp" alt="XROVIA" width={48} height={48} className="h-12 w-12 object-contain" />
          <h1 className="text-3xl font-black text-slate-950">Join an organization</h1>
          {info && <p className="mt-2 text-sm leading-6 text-slate-500"><strong>{info.organization.name}</strong> invited you as an <strong>{info.role}</strong>.</p>}
        </div>
        {error && <p className="mb-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        {info && !error.startsWith("This invitation") && (
          <form onSubmit={submit} className="space-y-5">
            {!info.existingAccount && <div><label className="mb-2 block text-sm font-bold text-slate-700">Full name</label><input value={fullName} onChange={e=>setFullName(e.target.value)} required placeholder="Your full name" className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"/></div>}
            <div><label className="mb-2 block text-sm font-bold text-slate-700">Work email</label><input type="email" value={email} onChange={e=>setEmail(e.target.value)} readOnly className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700"/></div>
            <div><label className="mb-2 block text-sm font-bold text-slate-700">{info.existingAccount ? "Account password" : "Create password"}</label><input type="password" value={password} onChange={e=>setPassword(e.target.value)} minLength={8} required placeholder="Minimum 8 characters" className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"/></div>
            <button disabled={loading} className="w-full rounded-xl bg-blue-600 py-3.5 font-bold text-white hover:bg-blue-700 disabled:opacity-50">{loading ? "Joining..." : "Accept invitation"}</button>
          </form>
        )}
      </div>
    </main>
  );
}
