"use client";

import React from "react";
import { AUDIENCES } from "./config";
import { Container, IconBox, SectionHeader } from "./ui";

export function Audience() {
  return (
    <section className="border-y border-slate-200 bg-slate-50 py-20 sm:py-24">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[1fr_400px] lg:items-center">
          <SectionHeader eyebrow="For people building a career" title="Start with what you have. Keep adding as you grow." description="Students, graduates and working professionals can begin with the information they already have." />
          <ul className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            {AUDIENCES.slice(0, 3).map(({ title, icon: Icon }) => (
              <li key={title} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md">
                <IconBox small><Icon className="h-4 w-4" /></IconBox><span className="text-sm font-bold text-slate-800">{title}</span>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}