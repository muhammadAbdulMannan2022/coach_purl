"use client";

import * as React from "react";

interface CommissionCardProps {
  commission: number;
  setCommission: (val: number) => void;
}

export default function CommissionCard({ commission, setCommission }: CommissionCardProps) {
  return (
    <div className="bg-white border border-border p-6 rounded-2xl shadow-sm flex flex-col transition-all duration-200 hover:shadow-md">
      <h3 className="text-sm font-bold text-slate-800 tracking-tight font-sans">
        Pricing & Commissions
      </h3>
      
      <div className="flex flex-col mt-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-slate-700 font-sans">
            Commission Rate
          </span>
          <span className="text-sm font-bold text-primary font-sans">
            {commission}%
          </span>
        </div>
        <div className="flex items-center gap-4 py-2">
          <input
            type="range"
            min="0"
            max="100"
            value={commission}
            onChange={(e) => setCommission(Number(e.target.value))}
            className="flex-1 accent-primary h-1.5 bg-border rounded-lg appearance-none cursor-pointer"
          />
        </div>
        <span className="text-xs text-foreground font-medium mt-1 font-sans">
          Percentage taken from coach session fees.
        </span>
      </div>
    </div>
  );
}
