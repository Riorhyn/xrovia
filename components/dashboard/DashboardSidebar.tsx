"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Edit3,
  Users,
  FileSpreadsheet,
  KeyRound,
  ShieldCheck,
  Menu,
  X,
  ChevronRight,
  ExternalLink
} from "lucide-react";

const navItems = [
  { label: "Dashboard Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Edit Profile Builder", href: "/dashboard/builder", icon: Edit3 },
  { label: "Projects & Collaborations", href: "/dashboard/collaborations", icon: Users },
  { label: "Import Document Data", href: "/dashboard/import", icon: FileSpreadsheet },
  { label: "Security & Password", href: "/dashboard/security", icon: KeyRound },
];

export function DashboardSidebar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50/80 flex flex-col lg:flex-row">
      {/* Mobile Top Header */}
      <header className="lg:hidden sticky top-0 z-40 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <img src="/ChatGPT Image Sep 27, 2026, 04_14_14 PM.png" alt="XROVIA" className="h-6 w-auto object-contain" />
          <span className="font-extrabold text-sm text-slate-900 tracking-tight">XROVIA Dashboard</span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100"
          aria-label="Toggle Navigation"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </header>

      {/* Mobile Overlay Drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex">
          <div className="w-72 bg-white h-full p-6 flex flex-col justify-between shadow-2xl">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <img src="/ChatGPT Image Sep 27, 2026, 04_14_14 PM.png" alt="XROVIA" className="h-6 w-auto object-contain" />
                  <span className="font-extrabold text-sm text-slate-900">Navigation</span>
                </div>
                <button onClick={() => setMobileOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-800">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="mt-6 space-y-1.5">
                {navItems.map(({ label, href, icon: Icon }) => {
                  const active = pathname === href;
                  return (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                        active
                          ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      }`}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span>{label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="pt-6 border-t border-slate-100">
              <Link
                href="/"
                className="flex items-center justify-between text-xs font-bold text-slate-600 hover:text-blue-600"
              >
                <span>Return to Public Home</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
          <div className="flex-1" onClick={() => setMobileOpen(false)} />
        </div>
      )}

      {/* Desktop Permanent Sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 bg-white border-r border-slate-200/90 flex-col justify-between p-6 sticky top-0 h-screen">
        <div>
          <div className="flex items-center gap-2.5 pb-6 border-b border-slate-100">
            <img src="/ChatGPT Image Sep 27, 2026, 04_14_14 PM.png" alt="XROVIA" className="h-7 w-auto object-contain" />
            <div>
              <span className="font-extrabold text-sm text-slate-950 tracking-tight block">XROVIA</span>
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest block">Dashboard</span>
            </div>
          </div>

          <nav className="mt-6 space-y-2">
            {navItems.map(({ label, href, icon: Icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition ${
                    active
                      ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{label}</span>
                  </div>
                  {active && <ChevronRight className="h-3.5 w-3.5 text-white/80" />}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
            <ShieldCheck className="h-4 w-4 text-emerald-600" /> Professional Identity
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Your identity card and verified profile records are managed securely.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:underline pt-1"
          >
            Public platform <ExternalLink className="h-3 w-3" />
          </Link>
        </div>
      </aside>

      {/* Main Page Area */}
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}
