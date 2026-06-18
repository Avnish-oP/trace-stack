"use client";

import React, { forwardRef, useState } from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", label, error, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    
    return (
      <div className="w-full relative">
        <style>{`
          @keyframes input-shake {
            0%, 100% { transform: translateX(0); }
            20%, 60% { transform: translateX(-4px); }
            40%, 80% { transform: translateX(4px); }
          }
          .animate-input-shake {
            animation: input-shake 0.4s ease-in-out;
          }
        `}</style>
        {label && (
          <label 
            className={`block text-sm font-medium mb-1.5 transition-colors duration-200 ${
              error ? 'text-[var(--color-brand-error)]' : isFocused ? 'text-[var(--color-brand-primary)]' : 'text-gray-300'
            }`}
          >
            {label}
          </label>
        )}
        <div className="relative group">
          {/* Animated Gradient Sweep on Focus */}
          <div className={`absolute -inset-[1px] rounded-md bg-gradient-to-r from-[var(--color-brand-primary)] to-[var(--color-brand-primary-dark)] opacity-0 transition-opacity duration-300 ${isFocused && !error ? 'opacity-100 blur-[2px]' : ''}`}></div>
          
          <input
            ref={ref}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            className={`relative w-full bg-[#0a0a0f] border border-[var(--color-border-subtle)] rounded-md px-3.5 py-2.5 text-white placeholder-gray-500 focus:outline-none transition-all duration-200 ${
              error 
                ? "border-[var(--color-brand-error)] focus:border-[var(--color-brand-error)] focus:ring-1 focus:ring-[var(--color-brand-error)] animate-input-shake shadow-[0_0_10px_rgba(253,121,168,0.2)]" 
                : "focus:border-[var(--color-brand-primary)]"
            } ${className}`}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-1.5 text-sm text-[var(--color-brand-error)] animate-fade-in font-medium">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
