import "./globals.css";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { getSession } from "../lib/auth/session";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { AccountSwitcher } from "@/components/auth/AccountSwitcher";
import { HeaderNav } from "@/components/home/HeaderNav";

export const dynamic = "force-dynamic";

export const metadata = {
  metadataBase: new URL("https://xrovia.com"),
  title: {
    default: "XROVIA | Professional Digital Identity Platform",
    template: "%s | XROVIA",
  },
  description:
    "XROVIA is a permanent digital identity platform for individuals and organizations. Build, verify, and discover structured professional history.",
  applicationName: "XROVIA",
  keywords: [
    "XROVIA",
    "Xrovia",
    "XROVIA digital identity",
    "professional digital identity",
    "digital identity platform",
    "permanent professional ID",
    "verified professional record",
    "career portfolio",
    "organization verification",
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
    icon: [
      { url: "/favicon.png", type: "image/png", sizes: "96x96" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/favicon.png",
  },
  openGraph: {
    type: "website",
    url: "https://xrovia.com/",
    siteName: "XROVIA",
    title: "XROVIA | Professional Digital Identity Platform",
    description:
      "Create, manage, verify, and share your permanent digital identity with one unique Professional ID.",
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
    title: "XROVIA | Professional Digital Identity Platform",
    description:
      "Create, manage, verify, and share your permanent digital identity with one unique Professional ID.",
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
        <HeaderNav
          session={session}
          accountSwitcherSlot={
            session ? (
              <AccountSwitcher
                isAdmin={session.role === "ADMIN"}
                activeOrganizationId={session.organizationId}
              />
            ) : null
          }
          logoutButtonSlot={session ? <LogoutButton /> : null}
        />

        <main className="flex-1">{children}</main>

        <footer className="border-t border-slate-800 bg-slate-950 text-slate-400">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
            <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5 lg:gap-12">
              <div className="lg:col-span-2">
                <Link href="/" aria-label="XROVIA Home">
                  <Image
                    src="/ChatGPT Image Sep 27, 2026, 04_32_11 PM.png"
                    alt="XROVIA"
                    width={180}
                    height={48}
                    className="h-9 w-[180px] object-cover object-center"
                  />
                </Link>
                <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
                  XROVIA is the permanent digital identity platform connecting individuals, organizations, education, and professional discovery.
                </p>
                <div className="mt-6 flex items-center gap-3 text-xs font-semibold text-slate-400">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-800 bg-slate-900 px-3 py-1">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    Platform Active
                  </span>
                  <span>v1.0.0</span>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-200">Platform</h3>
                <ul className="mt-4 space-y-2.5 text-sm">
                  <li><Link href="/#how-it-works" className="transition hover:text-white">How It Works</Link></li>
                  <li><Link href="/#why-xrovia" className="transition hover:text-white">Why XROVIA</Link></li>
                  <li><Link href="/#search-id" className="transition hover:text-white">Identity Lookup</Link></li>
                  <li><Link href="/#for-organizations" className="transition hover:text-white">For Organizations</Link></li>
                </ul>
              </div>

              <div>
                <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-200">Access</h3>
                <ul className="mt-4 space-y-2.5 text-sm">
                  <li><Link href="/register" className="transition hover:text-white">Create Individual ID</Link></li>
                  <li><Link href="/organization/register" className="transition hover:text-white">Register Organization</Link></li>
                  <li><Link href="/login" className="transition hover:text-white">Sign In</Link></li>
                  <li><Link href="/organization/login" className="transition hover:text-white">Organization Sign In</Link></li>
                </ul>
              </div>

              <div>
                <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-200">Resources</h3>
                <ul className="mt-4 space-y-2.5 text-sm">
                  <li><Link href="/career/job-search" className="transition hover:text-white">Career Guides</Link></li>
                  <li><Link href="/professional-profile" className="transition hover:text-white">Digital Profiles</Link></li>
                  <li><Link href="/feedback" className="transition hover:text-white">Platform Feedback</Link></li>
                  <li><Link href="/about" className="transition hover:text-white">About XROVIA</Link></li>
                </ul>
              </div>
            </div>

            <div className="mt-12 flex flex-col items-center justify-between border-t border-slate-800/80 pt-8 text-xs text-slate-500 sm:flex-row">
              <p>© {new Date().getFullYear()} XROVIA. All rights reserved.</p>
              <p className="mt-2 sm:mt-0 text-slate-500">
                A new standard for permanent digital identity.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
