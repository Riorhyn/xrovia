"use client";

import React from "react";
import { CheckCircle2, ShieldCheck, Link2 } from "lucide-react";
import { STEPS, SAMPLE_ID } from "./config";
import { Container, IconBox, Surface, SectionHeader } from "./ui";

export function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-20 border-b border-slate-200 bg-white py-20 sm:py-28">
      <Container>
        <SectionHeader
          eyebrow="How XROVIA works"
          title="Build. Verify. Share."
          description="A simple flow that keeps your professional information connected as your record grows."
        />

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {STEPS.map(({ title, body, icon: Icon }, index) => (
            <Surface key={title} className="relative h-full min-h-[230px]">
              <span className="absolute right-5 top-5 text-5xl font-black tracking-tighter text-slate-100">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="relative">
                <IconBox><Icon className="h-5 w-5" /></IconBox>
                <h3 className="mt-6 text-xl font-bold tracking-tight text-slate-950">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{body}</p>
              </div>
            </Surface>
          ))}
        </div>

        <div className="mt-12 rounded-[2rem] border border-slate-200 bg-slate-50 p-6 shadow-sm sm:p-9">
          <div className="grid gap-8 lg:grid-cols-[.8fr_1.2fr] lg:items-center">
            <div>
              <p className="inline-flex rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.14em] text-blue-700">
                Your Professional ID
              </p>
              <h3 className="mt-5 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
                One ID. A clearer picture of your work.
              </h3>
              <p className="mt-4 max-w-xl text-sm leading-7 text-slate-600">
                Your education, experience, skills and projects can sit together with their available verification or collaboration status.
              </p>
            </div>

            <div className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
              <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <p className="text-xs font-semibold text-slate-500">Professional ID</p>
                  <p className="mt-1 font-mono text-xl font-black text-slate-950">{SAMPLE_ID}</p>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-[10px] font-black text-emerald-700 ring-1 ring-emerald-200">
                  <CheckCircle2 className="h-3.5 w-3.5" /> 6 verified
                </span>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {[
                  ["Education", "B.E. Mechanical Engineering", true],
                  ["Experience", "Product Design Engineer · 5+ years", true],
                  ["Skills", "CAD · GD&T · Manufacturing · Python", true],
                  ["Projects", "Solar tracking system · 4 collaborators", false],
                ].map(([label, value, verified]) => (
                  <div
                    key={label as string}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-200 hover:bg-white hover:shadow-md"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{label as string}</span>
                      {verified ? (
                        <ShieldCheck className="h-4 w-4 text-emerald-600" />
                      ) : (
                        <Link2 className="h-4 w-4 text-blue-600" />
                      )}
                    </div>
                    <p className="mt-2 text-xs font-semibold leading-5 text-slate-800">{value as string}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}