import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

export function SectionHeader({ eyebrow, title, description, dark = false }: { eyebrow: string; title: string; description?: string; dark?: boolean }) {
  return (
    <div className="max-w-3xl">
      <span className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.16em] ${dark ? "border-blue-400/20 bg-blue-400/10 text-blue-300" : "border-blue-100 bg-blue-50 text-blue-700"}`}>{eyebrow}</span>
      <h2 className={`mt-4 text-3xl font-extrabold tracking-[-0.03em] sm:text-4xl ${dark ? "text-white" : "text-slate-950"}`}>{title}</h2>
      {description && <p className={`mt-4 max-w-2xl text-base leading-7 sm:text-lg sm:leading-8 ${dark ? "text-slate-300" : "text-slate-600"}`}>{description}</p>}
    </div>
  );
}

export function IconBox({ children, dark = false, small = false }: { children: ReactNode; dark?: boolean; small?: boolean }) {
  return <span className={`grid shrink-0 place-items-center rounded-xl ${small ? "h-9 w-9" : "h-11 w-11"} ${dark ? "border border-white/10 bg-white/10 text-blue-300" : "border border-blue-100 bg-blue-50 text-blue-700"}`}>{children}</span>;
}

export function Surface({ children, className = "", dark = false }: { children: ReactNode; className?: string; dark?: boolean }) {
  return <div className={`group rounded-3xl border p-6 transition-all duration-300 ${dark ? "border-white/10 bg-white/[0.06] hover:-translate-y-1 hover:border-blue-300/30 hover:bg-white/[0.08] hover:shadow-[0_16px_50px_rgba(15,23,42,0.28)]" : "border-slate-200 bg-white shadow-sm hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_18px_45px_rgba(15,23,42,0.08)]"} ${className}`}>{children}</div>;
}

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>;
}

type Variant = "primary" | "secondary" | "inverse" | "outlineInverse";

const BASE = "inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border font-bold transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-[0.98]";

const VARIANTS: Record<Variant, string> = {
  primary: "border-blue-600 bg-blue-600 px-5 text-white shadow-lg shadow-blue-600/20 hover:-translate-y-0.5 hover:border-blue-700 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/25 focus-visible:outline-blue-600",
  secondary: "border-slate-200 bg-white px-5 text-slate-800 shadow-sm hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50/40 hover:shadow-md focus-visible:outline-blue-600",
  inverse: "border-white bg-white px-5 text-slate-950 shadow-lg hover:-translate-y-0.5 hover:bg-slate-100 hover:shadow-xl focus-visible:outline-white",
  outlineInverse: "border-white/25 bg-white/5 px-5 text-white hover:-translate-y-0.5 hover:border-white/50 hover:bg-white/10 focus-visible:outline-white",
};

const SIZES = { sm: "px-4 text-sm", md: "px-5 text-sm sm:text-base" } as const;

export function Button({ variant = "primary", size = "md", className = "", ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: keyof typeof SIZES }) {
  return <button {...props} className={`${BASE} ${VARIANTS[variant]} ${SIZES[size]} ${className}`} />;
}

type ButtonLinkProps = ComponentProps<typeof Link> & { variant?: Variant; size?: keyof typeof SIZES };

export function ButtonLink({ variant = "primary", size = "md", className = "", ...props }: ButtonLinkProps) {
  return <Link {...props} className={`${BASE} ${VARIANTS[variant]} ${SIZES[size]} ${className}`} />;
}
