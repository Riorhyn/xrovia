import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

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