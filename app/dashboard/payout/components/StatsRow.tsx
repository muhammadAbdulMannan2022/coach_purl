"use client";

import * as React from "react";
import StatCard from "@/components/ui/dashboardCard";
import { MdAttachMoney, MdAccessTime, MdAutorenew, MdWarning } from "react-icons/md";

interface StatsRowProps {
  isDetailView: boolean;
}

export default function StatsRow({ isDetailView }: StatsRowProps) {
  if (isDetailView) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Spent"
          value="$1,128"
          valueColor="text-[#b08b5c] font-bold"
          icon={<MdAttachMoney className="w-6 h-6 text-blue-600" />}
          iconBg="bg-blue-50"
        />
        <StatCard
          title="Transactions"
          value="23"
          valueColor="text-[#0da34c] font-bold"
          icon={<MdAccessTime className="w-6 h-6 text-amber-600" />}
          iconBg="bg-amber-50"
        />
        <StatCard
          title="Average Transaction"
          value="$20.18"
          valueColor="text-[#0f766e] font-bold"
          icon={<MdAutorenew className="w-6 h-6 text-emerald-600" />}
          iconBg="bg-emerald-50"
        />
        <StatCard
          title="Last Transaction"
          value="28/04/2026"
          valueColor="text-[#c2410c] font-bold"
          icon={<MdWarning className="w-6 h-6 text-red-500" />}
          iconBg="bg-red-50"
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Today's Revenue"
        value="$3,128"
        valueColor="text-[#b08b5c] font-bold"
        icon={<MdAttachMoney className="w-6 h-6 text-blue-600" />}
        iconBg="bg-blue-50"
      />
      <StatCard
        title="Platform Earnings"
        value="$1,230"
        valueColor="text-[#0da34c] font-bold"
        icon={<MdAccessTime className="w-6 h-6 text-amber-600" />}
        iconBg="bg-amber-50"
      />
      <StatCard
        title="Pending Payouts"
        value="$3,120"
        valueColor="text-[#0f766e] font-bold"
        icon={<MdAutorenew className="w-6 h-6 text-emerald-600" />}
        iconBg="bg-emerald-50"
      />
      <StatCard
        title="Open Disputes"
        value="02"
        valueColor="text-[#c2410c] font-bold"
        icon={<MdWarning className="w-6 h-6 text-red-500" />}
        iconBg="bg-red-50"
      />
    </div>
  );
}
