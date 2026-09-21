"use client";

import { useState } from "react";

interface AdminReportActionsProps {
  reportId: string;
}

export function AdminReportActions({
  reportId,
}: AdminReportActionsProps) {
  const [loading, setLoading] = useState(false);

  async function updateReport(status: "RESOLVED" | "DISMISSED") {
    setLoading(true);

    try {
      const response = await fetch("/api/admin/reports", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reportId,
          status,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update report");
      }

      window.location.reload();
    } catch (error) {
      console.error(error);
      alert("Could not update the report.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        disabled={loading}
        onClick={() => updateReport("RESOLVED")}
        className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 disabled:opacity-50"
      >
        Resolve
      </button>

      <button
        type="button"
        disabled={loading}
        onClick={() => updateReport("DISMISSED")}
        className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 disabled:opacity-50"
      >
        Dismiss
      </button>
    </div>
  );
}