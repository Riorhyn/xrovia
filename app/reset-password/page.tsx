"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function ResetPasswordPage() {
  const params=useSearchParams();
  const router=useRouter();
  const token=params.get("token")||"";
  const [password,setPassword]=useState("");
  const [confirm,setConfirm]=useState("");
  const [error,setError]=useState("");
  const [success,setSuccess]=useState(false);
  const [loading,setLoading]=useState(false);

  async function submit(e:React.FormEvent<HTMLFormElement>){
    e.preventDefault(); setError("");
    if(password!==confirm){setError("Passwords do not match.");return;}
    setLoading(true);
    try{
      const res=await fetch("/api/auth/reset-password",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({token,password})});
      const data=await res.json();
      if(!res.ok){setError(data.error||"Unable to reset password.");return;}
      setSuccess(true);
      setTimeout(()=>router.push("/login"),1200);
    }catch{setError("Internal server error. Please try again.");}
    finally{setLoading(false);}
  }

  return <div className="max-w-md mx-auto px-4 py-16">
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8">
      <h1 className="text-2xl font-bold text-slate-900">Set a new password</h1>
      <p className="text-sm text-slate-500 mt-2 mb-6">Choose a new password for your XROVIA account.</p>
      {success?<div className="space-y-4"><p className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg p-3">Password changed successfully. Redirecting to login...</p><Link href="/login" className="text-blue-600 font-semibold hover:underline">Go to login</Link></div>:
      <form onSubmit={submit} className="space-y-5">
        <div><label className="block text-sm font-medium text-slate-700 mb-2">New password</label><input type="password" minLength={8} required value={password} onChange={e=>setPassword(e.target.value)} className="w-full px-4 py-3 border border-slate-300 rounded-lg text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"/></div>
        <div><label className="block text-sm font-medium text-slate-700 mb-2">Confirm new password</label><input type="password" minLength={8} required value={confirm} onChange={e=>setConfirm(e.target.value)} className="w-full px-4 py-3 border border-slate-300 rounded-lg text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"/></div>
        {error&&<p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">{error}</p>}
        <button disabled={loading||!token} className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50">{loading?"Changing...":"Change password"}</button>
      </form>}
    </div>
  </div>;
}
