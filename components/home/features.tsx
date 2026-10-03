"use client";

import React from "react";
import { FEATURES } from "./config";
import { Container, IconBox, SectionHeader, Surface } from "./ui";

export function Features() {
  return (
    <section id="features" className="scroll-mt-20 border-y border-slate-200/70 bg-slate-50 py-16 sm:py-24">
      <Container>
        <SectionHeader eyebrow="What XROVIA actually does" title="It turns scattered career information into one connected record." description="The features are pieces of one system: identity, career history, evidence, verification, relationships and sharing." />

        <ul className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ title, description, icon: Icon, label }) => (
            <li key={title}><Surface className="h-full">
              <div className="flex items-center justify-between gap-4">
                <IconBox>
                  <Icon className="h-5 w-5" />
                </IconBox>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{label}</span>
              </div>
              <h3 className="mt-5 text-lg font-bold text-slate-950">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
            </Surface></li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
