"use client";

import React from "react";
import { PROBLEMS } from "./config";
import { Container, IconBox, SectionHeader, Surface } from "./ui";

export function ProblemSection() {
  return (
    <section id="why-xrovia" className="border-b border-slate-200 bg-white py-20 sm:py-28">
      <Container>
        <SectionHeader
          eyebrow="Why XROVIA"
          title="Build a professional record that is ready when you need it."
          description="Keep your professional information organized, make important details easier to verify, and share one consistent identity as your career develops."
        />
        <ul className="mt-12 grid gap-6 md:grid-cols-3">
          {PROBLEMS.map(({ title, body, icon: Icon }) => (
            <li key={title}>
              <Surface className="h-full min-h-[235px]">
                <IconBox><Icon className="h-5 w-5" aria-hidden="true" /></IconBox>
                <h3 className="mt-6 text-xl font-bold tracking-tight text-slate-950">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{body}</p>
              </Surface>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}