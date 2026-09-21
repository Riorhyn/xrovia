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
  title: { absolute: "Xrovia | Your permanent professional identity" },
  description:
    "Create, manage, and share your professional identity with one permanent Professional ID.",
};

/**
 * The header and footer come from app/layout.tsx, so this page only renders
 * the homepage content between them.
 */
export default async function HomePage() {
  const session = await getSession();
  const isAuthenticated = Boolean(session);

  return (
    <>
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