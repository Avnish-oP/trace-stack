"use client";

import React, { HTMLAttributes, ThHTMLAttributes, TdHTMLAttributes } from "react";

export function Table({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`w-full overflow-auto rounded-xl border border-[var(--color-border-subtle)] bg-[#05050a]/40 ${className}`}>
      <table className="w-full text-sm text-left border-collapse">{children}</table>
    </div>
  );
}

export function TableHeader({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <thead className={`text-xs text-gray-400 uppercase sticky top-0 z-10 bg-[#0a0a0f]/80 backdrop-blur-md border-b border-[var(--color-border-subtle)] shadow-sm ${className}`}>
      {children}
    </thead>
  );
}

export function TableBody({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <tbody className={`divide-y divide-[var(--color-border-subtle)] ${className}`}>{children}</tbody>;
}

export function TableRow({ children, className = "", ...props }: HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr 
      className={`group even:bg-white/[0.015] odd:bg-transparent hover:bg-white/[0.04] transition-colors duration-200 ${props.onClick ? "cursor-pointer" : ""} ${className}`}
      {...props}
    >
      {children}
    </tr>
  );
}

export function TableHead({ children, className = "", ...props }: ThHTMLAttributes<HTMLTableCellElement>) {
  return <th className={`px-4 py-3.5 font-medium whitespace-nowrap ${className}`} {...props}>{children}</th>;
}

export function TableCell({ children, className = "", ...props }: TdHTMLAttributes<HTMLTableCellElement>) {
  return <td className={`px-4 py-3.5 text-gray-200 group-hover:text-white transition-colors duration-200 ${className}`} {...props}>{children}</td>;
}
