"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Shield, RotateCw, ExternalLink, Download } from "lucide-react";

interface DigitalIdCardProps {
  profile: {
    fullName: string;
    headline?: string | null;
    professionalId: string;
    photoUrl?: string | null;
    education?: { degree: string; institution: string }[];
    experience?: { jobTitle: string; company: string }[];
    skills?: { name: string }[];
  };
  qrDataUrl: string;
  publicUrl: string;
}

export const DigitalIdCard: React.FC<DigitalIdCardProps> = ({
  profile,
  qrDataUrl,
  publicUrl,
}) => {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="flex flex-col items-center">
      {/* 3D Flip Card Container */}
      <div className="w-full max-w-sm h-[480px] perspective cursor-pointer" onClick={() => setFlipped(!flipped)}>
        <div
          className={`relative w-full h-full duration-500 transform-style-3d transition-transform ${
            flipped ? "rotate-y-180" : ""
          }`}
        >
          {/* FRONT */}
          <div className="absolute inset-0 w-full h-full backface-hidden rounded-2xl bg-gradient-to-b from-slate-900 via-slate-850 to-slate-950 text-white p-6 shadow-2xl border border-slate-700 flex flex-col justify-between">
            <div>
              {/* Header */}
              <div className="flex justify-between items-start border-b border-slate-700 pb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded bg-blue-600 flex items-center justify-center font-black tracking-widest text-xs">
                    P
                  </div>
                  <span className="font-bold tracking-wider text-sm">PROVIA</span>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Professional ID</div>
                  <div className="font-mono text-sm font-bold text-blue-400">{profile.professionalId}</div>
                </div>
              </div>

              {/* Photo & Identity Details */}
              <div className="mt-5 flex items-center gap-4">
                <div className="relative w-20 h-20 rounded-xl overflow-hidden border-2 border-blue-500/50 bg-slate-800 flex-shrink-0">
                  {profile.photoUrl ? (
                    <Image
                      src={profile.photoUrl}
                      alt={profile.fullName}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 text-2xl font-bold bg-slate-800">
                      {profile.fullName.charAt(0)}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-tight text-white">{profile.fullName}</h3>
                  <p className="text-xs text-slate-300 mt-1 line-clamp-2">
                    {profile.headline || "Professional Member"}
                  </p>
                  <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] bg-amber-500/10 text-amber-300 border border-amber-500/20">
                    <span>🟡</span> User-provided
                  </div>
                </div>
              </div>

              {/* Quick Academic / Role Snapshot */}
              <div className="mt-4 bg-slate-800/60 rounded-lg p-3 text-xs border border-slate-700/60">
                {profile.education && profile.education[0] ? (
                  <div>
                    <span className="text-slate-400 block text-[10px]">Education</span>
                    <span className="font-medium text-slate-200">{profile.education[0].degree}</span>
                    <span className="text-slate-400 block truncate">{profile.education[0].institution}</span>
                  </div>
                ) : (
                  <div className="text-slate-400 italic">No formal education listed</div>
                )}
              </div>
            </div>

            {/* Bottom QR Section */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <div className="flex flex-col text-[11px] text-slate-400">
                <span className="font-medium text-slate-300">Scan to verify profile</span>
                <span className="text-[10px] text-slate-500 font-mono">provia.id/{profile.professionalId}</span>
              </div>
              <div className="bg-white p-1 rounded-lg shadow">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={qrDataUrl} alt="Provia Profile QR" className="w-16 h-16" />
              </div>
            </div>
          </div>

          {/* BACK */}
          <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-2xl bg-slate-900 text-white p-6 shadow-2xl border border-slate-700 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <span className="text-xs font-semibold text-slate-400 tracking-wider">CAREER SPECIFICATION</span>
                <span className="font-mono text-xs text-blue-400">{profile.professionalId}</span>
              </div>

              <div className="mt-4 space-y-3">
                <div>
                  <h4 className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Primary Focus</h4>
                  <p className="text-xs text-slate-200 mt-0.5">
                    {profile.experience?.[0]?.jobTitle || "Not specified"}
                    {profile.experience?.[0]?.company ? ` at ${profile.experience[0].company}` : ""}
                  </p>
                </div>

                <div>
                  <h4 className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Core Competencies</h4>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {profile.skills && profile.skills.length > 0 ? (
                      profile.skills.slice(0, 6).map((skill, i) => (
                        <span key={i} className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                          {skill.name}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-500">No skills added yet</span>
                    )}
                  </div>
                </div>

                <div className="pt-2">
                  <h4 className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Permanent Record URL</h4>
                  <p className="font-mono text-[11px] text-blue-400 break-all mt-0.5">
                    {publicUrl}
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center pt-4 border-t border-slate-800 text-[11px] text-slate-400">
              <p>PROVIA Universal Career Identity</p>
              <p className="text-[9px] text-slate-500 mt-0.5">Tap or click anywhere to flip card</p>
            </div>
          </div>
        </div>
      </div>

      {/* Control Actions */}
      <div className="mt-4 flex items-center gap-3">
        <button
          onClick={() => setFlipped(!flipped)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 shadow-sm"
        >
          <RotateCw className="w-3.5 h-3.5" /> Flip Card
        </button>
        <a
          href={qrDataUrl}
          download={`Provia-${profile.professionalId}-QR.png`}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 shadow-sm"
        >
          <Download className="w-3.5 h-3.5" /> Download QR
        </a>
      </div>
    </div>
  );
};