"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const types=[["UNIVERSITY","University / College"],["COMPANY","Company / Employer"],["TRAINING_PROVIDER","Training / Certification Provider"],["PROFESSIONAL_BODY","Professional / Industry Body"],["OTHER","Other Organization"]];

export default function OrganizationRegisterPage(){
  const params = useSearchParams();
  const [mode,setMode]=useState<"domain"|"personal">("domain");
  const [personalStage,setPersonalStage]=useState<"request"|"register">("request");
  const [form,setForm]=useState({
    name:"",type:"UNIVERSITY",website:"",email:params.get("email")||"",country:"India",password:"",
    applicantName:"",jobTitle:"",department:"",employmentType:"",associationDuration:"",phone:"",
    authorizationReason:"",officialProfileUrl:"",evidenceUrl:"",evidenceDescription:"",code:""
  });
  const [error,setError]=useState(""); const [message,setMessage]=useState(""); const [loading,setLoading]=useState(false);

  function update(key:keyof typeof form,value:string){setForm(p=>({...p,[key]:value}));}
  function resetMessages(){setError("");setMessage("");}

  async function submitPersonalRequest(e:React.FormEvent){
    e.preventDefault();resetMessages();setLoading(true);
    try{
      const r=await fetch("/api/organization/verification-request",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({
        name:form.name,type:form.type,website:form.website,country:form.country,contactEmail:form.email,
        applicantName:form.applicantName,jobTitle:form.jobTitle,department:form.department,
        employmentType:form.employmentType,associationDuration:form.associationDuration,phone:form.phone,
        authorizationReason:form.authorizationReason,officialProfileUrl:form.officialProfileUrl,
        evidenceUrl:form.evidenceUrl,evidenceDescription:form.evidenceDescription
      })});
      const d=await r.json();if(!r.ok){setError(d.error||"Could not submit request.");return;}
      setMessage("Request submitted successfully. XROVIA will review it and, after approval, send a one-time registration code to this same email address.");
    }catch{setError("Something went wrong. Please try again.");}finally{setLoading(false);}
  }

  async function completePersonalRegistration(e:React.FormEvent){
    e.preventDefault();resetMessages();setLoading(true);
    try{
      const r=await fetch("/api/organization/verified-registration",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:form.email,code:form.code,password:form.password})});
      const d=await r.json();if(!r.ok){setError(d.error||"Registration failed.");return;}
      window.location.href=d.redirectTo||"/organization";
    }catch{setError("Something went wrong. Please try again.");}finally{setLoading(false);}
  }

  async function submitDomain(e:React.FormEvent){
    e.preventDefault();resetMessages();setLoading(true);
    try{
      const r=await fetch("/api/organization/register",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:form.name,type:form.type,website:form.website,officialEmail:form.email,country:form.country,password:form.password})});
      const d=await r.json();if(!r.ok){setError(d.error||"Registration failed.");return;}
      if(d.needsEmailVerification){setMessage("A verification code was sent to your organization email. Use the existing email verification step to continue.");}
      else window.location.href=d.redirectTo||"/organization";
    }catch{setError("Something went wrong. Please try again.");}finally{setLoading(false);}
  }

  return <main className="mx-auto max-w-2xl px-5 py-12">
    <h1 className="text-3xl font-black text-slate-950">Register an organization</h1>
    <p className="mt-2 text-sm leading-6 text-slate-500">If your organization has no official domain email, XROVIA can verify the organization manually. You keep your same Gmail, Outlook, or other personal email throughout registration.</p>

    <div className="mb-7 mt-7 grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1">
      <Link href="/register" className="rounded-lg px-3 py-2.5 text-center text-sm font-semibold text-slate-600 hover:bg-white">Personal account</Link>
      <div className="rounded-lg bg-white px-3 py-2.5 text-center text-sm font-semibold text-slate-900 shadow-sm">Organization account</div>
    </div>

    <div className="mb-6 grid grid-cols-2 gap-2 rounded-xl border border-slate-200 p-1">
      <button type="button" onClick={()=>{setMode("domain");resetMessages()}} className={mode==="domain"?"rounded-lg bg-blue-600 px-3 py-2.5 text-sm font-bold text-white":"rounded-lg px-3 py-2.5 text-sm font-bold text-slate-600"}>I have an organization email</button>
      <button type="button" onClick={()=>{setMode("personal");resetMessages()}} className={mode==="personal"?"rounded-lg bg-blue-600 px-3 py-2.5 text-sm font-bold text-white":"rounded-lg px-3 py-2.5 text-sm font-bold text-slate-600"}>I only have personal email</button>
    </div>

    {mode==="domain" ? <form onSubmit={submitDomain} className="space-y-5">
      <Field label="Organization name"><input value={form.name} onChange={e=>update("name",e.target.value)} required className="input" placeholder="ABC University"/></Field>
      <Field label="Organization type"><select value={form.type} onChange={e=>update("type",e.target.value)} className="input bg-white">{types.map(([v,l])=><option key={v} value={v}>{l}</option>)}</select></Field>
      <Field label="Official website"><input type="url" value={form.website} onChange={e=>update("website",e.target.value)} required className="input" placeholder="https://example.edu"/></Field>
      <Field label="Official organization email"><input type="email" value={form.email} onChange={e=>update("email",e.target.value)} required className="input" placeholder="admin@example.edu"/><p className="mt-1.5 text-xs text-slate-500">This must be controlled by the organization and match the website domain.</p></Field>
      <Field label="Country"><input value={form.country} onChange={e=>update("country",e.target.value)} required className="input"/></Field>
      <Field label="Account password"><input type="password" value={form.password} onChange={e=>update("password",e.target.value)} minLength={8} required className="input"/></Field>
      {error&&<Alert text={error}/>} {message&&<Success text={message}/>}
      <button disabled={loading} className="w-full rounded-xl bg-blue-600 py-3.5 font-bold text-white disabled:opacity-50">{loading?"Submitting...":"Create organization request"}</button>
    </form> :
    personalStage==="request" ? <form onSubmit={submitPersonalRequest} className="space-y-5">
      <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5"><h2 className="font-black text-slate-900">Request XROVIA verification</h2><p className="mt-2 text-sm leading-6 text-slate-600">Submit enough information for XROVIA to verify that you represent this organization. No organization account is created until the request is approved.</p></div>
      <Field label="Organization name"><input value={form.name} onChange={e=>update("name",e.target.value)} required className="input"/></Field>
      <Field label="Organization type"><select value={form.type} onChange={e=>update("type",e.target.value)} className="input bg-white">{types.map(([v,l])=><option key={v} value={v}>{l}</option>)}</select></Field>
      <Field label="Organization website (if available)"><input type="url" value={form.website} onChange={e=>update("website",e.target.value)} className="input" placeholder="https://example.org"/></Field>
      <Field label="Country / location"><input value={form.country} onChange={e=>update("country",e.target.value)} required className="input"/></Field>
      <Field label="Your existing email"><input type="email" value={form.email} onChange={e=>update("email",e.target.value)} required className="input" placeholder="organization.contact@gmail.com"/><p className="mt-1.5 text-xs text-slate-500">This exact email will receive the XROVIA registration code if your request is approved.</p></Field>
      <Field label="Your full name"><input value={form.applicantName} onChange={e=>update("applicantName",e.target.value)} required className="input"/></Field>
      <Field label="Job title / position"><input value={form.jobTitle} onChange={e=>update("jobTitle",e.target.value)} required className="input"/></Field>
      <Field label="Department"><input value={form.department} onChange={e=>update("department",e.target.value)} className="input"/></Field>
      <Field label="Employment / relationship"><input value={form.employmentType} onChange={e=>update("employmentType",e.target.value)} className="input" placeholder="Owner, Director, Faculty, HR, etc."/></Field>
      <Field label="How long have you been associated?"><input value={form.associationDuration} onChange={e=>update("associationDuration",e.target.value)} className="input" placeholder="e.g. 5 years"/></Field>
      <Field label="Phone"><input value={form.phone} onChange={e=>update("phone",e.target.value)} className="input"/></Field>
      <Field label="Why are you authorized to register this organization?"><textarea value={form.authorizationReason} onChange={e=>update("authorizationReason",e.target.value)} required rows={4} className="input"/></Field>
      <Field label="Official profile / staff page (if available)"><input type="url" value={form.officialProfileUrl} onChange={e=>update("officialProfileUrl",e.target.value)} className="input"/></Field>
      <Field label="Supporting evidence link (if available)"><input type="url" value={form.evidenceUrl} onChange={e=>update("evidenceUrl",e.target.value)} className="input"/></Field>
      <Field label="Evidence description"><textarea value={form.evidenceDescription} onChange={e=>update("evidenceDescription",e.target.value)} rows={3} className="input" placeholder="Explain what the evidence proves."/></Field>
      {error&&<Alert text={error}/>} {message&&<Success text={message}/>}
      <button disabled={loading} className="w-full rounded-xl bg-blue-600 py-3.5 font-bold text-white disabled:opacity-50">{loading?"Submitting request...":"Send verification request to XROVIA"}</button>
    </form> :
    <form onSubmit={completePersonalRegistration} className="space-y-5">
      <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5"><h2 className="font-black text-slate-900">Complete approved registration</h2><p className="mt-2 text-sm leading-6 text-slate-600">Enter the same email you used for the verification request and the one-time code XROVIA sent to it.</p></div>
      <Field label="Same email"><input type="email" value={form.email} onChange={e=>update("email",e.target.value)} required className="input"/></Field>
      <Field label="XROVIA registration code"><input value={form.code} onChange={e=>update("code",e.target.value.replace(/\D/g,""))} inputMode="numeric" maxLength={8} required className="input text-center tracking-[0.35em]" placeholder="12345678"/></Field>
      <Field label="Create organization password"><input type="password" value={form.password} onChange={e=>update("password",e.target.value)} minLength={8} required className="input"/></Field>
      {error&&<Alert text={error}/>} {message&&<Success text={message}/>}
      <button disabled={loading} className="w-full rounded-xl bg-blue-600 py-3.5 font-bold text-white disabled:opacity-50">{loading?"Creating organization...":"Complete organization registration"}</button>
      <p className="text-xs leading-5 text-slate-500">Your email stays exactly the same. The code is a one-time XROVIA approval credential and expires after 48 hours.</p>
    </form>}
  </main>;
}
function Field({label,children}:{label:string;children:React.ReactNode}){return <div><label className="mb-2 block text-sm font-bold text-slate-700">{label}</label>{children}</div>}
function Alert({text}:{text:string}){return <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{text}</div>}
function Success({text}:{text:string}){return <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">{text}</div>}
