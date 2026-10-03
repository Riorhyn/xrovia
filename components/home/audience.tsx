"use client";

import React from "react";
import { AUDIENCES } from "./config";
import { Container } from "./ui";

export function Audience() {
  return (
    <section className="bg-white py-16 sm:py-24">
      <Container>
        <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700">Who it is for</span>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
              Start before your career is fully formed.
            </h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              XROVIA is useful when your record is small and when it has grown for years. The point is to keep adding to the same identity instead of starting over with every new stage.
            </p>
          </div>

          <ul className="grid gap-3 sm:grid-cols-2">
            {AUDIENCES.map(({ title, icon: Icon }) => (
              <li key={title} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white text-blue-700 ring-1 ring-slate-200">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="text-sm font-semibold text-slate-800">{title}</span>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
