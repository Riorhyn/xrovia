"use client";

import React from "react";
import { AUDIENCES } from "./config";
import { Container } from "./ui";

export function Audience() {
  const audienceList = AUDIENCES ?? [];

  return (
    <section className="bg-slate-50/50 py-16 sm:py-24 border-b border-slate-200/60">
      <Container>
        {/* Section Header */}
        <div className="max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
            Target Audience
          </span>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Who builds their digital identity on Xrovia
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-slate-600">
            Xrovia provides verified professional identity solutions tailored for individuals at every stage of education, career transition, and leadership.
          </p>
        </div>

        {/* Audience Badges */}
        <ul className="mt-10 flex flex-wrap gap-3">
          {audienceList.map(({ title, icon: Icon }) => (
            <li
              key={title}
              className="inline-flex items-center gap-2.5 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 shadow-sm transition-all hover:border-blue-300 hover:bg-blue-50/50 hover:text-blue-900"
            >
              <span className="grid h-6 w-6 place-items-center rounded-full bg-blue-50 text-blue-700">
                <Icon className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
              {title}
            </li>
          ))}
        </ul>

        {/* Footnote */}
        <p className="mt-8 text-xs text-slate-500">
          Xrovia standardizes and verifies professional credentials. Profile data is self-managed and officially validated by integrated institutions.
        </p>
      </Container>
    </section>
  );
}