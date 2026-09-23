"use client";

import { useState } from "react";
import Link from "next/link";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Invalid email or password.");
        return;
      }

      if (data.user?.role !== "ADMIN") {
        setError("This account does not have administrator access.");
        return;
      }

      window.location.href = "/admin";
    } catch {
      setError("Internal server error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-slate-900 text-white font-black text-xl mb-4">
            X
          </div>
          <p className="text-xs font-bold text-rose-600 uppercase tracking-widest">
            Restricted Access
          </p>
          <h1 className="text-3xl font-bold text-slate-900 mt-1">
            XROVIA Admin
          </h1>
          <p className="text-slate-500 mt-2">
            Sign in with an authorized administrator account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Admin email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@xrovia.com"
              required
              autoComplete="username"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg text-slate-900 outline-none focus:ring-2 focus:ring-slate-500"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-slate-700">
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-sm font-semibold text-blue-600 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              required
              autoComplete="current-password"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg text-slate-900 outline-none focus:ring-2 focus:ring-slate-500"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 text-white py-3 rounded-lg font-semibold hover:bg-slate-800 disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign in as Admin"}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          <Link href="/login" className="text-blue-600 font-semibold hover:underline">
            Back to professional login
          </Link>
        </p>
      </div>
    </div>
  );
}
