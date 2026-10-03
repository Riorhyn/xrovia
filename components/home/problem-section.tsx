"use client";

import React from "react";
import { PROBLEMS } from "./config";
import { Container, IconBox, SectionHeader, Surface } from "./ui";

export function ProblemSection() {
  return (
    <section className="border-y border-slate-200/70 bg-slate-50 py-16 sm:py-24">
      <Container>
        <SectionHeader eyebrow="The problem" title="A career is bigger than the document used to describe it." description="Today, your professional story is usually split between CVs, profiles, certificates, emails, portfolios and institutional records. The person is expected to keep joining the pieces together." />

        <ul className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {PROBLEMS.map(({ title, body, icon: Icon }) => (
            <li key={title}><Surface className="h-full">
              <IconBox>
                <Icon className="h-5 w-5" aria-hidden="true" />
              </IconBox>
              <h3 className="mt-5 text-lg font-bold text-slate-950">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{body}</p>
            </Surface></li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
