export default function OnlineCvPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
        XROVIA Professional Identity
      </p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900">
        Online Professional Profile and Identity
      </h1>
      <p className="mt-6 text-xl leading-8 text-slate-600">
        XROVIA gives individuals a persistent, verified digital identity to represent their skills, qualifications, achievements, and professional journey in one connected place.
      </p>

      <section className="mt-12 space-y-6 text-slate-700">
        <h2 className="text-2xl font-semibold text-slate-900">
          Persistent Professional Identity
        </h2>
        <p>
          Maintain a structured professional record that updates as your career evolves, giving organizations and peers a clear view of your verified credentials.
        </p>

        <h2 className="text-2xl font-semibold text-slate-900">
          Connected Ecosystem
        </h2>
        <p>
          Organize your verified education, work experience, projects, certifications, and achievements in a single digital identity card and public profile.
        </p>
      </section>

      <div className="mt-10 flex flex-wrap gap-5">
        <a className="text-blue-600 hover:underline" href="/professional-profile">
          Professional Profile
        </a>
        <a className="text-blue-600 hover:underline" href="/career-profile">
          Career Profile
        </a>
        <a className="text-blue-600 hover:underline" href="/professional-identity">
          Professional Identity
        </a>
      </div>
    </main>
  );
}
