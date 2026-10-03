"use client";

import React from "react";
import { ArrowRight, CheckCircle2, ShieldCheck, Link2 } from "lucide-react";
import { STEPS, SAMPLE_ID, ROUTES } from "./config";
import { Container, ButtonLink, IconBox, Surface } from "./ui";

export function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-20 bg-white py-16 sm:py-24">
      <Container>
        <div className="max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700">Simple by design</span>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">Build. Verify. Share.</h2>
          <p className="mt-5 text-lg leading-8 text-slate-600">XROVIA keeps the journey simple while giving your professional information more structure and context.</p>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {STEPS.map(({ title, body, icon: Icon }, index) => (
            <Surface key={title} className="h-full">
              <div className="flex items-center justify-between"><IconBox><Icon className="h-5 w-5" /></IconBox><span className="text-xs font-black text-slate-300">0{index + 1}</span></div>
              <h3 className="mt-5 text-xl font-bold text-slate-950">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{body}</p>
            </Surface>
          ))}
        </div>
        <div className="mt-10 grid gap-6 overflow-hidden rounded-3xl border border-slate-200 bg-slate-950 p-6 text-white sm:p-8 lg:grid-cols-[1fr_1.4fr] lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-blue-300">A Professional ID with context</p>
            <h3 className="mt-3 text-2xl font-black sm:text-3xl">One ID. A much clearer picture of your work.</h3>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">A shared record can show the experience, skills, projects and verification status behind the identity.</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div><p className="text-xs font-semibold text-slate-400">Professional ID</p><p className="mt-1 font-mono text-xl font-black">{SAMPLE_ID}</p></div>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-300/20 px-2.5 py-1 text-[10px] font-black text-emerald-200 ring-1 ring-emerald-300/30"><CheckCircle2 className="h-3 w-3" /> 6 verified</span>
            </div>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {[["Education","B.E. Mechanical Engineering",true],["Experience","Product Design Engineer · 5+ years",true],["Skills","CAD · GD&T · Manufacturing · Python",true],["Projects","Solar tracking system · 4 collaborators",false]].map(([label,value,verified]) => (
                <div key={label as string} className="group rounded-xl border border-white/10 bg-white/[0.04] p-3 transition-all duration-200 hover:border-blue-300/40 hover:bg-blue-400/[0.08] hover:shadow-[0_0_24px_rgba(37,99,235,0.12)]"><div className="flex items-center justify-between gap-2"><span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{label as string}</span>{verified ? <ShieldCheck className="h-3.5 w-3.5 text-emerald-300" /> : <Link2 className="h-3.5 w-3.5 text-blue-300" />}</div><p className="mt-1 text-xs font-semibold text-slate-200">{value as string}</p></div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-8 text-center"><ButtonLink href={ROUTES.register} size="md">Create your Professional ID <ArrowRight className="h-4 w-4" /></ButtonLink></div>
      </Container>
    </section>
  );
}
