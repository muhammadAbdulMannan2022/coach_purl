"use client";

import * as React from "react";
import { MdMoreVert } from "react-icons/md";
import { UserTransaction } from "@/lib/mock-data";

interface UserTableProps {
  transactions: UserTransaction[];
  onRowClick: (txn: UserTransaction) => void;
  onCancelTxn: (e: React.MouseEvent, id: string) => void;
  activeMenuId: string | null;
  setActiveMenuId: (id: string | null) => void;
}

export default function UserTable({
  transactions,
  onRowClick,
  onCancelTxn,
  activeMenuId,
  setActiveMenuId
}: UserTableProps) {
  
  const handleActionClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setActiveMenuId(activeMenuId === id ? null : id);
  };

  return (
    <table className="w-full text-left border-collapse min-w-[700px] font-sans">
      <thead>
        <tr className="bg-zinc-50 border-b border-border text-[13px] font-semibold text-[#6D6D6D] tracking-wide">
          <th className="px-6 py-4">Transaction Id</th>
          <th className="px-6 py-4">User</th>
          <th className="px-6 py-4">User Paid</th>
          <th className="px-6 py-4">Type</th>
          <th className="px-6 py-4">Platform Fee</th>
          <th className="px-6 py-4">Date</th>
          <th className="px-6 py-4">Status</th>
          <th className="px-6 py-4 text-center">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-border text-[14px]">
        {transactions.map((txn) => (
          <tr
            key={txn.id}
            onClick={() => onRowClick(txn)}
            className="hover:bg-zinc-50/50 cursor-pointer transition-colors"
          >
            <td className="px-6 py-4 text-slate-800 font-medium">{txn.id}</td>
            <td className="px-6 py-4 font-bold text-slate-800">{txn.user}</td>
            <td className="px-6 py-4 font-bold text-slate-800">{txn.userPaid}</td>
            <td className="px-6 py-4 text-[#6D6D6D]">{txn.type}</td>
            <td className="px-6 py-4 text-[#6D6D6D]">{txn.platformFee}</td>
            <td className="px-6 py-4 text-[#6D6D6D]">{txn.date}</td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span
                className={`
                  inline-flex px-2.5 py-0.5 rounded-md text-xs font-semibold uppercase tracking-wider
                  ${txn.status === "Completed" ? "bg-emerald-50 text-[#0da34c] border border-emerald-100" : ""}
                  ${txn.status === "Pending" ? "bg-amber-50 text-amber-600 border border-amber-100" : ""}
                  ${txn.status === "Refunded" ? "bg-red-50 text-red-500 border border-red-100" : ""}
                  ${txn.status === "Cancelled" ? "bg-zinc-50 text-zinc-500 border border-zinc-100" : ""}
                `}
              >
                {txn.status}
              </span>
            </td>
            <td className="px-6 py-4 text-center relative whitespace-nowrap">
              <button
                onClick={(e) => handleActionClick(e, txn.id)}
                className="p-1.5 hover:bg-zinc-100 rounded-full transition-colors inline-block focus:outline-none cursor-pointer"
              >
                <MdMoreVert className="w-5 h-5 text-slate-500" />
              </button>

              {activeMenuId === txn.id && (
                <div
                  className="absolute right-6 top-10 mt-1 z-30 w-36 bg-white border border-border rounded-xl shadow-lg p-1.5 text-left flex flex-col"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={(e) => onCancelTxn(e, txn.id)}
                    className="w-full px-3 py-2 text-xs font-semibold text-red-500 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors text-left cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
