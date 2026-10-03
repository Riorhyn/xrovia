"use client";

import React from "react";
import { AUDIENCES } from "./config";
import { Container, IconBox, SectionHeader } from "./ui";

export function Audience() {
  return (
    <section className="bg-white py-14 sm:py-20">
      <Container>
        <div className="flex flex-col gap-6 border-y border-slate-200 py-8 sm:flex-row sm:items-center sm:justify-between">
          <SectionHeader eyebrow="For people building a career" title="Start with what you have. Keep adding as you grow." description="Students, graduates and working professionals can begin with the information they already have." />
          <ul className="grid shrink-0 grid-cols-2 gap-2 sm:w-[360px]">
            {AUDIENCES.slice(0, 3).map(({ title, icon: Icon }) => (
              <li key={title} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3"><IconBox small><Icon className="h-4 w-4" /></IconBox><span className="text-xs font-semibold text-slate-800">{title}</span></li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
