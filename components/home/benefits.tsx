"use client";

import React from "react";
import { WHY_XROVIA } from "./config";
import { Container, IconBox, SectionHeader, Surface } from "./ui";

export function Benefits() {
  return (
    <section className="bg-slate-950 py-16 text-white sm:py-24">
      <Container>
        <SectionHeader dark eyebrow="The value" title="Your professional information becomes more useful when it is connected." description="XROVIA brings identity, career history, evidence and relationships into one system so you can present a fuller picture of your work." />
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {WHY_XROVIA.map(({ title, body, icon: Icon }) => (
            <Surface key={title} dark className="h-full"><IconBox dark><Icon className="h-5 w-5" /></IconBox><h3 className="mt-5 text-lg font-bold">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-300">{body}</p></Surface>
          ))}
        </div>
      </Container>
    </section>
  );
}
