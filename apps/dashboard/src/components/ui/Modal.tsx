"use client";

import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      if (!dialog.open) {
        dialog.showModal();
      }
      document.body.style.overflow = "hidden";
    } else {
      if (dialog.open) {
        dialog.close();
      }
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) {
      onClose();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={handleBackdropClick}
      className="backdrop:bg-black/60 backdrop:backdrop-blur-sm backdrop:animate-fade-in bg-transparent p-0 m-auto w-full max-w-lg open:animate-slide-up"
    >
      <div className="relative w-full p-6 glass-card rounded-2xl border border-[var(--color-border-subtle)] shadow-2xl text-left">
        <div className="flex items-center justify-between mb-5 pb-4 border-b border-[var(--color-border-subtle)]">
          <h2 className="text-xl font-semibold text-white tracking-tight">{title}</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1.5 rounded-md hover:bg-white/10 active:scale-95"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="text-gray-300">
          {children}
        </div>
      </div>
    </dialog>
  );
}
