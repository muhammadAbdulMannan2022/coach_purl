"use client";

import * as React from "react";
import { Modal } from "@/components/ui/modal";

interface PayoutModalsProps {
  isOpen: boolean;
  type: "accept" | "reject" | "hold" | "cancel" | "cancel_by_stripe" | null;
  defaultAmount: string;
  onClose: () => void;
  onSubmit: (amount: string, noteOrReason: string) => Promise<void> | void;
}

export default function PayoutModals({
  isOpen,
  type,
  defaultAmount,
  onClose,
  onSubmit,
}: PayoutModalsProps) {
  const [amount, setAmount] = React.useState("");
  const [note, setNote] = React.useState("");

  // Sync inputs on open/change
  React.useEffect(() => {
    if (isOpen) {
      setAmount(defaultAmount || "");
      setNote("");
    }
  }, [isOpen, defaultAmount, type]);

  if (!type) return null;

  const handleConfirm = () => {
    onSubmit(amount, note);
  };

  const getTitle = () => {
    switch (type) {
      case "accept":
        return "Please confirm Payment";
      case "reject":
        return "Reject Payout";
      case "hold":
        return "Hold Payout";
      case "cancel":
        return "Cancel";
      case "cancel_by_stripe":
        return "Cancel by Stripe";
      default:
        return "";
    }
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
          {getTitle()}
        </h3>

        {/* Form Fields */}
        {type === "accept" ? (
          <div className="space-y-4">
            <div className="flex flex-col">
              <label className="text-[13px] font-medium text-slate-500 mb-2 font-sans">
                Check the payment
              </label>
              <input
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-white border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-[15px] font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0da34c] transition-all h-11"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-[13px] font-medium text-slate-500 mb-2 font-sans">
                Note (if needed)
              </label>
              <textarea
                placeholder="Enter here"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full bg-white border border-[#E2E8F0] rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0da34c] transition-all h-28 resize-none font-sans"
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-col">
            <label className="text-[13px] font-medium text-slate-500 mb-2 font-sans">
              Reason
            </label>
            <textarea
              placeholder="Enter here"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full bg-white border border-[#E2E8F0] rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0da34c] transition-all h-32 resize-none font-sans"
            />
          </div>
        )}

        {/* Buttons (No bottom border, side-by-side flex-1 styled as outlined & solid green) */}
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
            onClick={handleConfirm}
            className="flex-1 bg-[#0da34c] hover:bg-[#0da34c]/95 text-white rounded-xl py-2.5 text-sm font-bold transition-all h-11 cursor-pointer shadow-sm font-sans"
          >
            {type === "accept" ? "Confirm and pay" : "Submit"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
