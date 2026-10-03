"use client";

import React from "react";
import { WHY_XROVIA } from "./config";
import { Container } from "./ui";

export function Benefits() {
  return (
    <section id="why-xrovia" className="scroll-mt-20 bg-slate-950 py-16 text-white sm:py-24">
      <Container>
        <div className="max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-300">Why XROVIA</span>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
            The profile is not the product. The record is.
          </h2>
          <p className="mt-5 text-lg leading-8 text-slate-300">
            A public profile is easy to copy. What takes time is building a history that stays structured, can carry evidence, and can accumulate confirmation over years.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {WHY_XROVIA.map(({ title, body, icon: Icon }) => (
            <div key={title} className="rounded-2xl border border-white/10 bg-white/[0.06] p-6">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 text-blue-300">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-lg font-bold">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-300">{body}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-blue-400/20 bg-blue-500/10 p-6">
          <p className="text-sm font-semibold text-blue-200">The long-term idea</p>
          <p className="mt-2 max-w-4xl text-xl font-semibold leading-8 text-white">
            Build your professional history once. Keep improving it. Let the record become more useful as more parts of it are supported by evidence and trusted relationships.
          </p>
        </div>
      </Container>
    </section>
  );
}
