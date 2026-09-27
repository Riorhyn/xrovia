"use client";

import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const types = [
  ["UNIVERSITY", "University / College"],
  ["COMPANY", "Company / Employer"],
  ["TRAINING_PROVIDER", "Training / Certification Provider"],
  ["PROFESSIONAL_BODY", "Professional / Industry Body"],
  ["OTHER", "Other Organization"],
];

export default function OrganizationRegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name:"", type:"UNIVERSITY", website:"", officialEmail:"", country:"India", password:"" });
  const [otp, setOtp] = useState("");
  const [verifyStep, setVerifyStep] = useState(false);
  const [organization, setOrganization] = useState<{name:string;slug:string} | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(key: keyof typeof form, value: string) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const res = await fetch("/api/organization/register", {
        method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Registration failed."); return; }
      setOrganization(data.organization);
      if (data.needsEmailVerification) setVerifyStep(true);
      else router.push("/organization/login?slug=" + encodeURIComponent(data.organization.slug));
    } catch {
      setError("Something went wrong. Please try again.");
    } finally { setLoading(false); }
  }

  async function verify(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const res = await fetch("/api/auth/verify-email", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({email:form.officialEmail, code:otp})
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Verification failed."); return; }
      window.location.href = data.redirectTo || "/organization";
    } catch {
      setError("Verification failed. Please try again.");
    } finally { setLoading(false); }
  }

  if (verifyStep) {
    return (
      <main className="mx-auto max-w-lg px-4 py-16">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="mb-6 grid h-12 w-12 place-items-center rounded-xl bg-blue-600 text-xl font-black text-white">X</div>
          <h1 className="text-3xl font-black text-slate-950">Verify organization email</h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            We sent a 6-digit code to <strong>{form.officialEmail}</strong>. Your organization account is ready, but its first administrator must verify the email before signing in.
          </p>
          <form onSubmit={verify} className="mt-7 space-y-5">
            <input value={otp} onChange={e=>setOtp(e.target.value.replace(/\D/g,""))} maxLength={6} inputMode="numeric" placeholder="000000" required className="w-full rounded-xl border border-slate-300 px-4 py-4 text-center text-2xl tracking-[0.5em] text-slate-900 outline-none focus:ring-2 focus:ring-blue-500" />
            {error && <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
            <button disabled={loading} className="w-full rounded-xl bg-blue-600 py-3 font-bold text-white hover:bg-blue-700 disabled:opacity-50">{loading ? "Verifying..." : "Verify and continue"}</button>
          </form>
          {organization && <p className="mt-5 text-xs text-slate-500">Organization ID: <span className="font-mono font-bold text-slate-700">{organization.slug}</span></p>}
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-12 sm:py-16">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-9">
        <div className="mb-8">
          <Image src="/xrovia-logo-mark.webp" alt="XROVIA" width={48} height={48} className="h-12 w-12 object-contain" />
          <h1 className="text-3xl font-black tracking-tight text-slate-950">Register an organization</h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">Create an XROVIA organization workspace for universities, companies and other verified institutions. The registering person becomes the Organization Owner.</p>
        </div>
        <form onSubmit={submit} className="space-y-5">
          <div><label className="mb-2 block text-sm font-bold text-slate-700">Organization name</label><input value={form.name} onChange={e=>update("name",e.target.value)} required placeholder="e.g. ABC University" className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"/></div>
          <div><label className="mb-2 block text-sm font-bold text-slate-700">Organization type</label><select value={form.type} onChange={e=>update("type",e.target.value)} className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:ring-2 focus:ring-blue-500">{types.map(([value,label])=><option key={value} value={value}>{label}</option>)}</select></div>
          <div><label className="mb-2 block text-sm font-bold text-slate-700">Official website</label><input type="url" value={form.website} onChange={e=>update("website",e.target.value)} required placeholder="https://example.edu" className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"/></div>
          <div><label className="mb-2 block text-sm font-bold text-slate-700">Official organization email</label><input type="email" value={form.officialEmail} onChange={e=>update("officialEmail",e.target.value)} required placeholder="admin@example.edu" className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"/><p className="mt-1.5 text-xs text-slate-500">Personal email providers are not accepted. The email domain must match the organization website.</p></div>
          <div><label className="mb-2 block text-sm font-bold text-slate-700">Country</label><input value={form.country} onChange={e=>update("country",e.target.value)} required placeholder="India" className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"/></div>
          <div><label className="mb-2 block text-sm font-bold text-slate-700">Owner password</label><input type="password" value={form.password} onChange={e=>update("password",e.target.value)} minLength={8} required placeholder="Minimum 8 characters" className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"/></div>
          {error && <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          <button disabled={loading} className="w-full rounded-xl bg-blue-600 py-3.5 font-bold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50">{loading ? "Creating organization..." : "Create organization account"}</button>
        </form>
        <div className="mt-6 flex flex-col gap-2 text-center text-sm text-slate-500 sm:flex-row sm:justify-center sm:gap-5">
          <Link href="/organization/login" className="font-bold text-blue-600 hover:underline">Organization login</Link>
          <Link href="/register" className="font-bold text-slate-700 hover:underline">Personal account</Link>
        </div>
      </div>
    </main>
  );
}
