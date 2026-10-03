"use client";

import React from "react";
import { AUDIENCES } from "./config";
import { Container, IconBox, SectionHeader } from "./ui";

export function Audience() {
  return (
    <section className="bg-white py-16 sm:py-24">
      <Container>
        <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
          <SectionHeader eyebrow="Who it is for" title="Start before your career is fully formed." description="XROVIA is useful when your record is small and when it has grown for years. The point is to keep adding to the same identity instead of starting over with every new stage." />

          <ul className="grid gap-3 sm:grid-cols-2">
            {AUDIENCES.map(({ title, icon: Icon }) => (
              <li key={title} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <IconBox small>
                  <Icon className="h-4 w-4" />
                </IconBox>
                <span className="text-sm font-semibold text-slate-800">{title}</span>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
