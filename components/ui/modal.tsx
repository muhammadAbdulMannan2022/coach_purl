"use client";

import * as React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose?: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  className = "",
  size = "md",
}: ModalProps) {
  const dialogRef = React.useRef<HTMLDialogElement>(null);

  React.useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      if (!dialog.open) {
        dialog.showModal();
        // Prevent body scrolling
        document.body.style.overflow = "hidden";
      }
    } else {
      if (dialog.open) {
        dialog.close();
        document.body.style.overflow = "";
      }
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Handle ESC key press
  React.useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || !onClose) return;

    const handleCancel = (e: Event) => {
      e.preventDefault();
      onClose();
    };

    dialog.addEventListener("cancel", handleCancel);
    return () => {
      dialog.removeEventListener("cancel", handleCancel);
    };
  }, [onClose]);

  // Close when clicking backdrop
  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current && onClose) {
      onClose();
    }
  };


  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-2xl",
    full: "max-w-full h-full rounded-none",
  };

  if (!isOpen) return null;

  return (
    <dialog
      ref={dialogRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-transparent outline-none backdrop:bg-black/30 backdrop:backdrop-blur-sm"
    >
      <div
        className={`
          relative w-full overflow-hidden rounded-2xl bg-white border border-border p-6 shadow-2xl transition-all duration-200 ease-out animate-in fade-in zoom-in-95
          ${sizeClasses[size]}
          ${className}
        `}
      >
        {/* Header */}
        {(title || onClose) && (
          <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
            {title && (
              <h2 className="text-xl font-semibold text-foreground tracking-tight">
                {title}
              </h2>
            )}
            {onClose && (
              <button
                onClick={onClose}
                className="rounded-full p-1.5 text-foreground/60 hover:text-foreground hover:bg-black/5 transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
                aria-label="Close modal"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="text-foreground/80 leading-relaxed font-sans text-base">{children}</div>
      </div>
    </dialog>
  );
}
