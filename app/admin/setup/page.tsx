"use client";

import { useState } from "react";
import Link from "next/link";

export default function AdminSetupPage() {
  const [email, setEmail] = useState("");
  const [secret, setSecret] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/admin/bootstrap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, secret }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Unable to promote account.");
        return;
      }

      setMessage(data.message);
      setEmail("");
      setSecret("");
    } catch {
      setError("Internal server error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8">
        <p className="text-xs font-bold text-rose-600 uppercase tracking-widest">
          One-Time Setup
        </p>
        <h1 className="text-3xl font-bold text-slate-900 mt-1">Create Admin Access</h1>
        <p className="text-sm text-slate-500 mt-3">
          Promote your existing XROVIA account to administrator. This setup works only
          while no administrator account exists.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5 mt-8">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Existing account email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg text-slate-900 outline-none focus:ring-2 focus:ring-slate-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Bootstrap secret
            </label>
            <input
              type="password"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              required
              autoComplete="off"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg text-slate-900 outline-none focus:ring-2 focus:ring-slate-500"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">{error}</p>
          )}

          {message && (
            <p className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg p-3">{message}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 text-white py-3 rounded-lg font-semibold hover:bg-slate-800 disabled:opacity-50"
          >
            {loading ? "Setting up..." : "Make This Account Admin"}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          <Link href="/login" className="text-blue-600 font-semibold hover:underline">
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
}
