"use client";

import * as React from "react";
import { ModerationReport } from "@/lib/mock-data";
import ReportRow from "./ReportRow";

interface ReportsTableProps {
  reports: ModerationReport[];
  coachesList: any[];
  usersList: any[];
  onReadMore: (message: string) => void;
  onActionTrigger: (target: "user" | "coach", type: "warn" | "block", report: ModerationReport) => void;
  activeMenuId: string | null;
  onToggleMenu: (reportId: string | null) => void;
}

export default function ReportsTable({
  reports,
  coachesList,
  usersList,
  onReadMore,
  onActionTrigger,
  activeMenuId,
  onToggleMenu,
}: ReportsTableProps) {
  
  const getCoachForReport = (report: ModerationReport) => {
    let name = "";
    if (report.type === "Coach") {
      name = report.reported;
    } else if (report.type === "User") {
      name = report.reporter;
    } else {
      name = report.reported;
    }
    const found = coachesList.find(c => c.name.toLowerCase() === name.toLowerCase());
    return {
      name,
      avatar: found?.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100"
    };
  };

  const getUserForReport = (report: ModerationReport) => {
    let name = "";
    if (report.type === "Coach") {
      name = report.reporter;
    } else if (report.type === "User") {
      name = report.reported;
    } else {
      name = report.reporter;
    }
    const found = usersList.find(u => u.name.toLowerCase() === name.toLowerCase());
    return {
      name,
      avatar: found?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100"
    };
  };

  if (reports.length === 0) {
    return (
      <div className="py-12 text-center text-[#6D6D6D] font-medium font-sans">
        No reports found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto -mx-6 border-t border-border pb-44">
      <table className="w-full text-left border-collapse min-w-[750px] font-sans">
        <thead>
          <tr className="bg-zinc-50 border-b border-border text-[13px] font-semibold text-[#6D6D6D] tracking-wide">
            <th className="px-6 py-4">Coach</th>
            <th className="px-6 py-4">User</th>
            <th className="px-6 py-4">Message</th>
            <th className="px-6 py-4">Date</th>
            <th className="px-6 py-4 text-center">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border text-[14px]">
          {reports.map((report) => {
            const coach = getCoachForReport(report);
            const user = getUserForReport(report);

            return (
              <ReportRow
                key={report.id}
                report={report}
                coach={coach}
                user={user}
                onReadMore={onReadMore}
                onActionTrigger={onActionTrigger}
                isMenuOpen={activeMenuId === report.id}
                onToggleMenu={(e) => {
                  e.stopPropagation();
                  onToggleMenu(activeMenuId === report.id ? null : report.id);
                }}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
