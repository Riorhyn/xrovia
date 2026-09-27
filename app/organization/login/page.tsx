"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function OrganizationLoginPage() {
  const params = useSearchParams();
  const [slug, setSlug] = useState(params.get("slug") || "");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setError(""); setLoading(true);
    try {
      const res = await fetch("/api/organization/login", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({slug,email,password})
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Unable to sign in."); return; }
      window.location.href = "/organization";
    } catch {
      setError("Internal server error. Please try again.");
    } finally { setLoading(false); }
  }

  return (
    <main className="mx-auto max-w-md px-4 py-16">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-7 text-center">
          <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-xl bg-blue-600 text-xl font-black text-white">X</div>
          <h1 className="text-3xl font-black text-slate-950">Organization login</h1>
          <p className="mt-2 text-sm text-slate-500">Sign in as an authorized member of an XROVIA organization.</p>
        </div>
        <form onSubmit={submit} className="space-y-5">
          <div><label className="mb-2 block text-sm font-bold text-slate-700">Organization ID</label><input value={slug} onChange={e=>setSlug(e.target.value)} required placeholder="your-organization-id" className="w-full rounded-xl border border-slate-300 px-4 py-3 font-mono text-sm text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"/></div>
          <div><label className="mb-2 block text-sm font-bold text-slate-700">Work email</label><input type="email" value={email} onChange={e=>setEmail(e.target.value)} required placeholder="name@organization.edu" className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"/></div>
          <div><label className="mb-2 block text-sm font-bold text-slate-700">Password</label><input type="password" value={password} onChange={e=>setPassword(e.target.value)} required placeholder="Your password" className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"/></div>
          {error && <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          <button disabled={loading} className="w-full rounded-xl bg-slate-900 py-3.5 font-bold text-white hover:bg-slate-800 disabled:opacity-50">{loading ? "Signing in..." : "Sign in to organization"}</button>
        </form>
        <div className="mt-6 space-y-2 text-center text-sm text-slate-500">
          <p>Need a new organization account? <Link href="/organization/register" className="font-bold text-blue-600 hover:underline">Register organization</Link></p>
          <p><Link href="/login" className="font-bold text-slate-700 hover:underline">Personal account login</Link></p>
        </div>
      </div>
    </main>
  );
}
