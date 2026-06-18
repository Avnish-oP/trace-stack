"use client";

import React from "react";

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className = "" }: EmptyStateProps) {
  return (
    <div className={`glass-card p-10 flex flex-col items-center justify-center text-center animate-slide-up rounded-xl border border-[var(--color-border-subtle)] ${className}`}>
      {icon && (
        <div className="mb-5 text-gray-400 bg-white/5 p-4 rounded-full shadow-inner border border-white/5">
          {icon}
        </div>
      )}
      <h3 className="text-xl font-semibold text-white mb-2 tracking-tight">{title}</h3>
      {description && (
        <p className="text-gray-400 max-w-md mb-6 text-sm leading-relaxed">{description}</p>
      )}
      {action && (
        <div className="mt-2">
          {action}
        </div>
      )}
    </div>
  );
}
