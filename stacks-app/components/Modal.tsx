"use client";

import { ReactNode, useEffect } from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  size?: "full" | "large" | "medium" | "small";
  showCloseButton?: boolean;
  closeOnBackdrop?: boolean;
  closeOnEsc?: boolean;
}

export default function Modal({
  isOpen,
  onClose,
  children,
  title,
  size = "medium",
  showCloseButton = true,
  closeOnBackdrop = true,
  closeOnEsc = true,
}: ModalProps) {
  // Handle ESC key
  useEffect(() => {
    if (!isOpen || !closeOnEsc) return;

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, closeOnEsc, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    full: "w-full h-full rounded-none",
    large: "w-[90vw] max-w-4xl max-h-[90vh]",
    medium: "w-[90vw] max-w-2xl max-h-[80vh]",
    small: "w-[90vw] max-w-md max-h-[70vh]",
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={closeOnBackdrop ? onClose : undefined}
        aria-hidden="true"
      />

      {/* Modal Content */}
      <div
        className={`relative bg-light-secondary dark:bg-dark-secondary border-[5px] border-light-border dark:border-dark-border shadow-brutal rounded-[20px] overflow-hidden flex flex-col ${sizeClasses[size]}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between px-6 py-4 border-b-[5px] border-light-border dark:border-dark-border bg-light-primary dark:bg-dark-primary">
            {title && (
              <h2
                id="modal-title"
                className="font-black text-xl uppercase tracking-tight text-light-text dark:text-dark-text"
              >
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="ml-auto w-10 h-10 flex items-center justify-center border-[3px] border-light-border dark:border-dark-border bg-light-secondary dark:bg-dark-secondary rounded-xl shadow-brutal-sm hover:shadow-brutal transition-all hover:-translate-x-[2px] hover:-translate-y-[2px]"
                aria-label="Close modal"
              >
                <X className="w-5 h-5 stroke-[3] text-light-text dark:text-dark-text" />
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {children}
        </div>
      </div>
    </div>
  );
}
