"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Search, User, Building2, ShieldCheck, ArrowRight } from "lucide-react";

interface HeaderNavProps {
  session: { role?: string; organizationId?: string | null; name?: string } | null;
  accountSwitcherSlot?: React.ReactNode;
  logoutButtonSlot?: React.ReactNode;
}

export function HeaderNav({ session, accountSwitcherSlot, logoutButtonSlot }: HeaderNavProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Avoid rendering duplicate marketing header on dashboard or admin pages
  if (pathname?.startsWith("/dashboard") || pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-xl shadow-[0_1px_3px_rgba(15,23,42,0.03)]">
      <div className="mx-auto flex h-16 sm:h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="group flex items-center gap-2.5" aria-label="XROVIA home">
          <Image
            src="/ChatGPT Image Sep 27, 2026, 04_14_14 PM.png"
            alt="XROVIA"
            width={160}
            height={90}
            priority
            className="h-9 sm:h-10 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
          />
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden items-center gap-1 rounded-full border border-slate-200/80 bg-slate-50/80 p-1 text-sm font-medium text-slate-600 md:flex">
          <Link href="/#how-it-works" className="rounded-full px-4 py-1.5 transition hover:bg-white hover:text-blue-600 hover:shadow-sm">
            How it works
          </Link>
          <Link href="/#why-xrovia" className="rounded-full px-4 py-1.5 transition hover:bg-white hover:text-blue-600 hover:shadow-sm">
            Why XROVIA
          </Link>
          <Link href="/#for-organizations" className="rounded-full px-4 py-1.5 transition hover:bg-white hover:text-blue-600 hover:shadow-sm">
            For Organizations
          </Link>
          <Link href="/#search-id" className="inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 transition hover:bg-white hover:text-blue-600 hover:shadow-sm">
            <Search className="h-3.5 w-3.5 text-blue-600" />
            Search ID
          </Link>
        </nav>

        {/* Action Buttons (Desktop) */}
        <div className="hidden items-center gap-2.5 sm:flex">
          {session ? (
            <div className="flex items-center gap-2">
              {accountSwitcherSlot}
              {logoutButtonSlot}
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-xl px-3.5 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-950"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-xl border border-blue-600 bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-600/20 transition-all hover:-translate-y-0.5 hover:border-blue-700 hover:bg-blue-700 hover:shadow-lg"
              >
                <span>Create Your Identity</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex items-center gap-2 sm:hidden">
          {session && accountSwitcherSlot}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-700 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Dropdown */}
      {mobileMenuOpen && (
        <div className="border-b border-slate-200/90 bg-white/95 px-4 pb-6 pt-3 backdrop-blur-2xl sm:hidden">
          <nav className="flex flex-col space-y-1">
            <Link
              href="/#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-blue-600"
            >
              <ShieldCheck className="h-4 w-4 text-blue-600" /> How it works
            </Link>
            <Link
              href="/#why-xrovia"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-blue-600"
            >
              <User className="h-4 w-4 text-blue-600" /> Why XROVIA
            </Link>
            <Link
              href="/#for-organizations"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-blue-600"
            >
              <Building2 className="h-4 w-4 text-blue-600" /> For Organizations
            </Link>
            <Link
              href="/#search-id"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-blue-600"
            >
              <Search className="h-4 w-4 text-blue-600" /> Search ID
            </Link>

            <div className="my-2 border-t border-slate-100 pt-2">
              {session ? (
                <div className="flex flex-col gap-2 pt-1">
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-bold text-white shadow-md"
                  >
                    Open Dashboard
                  </Link>
                  <div className="flex justify-center pt-1">{logoutButtonSlot}</div>
                </div>
              ) : (
                <div className="flex flex-col gap-2 pt-1">
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-bold text-white shadow-md shadow-blue-600/20"
                  >
                    <span>Create Your Identity</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex w-full items-center justify-center rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-sm font-semibold text-slate-800"
                  >
                    Sign In
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
