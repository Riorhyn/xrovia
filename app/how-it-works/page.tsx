import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How XROVIA Works",
  description:
    "Learn how XROVIA works: create a Professional ID, build your career record, add evidence, track verification, and share your professional profile.",
  alternates: { canonical: "https://xrovia.com/how-it-works" },
  openGraph: {
    title: "How XROVIA Works",
    description:
      "Create a Professional ID, build your career record, add evidence, and share your profile with XROVIA.",
    url: "https://xrovia.com/how-it-works",
    type: "website",
  },
};

const steps = [
  ["1", "Create your Professional ID", "Register with XROVIA and get a unique Professional ID for your professional identity."],
  ["2", "Build your career record", "Add education, work experience, skills, projects, certifications, achievements and other professional information."],
  ["3", "Add supporting evidence", "Attach available evidence to relevant records to make your professional information easier to review."],
  ["4", "Track verification", "See the status of supported education and experience records, including evidence and verification status."],
  ["5", "Share your profile", "Use your public profile and Professional ID to present your career record online."],
];

export default function HowItWorksPage() {
  return (
    <main className="bg-slate-50">
      <section className="mx-auto max-w-5xl px-6 py-20 sm:py-28">
        <p className="text-sm font-bold uppercase tracking-wider text-blue-700">XROVIA</p>
        <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl">How XROVIA works</h1>
        <p className="mt-6 max-w-3xl text-xl leading-8 text-slate-600">
          XROVIA is built around one simple idea: keep your professional identity and career record together,
          then update and share it as your career develops.
        </p>
        <div className="mt-14 space-y-5">
          {steps.map(([number, title, text]) => (
            <article key={number} className="flex gap-5 rounded-2xl border border-slate-200 bg-white p-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 font-bold text-white">{number}</div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">{title}</h2>
                <p className="mt-1 text-sm leading-6 text-slate-600">{text}</p>
              </div>
            </article>
          ))}
        </div>
        <Link href="/register" className="mt-10 inline-block rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white">Create Professional ID</Link>
      </section>
    </main>
  );
}
