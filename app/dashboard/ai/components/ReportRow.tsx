"use client";

import * as React from "react";
import { MdMoreVert, MdWarning, MdBlock } from "react-icons/md";
import { ModerationReport } from "@/lib/mock-data";

interface PersonDetail {
  name: string;
  avatar: string;
}

interface ReportRowProps {
  report: ModerationReport;
  coach: PersonDetail;
  user: PersonDetail;
  onReadMore: (message: string) => void;
  onActionTrigger: (target: "user" | "coach", type: "warn" | "block", report: ModerationReport) => void;
  isMenuOpen: boolean;
  onToggleMenu: (e: React.MouseEvent) => void;
}

export default function ReportRow({
  report,
  coach,
  user,
  onReadMore,
  onActionTrigger,
  isMenuOpen,
  onToggleMenu,
}: ReportRowProps) {
  const rawMsg = report.description || "";
  const previewMsg = rawMsg.length > 80 ? rawMsg.substring(0, 80) + "..." : rawMsg;

  return (
    <tr className="hover:bg-zinc-50/50 transition-colors">
      {/* Coach Column */}
      <td className="px-6 py-4.5 whitespace-nowrap">
        <div className="flex items-center gap-3">
          <div className="relative w-9 h-9 rounded-full overflow-hidden border border-border shrink-0 bg-zinc-100">
            <img
              src={coach.avatar}
              alt={coach.name}
              className="object-cover w-full h-full"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100";
              }}
            />
          </div>
          <span className="font-bold text-slate-800">{coach.name}</span>
        </div>
      </td>

      {/* User Column */}
      <td className="px-6 py-4.5 whitespace-nowrap">
        <div className="flex items-center gap-3">
          <div className="relative w-9 h-9 rounded-full overflow-hidden border border-border shrink-0 bg-zinc-100">
            <img
              src={user.avatar}
              alt={user.name}
              className="object-cover w-full h-full"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100";
              }}
            />
          </div>
          <span className="font-bold text-slate-800">{user.name}</span>
        </div>
      </td>

      {/* Message Column */}
      <td className="px-6 py-4 max-w-[320px]">
        <span className="text-[#6D6D6D]">
          "{previewMsg}"{" "}
          {rawMsg.length > 80 && (
            <button
              onClick={() => onReadMore(rawMsg)}
              className="text-[#0da34c] hover:underline font-semibold cursor-pointer focus:outline-none ml-1 inline-block"
            >
              Read more
            </button>
          )}
        </span>
      </td>

      {/* Date Column */}
      <td className="px-6 py-4 text-[#6D6D6D] whitespace-nowrap">
        {report.date}
      </td>

      {/* Actions Column */}
      <td className="px-6 py-4 text-center relative whitespace-nowrap">
        <button
          onClick={onToggleMenu}
          className="p-1 hover:bg-zinc-100 rounded-full transition-colors inline-block focus:outline-none cursor-pointer"
          aria-label="Actions menu"
        >
          <MdMoreVert className="w-5 h-5 text-slate-500" />
        </button>

        {/* Floating Dropdown Context Panel matching Image 4 */}
        {isMenuOpen && (
          <div
            className="absolute right-6 top-10 mt-1 z-30 w-44 bg-white border border-border rounded-xl shadow-lg p-2 text-left flex flex-col text-xs font-sans whitespace-normal"
            onClick={(e) => e.stopPropagation()}
          >
            {/* User Section */}
            <span className="px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              User
            </span>
            <button
              onClick={() => onActionTrigger("user", "warn", report)}
              className="w-full px-2.5 py-2 text-slate-700 hover:bg-[#f8faf8] hover:text-[#0da34c] rounded-lg transition-colors text-left cursor-pointer flex items-center gap-2 font-medium"
            >
              <MdWarning className="w-3.5 h-3.5 text-amber-500" />
              <span>Warn User</span>
            </button>
            <button
              onClick={() => onActionTrigger("user", "block", report)}
              className="w-full px-2.5 py-2 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors text-left cursor-pointer flex items-center gap-2 font-medium"
            >
              <MdBlock className="w-3.5 h-3.5 text-red-500" />
              <span>Block User</span>
            </button>

            <div className="border-t border-border my-1.5"></div>

            {/* Coach Section */}
            <span className="px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Coach
            </span>
            <button
              onClick={() => onActionTrigger("coach", "warn", report)}
              className="w-full px-2.5 py-2 text-slate-700 hover:bg-[#f8faf8] hover:text-[#0da34c] rounded-lg transition-colors text-left cursor-pointer flex items-center gap-2 font-medium"
            >
              <MdWarning className="w-3.5 h-3.5 text-amber-500" />
              <span>Warn User</span>
            </button>
            <button
              onClick={() => onActionTrigger("coach", "block", report)}
              className="w-full px-2.5 py-2 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors text-left cursor-pointer flex items-center gap-2 font-medium"
            >
              <MdBlock className="w-3.5 h-3.5 text-red-500" />
              <span>Block User</span>
            </button>
          </div>
        )}
      </td>
    </tr>
  );
}
