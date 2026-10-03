"use client";

import React from "react";
import { ArrowRight, CheckCircle2, Fingerprint, ShieldCheck, Users } from "lucide-react";
import { STEPS, SAMPLE_ID, ROUTES } from "./config";
import { Container, ButtonLink } from "./ui";

export function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-20 bg-white py-16 sm:py-24">
      <Container>
        <div className="max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700">The XROVIA model</span>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
            One record. Multiple kinds of proof.
          </h2>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            XROVIA is designed to make a professional history easier to build and easier to understand without pretending that every entry is automatically verified.
          </p>
        </div>

        <div className="mt-12 grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <ol className="relative space-y-8">
              {STEPS.map(({ title, body, icon: Icon }, index) => (
                <li key={title} className="relative flex gap-5">
                  {index < STEPS.length - 1 && (
                    <span aria-hidden="true" className="absolute left-5 top-11 h-[calc(100%+1rem)] w-px bg-slate-200" />
                  )}
                  <span className="relative grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-700 ring-1 ring-blue-100">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-blue-700">Step {index + 1}</p>
                    <h3 className="mt-1 text-lg font-bold text-slate-950">{title}</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-600">{body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <aside className="lg:col-span-5">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 sm:p-7">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Example</p>
                  <p className="mt-1 text-base font-bold text-slate-950">A living professional record</p>
                </div>
                <Fingerprint className="h-5 w-5 text-blue-700" />
              </div>

              <div className="mt-6 rounded-2xl bg-slate-950 p-5 text-white">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Professional ID</p>
                <p className="mt-2 text-2xl font-black tracking-wide">{SAMPLE_ID}</p>
                <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                  <span className="rounded-lg bg-white/10 px-3 py-2">Education</span>
                  <span className="rounded-lg bg-white/10 px-3 py-2">Experience</span>
                  <span className="rounded-lg bg-white/10 px-3 py-2">Projects</span>
                  <span className="rounded-lg bg-white/10 px-3 py-2">Evidence</span>
                </div>
              </div>

              <div className="mt-5 space-y-3 text-sm">
                <div className="flex items-start gap-3 rounded-xl bg-white p-3 ring-1 ring-slate-200">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-blue-700" />
                  <span><strong>Self-added</strong> — information the owner entered.</span>
                </div>
                <div className="flex items-start gap-3 rounded-xl bg-white p-3 ring-1 ring-slate-200">
                  <ShieldCheck className="mt-0.5 h-4 w-4 text-blue-700" />
                  <span><strong>Verified</strong> — independently confirmed by the relevant organization.</span>
                </div>
                <div className="flex items-start gap-3 rounded-xl bg-white p-3 ring-1 ring-slate-200">
                  <Users className="mt-0.5 h-4 w-4 text-blue-700" />
                  <span><strong>Collaborative</strong> — connected to people and roles involved in the work.</span>
                </div>
              </div>

              <ButtonLink href={ROUTES.register} className="mt-6 w-full justify-center">
                Start your record <ArrowRight className="h-4 w-4" />
              </ButtonLink>
            </div>
          </aside>
        </div>
      </Container>
    </section>
  );
}
