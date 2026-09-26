import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Professional Profile for Graduate Jobs",
  description: "Organize your education, projects, skills, certifications, and experience for graduate and entry-level opportunities.",
  keywords: ["graduate jobs","graduate professional profile","entry level jobs","career profile"],
  alternates: { canonical: "https://xrovia.com/career/graduate-jobs" },
  openGraph: { title: "Professional Profile for Graduate Jobs", description: "Organize your education, projects, skills, certifications, and experience for graduate and entry-level opportunities.", url: "https://xrovia.com/career/graduate-jobs", type: "website" },
};

export default function Page() {
  return <main className="mx-auto max-w-4xl px-6 py-16"><p className="text-sm font-semibold uppercase tracking-wide text-blue-600">XROVIA Career Guide</p><h1 className="mt-3 text-4xl font-bold">Professional Profile for Graduate Jobs</h1><p className="mt-5 text-lg leading-8 text-gray-600">Organize your education, projects, skills, certifications, and experience for graduate and entry-level opportunities.</p><section className="mt-10 space-y-6 leading-8 text-gray-700"><h2 className="text-2xl font-semibold text-gray-900">What to include</h2><p>Organize your education, experience, skills, projects, certifications, achievements, and supporting evidence in one current professional record.</p><h2 className="text-2xl font-semibold text-gray-900">How XROVIA helps</h2><p>XROVIA provides one place to maintain your professional identity and career information. It complements your CV, resume, portfolio, and applications.</p></section><div className="mt-10 flex flex-wrap gap-5"><a className="text-blue-600 hover:underline" href="/professional-profile">Professional Profile</a><a className="text-blue-600 hover:underline" href="/career-profile">Career Profile</a><a className="text-blue-600 hover:underline" href="/professional-identity">Professional Identity</a></div></main>;
}
