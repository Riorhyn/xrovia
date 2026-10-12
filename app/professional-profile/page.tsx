import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Digital Professional Profile",
  description: "Create a digital professional profile containing your education, work experience, skills, projects, certifications, achievements, and career information.",
  keywords: ["Digital Professional Profile", "professional profile", "XROVIA", "career profile"],
  alternates: { canonical: "https://xrovia.com/professional-profile" },
  openGraph: { title: "Digital Professional Profile | XROVIA", description: "Create a digital professional profile containing your education, work experience, skills, projects, certifications, achievements, and career information.", url: "https://xrovia.com/professional-profile", type: "article", siteName: "XROVIA" },
};

export default function Page() {
  return (
    <main className="bg-white">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">XROVIA Career Guide</p>
        <h1 className="mt-3 text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900">Digital professional profile</h1>
        <p className="mt-6 text-xl leading-8 text-slate-600">A digital professional profile is a structured online representation of your career information. XROVIA brings education, work experience, skills, projects, certifications, achievements, and supporting evidence together under a Professional ID.</p>
        <section className="mt-10 space-y-6 text-base leading-8 text-slate-700">
          <h2 className="text-2xl font-bold text-slate-900">How XROVIA helps</h2>
          <p>Your profile provides a structured digital presence for organizing and sharing your professional journey.</p>
          <p>With XROVIA, you keep your education, experience, skills, projects, certifications, achievements, and supporting evidence organized under one unique Professional ID (`PR-XXXXXX`). This information updates continuously as your career develops.</p>
          <p>Use XROVIA to build your professional presence, verify your achievements, and connect with institutional and organizational opportunities.</p>
        </section>
        <section className="mt-10 rounded-2xl bg-slate-50 border border-slate-200 p-6">
          <h2 className="text-xl font-bold text-slate-900">Explore XROVIA</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/register" className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">Explore professional profiles</Link>
            <Link href="/professional-identity" className="inline-flex items-center rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-white">Professional identity</Link>
            <Link href="/how-it-works" className="inline-flex items-center rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-white">How it works</Link>
          </div>
        </section>
      </article>
    </main>
  );
}