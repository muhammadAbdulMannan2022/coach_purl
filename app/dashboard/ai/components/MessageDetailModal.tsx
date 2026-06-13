"use client";

import * as React from "react";
import { Modal } from "@/components/ui/modal";

interface MessageDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
}

export default function MessageDetailModal({
  isOpen,
  onClose,
  message,
}: MessageDetailModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Messages"
      size="md"
      showCloseButton={true}
    >
      <div className="font-sans text-left p-2 space-y-6">
        <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
          {message}
        </p>
        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full bg-[#0da34c] hover:bg-[#0da34c]/95 text-white rounded-xl py-2.5 text-sm font-bold transition-all h-11 cursor-pointer shadow-sm font-sans"
          >
            Done
          </button>
        </div>
      </div>
    </Modal>
  );
}
