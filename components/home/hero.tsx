"use client";

import React from "react";
import { ArrowRight, Fingerprint, History, ShieldCheck } from "lucide-react";
import { ROUTES } from "./config";
import { ButtonLink, Container } from "./ui";
import { DigitalIdPreview } from "./DigitalIdPreview";

export function Hero({ isAuthenticated }: { isAuthenticated?: boolean }) {
  return (
    <section className="relative isolate overflow-hidden border-b border-slate-200 bg-white py-16 sm:py-20 lg:py-28">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-40 top-0 h-96 w-96 rounded-full bg-blue-100/60 blur-3xl" />
        <div className="absolute -right-32 top-20 h-96 w-96 rounded-full bg-indigo-100/60 blur-3xl" />
        <div className="absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-sky-50/70 blur-3xl" />
      </div>
      <Container>
        <div className="grid items-center gap-14 lg:grid-cols-[1.02fr_.98fr] lg:gap-16">
          <div>
            <div className="xrovia-fade-up inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3.5 py-2 text-xs font-bold text-blue-700 shadow-sm">
              <Fingerprint className="h-3.5 w-3.5" /> Professional identity, built to grow
            </div>
            <h1 className="xrovia-fade-up xrovia-delay-1 mt-6 max-w-3xl text-4xl font-black tracking-[-0.045em] text-slate-950 sm:text-5xl lg:text-[4.25rem] lg:leading-[1.02]">
              Build a professional identity that proves more of what you can do.
            </h1>
            <p className="xrovia-fade-up xrovia-delay-2 mt-7 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
              XROVIA brings your education, experience, skills, projects, evidence and verification together under one Professional ID.
            </p>
            <div className="xrovia-fade-up xrovia-delay-3 mt-9 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href={isAuthenticated ? ROUTES.dashboard : ROUTES.register}> {isAuthenticated ? "Open your Professional ID" : "Create your Professional ID"} <ArrowRight className="h-4 w-4" /></ButtonLink>
              <ButtonLink href="#how-it-works" variant="secondary">See how it works</ButtonLink>
            </div>
            <div className="mt-10 grid max-w-2xl gap-3 sm:grid-cols-3">
              {[[ShieldCheck,"Verified information"],[History,"One growing identity"],[Fingerprint,"Your professional record"]].map(([Icon,text],i) => (
                <div key={text as string} className={`xrovia-fade-up flex items-center gap-2.5 rounded-2xl border border-slate-200 bg-white/80 px-3 py-3 text-sm font-semibold text-slate-700 shadow-sm xrovia-delay-${i+1}`}>
                  <Icon className="h-4 w-4 shrink-0 text-blue-600" /><span>{text as string}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="xrovia-fade-up xrovia-delay-2 lg:pl-4">
            <div className="relative mx-auto w-full max-w-[31rem]">
              <div className="absolute -inset-6 rounded-[2.5rem] bg-blue-100/50 blur-3xl" aria-hidden="true" />
              <div className="xrovia-float relative rounded-[2rem] border border-slate-200 bg-white p-3 shadow-[0_28px_80px_rgba(15,23,42,.14)] sm:p-5">
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
