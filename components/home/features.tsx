"use client";

import React from "react";
import { FEATURES } from "./config";
import { Container } from "./ui";

export function Features() {
  const featuresList = FEATURES ?? [];

  return (
    <section id="features" className="scroll-mt-20 bg-slate-50/50 py-16 sm:py-24 border-b border-slate-200/60">
      <Container>
        {/* Section Header */}
        <div className="max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
            Capabilities
          </span>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            What you get with Xrovia
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-slate-600">
            Comprehensive tools built to manage, verify, and present your lifelong career record.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuresList.map(({ title, description, icon: Icon, status }) => (
            <li
              key={title}
              className="group relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-blue-700 ring-1 ring-blue-100/80 transition-colors group-hover:bg-blue-700 group-hover:text-white">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  {status === "soon" ? (
                    <span className="rounded-full border border-amber-200/80 bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-900">
                      Coming soon
                    </span>
                  ) : (
                    <span className="rounded-full border border-blue-100 bg-blue-50/80 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
                      Live
                    </span>
                  )}
                </div>

                <h3 className="mt-5 text-base font-bold text-slate-900">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {description}
                </p>
              </div>
            </li>
          ))}
        </ul>

        {/* Footnote */}
        <p className="mt-8 text-center text-xs text-slate-500">
          Institutional verification requests are processed via direct integrations with participating universities and employers.
        </p>
      </Container>
    </section>
  );
}