import "./globals.css";
import React from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { getSession } from "../lib/auth/session";
import { LogoutButton } from "@/components/auth/LogoutButton";

// FORCE NEXT.JS TO CHECK COOKIES ON EVERY REQUEST
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
    "professional identity",
    "professional identity platform",
    "digital professional profile",
    "career profile",
    "professional profile",
    "verified professional profile",
    "digital identity",
    "career record",
    "professional ID",
    "XROVIA",
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
  openGraph: {
    type: "website",
    url: "https://xrovia.com/",
    siteName: "XROVIA",
    title: "XROVIA | Professional Identity Platform",
    description:
      "Create, manage, verify, and share your professional identity with one permanent Professional ID.",
    locale: "en_US",
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
        <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black tracking-wider">
                X
              </div>
              <span className="font-extrabold text-xl text-slate-900 tracking-tight">XROVIA</span>
            </Link>

            <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-600">
              <Link href="/#how-it-works" className="hover:text-blue-600 transition">How it works</Link>
              <Link href="/#benefits" className="hover:text-blue-600 transition">Benefits</Link>
              <Link href="/#search-id" className="hover:text-blue-600 transition flex items-center gap-1">
                <Search className="w-4 h-4" /> Search ID
              </Link>
            </nav>

            <div className="flex items-center space-x-3">
              {session ? (
                <>
                  <Link
                    href={session.role === "ADMIN" ? "/admin" : "/dashboard"}
                    className="inline-flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-800 transition shadow-sm"
                  >
                    {session.role === "ADMIN" ? "Admin Console" : "Dashboard"}
                  </Link>
                  <LogoutButton />
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-sm font-semibold text-slate-700 hover:text-slate-900 px-3 py-2"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition shadow-sm"
                  >
                    Create Professional ID
                  </Link>
                </>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center text-white font-bold text-xs">X</div>
                <span className="font-bold text-white text-base tracking-wider">XROVIA</span>
              </div>
              <p className="text-xs text-slate-400 mt-2">Your permanent professional identity and career record.</p>
            </div>
            <div className="flex gap-6 text-sm">
              <Link href="/#search-id" className="hover:text-white">Search ID</Link>
              <Link href="/#benefits" className="hover:text-white">Member Benefits</Link>
              <Link href="/admin" className="hover:text-white">Admin</Link>
              <Link href="/feedback" className="hover:text-white">Feedback</Link>
            </div>
            <p className="text-xs text-slate-500">© {new Date().getFullYear()} Xrovia Identity Inc. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
} 