"use client";

import * as React from "react";
import { Modal } from "@/components/ui/modal";

interface ResolveReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (resolutionNote: string) => Promise<void> | void;
}

export default function ResolveReportModal({
  isOpen,
  onClose,
  onSubmit,
}: ResolveReportModalProps) {
  const [note, setNote] = React.useState("");

  // Clear note when opening
  React.useEffect(() => {
    if (isOpen) {
      setNote("");
    }
  }, [isOpen]);

  const handleSubmit = () => {
    onSubmit(note);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      showCloseButton={false}
      size="md"
    >
      <div className="font-sans text-left p-2 space-y-6">
        {/* Title */}
        <h3 className="text-xl font-bold text-slate-800 font-sans tracking-tight">
          Resolve
        </h3>

        {/* Textarea */}
        <div className="flex flex-col">
          <textarea
            placeholder="Enter here"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full bg-white border border-[#E2E8F0] rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0da34c] transition-all h-32 resize-none font-sans"
          />
        </div>

        {/* Buttons (outlined Cancel vs solid green Submit) */}
        <div className="flex gap-4 justify-between pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 border border-[#0da34c] text-[#0da34c] hover:bg-[#e8f5e9]/30 rounded-xl py-2.5 text-sm font-bold transition-all h-11 cursor-pointer font-sans bg-white"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="flex-1 bg-[#0da34c] hover:bg-[#0da34c]/95 text-white rounded-xl py-2.5 text-sm font-bold transition-all h-11 cursor-pointer shadow-sm font-sans"
          >
            Submit
          </button>
        </div>
      </div>
    </Modal>
  );
}
