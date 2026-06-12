"use client";

import * as React from "react";
import { MdMoreVert, MdClose } from "react-icons/md";
import { CoachDispute, CoachWithdrawal, CoachTransaction } from "@/lib/mock-data";

interface CoachTableProps {
  viewType: "All Transaction" | "Withdrawals";
  activeTab: string;
  transactions: CoachTransaction[];
  withdrawals: CoachWithdrawal[];
  disputes: CoachDispute[];
  onRowClick: (member: { name: string; avatar: string }) => void;
  onUpdateWithdrawalStatus: (id: string, status: CoachWithdrawal["status"], amount: string) => void;
  onUpdateTransactionStatus: (id: string, status: CoachTransaction["status"], amount: string) => void;
  activeMenuId: string | null;
  setActiveMenuId: (id: string | null) => void;
}

export default function CoachTable({
  viewType,
  activeTab,
  transactions,
  withdrawals,
  disputes,
  onRowClick,
  onUpdateWithdrawalStatus,
  onUpdateTransactionStatus,
  activeMenuId,
  setActiveMenuId
}: CoachTableProps) {

  const handleActionClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setActiveMenuId(activeMenuId === id ? null : id);
  };

  // Render high-fidelity badges matching layout screenshots
  const renderStatusBadge = (status: string) => {
    const s = status.toLowerCase();
    if (s === "completed") {
      return (
        <span className="inline-flex px-2.5 py-0.5 rounded-md text-xs font-semibold bg-emerald-50 text-[#0da34c] border border-emerald-100">
          Completed
        </span>
      );
    }
    if (s === "pending") {
      return (
        <span className="inline-flex px-2.5 py-0.5 rounded-md text-xs font-semibold bg-amber-50 text-amber-600 border border-amber-100">
          Pending
        </span>
      );
    }
    if (s === "refunded" || s === "rejected") {
      return (
        <span className="inline-flex px-2.5 py-0.5 rounded-md text-xs font-semibold bg-red-50 text-red-500 border border-red-100">
          {status}
        </span>
      );
    }
    if (s === "cancel") {
      return (
        <span className="inline-flex px-2.5 py-0.5 rounded-md text-xs font-semibold bg-zinc-100 text-zinc-500 border border-zinc-200">
          Cancel
        </span>
      );
    }
    if (s === "cancel by stripe") {
      return (
        <span className="inline-flex px-2.5 py-0.5 rounded-md text-xs font-semibold bg-red-50 text-red-500 border border-red-100">
          Cancel by Stripe
        </span>
      );
    }
    if (s === "hold") {
      return (
        <span className="inline-flex px-2.5 py-0.5 rounded-md text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
          Hold
        </span>
      );
    }
    return (
      <span className="inline-flex px-2.5 py-0.5 rounded-md text-xs font-semibold bg-zinc-50 text-zinc-500 border border-zinc-100">
        {status}
      </span>
    );
  };

  // 1. REFUND/DISPUTES VIEW (Screenshot 3)
  if (viewType === "All Transaction" && activeTab === "Refund") {
    return (
      <table className="w-full text-left border-collapse min-w-[800px] font-sans">
        <thead>
          <tr className="bg-zinc-50 border-b border-border text-[13px] font-semibold text-[#6D6D6D] tracking-wide">
            <th className="px-6 py-4">Dispute ID</th>
            <th className="px-6 py-4">User</th>
            <th className="px-6 py-4">Coach</th>
            <th className="px-6 py-4">Amount</th>
            <th className="px-6 py-4">Reason</th>
            <th className="px-6 py-4">Date</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border text-[14px]">
          {disputes.map((disp) => (
            <tr
              key={disp.id}
              onClick={() => onRowClick({ name: disp.coach, avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200" })}
              className="hover:bg-zinc-50/50 cursor-pointer transition-colors"
            >
              <td className="px-6 py-4 text-slate-800 font-medium">{disp.id}</td>
              <td className="px-6 py-4 font-bold text-slate-800">{disp.user}</td>
              <td className="px-6 py-4 font-bold text-slate-800">{disp.coach}</td>
              <td className="px-6 py-4 font-bold text-slate-800">{disp.amount}</td>
              <td className="px-6 py-4 text-[#6D6D6D]">{disp.reason}</td>
              <td className="px-6 py-4 text-[#6D6D6D]">{disp.date}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                {renderStatusBadge(disp.status)}
              </td>
              <td className="px-6 py-4 text-center">
                <button className="p-1.5 hover:bg-zinc-100 rounded-full cursor-pointer">
                  <MdMoreVert className="w-5 h-5 text-slate-500" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  // 2. CANCELED VIEW (Cancel / Cancel by Stripe tabs under All Transaction - Screenshot 4)
  if (viewType === "All Transaction" && (activeTab === "Cancel" || activeTab === "Cancel by Stripe")) {
    return (
      <table className="w-full text-left border-collapse min-w-[700px] font-sans">
        <thead>
          <tr className="bg-zinc-50 border-b border-border text-[13px] font-semibold text-[#6D6D6D] tracking-wide">
            <th className="px-6 py-4">Coach</th>
            <th className="px-6 py-4">Total Balance</th>
            <th className="px-6 py-4">Withdrawal Request</th>
            <th className="px-6 py-4">Withdrawal Amount</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border text-[14px]">
          {withdrawals.map((wth) => (
            <tr
              key={wth.id}
              className="hover:bg-zinc-50/50 transition-colors"
            >
              <td className="px-6 py-4 font-bold text-slate-800">{wth.coach}</td>
              <td className="px-6 py-4 font-bold text-slate-800">{wth.totalBalance}</td>
              <td className="px-6 py-4 text-[#6D6D6D]">{wth.withdrawalRequest}</td>
              <td className="px-6 py-4 font-bold text-slate-800">{wth.withdrawalAmount}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                {renderStatusBadge(wth.status)}
              </td>
              
              {/* Full Actions menu for Withdrawals/Cancel states */}
              <td className="px-6 py-4 text-center relative whitespace-nowrap">
                <button
                  onClick={(e) => handleActionClick(e, wth.id)}
                  className="p-1.5 hover:bg-zinc-100 rounded-full transition-colors inline-block focus:outline-none cursor-pointer"
                >
                  <MdMoreVert className="w-5 h-5 text-slate-500" />
                </button>

                {activeMenuId === wth.id && (
                  <div
                    className="absolute right-6 top-10 mt-1 z-30 w-44 bg-white border border-border rounded-xl shadow-lg p-2 text-left flex flex-col"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenuId(null);
                      }}
                      className="absolute top-2 right-2 text-zinc-400 hover:text-zinc-600 transition-colors cursor-pointer"
                    >
                      <MdClose className="w-3.5 h-3.5" />
                    </button>

                    <div className="pt-5 flex flex-col gap-0.5">
                      <button
                        onClick={() => {
                          onUpdateWithdrawalStatus(wth.id, "Completed", wth.withdrawalAmount);
                          setActiveMenuId(null);
                        }}
                        className="w-full px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-[#e8f5e9] hover:text-[#0da34c] rounded-lg transition-all text-left cursor-pointer"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => {
                          onUpdateWithdrawalStatus(wth.id, "Rejected", wth.withdrawalAmount);
                          setActiveMenuId(null);
                        }}
                        className="w-full px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-[#e8f5e9] hover:text-[#0da34c] rounded-lg transition-all text-left cursor-pointer"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => {
                          onUpdateWithdrawalStatus(wth.id, "Hold", wth.withdrawalAmount);
                          setActiveMenuId(null);
                        }}
                        className="w-full px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-[#e8f5e9] hover:text-[#0da34c] rounded-lg transition-all text-left cursor-pointer"
                      >
                        Hold
                      </button>
                      <button
                        onClick={() => {
                          onUpdateWithdrawalStatus(wth.id, "Cancel", wth.withdrawalAmount);
                          setActiveMenuId(null);
                        }}
                        className="w-full px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-[#e8f5e9] hover:text-[#0da34c] rounded-lg transition-all text-left cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          onUpdateWithdrawalStatus(wth.id, "Cancel by Stripe", wth.withdrawalAmount);
                          setActiveMenuId(null);
                        }}
                        className="w-full px-3 py-1.5 text-xs font-semibold text-red-500 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all text-left cursor-pointer border-t border-zinc-100 mt-1"
                      >
                        Cancel by Stripe
                      </button>
                    </div>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  // 3. WITHDRAWALS VIEW (Screenshot 1)
  if (viewType === "Withdrawals") {
    return (
      <table className="w-full text-left border-collapse min-w-[800px] font-sans">
        <thead>
          <tr className="bg-zinc-50 border-b border-border text-[13px] font-semibold text-[#6D6D6D] tracking-wide">
            <th className="px-6 py-4">Coach</th>
            <th className="px-6 py-4">Current Balance</th>
            <th className="px-6 py-4">Date</th>
            <th className="px-6 py-4">Request Amount</th>
            <th className="px-6 py-4">Note</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border text-[14px]">
          {withdrawals.map((wth) => (
            <tr
              key={wth.id}
              className="hover:bg-zinc-50/50 transition-colors"
            >
              <td className="px-6 py-4 font-bold text-slate-800">{wth.coach}</td>
              <td className="px-6 py-4 font-bold text-slate-800">{wth.currentBalance}</td>
              <td className="px-6 py-4 text-[#6D6D6D]">{wth.date}</td>
              <td className="px-6 py-4 font-bold text-slate-800">{wth.requestAmount}</td>
              <td className="px-6 py-4 text-[#6D6D6D] text-xs max-w-[200px] truncate" title={wth.note}>{wth.note || "-"}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                {renderStatusBadge(wth.status)}
              </td>
              
              {/* Full Actions Popup menu for Withdrawals */}
              <td className="px-6 py-4 text-center relative whitespace-nowrap">
                <button
                  onClick={(e) => handleActionClick(e, wth.id)}
                  className="p-1.5 hover:bg-zinc-100 rounded-full transition-colors inline-block focus:outline-none cursor-pointer"
                >
                  <MdMoreVert className="w-5 h-5 text-slate-500" />
                </button>

                {activeMenuId === wth.id && (
                  <div
                    className="absolute right-6 top-10 mt-1 z-30 w-44 bg-white border border-border rounded-xl shadow-lg p-2 text-left flex flex-col"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenuId(null);
                      }}
                      className="absolute top-2 right-2 text-zinc-400 hover:text-zinc-600 transition-colors cursor-pointer"
                    >
                      <MdClose className="w-3.5 h-3.5" />
                    </button>

                    <div className="pt-5 flex flex-col gap-0.5">
                      <button
                        onClick={() => {
                          onUpdateWithdrawalStatus(wth.id, "Completed", wth.requestAmount);
                          setActiveMenuId(null);
                        }}
                        className="w-full px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-[#e8f5e9] hover:text-[#0da34c] rounded-lg transition-all text-left cursor-pointer"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => {
                          onUpdateWithdrawalStatus(wth.id, "Rejected", wth.requestAmount);
                          setActiveMenuId(null);
                        }}
                        className="w-full px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-[#e8f5e9] hover:text-[#0da34c] rounded-lg transition-all text-left cursor-pointer"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => {
                          onUpdateWithdrawalStatus(wth.id, "Hold", wth.requestAmount);
                          setActiveMenuId(null);
                        }}
                        className="w-full px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-[#e8f5e9] hover:text-[#0da34c] rounded-lg transition-all text-left cursor-pointer"
                      >
                        Hold
                      </button>
                      <button
                        onClick={() => {
                          onUpdateWithdrawalStatus(wth.id, "Cancel", wth.requestAmount);
                          setActiveMenuId(null);
                        }}
                        className="w-full px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-[#e8f5e9] hover:text-[#0da34c] rounded-lg transition-all text-left cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          onUpdateWithdrawalStatus(wth.id, "Cancel by Stripe", wth.requestAmount);
                          setActiveMenuId(null);
                        }}
                        className="w-full px-3 py-1.5 text-xs font-semibold text-red-500 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all text-left cursor-pointer border-t border-zinc-100 mt-1"
                      >
                        Cancel by Stripe
                      </button>
                    </div>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  // 4. STANDARD TRANSACTION VIEW (Screenshot 2)
  return (
    <table className="w-full text-left border-collapse min-w-[700px] font-sans">
      <thead>
        <tr className="bg-zinc-50 border-b border-border text-[13px] font-semibold text-[#6D6D6D] tracking-wide">
          <th className="px-6 py-4">Transaction Id</th>
          <th className="px-6 py-4">Coach</th>
          <th className="px-6 py-4">Coach Fee</th>
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
            onClick={() => onRowClick({ name: txn.coach, avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200" })}
            className="hover:bg-zinc-50/50 cursor-pointer transition-colors"
          >
            <td className="px-6 py-4 text-slate-800 font-medium">{txn.id}</td>
            <td className="px-6 py-4 font-bold text-slate-800">{txn.coach}</td>
            <td className="px-6 py-4 font-bold text-slate-800">{txn.coachFee}</td>
            <td className="px-6 py-4 text-[#6D6D6D]">{txn.type}</td>
            <td className="px-6 py-4 text-[#6D6D6D]">{txn.platformFee}</td>
            <td className="px-6 py-4 text-[#6D6D6D]">{txn.date}</td>
            <td className="px-6 py-4 whitespace-nowrap">
              {renderStatusBadge(txn.status)}
            </td>
            
            {/* Standard Payout Actions Menu: Accept / Reject only */}
            <td className="px-6 py-4 text-center relative whitespace-nowrap">
              <button
                onClick={(e) => handleActionClick(e, txn.id)}
                className="p-1.5 hover:bg-zinc-100 rounded-full transition-colors inline-block focus:outline-none cursor-pointer"
              >
                <MdMoreVert className="w-5 h-5 text-slate-500" />
              </button>

              {activeMenuId === txn.id && (
                <div
                  className="absolute right-6 top-10 mt-1 z-30 w-32 bg-white border border-border rounded-xl shadow-lg p-2 text-left flex flex-col"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveMenuId(null);
                    }}
                    className="absolute top-2 right-2 text-zinc-400 hover:text-zinc-600 transition-colors cursor-pointer"
                  >
                    <MdClose className="w-3.5 h-3.5" />
                  </button>

                  <div className="pt-5 flex flex-col gap-0.5">
                    <button
                      onClick={() => {
                        onUpdateTransactionStatus(txn.id, "Completed", txn.coachFee);
                        setActiveMenuId(null);
                      }}
                      className="w-full px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-[#e8f5e9] hover:text-[#0da34c] rounded-lg transition-all text-left cursor-pointer"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => {
                        onUpdateTransactionStatus(txn.id, "Rejected", txn.coachFee);
                        setActiveMenuId(null);
                      }}
                      className="w-full px-3 py-1.5 text-xs font-semibold text-red-500 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all text-left cursor-pointer border-t border-zinc-100 mt-1"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
