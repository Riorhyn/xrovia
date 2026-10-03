import type { Metadata } from "next";
import { getSession } from "@/lib/auth/session";
import { Audience } from "@/components/home/audience";
import { Features } from "@/components/home/features";
import { FinalCta } from "@/components/home/final-cta";
import { Hero } from "@/components/home/hero";
import { HowItWorks } from "@/components/home/how-it-works";
import { ProblemSection } from "@/components/home/problem-section";
import { SearchId } from "@/components/home/search-id";

export const metadata: Metadata = {
  title: "XROVIA | Your Professional Identity",
  description: "Build a professional identity that brings your education, experience, skills, projects, evidence and verification together under one Professional ID.",
  keywords: ["XROVIA","professional identity","Professional ID","professional record","career record","verified professional profile"],
  alternates: { canonical: "https://xrovia.com/" },
  openGraph: { title: "XROVIA | Your Professional Identity", description: "One Professional ID for your professional history, evidence and verification.", url: "https://xrovia.com/", type: "website", siteName: "XROVIA" },
};

export default async function HomePage() {
  const session = await getSession();
  const isAuthenticated = Boolean(session);
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {"@type":"Organization","@id":"https://xrovia.com/#organization","name":"XROVIA","url":"https://xrovia.com/","logo":{"@type":"ImageObject","url":"https://xrovia.com/ChatGPT%20Image%20Sep%2027,%202026,%2004_14_14%20PM.png"},"description":"XROVIA is a professional identity platform for building, verifying and sharing a structured professional record."},
      {"@type":"WebSite","@id":"https://xrovia.com/#website","name":"XROVIA","url":"https://xrovia.com/","description":"A professional identity and career record platform.","publisher":{"@id":"https://xrovia.com/#organization"},"inLanguage":"en"},
      {"@type":"WebPage","@id":"https://xrovia.com/#webpage","url":"https://xrovia.com/","name":"XROVIA | Your Professional Identity","description":"Build a professional identity that brings your career information, evidence and verification together.","isPartOf":{"@id":"https://xrovia.com/#website"},"about":{"@id":"https://xrovia.com/#organization"},"inLanguage":"en"},
      {"@type":["SoftwareApplication","WebApplication"],"@id":"https://xrovia.com/#software","name":"XROVIA","url":"https://xrovia.com/","description":"A web-based professional identity and career record platform.","applicationCategory":"BusinessApplication","operatingSystem":"Web Browser","publisher":{"@id":"https://xrovia.com/#organization"}}
    ],
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(structuredData)}} />
      <style>{`html{scroll-behavior:smooth}@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}}`}</style>
      <div><Hero isAuthenticated={isAuthenticated} /><ProblemSection /><HowItWorks /><Features /><Audience /><SearchId /><FinalCta isAuthenticated={isAuthenticated} /></div>
    </>
  );
}
