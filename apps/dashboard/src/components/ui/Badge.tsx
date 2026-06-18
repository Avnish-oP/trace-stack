"use client";

import React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "primary" | "secondary" | "success" | "warning" | "error" | "outline";
  active?: boolean;
  showDot?: boolean;
}

export function Badge({ children, className = "", variant = "default", active = false, showDot = false, ...props }: BadgeProps) {
  const variants = {
    default: "bg-gray-800/80 text-gray-200 border border-gray-700",
    primary: "bg-[var(--color-brand-primary)]/15 text-[var(--color-brand-primary)] border border-[var(--color-brand-primary)]/40",
    secondary: "bg-[var(--color-brand-secondary)]/15 text-[#00E5E0] border border-[var(--color-brand-secondary)]/40",
    success: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/40",
    warning: "bg-yellow-500/15 text-yellow-400 border border-yellow-500/40",
    error: "bg-[var(--color-brand-error)]/15 text-[#FF9EBF] border border-[var(--color-brand-error)]/40",
    outline: "bg-transparent text-gray-300 border border-[var(--color-border-subtle)]",
  };

  const dotColors = {
    default: "bg-gray-400",
    primary: "bg-[var(--color-brand-primary)]",
    secondary: "bg-[#00E5E0]",
    success: "bg-emerald-400",
    warning: "bg-yellow-400",
    error: "bg-[#FF9EBF]",
    outline: "bg-gray-400",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium tracking-wide transition-colors ${variants[variant]} ${active ? "animate-pulse-glow" : ""} ${className}`}
      {...props}
    >
      {showDot && (
        <span className={`mr-1.5 h-1.5 w-1.5 rounded-full ${dotColors[variant]} ${active ? "animate-pulse" : ""}`} aria-hidden="true" />
      )}
      {children}
    </span>
  );
}
