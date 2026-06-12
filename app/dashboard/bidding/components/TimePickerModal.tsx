"use client";

import * as React from "react";
import { Modal } from "@/components/ui/modal";

interface TimePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTime: (timeText: string) => void;
  initialValue?: string;
}

export default function TimePickerModal({
  isOpen,
  onClose,
  onSelectTime,
  initialValue = "",
}: TimePickerModalProps) {
  const [hours, setHours] = React.useState(12);
  const [minutes, setMinutes] = React.useState(20);

  // Sync with initial value on open
  React.useEffect(() => {
    if (isOpen && initialValue) {
      const hMatch = initialValue.match(/(\d+)\s*(h|Hour)/i);
      const mMatch = initialValue.match(/(\d+)\s*(m|Min)/i);
      if (hMatch) setHours(parseInt(hMatch[1], 10));
      if (mMatch) setMinutes(parseInt(mMatch[1], 10));
    }
  }, [isOpen, initialValue]);

  const handleSetTime = () => {
    onSelectTime(`${hours}h, ${minutes} min`);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} showCloseButton={false} size="sm">
      <div className="font-sans text-left space-y-6 py-2">
        <h3 className="text-lg font-bold text-slate-800 font-sans tracking-tight">
          Select Bidding Duration
        </h3>

        {/* Hour / Minute Selection Dropdowns */}
        <div className="flex gap-4 justify-center items-center py-2">
          <div className="flex flex-col items-center">
            <label className="text-xs font-semibold text-slate-400 mb-1.5 font-sans">
              Hours
            </label>
            <select
              value={hours}
              onChange={(e) => setHours(parseInt(e.target.value, 10))}
              className="bg-white border border-[#E2E8F0] rounded-xl px-4 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0da34c] h-11 w-24 font-bold cursor-pointer"
            >
              {Array.from({ length: 73 }, (_, i) => i).map((h) => (
                <option key={h} value={h}>{h} hr</option>
              ))}
            </select>
          </div>

          <span className="text-lg font-bold text-slate-400 mt-5">:</span>

          <div className="flex flex-col items-center">
            <label className="text-xs font-semibold text-slate-400 mb-1.5 font-sans">
              Minutes
            </label>
            <select
              value={minutes}
              onChange={(e) => setMinutes(parseInt(e.target.value, 10))}
              className="bg-white border border-[#E2E8F0] rounded-xl px-4 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0da34c] h-11 w-24 font-bold cursor-pointer"
            >
              {Array.from({ length: 60 }, (_, i) => i).map((m) => (
                <option key={m} value={m}>{m} min</option>
              ))}
            </select>
          </div>
        </div>

        {/* Buttons (outlined cancel vs solid green set) */}
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
            onClick={handleSetTime}
            className="flex-1 bg-[#0da34c] hover:bg-[#0da34c]/95 text-white rounded-xl py-2.5 text-sm font-bold transition-all h-11 cursor-pointer shadow-sm font-sans"
          >
            Set Time
          </button>
        </div>
      </div>
    </Modal>
  );
}
