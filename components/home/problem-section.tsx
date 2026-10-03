"use client";

import React from "react";
import { PROBLEMS } from "./config";
import { Container, IconBox, SectionHeader, Surface } from "./ui";

export function ProblemSection() {
  return (
    <section id="why-xrovia" className="border-y border-slate-200/70 bg-slate-50 py-16 sm:py-24">
      <Container>
        <SectionHeader eyebrow="Why XROVIA" title="Build a professional record that is ready when you need it." description="Keep your professional information organized, make important details easier to verify, and share one consistent identity as your career develops." />
        <ul className="mt-12 grid gap-5 md:grid-cols-3">
          {PROBLEMS.map(({ title, body, icon: Icon }) => (
            <li key={title}><Surface className="h-full"><IconBox><Icon className="h-5 w-5" aria-hidden="true" /></IconBox><h3 className="mt-5 text-lg font-bold text-slate-950">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{body}</p></Surface></li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
