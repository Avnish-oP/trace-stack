"use client";

import React from "react";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "card" | "table-row" | "circular";
  className?: string;
}

export function Skeleton({ variant = "text", className = "", ...props }: SkeletonProps) {
  const baseClasses = "bg-white/5 relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent";

  const variants = {
    text: "h-4 w-full rounded-md",
    card: "h-32 w-full rounded-xl glass-card border border-[var(--color-border-subtle)]",
    "table-row": "h-12 w-full rounded-md",
    circular: "h-12 w-12 rounded-full",
  };

  return (
    <div 
      className={`${baseClasses} ${variants[variant]} ${className}`} 
      {...props} 
    />
  );
}
