"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";

interface MemberDetailHeaderProps {
  member: { name: string; avatar: string; joinDate: string };
  onBack: () => void;
  onExport: () => void;
}

export default function MemberDetailHeader({
  member,
  onBack,
  onExport
}: MemberDetailHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="flex items-center gap-4">
        <div className="relative w-14 h-14 rounded-full overflow-hidden border border-border bg-zinc-100 shrink-0">
          <img
            src={member.avatar}
            alt={member.name}
            className="object-cover w-full h-full"
          />
        </div>
        <div>
          <button
            onClick={onBack}
            className="text-xs font-bold text-slate-500 hover:text-primary transition-colors flex items-center gap-1.5 cursor-pointer font-sans"
          >
            ← Back to Transactions
          </button>
          <h2 className="text-2xl font-sans font-bold text-slate-900 mt-1">{member.name}</h2>
          <p className="text-xs text-[#6D6D6D] font-sans">Member since {member.joinDate}</p>
        </div>
      </div>
      <Button
        onClick={onExport}
        className="bg-[#0da34c] hover:bg-[#0da34c]/95 text-white font-semibold text-xs h-10 px-5 flex items-center gap-1.5 cursor-pointer shadow-sm ml-auto sm:ml-0 font-sans"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
        </svg>
        <span>Export</span>
      </Button>
    </div>
  );
}
