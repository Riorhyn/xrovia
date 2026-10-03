"use client";

import { ArrowRight, CheckCircle2, Fingerprint, ShieldCheck } from "lucide-react";
import { ROUTES, SAMPLE_ID } from "./config";
import { ButtonLink, Container } from "./ui";

export function Hero({ isAuthenticated }: { isAuthenticated?: boolean }) {
  return (
    <section className="relative overflow-hidden border-b border-slate-200 bg-[#f7faff]">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -left-40 -top-40 h-[34rem] w-[34rem] rounded-full bg-blue-200/40 blur-3xl" />
        <div className="absolute -right-32 top-24 h-[30rem] w-[30rem] rounded-full bg-indigo-100/50 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-white/80 blur-3xl" />
      </div>
      <Container className="relative pb-16 pt-10 sm:pb-24 sm:pt-14 lg:pb-28 lg:pt-20">
        <div className="mx-auto max-w-4xl text-center">
          <div className="xrovia-fade-up inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-4 py-2 text-xs font-bold text-blue-700 shadow-sm">
            <Fingerprint className="h-3.5 w-3.5" /> Your professional identity, connected
          </div>
          <h1 className="xrovia-fade-up xrovia-delay-1 mx-auto mt-7 max-w-4xl text-5xl font-black tracking-[-0.055em] text-slate-950 sm:text-6xl lg:text-[5.35rem] lg:leading-[.96]">
            Your professional history. <span className="text-blue-600">One identity.</span>
          </h1>
          <p className="xrovia-fade-up xrovia-delay-2 mx-auto mt-7 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
            Build one professional record that connects your education, experience, skills, projects, evidence and verification under one Professional ID.
          </p>
          <div className="xrovia-fade-up xrovia-delay-3 mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <ButtonLink href={isAuthenticated ? ROUTES.dashboard : ROUTES.register}>Create your Professional ID <ArrowRight className="h-4 w-4" /></ButtonLink>
            <ButtonLink href="#record" variant="secondary">Explore the record</ButtonLink>
          </div>
        </div>

        <div className="xrovia-fade-up xrovia-delay-3 relative mx-auto mt-14 max-w-6xl sm:mt-16">
          <div className="absolute -inset-8 rounded-[3rem] bg-blue-200/40 blur-3xl" aria-hidden="true" />
          <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_35px_100px_rgba(15,23,42,.15)]">
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-950 px-5 py-3 sm:px-7">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-blue-400" />
                <span className="text-xs font-bold tracking-wide text-white">XROVIA / PROFESSIONAL RECORD</span>
              </div>
              <span className="font-mono text-[10px] text-slate-400">{SAMPLE_ID}</span>
            </div>
            <div className="grid lg:grid-cols-[.72fr_1.28fr]">
              <div className="border-b border-slate-200 bg-slate-50 p-6 sm:p-8 lg:border-b-0 lg:border-r">
                <div className="flex items-start justify-between gap-4">
                  <div className="grid h-14 w-14 place-items-center rounded-2xl bg-blue-600 text-xl font-black text-white shadow-lg shadow-blue-600/20">AM</div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-[10px] font-black text-emerald-700 ring-1 ring-emerald-200"><CheckCircle2 className="h-3.5 w-3.5" /> Record active</span>
                </div>
                <p className="mt-7 text-xs font-bold uppercase tracking-[.16em] text-slate-400">Professional ID</p>
                <p className="mt-1 font-mono text-xl font-black text-slate-950">{SAMPLE_ID}</p>
                <h2 className="mt-7 text-2xl font-black tracking-tight text-slate-950">Alex Morgan</h2>
                <p className="mt-1 text-sm font-medium text-slate-500">Product Design Engineer</p>
                <p className="mt-5 text-sm leading-6 text-slate-600">Mechanical engineer focused on product design, manufacturing and sustainable systems.</p>
                <div className="mt-7 flex flex-wrap gap-2">
                  {["SolidWorks","GD&T","Manufacturing","Python"].map(x=><span key={x} className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[10px] font-bold text-slate-600">{x}</span>)}
                </div>
              </div>
              <div className="p-6 sm:p-8">
                <div className="flex items-center justify-between">
                  <div><p className="text-sm font-black text-slate-950">Professional record</p><p className="mt-1 text-xs text-slate-500">A connected history, not a single document.</p></div>
                  <div className="text-right"><p className="text-xl font-black text-blue-600">82%</p><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">record strength</p></div>
                </div>
                <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full w-[82%] rounded-full bg-blue-600" /></div>
                <div className="mt-7 grid gap-3 sm:grid-cols-2">
                  {[
                    ["Education","B.E. Mechanical Engineering","Verified",true],
                    ["Experience","Product Design Engineer","Verified",true],
                    ["Skills","CAD · GD&T · Manufacturing","Self-added",false],
                    ["Projects","Solar tracking system · 4 collaborators","Collaborative",false],
                  ].map(([a,b,c,v])=><div key={a as string} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="flex items-center justify-between gap-2"><span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{a as string}</span><span className={v ? "rounded-full bg-emerald-50 px-2 py-1 text-[9px] font-black text-emerald-700" : c==="Collaborative" ? "rounded-full bg-blue-50 px-2 py-1 text-[9px] font-black text-blue-700" : "rounded-full bg-slate-100 px-2 py-1 text-[9px] font-black text-slate-600"}>{c as string}</span></div>
                    <p className="mt-2 text-xs font-bold leading-5 text-slate-800">{b as string}</p>
                  </div>)}
                </div>
                <div className="mt-5 flex items-center gap-2 text-xs font-bold text-slate-500"><ShieldCheck className="h-4 w-4 text-emerald-600" /> 6 verified records <span className="text-slate-300">•</span> 12 skills <span className="text-slate-300">•</span> 8 projects</div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}