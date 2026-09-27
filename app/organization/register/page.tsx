"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const types=[["UNIVERSITY","University / College"],["COMPANY","Company / Employer"],["TRAINING_PROVIDER","Training / Certification Provider"],["PROFESSIONAL_BODY","Professional / Industry Body"],["OTHER","Other Organization"]];

export default function OrganizationRegisterPage(){
  const params=useSearchParams();
  const [mode,setMode]=useState(params.get("mode")==="verified"?"verified":"domain");
  const [form,setForm]=useState({name:"",type:"UNIVERSITY",website:"",email:params.get("email")||"",country:"India",password:"",applicantName:"",jobTitle:"",department:"",employmentType:"",associationDuration:"",phone:"",authorizationReason:"",officialProfileUrl:"",evidenceUrl:"",evidenceDescription:"",code:""});
  const [message,setMessage]=useState(""); const [error,setError]=useState(""); const [loading,setLoading]=useState(false);

  function update(key:string,value:string){setForm(p=>({...p,[key]:value}));}
  async function submitRequest(e:React.FormEvent){
    e.preventDefault();setError("");setMessage("");setLoading(true);
    try{
      const r=await fetch("/api/organization/verification-request",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({
        name:form.name,type:form.type,website:form.website,country:form.country,contactEmail:form.email,applicantName:form.applicantName,jobTitle:form.jobTitle,department:form.department,employmentType:form.employmentType,associationDuration:form.associationDuration,phone:form.phone,authorizationReason:form.authorizationReason,officialProfileUrl:form.officialProfileUrl,evidenceUrl:form.evidenceUrl,evidenceDescription:form.evidenceDescription
      })});
      const d=await r.json(); if(!r.ok){setError(d.error||"Could not submit request.");return;}
      setMessage("Request submitted. XROVIA will review the organization and send a one-time registration code to this same email after approval.");
    }catch{setError("Something went wrong. Please try again.");}finally{setLoading(false);}
  }
  async function registerApproved(e:React.FormEvent){
    e.preventDefault();setError("");setMessage("");setLoading(true);
    try{
      const r=await fetch("/api/organization/verified-registration",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:form.email,code:form.code,password:form.password})});
      const d=await r.json();if(!r.ok){setError(d.error||"Registration failed.");return;}
      window.location.href=d.redirectTo||"/organization";
    }catch{setError("Something went wrong. Please try again.");}finally{setLoading(false);}
  }

  return <main className="mx-auto max-w-2xl px-5 py-12">
    <h1 className="text-3xl font-black text-slate-950">Register an organization</h1>
    <p className="mt-2 text-sm leading-6 text-slate-500">Organizations with an official domain can use domain-email verification. If your organization only has a personal email such as Gmail or Outlook, request XROVIA verification first.</p>
    <div className="mb-7 mt-7 grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1">
      <Link href="/register" className="rounded-lg px-3 py-2.5 text-center text-sm font-semibold text-slate-600 hover:bg-white">Personal account</Link>
      <div className="rounded-lg bg-white px-3 py-2.5 text-center text-sm font-semibold text-slate-900 shadow-sm">Organization account</div>
    </div>
    <div className="mb-6 grid grid-cols-2 gap-2 rounded-xl border border-slate-200 p-1">
      <button type="button" onClick={()=>setMode("domain")} className={mode==="domain"?"rounded-lg bg-blue-600 px-3 py-2.5 text-sm font-bold text-white":"rounded-lg px-3 py-2.5 text-sm font-bold text-slate-600"}>I have an organization email</button>
      <button type="button" onClick={()=>setMode("verified")} className={mode==="verified"?"rounded-lg bg-blue-600 px-3 py-2.5 text-sm font-bold text-white":"rounded-lg px-3 py-2.5 text-sm font-bold text-slate-600"}>I only have personal email</button>
    </div>

    {mode==="domain" ? <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
      <h2 className="font-black text-slate-900">Official organization email registration</h2>
      <p className="mt-2 text-sm text-slate-600">Use the existing organization registration process when your email domain is controlled by the organization.</p>
      <Link href="/organization/register" className="mt-4 inline-flex rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white">Continue with organization email</Link>
      <p className="mt-4 text-xs text-slate-500">Enter the organization details below on the standard form. If you do not have an official domain email, choose the other option above.</p>
      <DomainForm form={form} update={update}/>
    </div> :
    <form onSubmit={registerApproved} className="space-y-5">
      <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5"><h2 className="font-black text-slate-900">Approved registration</h2><p className="mt-2 text-sm leading-6 text-slate-600">Use the same personal email that you submitted to XROVIA. You can continue only after XROVIA approves your verification request and sends a one-time code to that email.</p></div>
      <Field label="Email"><input type="email" value={form.email} onChange={e=>update("email",e.target.value)} required className="input"/></Field>
      <Field label="XROVIA registration code"><input value={form.code} onChange={e=>update("code",e.target.value.replace(/\D/g,""))} inputMode="numeric" maxLength={8} required placeholder="8-digit code" className="input text-center tracking-[0.35em]"/></Field>
      <Field label="Create organization account password"><input type="password" value={form.password} onChange={e=>update("password",e.target.value)} minLength={8} required className="input"/></Field>
      {error&&<Alert text={error}/>} {message&&<Success text={message}/>}
      <button disabled={loading} className="w-full rounded-xl bg-blue-600 py-3.5 font-bold text-white disabled:opacity-50">{loading?"Creating organization...":"Complete organization registration"}</button>
      <p className="text-xs leading-5 text-slate-500">Your personal email remains the account/contact email. The code is only proof that XROVIA approved this organization registration request.</p>
    </form>}
    {mode==="verified"&&<button type="button" onClick={()=>setMode("domain")} className="mt-5 text-sm font-bold text-blue-600 hover:underline">Back to organization email registration</button>}
  </main>;
}

function DomainForm({form,update}:{form:any;update:(k:string,v:string)=>void}){
  return <div className="mt-5 space-y-4">
    <Field label="Organization name"><input value={form.name} onChange={e=>update("name",e.target.value)} className="input"/></Field>
    <Field label="Organization type"><select value={form.type} onChange={e=>update("type",e.target.value)} className="input bg-white">{types.map(([v,l])=><option key={v} value={v}>{l}</option>)}</select></Field>
    <Field label="Official website"><input type="url" value={form.website} onChange={e=>update("website",e.target.value)} className="input" placeholder="https://example.edu"/></Field>
    <Field label="Official organization email"><input type="email" value={form.email} onChange={e=>update("email",e.target.value)} className="input" placeholder="admin@example.edu"/></Field>
    <Field label="Country"><input value={form.country} onChange={e=>update("country",e.target.value)} className="input"/></Field>
    <Field label="Account password"><input type="password" value={form.password} onChange={e=>update("password",e.target.value)} className="input"/></Field>
    <p className="text-xs text-slate-500">The standard domain-email flow is preserved. If this email is Gmail/Outlook/etc., use “I only have personal email” instead.</p>
  </div>;
}
function Field({label,children}:{label:string;children:React.ReactNode}){return <div><label className="mb-2 block text-sm font-bold text-slate-700">{label}</label>{children}</div>}
function Alert({text}:{text:string}){return <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{text}</div>}
function Success({text}:{text:string}){return <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">{text}</div>}
