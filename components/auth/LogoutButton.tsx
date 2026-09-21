"use client";

import React, { useTransition } from "react";
import { LogOut } from "lucide-react";
import { logoutAction } from "@/app/actions/auth";

export function LogoutButton() {
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    // 1. Clear client storage
    localStorage.clear();
    sessionStorage.clear();
    window.dispatchEvent(new Event("profile_updated"));

    // 2. Invoke server action to delete cookie & redirect
    startTransition(async () => {
      await logoutAction();
    });
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