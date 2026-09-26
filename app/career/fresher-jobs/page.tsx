import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Professional Profile for Freshers",
  description: "A practical professional profile for fresh graduates and students. Organize education, skills, projects, certifications, achievements, and experience in one place.",
  keywords: ["Professional Profile for Freshers", "professional profile", "XROVIA", "career profile"],
  alternates: { canonical: "https://xrovia.com/career/fresher-jobs" },
  openGraph: { title: "Professional Profile for Freshers | XROVIA", description: "A practical professional profile for fresh graduates and students. Organize education, skills, projects, certifications, achievements, and experience in one place.", url: "https://xrovia.com/career/fresher-jobs", type: "article", siteName: "XROVIA" },
};

export default function Page() {
  return (
    <main className="bg-white">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">XROVIA Career Guide</p>
        <h1 className="mt-3 text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900">Professional profile for freshers</h1>
        <p className="mt-6 text-xl leading-8 text-slate-600">Fresh graduates may not have years of work experience, but they can still present useful evidence of what they have learned and built. XROVIA lets freshers organize education, projects, technical skills, certifications, achievements, and experience into a shareable professional identity.</p>
        <section className="mt-10 space-y-6 text-base leading-8 text-slate-700">
          <h2 className="text-2xl font-bold text-slate-900">How XROVIA can help</h2>
          <p>Use your profile alongside your resume and job applications to give recruiters or hiring teams more context about your background.</p>
          <p>With XROVIA, you can keep your education, experience, skills, projects, certifications, achievements, and supporting evidence organized under one Professional ID. This information can be updated as your career develops.</p>
          <p>Use XROVIA together with your CV, applications, portfolio, and other professional profiles. The goal is to keep your career record organized and easier to share, not to replace the tools you already use.</p>
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