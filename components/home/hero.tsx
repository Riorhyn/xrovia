"use client";

import React from "react";
import { ArrowRight, Fingerprint, ShieldCheck, Award, Sparkles, Building2 } from "lucide-react";
import { ROUTES } from "./config";
import { ButtonLink, Container } from "./ui";
import { DigitalIdPreview } from "./DigitalIdPreview";

export function Hero({ isAuthenticated }: { isAuthenticated?: boolean }) {
  return (
    <section className="relative isolate overflow-hidden border-b border-slate-200/80 bg-gradient-to-b from-white via-slate-50/50 to-white py-16 sm:py-24 lg:py-28">
      {/* Background Subtle Gradient Blobs */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-32 -top-20 h-96 w-96 rounded-full bg-blue-100/50 blur-3xl" />
        <div className="absolute -right-28 top-20 h-96 w-96 rounded-full bg-indigo-100/50 blur-3xl" />
        <div className="absolute left-1/2 top-1/3 h-80 w-80 -translate-x-1/2 rounded-full bg-sky-50/70 blur-3xl" />
      </div>

      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          {/* Left Text Column */}
          <div>
            <div className="xrovia-fade-up inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-blue-50/80 px-3.5 py-1.5 text-xs font-bold text-blue-700 shadow-sm backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-blue-600" />
              <span>Next-Generation Digital Identity Platform</span>
            </div>

            <h1 className="xrovia-fade-up xrovia-delay-1 mt-6 max-w-2xl text-4xl font-black tracking-[-0.04em] text-slate-950 sm:text-5xl lg:text-[4.25rem] lg:leading-[1.05]">
              Your Professional Identity. <span className="xrovia-gradient-text">Beyond Documents.</span>
            </h1>

            <p className="xrovia-fade-up xrovia-delay-2 mt-6 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg sm:leading-8">
              Create a lasting digital identity that brings your professional profile, skills, achievements, and verified experience together in one searchable place.
            </p>

            <div className="xrovia-fade-up xrovia-delay-3 mt-8 flex flex-col gap-3.5 sm:flex-row sm:items-center">
              <ButtonLink href={isAuthenticated ? ROUTES.dashboard : ROUTES.register} size="md">
                <span>{isAuthenticated ? "Open Your Identity" : "Create Your Identity"}</span>
                <ArrowRight className="h-4 w-4" />
              </ButtonLink>
              <ButtonLink href="#how-it-works" variant="secondary" size="md">
                Explore XROVIA
              </ButtonLink>
            </div>

            {/* Feature Pills */}
            <div className="mt-10 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3">
              {[
                [Fingerprint, "Permanent ID", "One unique identifier"],
                [ShieldCheck, "Verified History", "Authentic credentials"],
                [Building2, "Org Validation", "Institution proof"],
              ].map(([Icon, title, desc], i) => (
                <div
                  key={title as string}
                  className={`xrovia-fade-up xrovia-delay-${i + 1} flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white/90 p-3 shadow-sm`}
                >
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-950">{title as string}</p>
                    <p className="text-[10px] text-slate-500">{desc as string}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Digital ID Card Product Visual Column */}
          <div className="xrovia-fade-up xrovia-delay-2 lg:pl-4">
            <div className="relative mx-auto w-full max-w-[28rem]">
              {/* Soft glow background */}
              <div className="absolute -inset-4 rounded-[3rem] bg-gradient-to-r from-blue-200/50 via-indigo-200/40 to-sky-200/50 blur-2xl" aria-hidden="true" />
              <div className="relative">
                <DigitalIdPreview />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
