"use client";

import React from "react";
import { ArrowRight, Fingerprint, History, ShieldCheck } from "lucide-react";
import { ROUTES } from "./config";
import { ButtonLink, Container } from "./ui";
import { DigitalIdPreview } from "./DigitalIdPreview";

export function Hero({ isAuthenticated }: { isAuthenticated?: boolean }) {
  return (
    <section className="relative isolate overflow-hidden bg-white pt-12 pb-16 sm:pt-16 sm:pb-20 lg:pt-24 lg:pb-28">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-40 top-0 h-96 w-96 rounded-full bg-blue-100/60 blur-3xl" />
        <div className="absolute -right-32 top-24 h-96 w-96 rounded-full bg-indigo-100/60 blur-3xl" />
      </div>
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700">
              <Fingerprint className="h-3.5 w-3.5" /> Professional identity, built to grow
            </div>
            <h1 className="mt-5 max-w-4xl text-4xl font-black tracking-[-0.04em] text-slate-950 sm:text-5xl lg:text-6xl lg:leading-[1.05]">
              Build a professional identity that proves more of what you can do.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
              XROVIA brings your education, experience, skills, projects, evidence and verification together under one Professional ID.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href={isAuthenticated ? ROUTES.dashboard : ROUTES.register} size="md">
                {isAuthenticated ? "Open your Professional ID" : "Create your Professional ID"} <ArrowRight className="h-4 w-4" />
              </ButtonLink>
              <ButtonLink href="#how-it-works" size="md" variant="secondary">See how it works</ButtonLink>
            </div>
            <div className="mt-9 grid max-w-2xl gap-3 sm:grid-cols-3">
              {[[ShieldCheck,"Verified information"],[History,"One growing identity"],[Fingerprint,"Your professional record"]].map(([Icon,text]) => (
                <div key={text as string} className="flex items-start gap-2.5 text-sm font-semibold text-slate-700">
                  <Icon className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" /><span>{text as string}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="relative mx-auto w-full max-w-md">
              <div className="absolute -inset-5 rounded-[2rem] bg-blue-100/50 blur-2xl" aria-hidden="true" />
              <div className="relative rounded-[2rem] border border-slate-200 bg-white p-4 shadow-2xl shadow-slate-300/30 sm:p-5">
                <DigitalIdPreview />
                <div className="mt-4 grid grid-cols-3 gap-2 border-t border-slate-100 pt-4 text-center">
                  {[["ID","Permanent"],["Record","Connected"],["Trust","Verifiable"]].map(([a,b]) => <div key={a}><p className="text-xs font-bold text-slate-900">{a}</p><p className="mt-0.5 text-[10px] text-slate-500">{b}</p></div>)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
