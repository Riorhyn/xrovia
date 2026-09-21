"use client";

import React from "react";
import { BENEFITS } from "./config";
import { Container } from "./ui";

export function Benefits() {
  const benefitsList = BENEFITS ?? [];

  return (
    <section id="benefits" className="scroll-mt-20 bg-white py-16 sm:py-24 border-b border-slate-200/60">
      <Container>
        {/* Section Header */}
        <div className="max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
            Platform Benefits
          </span>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            One Permanent Professional ID. One Verified Career Record.
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-slate-600">
            Eliminate fragmented resumes and unverified profiles. Xrovia equips you with a trustworthy, lifelong career record built for modern hiring ecosystems.
          </p>
        </div>

        {/* Benefits Grid */}
        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {benefitsList.map(({ title, description, icon: Icon }) => (
            <li
              key={title}
              className="group rounded-2xl border border-slate-200/80 bg-slate-50/50 p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-blue-200 hover:bg-white hover:shadow-md"
            >
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-100/70 text-blue-800 transition-colors group-hover:bg-blue-700 group-hover:text-white">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <h3 className="mt-4 text-base font-bold text-slate-900">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{description}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}