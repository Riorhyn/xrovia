import React from "react";

interface BadgeProps {
  status?: "USER_PROVIDED" | "PENDING" | "VERIFIED" | "REJECTED";
  label?: string;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  status = "USER_PROVIDED",
  label,
  className = "",
}) => {
  if (status === "VERIFIED") {
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 ${className}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        {label || "Verified"}
      </span>
    );
  }

  if (status === "PENDING") {
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 ${className}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
        {label || "Pending Verification"}
      </span>
    );
  }

  // Default: USER_PROVIDED (Yellow indicator as requested)
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200 ${className}`}>
      <span className="text-[11px]">🟡</span>
      <span>{label || "User-provided"}</span>
    </span>
  );
};