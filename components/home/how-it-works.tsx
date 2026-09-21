"use client";

import React from "react";
import {
  ShieldCheck,
  CheckCircle2,
  Share2,
  QrCode,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { SAMPLE_ID, STEPS, ROUTES } from "./config";
import { Container, ButtonLink } from "./ui";
import { QrVisual } from "./qr-visual";

export function HowItWorks() {
  const stepsList = STEPS ?? [];

  return (
    <section id="how-it-works" className="scroll-mt-20 bg-slate-50/50 py-16 sm:py-24 border-y border-slate-200/60">
      <Container>
        {/* Section Header */}
        <div className="max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
            Process
          </span>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            How Xrovia works
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-slate-600">
            {stepsList.length} steps from sign-up to a verified professional record you can share and keep current.
          </p>
        </div>

        <div className="mt-12 grid gap-12 lg:grid-cols-12 lg:gap-8 items-start">
          {/* Left Column: Timeline Steps */}
          <div className="lg:col-span-7">
            <ol className="relative">
              {stepsList.map(({ title, body, icon: Icon }, index) => {
                const isLast = index === stepsList.length - 1;
                return (
                  <li key={title || index} className="relative flex gap-5 pb-9 last:pb-0">
                    {!isLast && (
                      <span
                        aria-hidden="true"
                        className="absolute left-5 top-12 h-[calc(100%-2.5rem)] w-px bg-slate-200"
                      />
                    )}
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-blue-700 shadow-sm ring-1 ring-slate-200/80">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-blue-700">
                        Step {index + 1}
                      </p>
                      <h3 className="mt-0.5 text-lg font-bold text-slate-900">{title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-slate-600">{body}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>

          {/* Right Column: Expanded Feature & Preview Card */}
          <aside className="lg:col-span-5 space-y-4 lg:sticky lg:top-24">
            {/* Live Profile Card Mock */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-md shadow-slate-200/50">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Profile Showcase
                  </p>
                  <p className="text-sm font-bold text-slate-900">Your Permanent ID</p>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 ring-1 ring-blue-100">
                  <ShieldCheck className="h-3.5 w-3.5 text-blue-700" />
                  Verified Badge
                </span>
              </div>

              {/* ID Header Box */}
              <div className="mt-5 rounded-2xl bg-blue-700 p-5 text-white shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium uppercase tracking-wider text-blue-200">
                    Xrovia Professional ID
                  </span>
                  <Sparkles className="h-4 w-4 text-blue-300" />
                </div>
                <p className="mt-2 text-3xl font-extrabold tabular-nums tracking-wide">
                  {SAMPLE_ID}
                </p>
                <div className="mt-3 flex items-center gap-1.5 text-xs text-blue-100">
                  <CheckCircle2 className="h-3.5 w-3.5 text-blue-300" />
                  Official Education & Employment Verified
                </div>
              </div>

              {/* Mini Profile Summary */}
              <div className="mt-5 space-y-3 text-xs text-slate-600">
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="font-medium text-slate-500">Public Address</span>
                  <span className="font-bold text-blue-700">/{SAMPLE_ID}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="font-medium text-slate-500">Verification Status</span>
                  <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                    Employer & Uni Verified
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="font-medium text-slate-500">Sharing Options</span>
                  <span className="font-medium text-slate-800 flex items-center gap-1">
                    <QrCode className="h-3.5 w-3.5 text-blue-700" /> Dynamic QR Code
                  </span>
                </div>
              </div>

              {/* Bottom Info Callout */}
              <div className="mt-5 rounded-xl bg-slate-50 p-4 border border-slate-200/60">
                <p className="text-xs leading-relaxed text-slate-600">
                  When employers or institutions look up your ID, they see a clean, verified timeline of your real background.
                </p>
              </div>

              {/* Action Button */}
              <div className="mt-5 pt-2">
                <ButtonLink href={ROUTES.register} className="w-full justify-center" size="md">
                  Claim Your Professional ID <ArrowRight className="h-4 w-4" />
                </ButtonLink>
              </div>
            </div>
          </aside>
        </div>
      </Container>
    </section>
  );
}