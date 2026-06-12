"use client";

import * as React from "react";
import { FaX } from "react-icons/fa6";

interface ModalProps {
  isOpen: boolean;
  onClose?: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  showCloseButton?: boolean;
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  className = "",
  size = "md",
  showCloseButton = true,
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
      className="fixed inset-0 z-50 flex items-center justify-center p-0 m-auto bg-transparent border-none outline-none backdrop:bg-black/30 backdrop:backdrop-blur-sm w-screen h-screen max-w-none max-h-none"
    >
      <div
        className={`
          relative w-full overflow-hidden rounded-2xl bg-white border border-border p-6 shadow-2xl transition-all duration-200 ease-out animate-in fade-in zoom-in-95
          ${sizeClasses[size]}
          ${className}
        `}
      >
        {/* Close Button - Absolutely positioned in the top-right */}
        {onClose && showCloseButton && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 rounded-full p-1.5 text-[#6D6D6D]/60 hover:text-[#6D6D6D] hover:bg-black/5 transition-colors focus:outline-none focus:ring-2 focus:ring-ring z-10 cursor-pointer"
            aria-label="Close modal"
          >
            <FaX/>
          </button>
        )}

        {/* Header - Only render if title is provided */}
        {title && (
          <div className="border-b border-border pb-4 mb-4 pr-8">
            <h2 className="text-xl font-semibold text-[#6D6D6D] tracking-tight">
              {title}
            </h2>
          </div>
        )}

        {/* Content */}
        <div className="text-foreground/80 leading-relaxed font-sans text-base">{children}</div>
      </div>
    </dialog>
  );
}
