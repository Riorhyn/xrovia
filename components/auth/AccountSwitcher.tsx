"use client";

import { useEffect, useRef, useState } from "react";
import { Building2, ChevronDown, ShieldCheck, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";

type OrganizationContext = {
  id: string;
  name: string;
  slug: string;
  status: string;
  role: "OWNER" | "ADMIN" | "VERIFIER" | "REVIEWER";
};

type ContextResponse = {
  personal: { email: string };
  organizations: OrganizationContext[];
};

export function AccountSwitcher({
  isAdmin,
  activeOrganizationId,
}: {
  isAdmin: boolean;
  activeOrganizationId?: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<ContextResponse | null>(null);
  const [switching, setSwitching] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/account/contexts", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((value) => value && setData(value))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const activeOrganization = data?.organizations.find((org) => org.id === activeOrganizationId);
  const label = activeOrganization ? activeOrganization.name : "Personal Account";

  async function switchContext(type: "PERSONAL" | "ORGANIZATION", organizationId?: string) {
    setSwitching(true);
    try {
      const res = await fetch("/api/account/switch-context", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, organizationId }),
      });
      if (!res.ok) return;
      setOpen(false);
      router.push(type === "PERSONAL" ? "/dashboard" : "/organization");
      router.refresh();
    } finally {
      setSwitching(false);
    }
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        disabled={switching}
        className="inline-flex max-w-[230px] items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-bold text-slate-800 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 disabled:opacity-60"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {activeOrganization ? (
          <Building2 className="h-4 w-4 shrink-0 text-blue-600" />
        ) : (
          <UserRound className="h-4 w-4 shrink-0 text-slate-600" />
        )}
        <span className="truncate">{label}</span>
        <ChevronDown className="h-4 w-4 shrink-0 text-slate-400" />
      </button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+8px)] z-50 w-80 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
          <button
            type="button"
            onClick={() => switchContext("PERSONAL")}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-slate-50"
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-700">
              <UserRound className="h-4 w-4" />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-bold text-slate-900">Personal Account</span>
              <span className="block truncate text-xs text-slate-500">{data?.personal.email || "Your professional identity"}</span>
            </span>
          </button>

          {isAdmin && (
            <a
              href="/admin"
              onClick={() => setOpen(false)}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-blue-50"
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-700">
                <ShieldCheck className="h-4 w-4" />
              </span>
              <span>
                <span className="block text-sm font-bold text-slate-900">Admin Console</span>
                <span className="block text-xs text-slate-500">XROVIA platform administration</span>
              </span>
            </a>
          )}

          <div className="my-2 border-t border-slate-100" />
          <div className="px-3 pb-1 pt-1 text-[10px] font-black uppercase tracking-wider text-slate-400">
            Organizations
          </div>

          {data?.organizations.length ? (
            data.organizations.map((org) => (
              <button
                key={org.id}
                type="button"
                onClick={() => switchContext("ORGANIZATION", org.id)}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-slate-50"
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-700">
                  <Building2 className="h-4 w-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-bold text-slate-900">{org.name}</span>
                  <span className="block text-xs text-slate-500">
                    {org.role} · {org.status === "VERIFIED" ? "Verified" : "Pending"}
                  </span>
                </span>
              </button>
            ))
          ) : (
            <p className="px-3 py-3 text-xs text-slate-500">No organization memberships.</p>
          )}
        </div>
      )}
    </div>
  );
}
