"use client";

import React from "react";
import Link from "next/link";
import {
  GraduationCap,
  Briefcase,
  Wrench,
  FolderGit2,
  ArrowRight,
} from "lucide-react";
import { ROUTES } from "./config";
import { ButtonLink, Container } from "./ui";
import { DigitalIdPreview } from "./DigitalIdPreview";

export function Hero({ isAuthenticated }: { isAuthenticated?: boolean }) {
  return (
    <section className="relative isolate overflow-hidden bg-white pt-10 pb-16 sm:pt-14 sm:pb-20 lg:pt-20 lg:pb-28">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-32 top-16 h-72 w-72 rounded-full bg-blue-100/60 blur-3xl" />
        <div className="absolute -right-24 top-0 h-80 w-80 rounded-full bg-sky-100/70 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-48 w-96 -translate-x-1/2 rounded-full bg-indigo-50/60 blur-3xl" />
      </div>

      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-6">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50/80 px-3 py-1.5 text-xs font-bold text-blue-700 shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-600" aria-hidden="true" />
              Your professional identity
            </div>

            <h1 className="max-w-3xl text-4xl font-black tracking-[-0.03em] text-slate-950 sm:text-5xl lg:text-6xl lg:leading-[1.08]">
              Your Professional Identity.
              <span className="block bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Your Permanent Record.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
              Create, manage, and share your professional identity with one
              permanent Professional ID.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              {isAuthenticated ? (
                <ButtonLink href={ROUTES.dashboard} size="md" variant="primary">
                  Go to Dashboard <ArrowRight className="h-4 w-4" />
                </ButtonLink>
              ) : (
                <ButtonLink href={ROUTES.register} size="md" variant="primary">
                  Create Professional ID
                </ButtonLink>
              )}

              <ButtonLink href="#how-it-works" size="md" variant="secondary">
                Explore How It Works
              </ButtonLink>
            </div>

            <Link
              href="/feedback"
              className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-slate-500 transition hover:text-blue-700"
            >
              <span aria-hidden="true">💬</span>
              Help us improve XROVIA — Give Feedback
            </Link>

            <div className="mt-9 border-t border-slate-200/80 pt-6">
              <div className="flex flex-wrap items-center gap-x-5 gap-y-3 text-sm font-semibold text-slate-600">
                <span className="inline-flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-blue-600" />
                  Education
                </span>
                <span className="inline-flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-blue-600" />
                  Work experience
                </span>
                <span className="inline-flex items-center gap-2">
                  <Wrench className="h-4 w-4 text-blue-600" />
                  Skills
                </span>
                <span className="inline-flex items-center gap-2">
                  <FolderGit2 className="h-4 w-4 text-blue-600" />
                  Projects
                </span>
              </div>
              <p className="mt-3 text-xs leading-5 text-slate-500">
                Everything on a Xrovia profile is provided by the person who owns it.
              </p>
            </div>
          </div>

          <div className="lg:col-span-6 lg:pl-4">
            <div className="relative mx-auto w-full max-w-md">
              <div className="absolute -inset-4 rounded-[2rem] bg-blue-100/40 blur-2xl" aria-hidden="true" />
              <div className="relative rounded-[2rem] border border-white/80 bg-white/75 p-3 shadow-2xl shadow-slate-300/30 ring-1 ring-slate-200/80 backdrop-blur sm:p-5">
                <DigitalIdPreview />
                <p className="mt-3 text-center text-[11px] font-medium text-slate-400">
                  Sample profile with example data.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}