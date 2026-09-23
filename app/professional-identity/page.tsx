import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Professional Identity Platform",
  description:
    "XROVIA helps you create a permanent professional identity with one Professional ID for your education, experience, skills, projects, achievements, and career record.",
  alternates: { canonical: "https://xrovia.com/professional-identity" },
  openGraph: {
    title: "Professional Identity Platform | XROVIA",
    description:
      "Create a permanent professional identity and career record with one Professional ID.",
    url: "https://xrovia.com/professional-identity",
    type: "website",
  },
};

export default function ProfessionalIdentityPage() {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Professional Identity Platform",
    url: "https://xrovia.com/professional-identity",
    description: metadata.description,
    isPartOf: { "@id": "https://xrovia.com/#website" },
  };

  return (
    <main className="bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
      <section className="mx-auto max-w-5xl px-6 py-20 sm:py-28">
        <p className="text-sm font-bold uppercase tracking-wider text-blue-700">XROVIA</p>
        <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl">
          Professional Identity Platform
        </h1>
        <p className="mt-6 max-w-3xl text-xl leading-8 text-slate-600">
          Build a professional identity that brings your education, experience, skills, projects,
          achievements, and career record together in one place.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Link href="/register" className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white">Create Professional ID</Link>
          <Link href="/#how-it-works" className="rounded-lg border border-slate-300 px-5 py-3 font-semibold text-slate-800">How XROVIA works</Link>
        </div>
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            ["Professional ID", "Use one permanent Professional ID to represent your professional record."],
            ["Career record", "Organize education, experience, skills, projects, certifications, and achievements."],
            ["Evidence", "Attach supporting evidence to records and build a more complete professional profile."],
            ["Public profile", "Share a professional profile instead of repeatedly rebuilding the same information."],
            ["Verification", "Keep track of verification status for supported education and experience records."],
            ["Digital identity", "Maintain your professional information as your career develops."],
          ].map(([title, text]) => (
            <div key={title} className="rounded-2xl border border-slate-200 p-6">
              <h2 className="font-bold text-slate-900">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
