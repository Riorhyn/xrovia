"use client";

import React from "react";
import { ArrowRight, CheckCircle2, ShieldCheck, Link2 } from "lucide-react";
import { STEPS, SAMPLE_ID, ROUTES } from "./config";
import { Container, ButtonLink, IconBox, Surface, SectionHeader } from "./ui";

export function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-20 bg-white py-20 sm:py-28">
      <Container>
        <SectionHeader eyebrow="Simple by design" title="Build. Verify. Share." description="XROVIA keeps the journey simple while giving your professional information more structure and context." />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {STEPS.map(({ title, body, icon: Icon }, index) => (
            <Surface key={title} className="relative h-full min-h-[235px] overflow-hidden">
              <span className="absolute right-5 top-5 text-5xl font-black tracking-tighter text-slate-100">{String(index + 1).padStart(2,"0")}</span>
              <div className="relative"><IconBox><Icon className="h-5 w-5" /></IconBox><h3 className="mt-6 text-xl font-bold tracking-tight text-slate-950">{title}</h3><p className="mt-3 max-w-sm text-sm leading-7 text-slate-600">{body}</p></div>
            </Surface>
          ))}
        </div>
        <div className="mt-12 overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-950 p-6 text-white shadow-2xl shadow-slate-950/10 sm:p-9">
          <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-center">
            <div>
              <p className="inline-flex rounded-full border border-blue-400/20 bg-blue-400/10 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.14em] text-blue-300">A Professional ID with context</p>
              <h3 className="mt-5 text-2xl font-black tracking-tight sm:text-3xl">One ID. A much clearer picture of your work.</h3>
              <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300">A shared record can show the experience, skills, projects and verification status behind the identity.</p>
            </div>
            <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.06] p-4 shadow-inner sm:p-5">
              <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div><p className="text-xs font-semibold text-slate-400">Professional ID</p><p className="mt-1 font-mono text-xl font-black">{SAMPLE_ID}</p></div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-300/15 px-3 py-1.5 text-[10px] font-black text-emerald-200 ring-1 ring-emerald-300/40"><CheckCircle2 className="h-3.5 w-3.5" /> 6 verified</span>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {[["Education","B.E. Mechanical Engineering",true],["Experience","Product Design Engineer · 5+ years",true],["Skills","CAD · GD&T · Manufacturing · Python",true],["Projects","Solar tracking system · 4 collaborators",false]].map(([label,value,verified]) => (
                  <div key={label as string} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-300/40 hover:bg-blue-400/[0.08] hover:shadow-[0_0_30px_rgba(37,99,235,.14)]">
                    <div className="flex items-center justify-between gap-2"><span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{label as string}</span>{verified ? <ShieldCheck className="h-4 w-4 text-emerald-300 drop-shadow-[0_0_7px_rgba(110,231,183,.45)]" /> : <Link2 className="h-4 w-4 text-sky-300 drop-shadow-[0_0_7px_rgba(125,211,252,.4)]" />}</div>
                    <p className="mt-2 text-xs font-semibold leading-5 text-slate-200">{value as string}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-10 flex justify-center"><ButtonLink href={ROUTES.register}>Create your Professional ID <ArrowRight className="h-4 w-4" /></ButtonLink></div>
      </Container>
    </section>
  );
}