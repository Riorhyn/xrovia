"use client";

import React from "react";
import { Container, SectionHeader } from "./ui";
import { ShieldCheck, UserCheck, Users, CheckCircle, FileBadge } from "lucide-react";

export function TrustSection() {
  return (
    <section className="border-b border-slate-200/80 bg-slate-50/60 py-20 sm:py-28">
      <Container>
        <SectionHeader
          eyebrow="Trust & Authenticity"
          title="Transparent claims. No fabricated authority."
          description="XROVIA distinguishes self-added record entries from independently confirmed institutional data and peer project collaborations."
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-3">
          {/* Level 1 */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100 text-slate-700 font-bold">
                  <UserCheck className="h-5 w-5" />
                </span>
                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-extrabold text-slate-600">
                  Level 1
                </span>
              </div>
              <h3 className="mt-5 text-base font-bold text-slate-950">Self-Added Records</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600">
                Information added directly by profile owners (skills, self-guided projects, personal summaries). Clearly flagged as self-reported for total transparency.
              </p>
            </div>
            <div className="mt-6 pt-3 border-t border-slate-100">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-500">
                <CheckCircle className="h-3.5 w-3.5 text-slate-400" /> Transparent Self-Report
              </span>
            </div>
          </div>

          {/* Level 2 */}
          <div className="rounded-3xl border border-blue-200 bg-white p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-blue-600 font-bold">
                  <Users className="h-5 w-5" />
                </span>
                <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-extrabold text-blue-700">
                  Level 2
                </span>
              </div>
              <h3 className="mt-5 text-base font-bold text-slate-950">Peer & Team Proof</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600">
                Collaborative project items confirmed by tagged co-creators or team members using their own active Professional IDs.
              </p>
            </div>
            <div className="mt-6 pt-3 border-t border-slate-100">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-blue-700">
                <Users className="h-3.5 w-3.5 text-blue-600" /> Verified Collaborators
              </span>
            </div>
          </div>

          {/* Level 3 */}
          <div className="rounded-3xl border border-emerald-200 bg-white p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-emerald-600 font-bold">
                  <ShieldCheck className="h-5 w-5" />
                </span>
                <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-extrabold text-emerald-700">
                  Level 3
                </span>
              </div>
              <h3 className="mt-5 text-base font-bold text-slate-950">Institutional Verification</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600">
                Degrees, employment histories, or formal certifications independently approved by verified organizational administrators on XROVIA.
              </p>
            </div>
            <div className="mt-6 pt-3 border-t border-slate-100">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> Organization Validated
              </span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
