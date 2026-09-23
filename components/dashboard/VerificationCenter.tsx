"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, ShieldCheck, Clock3 } from "lucide-react";

type Request = { id:string; type:string; itemId:string; title:string; organizationName:string; verifierEmail:string; verifierRole:string; status:string; createdAt:string; verifiedAt?:string|null };

export function VerificationCenter() {
  const [requests,setRequests]=useState<Request[]>([]);
  const [loading,setLoading]=useState(true);

  useEffect(()=>{(async()=>{
    try {
      const res=await fetch("/api/profile",{cache:"no-store"});
      if(!res.ok)return;
      const data=await res.json();
      const stored=data.user?.profile?.fullData?.verificationRequests;
      setRequests(Array.isArray(stored)?stored:[]);
    } finally { setLoading(false); }
  })()},[]);

  const verified=requests.filter(r=>r.status==="VERIFIED").length;
  const pending=requests.filter(r=>r.status==="PENDING").length;

  return <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-5">
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div><div className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-blue-600"/><h2 className="text-base font-black text-slate-900">Verification Center</h2></div><p className="mt-1 text-xs text-slate-500">Verification requests are sent directly to the verifier's email. Only the recipient can approve the request.</p></div>
      <div className="flex gap-2 text-[11px] font-bold"><span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700 border border-emerald-200">{verified} verified</span><span className="rounded-full bg-amber-50 px-3 py-1 text-amber-700 border border-amber-200">{pending} pending</span></div>
    </div>
    {loading ? <div className="h-16 rounded-2xl bg-slate-50 animate-pulse"/> : requests.length===0 ? <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 p-5"><p className="text-sm font-bold text-slate-800">Your records are currently self-reported.</p><p className="mt-1 text-xs text-slate-500">Request verification from an appropriate university or employer representative.</p></div> :
    <div className="space-y-3">{requests.map(r=><div key={r.id} className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4"><div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"><div><div className="flex items-center gap-2">{r.status==="VERIFIED"?<CheckCircle2 className="h-4 w-4 text-emerald-600"/>:<Clock3 className="h-4 w-4 text-amber-600"/>}<h3 className="text-sm font-bold text-slate-900">{r.title}</h3></div><p className="mt-1 text-xs text-slate-500">{r.type} • {r.organizationName} • {r.verifierRole}</p></div></div></div>)}</div>}
  </section>;
}
