"use client";

import * as React from "react";
import { Modal } from "@/components/ui/modal";

interface ActionReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => Promise<void> | void;
  title: string;
  targetName: string;
}

export default function ActionReportModal({
  isOpen,
  onClose,
  onSubmit,
  title,
  targetName,
}: ActionReportModalProps) {
  const [reason, setReason] = React.useState("");

  // Clear reason when opening
  React.useEffect(() => {
    if (isOpen) {
      setReason("");
    }
  }, [isOpen]);

  const handleSubmit = () => {
    onSubmit(reason);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      showCloseButton={true}
      size="md"
    >
      <div className="font-sans text-left p-2 space-y-6">
        {/* Title */}
        <h3 className="text-xl font-bold text-slate-800 font-sans tracking-tight">
          {title}
        </h3>

        {/* Target Name Subtext */}
        <p className="text-sm text-[#6D6D6D]">
          Please provide a reason for performing this action on <span className="font-semibold text-slate-800">{targetName}</span>.
        </p>

        {/* Textarea */}
        <div className="flex flex-col">
          <label className="text-sm font-bold text-slate-700 mb-2 font-sans">
            Reason
          </label>
          <textarea
            placeholder="Enter here"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
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
