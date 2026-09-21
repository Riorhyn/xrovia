"use client";

import React from "react";
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
    <section className="relative overflow-hidden bg-white pt-12 pb-20 lg:pt-20 lg:pb-28">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Left Column: Copy & Actions */}
          <div className="lg:col-span-6">
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl lg:leading-[1.1]">
              Your Professional Identity. <br />
              <span className="text-blue-700">Your Permanent Record.</span>
            </h1>

            <p className="mt-6 text-lg text-slate-600 sm:text-xl sm:leading-relaxed">
              Create, manage, and share your professional identity with one
              permanent Professional ID.
            </p>

            {/* Clean Single Primary CTA + Secondary Link */}
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

              <ButtonLink
                href="#how-it-works"
                size="md"
                variant="secondary"
              >
                Explore How It Works
              </ButtonLink>
            </div>

            {/* Feature Badges */}
            <div className="mt-10 border-t border-slate-100 pt-6">
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm font-medium text-slate-600">
                <span className="inline-flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-blue-700" />
                  Education
                </span>
                <span className="inline-flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-blue-700" />
                  Work experience
                </span>
                <span className="inline-flex items-center gap-2">
                  <Wrench className="h-4 w-4 text-blue-700" />
                  Skills
                </span>
                <span className="inline-flex items-center gap-2">
                  <FolderGit2 className="h-4 w-4 text-blue-700" />
                  Projects
                </span>
              </div>
              <p className="mt-3 text-xs text-slate-500">
                Everything on a Xrovia profile is provided by the person who owns it.
              </p>
            </div>
          </div>

          {/* Right Column: Single Digital ID Preview Card */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="relative w-full max-w-md rounded-3xl bg-slate-100/70 p-4 ring-1 ring-slate-200/60 lg:p-6">
              <DigitalIdPreview />
              <p className="mt-3 text-center text-xs text-slate-500">
                Sample profile with example data.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}