import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Career Portfolio and Professional Record",
  description: "Organize projects, education, experience, skills, certifications, and achievements in one career portfolio.",
  keywords: ["Career Portfolio and Professional Record", "professional profile", "XROVIA", "career profile"],
  alternates: { canonical: "https://xrovia.com/career-portfolio" },
  openGraph: { title: "Career Portfolio and Professional Record | XROVIA", description: "Organize projects, education, experience, skills, certifications, and achievements in one career portfolio.", url: "https://xrovia.com/career-portfolio", type: "article", siteName: "XROVIA" },
};

export default function Page() {
  return (
    <main className="bg-white">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">XROVIA Career Guide</p>
        <h1 className="mt-3 text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900">Career portfolio and professional record</h1>
        <p className="mt-6 text-xl leading-8 text-slate-600">A career portfolio can help you keep important professional information organized instead of scattered across documents and platforms. XROVIA combines career information into a shareable professional record.</p>
        <section className="mt-10 space-y-6 text-base leading-8 text-slate-700">
          <h2 className="text-2xl font-bold text-slate-900">How XROVIA can help</h2>
          <p>A portfolio works best when it contains specific, accurate information and useful evidence of your work.</p>
          <p>With XROVIA, you can keep your education, experience, skills, projects, certifications, achievements, and supporting evidence organized under one Professional ID. This information can be updated as your career develops.</p>
          <p>Use XROVIA together with your CV, applications, portfolio, and other professional profiles. The goal is to keep your career record organized and easier to share, not to replace the tools you already use.</p>
        </section>
        <section className="mt-10 rounded-2xl bg-slate-50 border border-slate-200 p-6">
          <h2 className="text-xl font-bold text-slate-900">Explore XROVIA</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/career-profile" className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">Explore professional profiles</Link>
            <Link href="/professional-identity" className="inline-flex items-center rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-white">Professional identity</Link>
            <Link href="/how-it-works" className="inline-flex items-center rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-white">How it works</Link>
          </div>
        </section>
      </article>
    </main>
  );
}