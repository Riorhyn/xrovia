"use client";

import React, { useState } from "react";
import { Flag, X, Check } from "lucide-react";

interface ReportModalProps {
  profileId: string;
  professionalId: string;
}

export const ReportModal: React.FC<ReportModalProps> = ({ profileId, professionalId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState("FAKE_INFORMATION");
  const [details, setDetails] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileId, reason, details }),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          setIsOpen(false);
        }, 2000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-rose-600 transition"
      >
        <Flag className="w-3.5 h-3.5" /> Report Profile
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl border border-slate-200">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Report Profile: {professionalId}</h3>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            {success ? (
              <div className="py-8 text-center text-emerald-600 text-sm font-semibold flex flex-col items-center gap-2">
                <Check className="w-8 h-8 bg-emerald-100 rounded-full p-1.5" />
                Report submitted for review.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Reason</label>
                  <select
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg"
                  >
                    <option value="FAKE_INFORMATION">Fake Information</option>
                    <option value="FAKE_IDENTITY">Fake Identity</option>
                    <option value="FAKE_EMPLOYMENT">Fake Employment</option>
                    <option value="FAKE_EDUCATION">Fake Education</option>
                    <option value="FRAUD_SCAM">Fraud / Scam</option>
                    <option value="INAPPROPRIATE_CONTENT">Inappropriate Content</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Details (Optional)</label>
                  <textarea
                    rows={3}
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg"
                    placeholder="Provide context or evidence..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-2 bg-rose-600 text-white rounded-lg text-xs font-semibold hover:bg-rose-700 transition"
                >
                  {submitting ? "Submitting..." : "Submit Report"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
};