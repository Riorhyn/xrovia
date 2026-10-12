import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Professional Digital Profile",
  description: "Organize your detailed education, experience, skills, projects, certifications, and achievements into one persistent digital identity.",
  keywords: ["Professional Digital Profile", "professional identity", "XROVIA", "digital profile"],
  alternates: { canonical: "https://xrovia.com/online-cv" },
  openGraph: { title: "Professional Digital Profile | XROVIA", description: "Organize your detailed education, experience, skills, projects, certifications, and achievements into one persistent digital identity.", url: "https://xrovia.com/online-cv", type: "article", siteName: "XROVIA" },
};

export default function Page() {
  return (
    <main className="bg-white">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">XROVIA Career Guide</p>
        <h1 className="mt-3 text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900">Persistent Professional Digital Profile</h1>
        <p className="mt-6 text-xl leading-8 text-slate-600">An online professional digital identity provides a central, persistent presence for your complete career trajectory. XROVIA helps you organize and share your structured professional journey.</p>
        <section className="mt-10 space-y-6 text-base leading-8 text-slate-700">
          <h2 className="text-2xl font-bold text-slate-900">How XROVIA helps</h2>
          <p>Maintain your professional records in one central, verified digital presence accessible anywhere.</p>
          <p>With XROVIA, you keep your education, experience, skills, projects, certifications, achievements, and supporting evidence organized under one unique Professional ID (`PR-XXXXXX`). This identity evolves smoothly as your career grows.</p>
          <p>Use XROVIA to share your verified achievements, connect with institutional partners, and establish a discoverable professional identity across the web.</p>
        </section>
        <section className="mt-10 rounded-2xl bg-slate-50 border border-slate-200 p-6">
          <h2 className="text-xl font-bold text-slate-900">Explore XROVIA</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/digital-professional-profile" className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">Explore professional profiles</Link>
            <Link href="/professional-identity" className="inline-flex items-center rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-white">Professional identity</Link>
            <Link href="/how-it-works" className="inline-flex items-center rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-white">How it works</Link>
          </div>
        </section>
      </article>
    </main>
  );
}