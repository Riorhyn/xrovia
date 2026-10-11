import React from "react";
import { ROUTES } from "./config";
import { ButtonLink, Container } from "./ui";
import { ArrowRight, Fingerprint, ShieldCheck } from "lucide-react";

export function FinalCta({ isAuthenticated }: { isAuthenticated: boolean }) {
  return (
    <section className="relative overflow-hidden border-t border-slate-800 bg-slate-950 py-24 sm:py-32">
      <div className="pointer-events-none absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-blue-600/20 blur-3xl" />
      <div className="pointer-events-none absolute right-10 bottom-0 h-80 w-80 rounded-full bg-indigo-600/15 blur-3xl" />

      <Container className="relative text-center">
        <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/10 px-4 py-1.5 text-xs font-extrabold uppercase tracking-widest text-blue-300 backdrop-blur-md">
          <Fingerprint className="h-3.5 w-3.5" /> Start Your Professional Record
        </div>

        <h2 className="mx-auto mt-6 max-w-4xl text-3xl font-black tracking-[-0.03em] text-white sm:text-5xl lg:text-6xl">
          Build Your Identity. <span className="text-blue-400">Make It Yours.</span>
        </h2>

        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg sm:leading-8">
          Join a growing ecosystem of individuals and trusted institutions establishing authentic, permanent digital identities.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <ButtonLink href={isAuthenticated ? ROUTES.dashboard : ROUTES.register} variant="inverse" size="md">
            <span>{isAuthenticated ? "Open Your Professional ID" : "Create Your Identity"}</span>
            <ArrowRight className="h-4 w-4" />
          </ButtonLink>

          <ButtonLink href="/organization/register" variant="outlineInverse" size="md">
            Register an Organization
          </ButtonLink>
        </div>

        <div className="mt-12 flex items-center justify-center gap-6 text-xs font-semibold text-slate-400">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-emerald-400" /> Free Personal Identity
          </span>
          <span className="h-1 w-1 rounded-full bg-slate-700" />
          <span>No Document Upload Lock-in</span>
          <span className="h-1 w-1 rounded-full bg-slate-700" />
          <span>Instant Shareable ID</span>
        </div>
      </Container>
    </section>
  );
}
