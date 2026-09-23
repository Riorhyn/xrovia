"use client";

import { useState } from "react";

interface AdminUserActionsProps {
  userId: string;
  isCurrentAdmin: boolean;
  isAdmin: boolean;
}

export function AdminUserActions({
  userId,
  isCurrentAdmin,
  isAdmin,
}: AdminUserActionsProps) {
  const [loading, setLoading] = useState(false);

  async function deleteUser() {
    const confirmed = window.confirm(
      "Delete this XROVIA account permanently? This removes the account and its associated profile data and cannot be undone."
    );

    if (!confirmed) return;

    setLoading(true);

    try {
      const response = await fetch("/api/admin/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not delete the account.");
      }

      window.location.reload();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Could not delete the account.");
    } finally {
      setLoading(false);
    }
  }

  if (isCurrentAdmin) {
    return (
      <span className="text-xs font-semibold text-slate-400">
        Current admin
      </span>
    );
  }

  return (
    <button
      type="button"
      disabled={loading}
      onClick={deleteUser}
      className="inline-flex items-center justify-center rounded-lg bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 border border-rose-200 hover:bg-rose-100 disabled:opacity-50"
    >
      {loading ? "Deleting..." : isAdmin ? "Delete admin" : "Delete"}
    </button>
  );
}
