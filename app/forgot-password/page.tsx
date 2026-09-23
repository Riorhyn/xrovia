"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email,setEmail]=useState("");
  const [message,setMessage]=useState("");
  const [error,setError]=useState("");
  const [loading,setLoading]=useState(false);

  async function submit(e:React.FormEvent<HTMLFormElement>){
    e.preventDefault(); setMessage(""); setError(""); setLoading(true);
    try{
      const res=await fetch("/api/auth/forgot-password",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email})});
      const data=await res.json();
      if(!res.ok){setError(data.error||"Unable to send reset link.");return;}
      setMessage(data.message);
    }catch{setError("Internal server error. Please try again.");}
    finally{setLoading(false);}
  }

  return <div className="max-w-md mx-auto px-4 py-16">
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8">
      <h1 className="text-2xl font-bold text-slate-900">Forgot your password?</h1>
      <p className="text-sm text-slate-500 mt-2 mb-6">Enter your XROVIA account email and we&apos;ll send you a password reset link.</p>
      <form onSubmit={submit} className="space-y-5">
        <div><label className="block text-sm font-medium text-slate-700 mb-2">Email address</label>
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required placeholder="Enter your email" className="w-full px-4 py-3 border border-slate-300 rounded-lg text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"/>
        </div>
        {message&&<p className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg p-3">{message}</p>}
        {error&&<p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">{error}</p>}
        <button disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50">{loading?"Sending...":"Send reset link"}</button>
      </form>
      <p className="text-center text-sm text-slate-500 mt-6"><Link href="/login" className="text-blue-600 font-semibold hover:underline">Back to login</Link></p>
    </div>
  </div>;
}
