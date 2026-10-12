export default function ProfessionalProfilePage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
        XROVIA Identity System
      </p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900">
        Structured Digital Identity
      </h1>
      <p className="mt-6 text-xl leading-8 text-slate-600">
        XROVIA provides a persistent digital identity framework to organize, verify, and share your professional qualifications.
      </p>

      <section className="mt-12 space-y-6 text-slate-700">
        <h2 className="text-2xl font-semibold text-slate-900">
          Digital Identity Identifier
        </h2>
        <p>
          Each individual receives a unique, persistent identity ID that connects their education, experience, and verified achievements into a secure, discoverable profile.
        </p>

        <h2 className="text-2xl font-semibold text-slate-900">
          Verified Presence
        </h2>
        <p>
          Connect with employers, academic institutions, and professional organizations while retaining full ownership and privacy control over your professional identity.
        </p>
      </section>

      <div className="mt-10 flex flex-wrap gap-5">
        <a className="text-blue-600 hover:underline" href="/professional-identity">
          Professional Identity
        </a>
        <a className="text-blue-600 hover:underline" href="/career-profile">
          Career Profile
        </a>
      </div>
    </main>
  );
}
