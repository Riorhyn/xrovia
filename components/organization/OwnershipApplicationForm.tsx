"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, FileText, Search, Building2 } from "lucide-react";

type Organization = {
  id: string; name: string; slug: string; type: string; website: string;
  officialEmailDomain: string; country: string; status: string;
};

export default function OwnershipApplicationForm({ organization }: { organization: Organization }) {
  const router = useRouter();
  const [form, setForm] = useState({
    fullName: "", jobTitle: "", department: "", employmentType: "EMPLOYEE",
    associationDuration: "", phone: "", authorizationReason: "",
    officialProfileUrl: "", evidenceUrl: "", evidenceDescription: "",
  });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  function update(key: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setMessage(""); setLoading(true);
    try {
      const res = await fetch("/api/organization/ownership", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, organizationId: organization.id }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Could not submit application."); return; }
      setMessage("Ownership application submitted. XROVIA will review your organization and authorization details.");
      setTimeout(() => router.push("/organization"), 1400);
    } catch {
      setError("Could not submit application. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-600"><Building2 className="h-5 w-5" /></div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-blue-600">Organization ownership</p>
            <h1 className="mt-1 text-3xl font-black text-slate-950">Apply for ownership</h1>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Registering an organization does not make you its owner. Tell XROVIA why you are authorized to represent <strong className="text-slate-700">{organization.name}</strong>.
            </p>
          </div>
        </div>
      </section>

      <form onSubmit={submit} className="space-y-6">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-black text-slate-900">Your position</h2>
          <p className="mt-1 text-sm text-slate-500">These details help XROVIA understand your relationship with the organization.</p>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <Field label="Full name *" value={form.fullName} onChange={(v) => update("fullName", v)} placeholder="Your full legal name" />
            <Field label="Job title / position *" value={form.jobTitle} onChange={(v) => update("jobTitle", v)} placeholder="e.g. Assistant Registrar" />
            <Field label="Department *" value={form.department} onChange={(v) => update("department", v)} placeholder="e.g. Examination Department" />
            <label className="block"><span className="mb-2 block text-sm font-bold text-slate-700">Relationship *</span><select value={form.employmentType} onChange={(e) => update("employmentType", e.target.value)} className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"><option value="EMPLOYEE">Employee</option><option value="FACULTY">Faculty</option><option value="ADMINISTRATOR">Administrator</option><option value="AUTHORIZED_REPRESENTATIVE">Authorized representative</option><option value="OTHER">Other</option></select></label>
            <Field label="How long have you been associated? *" value={form.associationDuration} onChange={(v) => update("associationDuration", v)} placeholder="e.g. 3 years" />
            <Field label="Phone number" value={form.phone} onChange={(v) => update("phone", v)} placeholder="+91..." />
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-black text-slate-900">Authorization</h2>
          <div className="mt-5 space-y-5">
            <label className="block"><span className="mb-2 block text-sm font-bold text-slate-700">Why are you authorized to manage this organization? *</span><textarea value={form.authorizationReason} onChange={(e) => update("authorizationReason", e.target.value)} required rows={5} placeholder="Explain your responsibility and why XROVIA should recognize you as an organization administrator." className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-blue-500" /></label>
            <Field label="Official staff/profile page URL" value={form.officialProfileUrl} onChange={(v) => update("officialProfileUrl", v)} placeholder="https://organization.edu/staff/your-name" />
            <Field label="Supporting evidence URL" value={form.evidenceUrl} onChange={(v) => update("evidenceUrl", v)} placeholder="Official page or document link" />
            <label className="block"><span className="mb-2 block text-sm font-bold text-slate-700">Evidence explanation</span><textarea value={form.evidenceDescription} onChange={(e) => update("evidenceDescription", e.target.value)} rows={4} placeholder="Explain what the submitted evidence proves." className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-blue-500" /></label>
          </div>
        </section>

        <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm leading-6 text-blue-900">
          XROVIA may review the organization's official website and other publicly available information before approving ownership. Email verification confirms control of the organization email; it does not by itself grant ownership.
        </div>

        {error && <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
        {message && <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">{message}</div>}

        <button disabled={loading} className="w-full rounded-xl bg-blue-600 py-3.5 font-bold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50">{loading ? "Submitting application..." : "Submit ownership application"}</button>
      </form>
    </div>
  );
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (value: string) => void; placeholder: string }) {
  return <label className="block"><span className="mb-2 block text-sm font-bold text-slate-700">{label}</span><input value={value} onChange={(e) => onChange(e.target.value)} required={label.includes("*")} placeholder={placeholder} className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-blue-500" /></label>;
}
