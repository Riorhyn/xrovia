"use client";

import React from "react";
import { PROBLEMS } from "./config";
import { Container } from "./ui";

export function ProblemSection() {
  return (
    <section className="border-y border-slate-200/70 bg-slate-50 py-16 sm:py-24">
      <Container>
        <div className="max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700">The problem</span>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
            A career is bigger than the document used to describe it.
          </h2>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            Today, your professional story is usually split between CVs, profiles, certificates, emails, portfolios and institutional records. The person is expected to keep joining the pieces together.
          </p>
        </div>

        <ul className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {PROBLEMS.map(({ title, body, icon: Icon }) => (
            <li key={title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-blue-700">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <h3 className="mt-5 text-lg font-bold text-slate-950">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{body}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
