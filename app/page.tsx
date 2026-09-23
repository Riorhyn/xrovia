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
  // `absolute` ignores any title template set in app/layout.tsx.
  title: "Professional Identity Platform | Digital Career Profile",
  description:
    "Build a professional identity with XROVIA. Create a digital career profile with your education, experience, skills, projects, achievements, evidence, and Professional ID.",
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

/**
 * The header and footer come from app/layout.tsx, so this page only renders
 * the homepage content between them.
 */
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
        url: "https://xrovia.com/",
        description:
          "Professional identity platform for building, managing, verifying, and sharing digital career profiles.",
      },
      {
        "@type": "WebSite",
        "@id": "https://xrovia.com/#website",
        name: "XROVIA",
        url: "https://xrovia.com/",
        description:
          "Create and share a professional identity and career record with one Professional ID.",
        publisher: {
          "@id": "https://xrovia.com/#organization",
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      {/* Smooth in-page scrolling for the homepage only; respects reduced motion. */}
      <style>{`html{scroll-behavior:smooth}@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}}`}</style>

      <div>
        <Hero isAuthenticated={isAuthenticated} />
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