import "./globals.css";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";
import { getSession } from "../lib/auth/session";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { AccountSwitcher } from "@/components/auth/AccountSwitcher";

export const dynamic = "force-dynamic";

export const metadata = {
  metadataBase: new URL("https://xrovia.com"),
  title: {
    default: "XROVIA | Professional Identity Platform",
    template: "%s | XROVIA",
  },
  description:
    "XROVIA is a professional identity platform for creating, managing, verifying, and sharing your career profile, education, experience, skills, projects, and achievements.",
  applicationName: "XROVIA",
  keywords: [
    "XROVIA",
    "Xrovia",
    "XROVIA professional identity",
    "XROVIA professional profile",
    "XROVIA career profile",
    "professional identity",
    "professional identity platform",
    "digital professional profile",
    "career profile",
    "professional profile",
    "verified professional profile",
    "digital identity",
    "career record",
    "professional ID",
  ],
  authors: [{ name: "XROVIA" }],
  creator: "XROVIA",
  publisher: "XROVIA",
  alternates: {
    canonical: "https://xrovia.com/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/ChatGPT Image Sep 27, 2026, 04_14_14 PM.png",
    apple: "/ChatGPT Image Sep 27, 2026, 04_14_14 PM.png",
  },
  openGraph: {
    type: "website",
    url: "https://xrovia.com/",
    siteName: "XROVIA",
    title: "XROVIA | Professional Identity Platform",
    description:
      "Create, manage, verify, and share your professional identity with one permanent Professional ID.",
    locale: "en_US",
    images: [
      {
        url: "/ChatGPT Image Sep 27, 2026, 04_14_14 PM.png",
        width: 2048,
        height: 1152,
        alt: "XROVIA logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "XROVIA | Professional Identity Platform",
    description:
      "Create, manage, verify, and share your professional identity with one permanent Professional ID.",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased">
        <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/85 shadow-[0_1px_0_rgba(15,23,42,0.02)] backdrop-blur-xl">
          <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <Link href="/" className="group flex items-center gap-2.5" aria-label="XROVIA home">
              <Image
                src="/ChatGPT Image Sep 27, 2026, 04_14_14 PM.png"
                alt="XROVIA"
                width={160}
                height={90}
                priority
                className="h-10 w-auto object-contain transition-transform group-hover:scale-105"
              />
            </Link>

            <nav className="hidden items-center gap-1 rounded-full border border-slate-200/80 bg-slate-50/80 p-1 text-sm font-semibold text-slate-600 md:flex">
              <Link href="/#how-it-works" className="rounded-full px-4 py-2 transition hover:bg-white hover:text-blue-700 hover:shadow-sm">
                How it works
              </Link>
              <Link href="/#benefits" className="rounded-full px-4 py-2 transition hover:bg-white hover:text-blue-700 hover:shadow-sm">
                Benefits
              </Link>
              <Link href="/#search-id" className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 transition hover:bg-white hover:text-blue-700 hover:shadow-sm">
                <Search className="h-4 w-4" />
                Search ID
              </Link>
            </nav>

            <div className="flex items-center gap-2">
              {session ? (
                <>
                  <AccountSwitcher
                    isAdmin={session.role === "ADMIN"}
                    activeOrganizationId={session.organizationId}
                  />
                  <LogoutButton />
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="hidden rounded-xl px-3 py-2 text-sm font-bold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 sm:inline-flex"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="inline-flex rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-md"
                  >
                    <span className="hidden sm:inline">Create Professional ID</span>
                    <span className="sm:hidden">Create ID</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="border-t border-slate-800 bg-slate-950 text-slate-400">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.2fr_1fr_auto] lg:px-8 lg:py-14">
            <div>
              <div className="flex items-center gap-2.5">
                <Image
                  src="/ChatGPT Image Sep 27, 2026, 04_14_14 PM.png"
                  alt="XROVIA"
                  width={140}
                  height={79}
                  className="h-8 w-auto object-contain"
                />
              </div>
              <p className="mt-3 max-w-sm text-sm leading-6 text-slate-400">
                Your permanent professional identity and career record.
              </p>
            </div>

            <nav className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm sm:grid-cols-3 lg:grid-cols-2" aria-label="Footer">
              <Link href="/#search-id" className="transition hover:text-white">Search ID</Link>
              <Link href="/#benefits" className="transition hover:text-white">Member Benefits</Link>
              <Link href="/career/job-search" className="transition hover:text-white">Career Guides</Link>
              <Link href="/professional-profile" className="transition hover:text-white">Professional Profile</Link>
              <Link href="/feedback" className="transition hover:text-white">Feedback</Link>
              <Link href="/organization/register" className="transition hover:text-white">For Organizations</Link>
            </nav>

            <p className="text-xs text-slate-500 lg:text-right">
              © {new Date().getFullYear()} XROVIA.<br className="hidden lg:block" /> All rights reserved.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}