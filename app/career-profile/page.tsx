import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Career Profile and Professional Record",
  description:
    "Build a career profile with XROVIA and keep your education, experience, skills, projects, certifications, achievements, and professional evidence organized under one Professional ID.",
  alternates: { canonical: "https://xrovia.com/career-profile" },
  openGraph: {
    title: "Career Profile | XROVIA",
    description:
      "Keep your professional career record organized and shareable with one Professional ID.",
    url: "https://xrovia.com/career-profile",
    type: "website",
  },
};

export default function CareerProfilePage() {
  return (
    <main className="bg-white">
      <section className="mx-auto max-w-5xl px-6 py-20 sm:py-28">
        <p className="text-sm font-bold uppercase tracking-wider text-blue-700">CAREER RECORD</p>
        <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl">
          A career profile that grows with you.
        </h1>
        <p className="mt-6 max-w-3xl text-xl leading-8 text-slate-600">
          Instead of maintaining separate versions of your professional information, keep your
          career record organized in XROVIA and update it as your education and experience change.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Link href="/register" className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white">Create Professional ID</Link>
          <Link href="/#benefits" className="rounded-lg border border-slate-300 px-5 py-3 font-semibold text-slate-800">View benefits</Link>
        </div>
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          <article className="rounded-2xl border border-slate-200 p-6">
            <h2 className="font-bold text-slate-900">Build</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">Add the education, experience, skills and work you want represented in your professional record.</p>
          </article>
          <article className="rounded-2xl border border-slate-200 p-6">
            <h2 className="font-bold text-slate-900">Maintain</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">Update your record as you gain new qualifications, roles, projects and achievements.</p>
          </article>
          <article className="rounded-2xl border border-slate-200 p-6">
            <h2 className="font-bold text-slate-900">Share</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">Use your Professional ID and public profile to present your professional information online.</p>
          </article>
        </div>
      </section>
    </main>
  );
}
