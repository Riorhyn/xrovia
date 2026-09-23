"use client";

import { useState } from "react";
import Link from "next/link";

export default function SecurityPage(){
  const [currentPassword,setCurrentPassword]=useState("");
  const [newPassword,setNewPassword]=useState("");
  const [confirm,setConfirm]=useState("");
  const [message,setMessage]=useState("");
  const [error,setError]=useState("");
  const [loading,setLoading]=useState(false);

  async function submit(e:React.FormEvent<HTMLFormElement>){
    e.preventDefault();setMessage("");setError("");
    if(newPassword!==confirm){setError("New passwords do not match.");return;}
    setLoading(true);
    try{
      const res=await fetch("/api/auth/change-password",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({currentPassword,newPassword})});
      const data=await res.json();
      if(!res.ok){setError(data.error||"Unable to change password.");return;}
      setMessage(data.message);setCurrentPassword("");setNewPassword("");setConfirm("");
    }catch{setError("Internal server error. Please try again.");}
    finally{setLoading(false);}
  }

  return <div className="min-h-screen bg-slate-50/50 py-10 px-4">
    <div className="max-w-xl mx-auto">
      <Link href="/dashboard" className="text-sm text-blue-600 font-semibold hover:underline">← Back to dashboard</Link>
      <div className="mt-4 bg-white border border-slate-200 rounded-2xl shadow-sm p-8">
        <h1 className="text-2xl font-bold text-slate-900">Change Password</h1>
        <p className="text-sm text-slate-500 mt-2 mb-6">Update the password you use to sign in to XROVIA.</p>
        <form onSubmit={submit} className="space-y-5">
          <div><label className="block text-sm font-medium text-slate-700 mb-2">Current password</label><input type="password" required value={currentPassword} onChange={e=>setCurrentPassword(e.target.value)} className="w-full px-4 py-3 border border-slate-300 rounded-lg text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"/></div>
          <div><label className="block text-sm font-medium text-slate-700 mb-2">New password</label><input type="password" minLength={8} required value={newPassword} onChange={e=>setNewPassword(e.target.value)} className="w-full px-4 py-3 border border-slate-300 rounded-lg text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"/></div>
          <div><label className="block text-sm font-medium text-slate-700 mb-2">Confirm new password</label><input type="password" minLength={8} required value={confirm} onChange={e=>setConfirm(e.target.value)} className="w-full px-4 py-3 border border-slate-300 rounded-lg text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"/></div>
          {message&&<p className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg p-3">{message}</p>}
          {error&&<p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">{error}</p>}
          <button disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50">{loading?"Updating...":"Change password"}</button>
        </form>
      </div>
    </div>
  </div>;
}
