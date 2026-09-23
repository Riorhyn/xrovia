"use client";

import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setError(""); setLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({email,password}),
      });
      const data = await response.json();
      if (!response.ok) { setError(data.error || "Invalid email or password"); return; }
      window.location.href = data.user?.role === "ADMIN" ? "/admin" : "/dashboard";
    } catch { setError("Internal server error. Please try again."); }
    finally { setLoading(false); }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600 text-white font-black text-xl mb-4">X</div>
          <h1 className="text-3xl font-bold text-slate-900">Welcome back</h1>
          <p className="text-slate-500 mt-2">Sign in to your PROVIA account.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div><label className="block text-sm font-medium text-slate-700 mb-2">Email address</label>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Enter your email" required className="w-full px-4 py-3 border border-slate-300 rounded-lg text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"/>
          </div>
          <div><div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-slate-700">Password</label>
            <Link href="/forgot-password" className="text-sm font-semibold text-blue-600 hover:underline">Forgot password?</Link>
          </div>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Enter your password" required className="w-full px-4 py-3 border border-slate-300 rounded-lg text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"/>
          </div>
          {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">{error}</p>}
          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50">{loading ? "Signing in..." : "Sign in"}</button>
        </form>
        <p className="text-center text-sm text-slate-500 mt-6">Don&apos;t have an account?{" "}
          <Link href="/register" className="text-blue-600 font-semibold hover:underline">Create Professional ID</Link>
        </p>
      </div>
    </div>
  );
}