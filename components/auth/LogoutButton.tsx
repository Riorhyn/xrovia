"use client";

import React, { useState } from "react";
import { LogOut } from "lucide-react";
import { logoutAction } from "@/app/actions/auth";

export function LogoutButton() {
  const [isPending, setIsPending] = useState(false);

  const handleLogout = async () => {
    setIsPending(true);
    
    // 1. Clear client storage
    localStorage.clear();
    sessionStorage.clear();
    window.dispatchEvent(new Event("profile_updated"));

    // 2. Invoke server action to delete cookie
    try {
      await logoutAction();
    } catch (error) {
      console.error("Logout action error:", error);
    }

    // 3. Force a hard browser reload to clear Next.js layout cache
    window.location.href = "/";
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isPending}
      className="inline-flex items-center gap-1.5 border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 px-3 py-2 rounded-lg text-sm font-semibold transition cursor-pointer disabled:opacity-50"
      title="Log Out"
    >
      <LogOut className="w-4 h-4 text-red-600" />
      {isPending ? "Logging out..." : "Log Out"}
    </button>
  );
}
