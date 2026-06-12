"use client";

import * as React from "react";
import { Modal } from "@/components/ui/modal";
import { MdCalendarToday } from "react-icons/md";
import { BiddingSystemConfig } from "@/lib/mock-data";
import DateRangeModal from "../../payout/components/DateRangeModal";
import TimePickerModal from "./TimePickerModal";

interface BiddingConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPublish: (config: BiddingSystemConfig) => void;
  currentConfig: BiddingSystemConfig;
}

export default function BiddingConfigModal({
  isOpen,
  onClose,
  onPublish,
  currentConfig,
}: BiddingConfigModalProps) {
  const [slot1, setSlot1] = React.useState("");
  const [slot2, setSlot2] = React.useState("");
  const [slot3, setSlot3] = React.useState("");
  const [slot4, setSlot4] = React.useState("");
  const [raffle, setRaffle] = React.useState("");
  const [biddingDuration, setBiddingDuration] = React.useState("");
  const [featuredDuration, setFeaturedDuration] = React.useState("");

  // Picker states
  const [isTimePickerOpen, setIsTimePickerOpen] = React.useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = React.useState(false);
  const [startDate, setStartDate] = React.useState<Date | null>(null);
  const [endDate, setEndDate] = React.useState<Date | null>(null);

  // Sync state with current config when open
  React.useEffect(() => {
    if (isOpen) {
      setSlot1(currentConfig.slot1Min.toString());
      setSlot2(currentConfig.slot2Min.toString());
      setSlot3(currentConfig.slot3Min.toString());
      setSlot4(currentConfig.slot4Min.toString());
      setRaffle(currentConfig.rafflePrice.toString());
      setBiddingDuration(currentConfig.biddingDuration);
      setFeaturedDuration(currentConfig.featuredDuration);
      setStartDate(null);
      setEndDate(null);
    }
  }, [isOpen, currentConfig]);

  const handlePublish = () => {
    onPublish({
      slot1Min: parseFloat(slot1) || 0,
      slot2Min: parseFloat(slot2) || 0,
      slot3Min: parseFloat(slot3) || 0,
      slot4Min: parseFloat(slot4) || 0,
      rafflePrice: parseFloat(raffle) || 0,
      biddingDuration: biddingDuration || "24 Hours",
      featuredDuration: featuredDuration || "30 Days",
    });
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
          Bidding System Configuration
        </h3>

        {/* Form Fields */}
        <div className="space-y-4">
          <label className="text-[13px] font-semibold text-slate-500 font-sans block uppercase tracking-wide">
            Set Minimum Bid Amount
          </label>

          {/* Slots Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="text-xs font-semibold text-slate-400 mb-1.5 font-sans">
                1st Slot
              </label>
              <input
                type="text"
                placeholder="Enter here...."
                value={slot1}
                onChange={(e) => setSlot1(e.target.value)}
                className="w-full bg-white border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0da34c] transition-all h-11"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-xs font-semibold text-slate-400 mb-1.5 font-sans">
                2nd Slot
              </label>
              <input
                type="text"
                placeholder="Enter here...."
                value={slot2}
                onChange={(e) => setSlot2(e.target.value)}
                className="w-full bg-white border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0da34c] transition-all h-11"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-xs font-semibold text-slate-400 mb-1.5 font-sans">
                3rd Slot
              </label>
              <input
                type="text"
                placeholder="Enter here...."
                value={slot3}
                onChange={(e) => setSlot3(e.target.value)}
                className="w-full bg-white border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0da34c] transition-all h-11"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-xs font-semibold text-slate-400 mb-1.5 font-sans">
                4th Slot
              </label>
              <input
                type="text"
                placeholder="Enter here...."
                value={slot4}
                onChange={(e) => setSlot4(e.target.value)}
                className="w-full bg-white border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0da34c] transition-all h-11"
              />
            </div>
          </div>

          {/* Raffle ticket price input */}
          <div className="flex flex-col">
            <label className="text-xs font-semibold text-slate-400 mb-1.5 font-sans">
              Raffle Price for 5th Slot
            </label>
            <input
              type="text"
              placeholder="Enter here...."
              value={raffle}
              onChange={(e) => setRaffle(e.target.value)}
              className="w-full bg-white border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0da34c] transition-all h-11"
            />
          </div>

          {/* Bidding Duration Select */}
          <div className="flex flex-col">
            <label className="text-xs font-semibold text-slate-400 mb-1.5 font-sans">
              Bidding Duration
            </label>
            <div 
              className="relative cursor-pointer"
              onClick={() => setIsTimePickerOpen(true)}
            >
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <MdCalendarToday className="w-5 h-5 text-slate-400" />
              </span>
              <input
                type="text"
                placeholder="Select Duration"
                value={biddingDuration}
                readOnly
                className="w-full bg-white border border-[#E2E8F0] hover:border-slate-300 rounded-xl pl-11 pr-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0da34c] transition-all h-11 font-sans cursor-pointer"
              />
            </div>
          </div>

          {/* Featured Position Duration Select */}
          <div className="flex flex-col">
            <label className="text-xs font-semibold text-slate-400 mb-1.5 font-sans">
              Featured Position Duration
            </label>
            <div 
              className="relative cursor-pointer"
              onClick={() => setIsDatePickerOpen(true)}
            >
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <MdCalendarToday className="w-5 h-5 text-slate-400" />
              </span>
              <input
                type="text"
                placeholder="Select Duration"
                value={featuredDuration}
                readOnly
                className="w-full bg-white border border-[#E2E8F0] hover:border-slate-300 rounded-xl pl-11 pr-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0da34c] transition-all h-11 font-sans cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons (flex row, outlined Cancel vs solid green Publish) */}
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
            onClick={handlePublish}
            className="flex-1 bg-[#0da34c] hover:bg-[#0da34c]/95 text-white rounded-xl py-2.5 text-sm font-bold transition-all h-11 cursor-pointer shadow-sm font-sans"
          >
            Publish
          </button>
        </div>
      </div>

      {/* Embedded Pickers */}
      <TimePickerModal
        isOpen={isTimePickerOpen}
        onClose={() => setIsTimePickerOpen(false)}
        initialValue={biddingDuration}
        onSelectTime={(timeText) => setBiddingDuration(timeText)}
      />

      <DateRangeModal
        isOpen={isDatePickerOpen}
        onClose={() => setIsDatePickerOpen(false)}
        startDate={startDate}
        endDate={endDate}
        onSelectRange={(start, end, label) => {
          setStartDate(start);
          setEndDate(end);
          setFeaturedDuration(label);
        }}
      />
    </Modal>
  );
}
