import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About XROVIA",
  description:
    "Learn about XROVIA, a professional identity platform for creating, managing, verifying, and sharing a digital professional profile and permanent career record.",
  keywords: [
    "about XROVIA",
    "XROVIA",
    "Xrovia",
    "professional identity platform",
    "digital professional profile",
    "professional ID",
    "career record",
  ],
  alternates: {
    canonical: "https://xrovia.com/about",
  },
  openGraph: {
    title: "About XROVIA | Professional Identity Platform",
    description:
      "Learn what XROVIA is, how its Professional ID works, and how it helps people maintain a digital professional profile and career record.",
    url: "https://xrovia.com/about",
    type: "website",
    siteName: "XROVIA",
  },
};

export default function AboutPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": "https://xrovia.com/about#webpage",
    url: "https://xrovia.com/about",
    name: "About XROVIA",
    description:
      "Learn about XROVIA, a professional identity platform for digital professional profiles and permanent career records.",
    isPartOf: {
      "@id": "https://xrovia.com/#website",
    },
    about: {
      "@id": "https://xrovia.com/#organization",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <main className="bg-white">
        <section className="bg-slate-50 border-b border-slate-200 py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
              About XROVIA
            </p>
            <h1 className="mt-3 text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
              Your Professional Identity. Your Permanent Record.
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">
              XROVIA is a professional identity platform built to give people
              one place to create, manage, verify, and share their professional
              identity and career record.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">What is XROVIA?</h2>
              <p className="mt-4 text-lg leading-8 text-slate-600">
                XROVIA combines education, work experience, skills, projects,
                certifications, achievements, and supporting evidence into a
                digital professional profile connected to a permanent
                Professional ID.
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-slate-900">
                Why a professional identity?
              </h2>
              <p className="mt-4 text-lg leading-8 text-slate-600">
                A CV can change for every opportunity. XROVIA is designed as a
                continuing professional record that can be updated as a person's
                education, experience, skills, projects, and achievements grow.
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-slate-900">
                What is a Professional ID?
              </h2>
              <p className="mt-4 text-lg leading-8 text-slate-600">
                A Professional ID is the unique identity used to connect a
                person's XROVIA profile and career information. It provides a
                consistent way to access and share the professional profile.
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-slate-900">
                Build and maintain your career record
              </h2>
              <p className="mt-4 text-lg leading-8 text-slate-600">
                Users can build a digital professional profile around the
                information that represents their career, including education,
                employment, skills, projects, certifications, achievements, and
                evidence. Verification features can help distinguish information
                that has been checked from information that has not been
                verified.
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-slate-900">Who is XROVIA for?</h2>
              <p className="mt-4 text-lg leading-8 text-slate-600">
                XROVIA can be used by students, graduates, professionals, job
                seekers, and others who want a persistent digital record of their
                professional development.
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-slate-900">Explore XROVIA</h2>
              <div className="mt-6 flex flex-wrap gap-4">
                <Link
                  href="/professional-identity"
                  className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
                >
                  Professional Identity
                </Link>
                <Link
                  href="/digital-professional-profile"
                  className="rounded-lg border border-slate-300 px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Digital Professional Profile
                </Link>
                <Link
                  href="/career-profile"
                  className="rounded-lg border border-slate-300 px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Career Profile
                </Link>
                <Link
                  href="/how-it-works"
                  className="rounded-lg border border-slate-300 px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50"
                >
                  How It Works
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
