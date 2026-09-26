import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Professional Profile for Students",
  description: "Build a student professional profile with education, skills, projects, certifications, achievements, and early experience.",
  keywords: ["Professional Profile for Students", "professional profile", "XROVIA", "career profile"],
  alternates: { canonical: "https://xrovia.com/professional-profile-for-students" },
  openGraph: { title: "Professional Profile for Students | XROVIA", description: "Build a student professional profile with education, skills, projects, certifications, achievements, and early experience.", url: "https://xrovia.com/professional-profile-for-students", type: "article", siteName: "XROVIA" },
};

export default function Page() {
  return (
    <main className="bg-white">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">XROVIA Career Guide</p>
        <h1 className="mt-3 text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900">Professional profile for students</h1>
        <p className="mt-6 text-xl leading-8 text-slate-600">Students can start building a professional identity before they have a long employment history. Recording projects, skills, certifications, education, competitions, internships, and achievements creates a structured career record that can grow over time.</p>
        <section className="mt-10 space-y-6 text-base leading-8 text-slate-700">
          <h2 className="text-2xl font-bold text-slate-900">How XROVIA can help</h2>
          <p>Keep adding genuine accomplishments as your education and experience develop.</p>
          <p>With XROVIA, you can keep your education, experience, skills, projects, certifications, achievements, and supporting evidence organized under one Professional ID. This information can be updated as your career develops.</p>
          <p>Use XROVIA together with your CV, applications, portfolio, and other professional profiles. The goal is to keep your career record organized and easier to share, not to replace the tools you already use.</p>
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