"use client";

import React from "react";
import { FEATURES } from "./config";
import { Container } from "./ui";

export function Features() {
  return (
    <section id="features" className="scroll-mt-20 border-y border-slate-200/70 bg-slate-50 py-16 sm:py-24">
      <Container>
        <div className="max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700">What XROVIA actually does</span>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
            It turns scattered career information into one connected record.
          </h2>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            The features are pieces of one system: identity, career history, evidence, verification, relationships and sharing.
          </p>
        </div>

        <ul className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ title, description, icon: Icon, label }) => (
            <li key={title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-blue-700">
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{label}</span>
              </div>
              <h3 className="mt-5 text-lg font-bold text-slate-950">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
