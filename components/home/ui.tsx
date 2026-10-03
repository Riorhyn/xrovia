import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

export function SectionHeader({ eyebrow, title, description, dark = false }: { eyebrow: string; title: string; description?: string; dark?: boolean }) {
  return <div className="max-w-3xl">
    <span className={`text-xs font-bold uppercase tracking-[0.16em] ${dark ? "text-blue-300" : "text-blue-700"}`}>{eyebrow}</span>
    <h2 className={`mt-2 text-3xl font-extrabold tracking-[-0.025em] sm:text-4xl ${dark ? "text-white" : "text-slate-950"}`}>{title}</h2>
    {description && <p className={`mt-5 text-lg leading-8 ${dark ? "text-slate-300" : "text-slate-600"}`}>{description}</p>}
  </div>;
}

export function IconBox({ children, dark = false, small = false }: { children: ReactNode; dark?: boolean; small?: boolean }) {
  return <span className={`grid shrink-0 place-items-center rounded-xl ${small ? "h-9 w-9" : "h-10 w-10"} ${dark ? "bg-white/10 text-blue-300" : "bg-blue-50 text-blue-700 ring-1 ring-blue-100"}`}>{children}</span>;
}

export function Surface({ children, className = "", dark = false }: { children: ReactNode; className?: string; dark?: boolean }) {
  return <div className={`rounded-2xl border p-6 ${dark ? "border-white/10 bg-white/[0.06]" : "border-slate-200 bg-white shadow-sm"} ${className}`}>{children}</div>;
}

export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  );
}

type Variant = "primary" | "secondary" | "inverse" | "outlineInverse";

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-[0.98]";

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-blue-600 text-white shadow-sm shadow-blue-600/20 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-md hover:shadow-blue-600/20 focus-visible:outline-blue-600",
  secondary:
    "border border-slate-200 bg-white text-slate-800 shadow-sm hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 hover:shadow-md focus-visible:outline-blue-600",
  inverse:
    "bg-white text-slate-900 shadow-sm hover:-translate-y-0.5 hover:bg-slate-100 hover:shadow-md focus-visible:outline-white",
  outlineInverse:
    "border border-white/30 bg-white/5 text-white hover:bg-white/10 hover:border-white/50 focus-visible:outline-white",
};

export function Button({ variant = "primary", size = "md", className = "", ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: keyof typeof SIZES }) {
  return <button {...props} className={`${BASE} ${VARIANTS[variant]} ${SIZES[size]} ${className}`} />;
}

const SIZES = {
  sm: "px-4 py-2 text-sm",
  md: "px-5 py-3 text-base",
} as const;

type ButtonLinkProps = ComponentProps<typeof Link> & {
  variant?: Variant;
  size?: keyof typeof SIZES;
};

export function ButtonLink({
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      {...props}
      className={`${BASE} ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
    />
  );
}