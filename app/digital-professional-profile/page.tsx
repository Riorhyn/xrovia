import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Digital Professional Profile",
  description:
    "Create a digital professional profile with XROVIA. Present education, work experience, skills, projects, certifications, achievements, and evidence in one career profile.",
  alternates: { canonical: "https://xrovia.com/digital-professional-profile" },
  openGraph: {
    title: "Digital Professional Profile | XROVIA",
    description:
      "Create and share a structured digital professional profile with your career information in one place.",
    url: "https://xrovia.com/digital-professional-profile",
    type: "website",
  },
};

export default function DigitalProfessionalProfilePage() {
  return (
    <main className="bg-slate-50">
      <section className="mx-auto max-w-5xl px-6 py-20 sm:py-28">
        <p className="text-sm font-bold uppercase tracking-wider text-blue-700">DIGITAL CAREER PROFILE</p>
        <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl">
          Your digital professional profile, in one place.
        </h1>
        <p className="mt-6 max-w-3xl text-xl leading-8 text-slate-600">
          XROVIA gives you a structured profile for the information that makes up your professional
          identity—from education and work experience to skills, projects, certifications and achievements.
        </p>
        <Link href="/register" className="mt-10 inline-block rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white">
          Create Professional ID
        </Link>
        <div className="mt-16 rounded-2xl border border-slate-200 bg-white p-8">
          <h2 className="text-2xl font-bold text-slate-900">What you can keep in your profile</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {["Education", "Work experience", "Skills", "Projects", "Certifications", "Achievements", "Publications", "Supporting evidence"].map((item) => (
              <div key={item} className="rounded-xl bg-slate-50 px-4 py-3 font-medium text-slate-700">{item}</div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
