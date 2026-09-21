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
  "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";

const VARIANTS: Record<Variant, string> = {
  primary: "bg-blue-700 text-white hover:bg-blue-800 focus-visible:outline-blue-700",
  secondary:
    "border border-slate-300 bg-white text-slate-900 hover:bg-slate-50 focus-visible:outline-blue-700",
  inverse: "bg-white text-slate-900 hover:bg-slate-100 focus-visible:outline-white",
  outlineInverse:
    "border border-white/40 text-white hover:bg-white/10 focus-visible:outline-white",
};

const SIZES = {
  sm: "px-4 py-2 text-sm",
  md: "px-5 py-3 text-base",
} as const;

type ButtonLinkProps = ComponentProps<typeof Link> & {
  variant?: Variant;
  size?: keyof typeof SIZES;
};

/** A real <a> link styled as a button. Every button on the page navigates somewhere. */
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