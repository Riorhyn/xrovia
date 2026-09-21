"use client";

import React from "react";
import { PROBLEMS } from "./config";
import { Container } from "./ui";

export function ProblemSection() {
  return (
    <section className="bg-slate-50 py-16 sm:py-24 border-y border-slate-200/60">
      <Container>
        {/* Section Header */}
        <div className="max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
            The Problem
          </span>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Your career information is spread too thin
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-slate-600">
            Students and professionals keep their story in many files and profiles.
            Keeping them all current, and easy for others to read, takes constant effort.
          </p>
        </div>

        {/* Problem Grid */}
        <ul className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {PROBLEMS.map(({ title, body, icon: Icon }) => (
            <li
              key={title}
              className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-slate-300 hover:shadow-md"
            >
              <div>
                {/* Icon Badge */}
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-blue-700 transition-colors group-hover:bg-blue-700 group-hover:text-white">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>

                {/* Content */}
                <h3 className="mt-5 text-lg font-bold text-slate-900">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {body}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}