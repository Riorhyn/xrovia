import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Job Application Profile",
  description: "Create a clear professional profile for job applications | XROVIA",
  keywords: ["job application profile", "job applications", "professional profile", "career profile"],
  alternates: { canonical: "https://xrovia.com/job-application-profile" },
  openGraph: { title: "Job Application Profile", description: "Create a clear professional profile for job applications | XROVIA", url: "https://xrovia.com/job-application-profile", type: "website" },
};

export default function Page() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-blue-600">XROVIA Career Guide</p>
      <h1 className="text-4xl font-bold tracking-tight">Job Application Profile</h1>
      <p className="mt-5 text-lg leading-8 text-gray-600">A job application profile can organize your education, experience, skills, projects, certifications, and achievements so employers can understand your background more easily.</p>
      <section className="mt-10 space-y-5 leading-8 text-gray-700">
        <h2 className="text-2xl font-semibold text-gray-900">What to include</h2>
        <p>Start with your education and add relevant work experience, internships, technical skills, projects, certifications, and achievements. Keep the information current so you can share a consistent professional record when applying for opportunities.</p>
        <h2 className="text-2xl font-semibold text-gray-900">Why a structured profile helps</h2>
        <p>A structured profile gives you one place to maintain career information and makes it easier to share the details behind your applications. It complements your CV, resume, portfolio, and other application materials rather than replacing them.</p>
        <h2 className="text-2xl font-semibold text-gray-900">Build your professional identity</h2>
        <p>XROVIA lets you organize education, experience, skills, projects, certifications, achievements, and supporting evidence around one Professional ID.</p>
      </section>
      <nav className="mt-10 flex flex-wrap gap-4 text-sm font-medium">
        <a className="text-blue-600 hover:underline" href="/professional-profile">Professional Profile</a>\n        <a className="text-blue-600 hover:underline" href="/career-profile">Career Profile</a>\n        <a className="text-blue-600 hover:underline" href="/professional-identity">Professional Identity</a>
      </nav>
    </main>
  );
}
