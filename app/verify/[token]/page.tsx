"use client";

import { useEffect,useState } from "react";
import { CheckCircle2,ShieldCheck,ShieldAlert } from "lucide-react";

export default function VerifyRequestPage(){
  const [data,setData]=useState<any>(null),[error,setError]=useState(""),[name,setName]=useState(""),[role,setRole]=useState(""),[attested,setAttested]=useState(false),[done,setDone]=useState(false),[saving,setSaving]=useState(false);

  useEffect(()=>{
    const token=window.location.pathname.split("/").filter(Boolean).pop();
    if(!token)return;
    fetch(`/api/verification/${encodeURIComponent(token)}`).then(async r=>{
      const j=await r.json();
      if(!r.ok)throw new Error(j.error||"Request not found");
      setData(j);
      if(j.request.status==="VERIFIED")setDone(true);
    }).catch(e=>setError(e.message));
  },[]);

  const verify=async()=>{
    const token=window.location.pathname.split("/").filter(Boolean).pop()||"";
    setSaving(true);setError("");
    try{
      const res=await fetch(`/api/verification/${encodeURIComponent(token)}`,{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({verifierName:name,verifierRole:role,attested})
      });
      const j=await res.json();
      if(!res.ok)throw new Error(j.error||"Unable to verify");
      setDone(true);
    }catch(e:any){setError(e.message)}
    finally{setSaving(false)}
  };

  if(error)return <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6"><div className="max-w-lg w-full rounded-3xl bg-white border border-slate-200 p-8 shadow-sm text-center"><ShieldAlert className="mx-auto h-10 w-10 text-red-500"/><h1 className="mt-4 text-xl font-black text-slate-900">Verification request unavailable</h1><p className="mt-2 text-sm text-slate-500">{error}</p></div></main>;
  if(!data)return <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6"><div className="max-w-lg w-full rounded-3xl bg-white border border-slate-200 p-8 text-center"><div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600"/></div></main>;

  return <main className="min-h-screen bg-slate-50 py-12 px-4">
    <div className="mx-auto max-w-xl rounded-3xl border border-slate-200 bg-white p-7 sm:p-9 shadow-sm">
      <div className="flex items-center gap-2 text-blue-600"><ShieldCheck className="h-6 w-6"/><span className="text-xs font-black uppercase tracking-wider">XROVIA Verification</span></div>
      <h1 className="mt-5 text-2xl font-black text-slate-900">Verify a professional record</h1>
      <p className="mt-2 text-sm text-slate-600"><strong>{data.profile.fullName}</strong> requested verification for:</p>
      <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50/60 p-5">
        <p className="text-xs font-bold uppercase tracking-wider text-blue-600">{data.request.type}</p>
        <p className="mt-1 text-lg font-black text-slate-900">{data.request.title}</p>
        <p className="mt-2 text-xs text-slate-500">{data.request.organizationName} • Professional ID: {data.profile.professionalId}</p>
      </div>
      {done
        ? <div className="mt-6 rounded-2xl bg-emerald-50 border border-emerald-200 p-5 text-center"><CheckCircle2 className="mx-auto h-8 w-8 text-emerald-600"/><p className="mt-2 text-sm font-black text-emerald-800">Record verified</p><p className="mt-1 text-xs text-emerald-700">XROVIA recorded the verification and verifier attestation.</p></div>
        : <div className="mt-6 space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600">
              This secure link was sent to the requested verifier email. By continuing, confirm that you are the intended recipient and an appropriate representative of the organization named above.
            </div>
            <input value={name} onChange={e=>setName(e.target.value)} placeholder="Your full name" className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm"/>
            <input value={role} onChange={e=>setRole(e.target.value)} placeholder="Your role (Professor, HR, Registrar...)" className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm"/>
            <label className="flex items-start gap-3 rounded-xl border border-slate-200 p-3 text-xs text-slate-600">
              <input type="checkbox" checked={attested} onChange={e=>setAttested(e.target.checked)} className="mt-0.5"/>
              <span>I confirm that I am authorized to verify this record and that the information shown above is accurate to the best of my knowledge.</span>
            </label>
            <button onClick={verify} disabled={saving||!name.trim()||!role.trim()||!attested} className="w-full rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white disabled:opacity-40">{saving?"Recording verification...":"Confirm this record"}</button>
          </div>
      }
    </div>
  </main>;
}
