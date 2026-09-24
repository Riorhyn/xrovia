import type { Metadata } from "next";

import { getSession } from "@/lib/auth/session";

import { Audience } from "@/components/home/audience";
import { Benefits } from "@/components/home/benefits";
import { Features } from "@/components/home/features";
import { FinalCta } from "@/components/home/final-cta";
import { Hero } from "@/components/home/hero";
import { HowItWorks } from "@/components/home/how-it-works";
import { ProblemSection } from "@/components/home/problem-section";
import { SearchId } from "@/components/home/search-id";

export const metadata: Metadata = {
  title: "XROVIA | Professional Identity Platform & Digital Career Profile",
  description:
    "XROVIA is a professional identity platform and digital career profile for education, work experience, skills, projects, certifications, achievements, evidence, and one permanent Professional ID.",
  keywords: [
    "XROVIA",
    "Xrovia",
    "XROVIA professional identity",
    "XROVIA professional profile",
    "XROVIA career profile",
    "professional identity platform",
    "digital professional profile",
    "digital career profile",
    "professional ID",
    "career record",
  ],
  alternates: { canonical: "https://xrovia.com/" },
  openGraph: {
    title: "XROVIA | Professional Identity Platform",
    description:
      "Build, verify, manage, and share your professional identity and career record with one Professional ID.",
    url: "https://xrovia.com/",
    type: "website",
    siteName: "XROVIA",
  },
};

export default async function HomePage() {
  const session = await getSession();
  const isAuthenticated = Boolean(session);

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://xrovia.com/#organization",
        name: "XROVIA",
        alternateName: "Xrovia",
        url: "https://xrovia.com/",
        logo: "https://xrovia.com/icon.svg",
        description:
          "XROVIA is a professional identity platform for building, managing, verifying, and sharing digital career profiles and professional records.",
      },
      {
        "@type": "WebSite",
        "@id": "https://xrovia.com/#website",
        name: "XROVIA",
        alternateName: "Xrovia",
        url: "https://xrovia.com/",
        description:
          "XROVIA helps people create and share a professional identity, digital professional profile, and career record with one Professional ID.",
        publisher: {
          "@id": "https://xrovia.com/#organization",
        },
        inLanguage: "en",
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <style>{`html{scroll-behavior:smooth}@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}}`}</style>

      <div>
        <Hero isAuthenticated={isAuthenticated} />

        <section
          aria-labelledby="about-xrovia"
          className="bg-white border-y border-slate-100 py-16"
        >
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                About XROVIA
              </p>
              <h2
                id="about-xrovia"
                className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900"
              >
                What is XROVIA?
              </h2>
              <p className="mt-5 text-lg leading-8 text-slate-600">
                XROVIA is a professional identity platform for creating a digital
                professional profile and permanent career record. It brings
                education, work experience, skills, projects, certifications,
                achievements, and supporting evidence together under one
                Professional ID.
              </p>
              <p className="mt-4 text-base leading-7 text-slate-600">
                XROVIA is also referred to as Xrovia. The official XROVIA website
                is xrovia.com, where people can create, manage, verify, and share
                their professional identity and career profile.
              </p>
            </div>
          </div>
        </section>

        <ProblemSection />
        <HowItWorks />
        <Features />
        <Audience />
        <Benefits />
        <SearchId />
        <FinalCta isAuthenticated={isAuthenticated} />
      </div>
    </>
  );
}
