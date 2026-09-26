import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How to Build a Professional Profile for Your Job Search",
  description: "A practical guide to organizing your education, skills, experience, projects, and achievements for a job search.",
  keywords: ["how to get a job","job search profile","professional identity","career profile"],
  alternates: { canonical: "https://xrovia.com/career/how-to-get-a-job" },
  openGraph: { title: "How to Build a Professional Profile for Your Job Search", description: "A practical guide to organizing your education, skills, experience, projects, and achievements for a job search.", url: "https://xrovia.com/career/how-to-get-a-job", type: "website" },
};

export default function Page() {
  return <main className="mx-auto max-w-4xl px-6 py-16"><p className="text-sm font-semibold uppercase tracking-wide text-blue-600">XROVIA Career Guide</p><h1 className="mt-3 text-4xl font-bold">How to Build a Professional Profile for Your Job Search</h1><p className="mt-5 text-lg leading-8 text-gray-600">A practical guide to organizing your education, skills, experience, projects, and achievements for a job search.</p><section className="mt-10 space-y-6 leading-8 text-gray-700"><h2 className="text-2xl font-semibold text-gray-900">What to include</h2><p>Organize your education, experience, skills, projects, certifications, achievements, and supporting evidence in one current professional record.</p><h2 className="text-2xl font-semibold text-gray-900">How XROVIA helps</h2><p>XROVIA provides one place to maintain your professional identity and career information. It complements your CV, resume, portfolio, and applications.</p></section><div className="mt-10 flex flex-wrap gap-5"><a className="text-blue-600 hover:underline" href="/professional-profile">Professional Profile</a><a className="text-blue-600 hover:underline" href="/career-profile">Career Profile</a><a className="text-blue-600 hover:underline" href="/professional-identity">Professional Identity</a></div></main>;
}
