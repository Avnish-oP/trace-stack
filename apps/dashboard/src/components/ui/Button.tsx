"use client";

import React, { forwardRef } from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "danger" | "ghost" | "icon";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className = "", variant = "primary", size = "md", isLoading, disabled, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium rounded-md transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-primary)] disabled:opacity-50 disabled:cursor-not-allowed active:scale-95";

    const variants = {
      primary:
        "bg-gradient-to-r from-[var(--color-brand-primary)] to-[var(--color-brand-primary-dark)] text-white shadow-[0_0_15px_rgba(108,92,231,0.3)] hover:shadow-[0_0_25px_rgba(108,92,231,0.6)] hover:animate-shimmer bg-[length:200%_auto]",
      secondary: "bg-[var(--color-brand-secondary)] hover:opacity-90 text-[#05050a]",
      outline:
        "bg-transparent border border-[var(--color-border-subtle)] hover:border-[var(--color-brand-primary)] hover:bg-[var(--color-bg-surface-hover)] text-gray-200 hover:text-white",
      danger:
        "bg-[var(--color-brand-error)] hover:opacity-90 text-white shadow-[0_0_15px_rgba(253,121,168,0.3)] hover:shadow-[0_0_25px_rgba(253,121,168,0.5)]",
      ghost: "bg-transparent hover:bg-[var(--color-bg-surface-hover)] text-gray-300 hover:text-white",
      icon: "bg-transparent hover:bg-white/10 text-gray-300 hover:text-white rounded-full",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2.5 text-sm",
      lg: "px-6 py-3 text-base",
      icon: "h-10 w-10 p-2 flex items-center justify-center",
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
