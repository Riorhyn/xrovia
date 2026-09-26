import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Project Portfolio for Students",
  description: "Showcase student projects, technical skills, education, certifications, and achievements in a structured professional profile.",
  keywords: ["Project Portfolio for Students", "professional profile", "XROVIA", "career profile"],
  alternates: { canonical: "https://xrovia.com/project-portfolio-for-students" },
  openGraph: { title: "Project Portfolio for Students | XROVIA", description: "Showcase student projects, technical skills, education, certifications, and achievements in a structured professional profile.", url: "https://xrovia.com/project-portfolio-for-students", type: "article", siteName: "XROVIA" },
};

export default function Page() {
  return (
    <main className="bg-white">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">XROVIA Career Guide</p>
        <h1 className="mt-3 text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900">Project portfolio for students</h1>
        <p className="mt-6 text-xl leading-8 text-slate-600">Projects can demonstrate how a student applies what they learn. XROVIA gives students a place to record projects together with skills, education, certifications, achievements, and other career information.</p>
        <section className="mt-10 space-y-6 text-base leading-8 text-slate-700">
          <h2 className="text-2xl font-bold text-slate-900">How XROVIA can help</h2>
          <p>Describe what you built, your role, the tools you used, and the result accurately. Use evidence where appropriate.</p>
          <p>With XROVIA, you can keep your education, experience, skills, projects, certifications, achievements, and supporting evidence organized under one Professional ID. This information can be updated as your career develops.</p>
          <p>Use XROVIA together with your CV, applications, portfolio, and other professional profiles. The goal is to keep your career record organized and easier to share, not to replace the tools you already use.</p>
        </section>
        <section className="mt-10 rounded-2xl bg-slate-50 border border-slate-200 p-6">
          <h2 className="text-xl font-bold text-slate-900">Explore XROVIA</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/professional-profile-for-students" className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">Explore professional profiles</Link>
            <Link href="/professional-identity" className="inline-flex items-center rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-white">Professional identity</Link>
            <Link href="/how-it-works" className="inline-flex items-center rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-white">How it works</Link>
          </div>
        </section>
      </article>
    </main>
  );
}