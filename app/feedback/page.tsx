"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Bug, Lightbulb, Rocket, MessageSquare, Paperclip, CheckCircle2, X, Upload } from "lucide-react";

const choices = [
  { id: "PROBLEM", label: "Report a problem", icon: Bug, text: "Something isn't working" },
  { id: "IDEA", label: "Suggest an idea", icon: Lightbulb, text: "Something you'd like to see" },
  { id: "FEATURE", label: "Request a feature", icon: Rocket, text: "Something we should add" },
  { id: "FEEDBACK", label: "Share feedback", icon: MessageSquare, text: "Tell us what you think" },
];

const accepted = ".jpg,.jpeg,.png,.webp,.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt";

export default function FeedbackPage() {
  const [type, setType] = useState("PROBLEM");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [error, setError] = useState("");

  const addFiles = (selected: FileList | null) => {
    if (!selected) return;
    setError("");
    const next = [...files];
    for (const file of Array.from(selected)) {
      if (next.length >= 5) break;
      if (file.size > 10 * 1024 * 1024) {
        setError("Each attachment must be 10 MB or smaller.");
        continue;
      }
      if (!next.some((item) => item.name === file.name && item.size === file.size)) next.push(file);
    }
    setFiles(next);
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus("sending");
    setError("");
    try {
      const body = new FormData();
      body.append("type", type);
      body.append("message", message);
      body.append("email", email);
      body.append("pageUrl", window.location.href);
      files.forEach((file) => body.append("files", file));

      const res = await fetch("/api/feedback", { method: "POST", body });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unable to submit feedback.");
      setStatus("success");
      setMessage("");
      setEmail("");
      setFiles([]);
    } catch (err: any) {
      setError(err?.message || "Unable to submit feedback.");
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-2xl">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h1 className="mt-5 text-2xl font-black text-slate-900">Thanks for helping build XROVIA.</h1>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-500">
              Your feedback has been received. Suggestions, reports and ideas from early users help us improve the platform.
            </p>
            <div className="mt-7 flex justify-center gap-3">
              <Link href="/" className="rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-blue-700">Back to XROVIA</Link>
              <button onClick={() => setStatus("idle")} className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50">Send another</button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-blue-600">
          <ArrowLeft className="h-4 w-4" /> Back to XROVIA
        </Link>

        <section className="mt-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="max-w-2xl">
            <span className="inline-flex rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-blue-700">Early feedback</span>
            <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Help us build XROVIA</h1>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              XROVIA is new, and we want to build it with the people who use it. Found a problem, have an idea, or want something added? Tell us.
            </p>
          </div>

          <form onSubmit={submit} className="mt-8 space-y-6">
            <div>
              <label className="text-sm font-bold text-slate-900">What would you like to tell us?</label>
              <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {choices.map((choice) => {
                  const Icon = choice.icon;
                  const active = type === choice.id;
                  return (
                    <button key={choice.id} type="button" onClick={() => setType(choice.id)}
                      className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-left transition ${active ? "border-blue-300 bg-blue-50 text-blue-900" : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"}`}>
                      <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${active ? "bg-white text-blue-600" : "bg-slate-100 text-slate-500"}`}><Icon className="h-4 w-4" /></span>
                      <span><span className="block text-xs font-extrabold">{choice.label}</span><span className="mt-0.5 block text-[11px] text-slate-500">{choice.text}</span></span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label htmlFor="message" className="text-sm font-bold text-slate-900">Describe it</label>
              <textarea id="message" required minLength={5} maxLength={5000} value={message} onChange={(e) => setMessage(e.target.value)}
                placeholder={type === "PROBLEM" ? "Tell us what happened, what you expected, and what you saw..." : "Tell us what you would like XROVIA to do..."}
                className="mt-3 min-h-36 w-full resize-y rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-50" />
            </div>

            <div>
              <label className="text-sm font-bold text-slate-900">Add attachments <span className="font-normal text-slate-400">(optional)</span></label>
              <div className="mt-3 rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 p-5">
                <label className="flex cursor-pointer flex-col items-center justify-center text-center">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm border border-slate-200"><Upload className="h-5 w-5" /></span>
                  <span className="mt-3 text-xs font-bold text-slate-700">Upload screenshots, images, PDFs or documents</span>
                  <span className="mt-1 text-[11px] text-slate-500">Up to 5 files • 10 MB each</span>
                  <input type="file" multiple accept={accepted} className="hidden" onChange={(e) => addFiles(e.target.files)} />
                </label>
                {files.length > 0 && (
                  <div className="mt-4 grid gap-2 sm:grid-cols-2">
                    {files.map((file, index) => (
                      <div key={`${file.name}-${index}`} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2">
                        <Paperclip className="h-4 w-4 shrink-0 text-blue-600" />
                        <span className="min-w-0 flex-1 truncate text-[11px] font-semibold text-slate-700">{file.name}</span>
                        <button type="button" onClick={() => setFiles(files.filter((_, i) => i !== index))} className="text-slate-400 hover:text-red-500"><X className="h-4 w-4" /></button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <p className="mt-2 text-[10px] text-slate-400">Images, PDF, Word, PowerPoint, Excel and TXT are supported.</p>
            </div>

            <div>
              <label htmlFor="email" className="text-sm font-bold text-slate-900">Your email <span className="font-normal text-slate-400">(optional)</span></label>
              <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Leave your email if you'd like us to contact you"
                className="mt-3 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-50" />
            </div>

            {error && <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-semibold text-red-700">{error}</p>}

            <button type="submit" disabled={status === "sending"} className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-xs font-black text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">
              {status === "sending" ? "Sending..." : "Send feedback"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
