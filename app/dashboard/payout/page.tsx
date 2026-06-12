"use client";

import * as React from "react";
import StatsRow from "./components/StatsRow";
import MemberDetailHeader from "./components/MemberDetailHeader";
import DateRangeModal from "./components/DateRangeModal";
import UserTable from "./components/UserTable";
import CoachTable from "./components/CoachTable";
import PayoutModals from "./components/PayoutModals";
import { MdSearch, MdClose, MdCalendarToday } from "react-icons/md";
import { FaChevronDown } from "react-icons/fa6";
import {
  mockApi,
  UserTransaction,
  CoachDispute,
  CoachWithdrawal,
  CoachTransaction
} from "@/lib/mock-data";

type UserTabType = "All Transactions" | "Completed" | "Pending" | "Refunds";
type CoachTabType = "All Transaction" | "Completed" | "Pending" | "Refund" | "Cancel" | "Cancel by Stripe";
type WithdrawalTabType = "All Withdrawals" | "Pending" | "Accept" | "Rejected" | "Cancel" | "Cancel by Stripe";

// Premium Skeleton Loader for asynchronous UX
const TableSkeleton = () => (
  <div className="w-full space-y-4 p-6 animate-pulse">
    <div className="h-6 bg-zinc-100 rounded-lg w-1/4"></div>
    <div className="space-y-3 pt-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex gap-4 items-center border-b border-border pb-3">
          <div className="h-4 bg-zinc-100 rounded w-24"></div>
          <div className="h-4 bg-zinc-100 rounded flex-1"></div>
          <div className="h-4 bg-zinc-100 rounded w-16"></div>
          <div className="h-4 bg-zinc-100 rounded w-20"></div>
          <div className="h-4 bg-zinc-100 rounded w-24"></div>
        </div>
      ))}
    </div>
  </div>
);

export default function PaymentAndPayoutPage() {
  // Navigation detail view states
  const [selectedMember, setSelectedMember] = React.useState<any | null>(null);

  // Filters state
  const [roleType, setRoleType] = React.useState<"User" | "Coach">("User");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [viewType, setViewType] = React.useState<"All Transaction" | "Withdrawals">("All Transaction");

  // Tab sub-filters states
  const [userTab, setUserTab] = React.useState<UserTabType>("All Transactions");
  const [coachTab, setCoachTab] = React.useState<CoachTabType>("All Transaction");
  const [withdrawalTab, setWithdrawalTab] = React.useState<WithdrawalTabType>("All Withdrawals");

  // Local state databases for mock data loaded from mockApi
  const [userTransactions, setUserTransactions] = React.useState<UserTransaction[]>([]);
  const [coachTransactions, setCoachTransactions] = React.useState<CoachTransaction[]>([]);
  const [coachDisputes, setCoachDisputes] = React.useState<CoachDispute[]>([]);
  const [coachWithdrawals, setCoachWithdrawals] = React.useState<CoachWithdrawal[]>([]);
  const [loading, setLoading] = React.useState(true);

  // Focus actions context menu
  const [activeMenuId, setActiveMenuId] = React.useState<string | null>(null);

  // Custom calendar date range picker modal states
  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false);
  const [selectedRangeText, setSelectedRangeText] = React.useState("Select Date Range");
  const [startDate, setStartDate] = React.useState<Date | null>(null);
  const [endDate, setEndDate] = React.useState<Date | null>(null);

  // Action Confirmation Modals State mapping (Screenshots 1-5)
  const [activeModalType, setActiveModalType] = React.useState<"accept" | "reject" | "hold" | "cancel" | "cancel_by_stripe" | null>(null);
  const [selectedRecordId, setSelectedRecordId] = React.useState<string | null>(null);
  const [selectedRecordType, setSelectedRecordType] = React.useState<"withdrawal" | "transaction" | "user_transaction" | null>(null);
  const [modalAmountValue, setModalAmountValue] = React.useState("");

  // Load payout lists from mockApi
  const loadPayoutData = React.useCallback(async () => {
    try {
      const [txns, disputes, withdrawals, coachTxns] = await Promise.all([
        mockApi.getPayoutUserTransactions(),
        mockApi.getPayoutCoachDisputes(),
        mockApi.getPayoutCoachWithdrawals(),
        mockApi.getPayoutCoachTransactions()
      ]);
      setUserTransactions(txns);
      setCoachDisputes(disputes);
      setCoachWithdrawals(withdrawals);
      setCoachTransactions(coachTxns);
    } catch (err) {
      console.error("Failed to load payout details from mockApi:", err);
    }
  }, []);

  React.useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      loadPayoutData().then(() => setLoading(false));
    }, 450); // Simulate network latency
    return () => clearTimeout(timer);
  }, [loadPayoutData, roleType, viewType]);

  // Reset viewType when role swaps to ensure clean default page tabs
  React.useEffect(() => {
    if (roleType === "User") {
      setViewType("All Transaction");
    }
  }, [roleType]);

  // Close active action menus when clicking outside
  React.useEffect(() => {
    const handleOutsideClick = () => setActiveMenuId(null);
    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, []);

  // Trigger Withdrawal Action modal opening
  const handleUpdateWithdrawalStatusClick = (id: string, status: CoachWithdrawal["status"], amount: string) => {
    setSelectedRecordId(id);
    setSelectedRecordType("withdrawal");
    
    // Default the amount input for accept modal
    const rawAmt = amount.replace(/[^0-9]/g, ""); // extract numbers
    setModalAmountValue(rawAmt ? `${rawAmt}$` : ""); 
    
    if (status === "Completed") setActiveModalType("accept");
    else if (status === "Rejected") setActiveModalType("reject");
    else if (status === "Hold") setActiveModalType("hold");
    else if (status === "Cancel") setActiveModalType("cancel");
    else if (status === "Cancel by Stripe") setActiveModalType("cancel_by_stripe");
  };

  // Trigger Coach Transaction Action modal opening
  const handleUpdateTransactionStatusClick = (id: string, status: CoachTransaction["status"], amount: string) => {
    setSelectedRecordId(id);
    setSelectedRecordType("transaction");
    
    const rawAmt = amount.replace(/[^0-9]/g, "");
    setModalAmountValue(rawAmt ? `${rawAmt}$` : "");

    if (status === "Completed") setActiveModalType("accept");
    else if (status === "Rejected") setActiveModalType("reject");
    else if (status === "Cancel") setActiveModalType("cancel");
    else if (status === "Cancel by Stripe") setActiveModalType("cancel_by_stripe");
  };

  // Handle User transaction Cancel action (triggers modal)
  const handleUserCancelClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSelectedRecordId(id);
    setSelectedRecordType("user_transaction");
    setActiveModalType("cancel");
    setActiveMenuId(null);
  };

  // Process and save modal decisions in-memory
  const handleModalSubmit = async (amount: string, noteOrReason: string) => {
    if (!selectedRecordId || !selectedRecordType || !activeModalType) return;
    
    let targetStatus: any = "Completed";
    if (activeModalType === "accept") targetStatus = "Completed";
    else if (activeModalType === "reject") targetStatus = "Rejected";
    else if (activeModalType === "hold") targetStatus = "Hold";
    else if (activeModalType === "cancel") targetStatus = "Cancel";
    else if (activeModalType === "cancel_by_stripe") targetStatus = "Cancel by Stripe";

    try {
      if (selectedRecordType === "withdrawal") {
        await mockApi.updateCoachWithdrawalStatus(selectedRecordId, targetStatus);
      } else if (selectedRecordType === "transaction") {
        if (targetStatus === "Rejected") {
          targetStatus = "Refunded"; // Align transaction rejected status to Refunded badge
        }
        await mockApi.updateCoachTransactionStatus(selectedRecordId, targetStatus);
      } else if (selectedRecordType === "user_transaction") {
        await mockApi.updateUserTransactionStatus(selectedRecordId, "Cancelled");
      }
      
      await loadPayoutData();
      setActiveModalType(null);
      setSelectedRecordId(null);
      setSelectedRecordType(null);
    } catch (err) {
      console.error("Failed to submit modal decision:", err);
    }
  };

  const handleRowClick = (member: { name: string; avatar: string }) => {
    setSelectedMember({
      name: member.name,
      avatar: member.avatar,
      joinDate: "12/02/2025"
    });
  };

  // Parse DD/MM/YYYY date strings for comparing with Date objects
  const parseDDMMYYYY = (dateStr: string): Date => {
    const datePart = dateStr.split(" ")[0];
    const parts = datePart.split("/");
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // 0-indexed month
    const year = parseInt(parts[2], 10);
    return new Date(year, month, day);
  };

  // Date range filter utility
  const filterByDate = (dateStr: string) => {
    if (!startDate) return true;
    const itemDate = parseDDMMYYYY(dateStr);
    
    // Reset times to midnight to ensure exact day comparisons
    const checkDate = new Date(itemDate.getFullYear(), itemDate.getMonth(), itemDate.getDate());
    const sc = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());

    if (endDate) {
      const ec = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
      return checkDate >= sc && checkDate <= ec;
    }

    return checkDate.getTime() === sc.getTime();
  };

  // Filter computations
  const filteredUserTransactions = userTransactions.filter(t => {
    if (selectedMember && t.user !== selectedMember.name) return false;

    const matchesSearch = t.user.toLowerCase().includes(searchQuery.toLowerCase()) || t.id.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (!filterByDate(t.date)) return false;

    if (userTab === "Completed") return t.status === "Completed";
    if (userTab === "Pending") return t.status === "Pending";
    if (userTab === "Refunds") return t.status === "Refunded";
    return true;
  });

  const filteredCoachTransactions = coachTransactions.filter(t => {
    if (selectedMember && t.coach !== selectedMember.name) return false;

    const matchesSearch = t.coach.toLowerCase().includes(searchQuery.toLowerCase()) || t.id.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (!filterByDate(t.date)) return false;

    if (coachTab === "Completed") return t.status === "Completed";
    if (coachTab === "Pending") return t.status === "Pending";
    if (coachTab === "Refund") return t.status === "Refunded";
    if (coachTab === "Cancel") return t.status === "Cancel";
    if (coachTab === "Cancel by Stripe") return t.status === "Cancel by Stripe";
    return true;
  });

  const filteredCoachWithdrawals = coachWithdrawals.filter(w => {
    if (selectedMember && w.coach !== selectedMember.name) return false;

    const matchesSearch = w.coach.toLowerCase().includes(searchQuery.toLowerCase()) || w.id.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    const dateToFilter = viewType === "Withdrawals" ? w.date : w.withdrawalRequest;
    if (!filterByDate(dateToFilter)) return false;

    // Filter mapping for Withdrawals dropdown tab layout
    if (viewType === "Withdrawals") {
      if (withdrawalTab === "Pending") return w.status === "Pending";
      if (withdrawalTab === "Accept") return w.status === "Completed";
      if (withdrawalTab === "Rejected") return w.status === "Rejected";
      if (withdrawalTab === "Cancel") return w.status === "Cancel";
      if (withdrawalTab === "Cancel by Stripe") return w.status === "Cancel by Stripe";
      return true;
    }

    // Standard canceled withdrawals filter for standard tabs (Image 4)
    if (coachTab === "Cancel") return w.status === "Cancel";
    if (coachTab === "Cancel by Stripe") return w.status === "Cancel by Stripe";
    return true;
  });

  const filteredCoachDisputes = coachDisputes.filter(d => {
    if (selectedMember && d.coach !== selectedMember.name && d.user !== selectedMember.name) return false;

    const matchesSearch = d.user.toLowerCase().includes(searchQuery.toLowerCase()) || d.coach.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (!filterByDate(d.date)) return false;

    return true;
  });

  return (
    <div className="space-y-6 font-sans animate-in fade-in duration-300">

      {/* Member Details header */}
      {selectedMember && (
        <MemberDetailHeader
          member={selectedMember}
          onBack={() => setSelectedMember(null)}
          onExport={() => alert(`Exporting ledger sheet for ${selectedMember.name}...`)}
        />
      ) }

      {/* Stats indicators grid */}
      <StatsRow isDetailView={!!selectedMember} />

      {/* Table Container Card */}
      <div className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden flex flex-col p-6">
        <h3 className="text-lg font-sans font-bold text-slate-800 mb-6">Transaction History</h3>
        
        {/* Search bar input with green search icon */}
        <div className="relative flex-1 min-w-[200px] mb-5">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <MdSearch className="w-5 h-5 text-[#0da34c]" />
          </span>
          <input
            type="text"
            placeholder="Enter Name here"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#f8faf8] border border-border rounded-xl pl-10 pr-4 py-2 text-[14px] text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all h-10"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-foreground/50 hover:text-foreground cursor-pointer"
            >
              <MdClose className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Controls Row */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          {/* Coach / User selection Dropdown */}
          <div className="relative">
            <select
              value={roleType}
              onChange={(e) => setRoleType(e.target.value as "User" | "Coach")}
              className="appearance-none bg-[#e8f5e9] border border-[#c8e6c9] rounded-xl px-4 py-2 pr-10 text-sm font-semibold text-[#0da34c] focus:outline-none focus:ring-2 focus:ring-ring transition-all cursor-pointer h-10 min-w-[100px]"
            >
              <option value="User">User</option>
              <option value="Coach">Coach</option>
            </select>
            <FaChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-3 h-3 text-[#0da34c] pointer-events-none" />
          </div>

          {/* Date calendar trigger */}
          <button
            onClick={() => setIsCalendarOpen(true)}
            className="flex items-center gap-2 bg-[#e8f5e9] border border-[#c8e6c9] rounded-xl px-4 py-2 text-sm font-semibold text-[#0da34c] focus:outline-none focus:ring-2 focus:ring-ring transition-all cursor-pointer h-10 shrink-0"
          >
            <MdCalendarToday className="w-4 h-4 text-[#0da34c]" />
            <span>{selectedRangeText}</span>
          </button>

          {/* Withdrawals filter dropdown */}
          {roleType === "Coach" && (
            <div className="relative">
              <select
                value={viewType}
                onChange={(e) => setViewType(e.target.value as "All Transaction" | "Withdrawals")}
                className="appearance-none bg-[#e8f5e9] border border-[#c8e6c9] rounded-xl px-4 py-2 pr-10 text-sm font-semibold text-[#0da34c] focus:outline-none focus:ring-2 focus:ring-ring transition-all cursor-pointer h-10 min-w-[140px]"
              >
                <option value="All Transaction">All Transaction</option>
                <option value="Withdrawals">Withdrawals</option>
              </select>
              <FaChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-3 h-3 text-[#0da34c] pointer-events-none" />
            </div>
          )}
        </div>

        {/* Sub-tabs Selection Row */}
        <div className="flex bg-[#f3f4f3] p-1 rounded-xl items-center gap-1 self-start mb-6 overflow-x-auto max-w-full font-sans">
          {roleType === "User" ? (
            (["All Transactions", "Completed", "Pending", "Refunds"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setUserTab(tab)}
                className={`
                  px-4 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer
                  ${userTab === tab ? "bg-[#0da34c] text-white shadow-sm" : "text-[#6D6D6D] hover:text-[#585858]"}
                `}
              >
                {tab}
              </button>
            ))
          ) : viewType === "Withdrawals" ? (
            (["All Withdrawals", "Pending", "Accept", "Rejected", "Cancel", "Cancel by Stripe"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setWithdrawalTab(tab)}
                className={`
                  px-4 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer
                  ${withdrawalTab === tab ? "bg-[#0da34c] text-white shadow-sm" : ""}
                  ${withdrawalTab !== tab && tab === "Cancel by Stripe" ? "text-red-500 hover:text-red-600" : ""}
                  ${withdrawalTab !== tab && tab !== "Cancel by Stripe" ? "text-[#6D6D6D] hover:text-[#585858]" : ""}
                `}
              >
                {tab}
              </button>
            ))
          ) : (
            (["All Transaction", "Completed", "Pending", "Refund", "Cancel", "Cancel by Stripe"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setCoachTab(tab)}
                className={`
                  px-4 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer
                  ${coachTab === tab ? "bg-[#0da34c] text-white shadow-sm" : ""}
                  ${coachTab !== tab && tab === "Cancel by Stripe" ? "text-red-500 hover:text-red-600" : ""}
                  ${coachTab !== tab && tab !== "Cancel by Stripe" ? "text-[#6D6D6D] hover:text-[#585858]" : ""}
                `}
              >
                {tab}
              </button>
            ))
          )}
        </div>

        {/* Data Tables list */}
        <div className="overflow-x-auto -mx-6 border-t border-border">
          {loading ? (
            <TableSkeleton />
          ) : roleType === "User" ? (
            filteredUserTransactions.length === 0 ? (
              <div className="py-12 text-center text-[#6D6D6D] font-medium font-sans">No transactions found for the selected filter criteria.</div>
            ) : (
              <UserTable
                transactions={filteredUserTransactions}
                onRowClick={(txn) => handleRowClick({ name: txn.user, avatar: txn.avatar })}
                onCancelTxn={handleUserCancelClick}
                activeMenuId={activeMenuId}
                setActiveMenuId={setActiveMenuId}
              />
            )
          ) : (
            (viewType === "Withdrawals" ? filteredCoachWithdrawals.length === 0 : filteredCoachTransactions.length === 0 && filteredCoachWithdrawals.length === 0 && filteredCoachDisputes.length === 0) ? (
              <div className="py-12 text-center text-[#6D6D6D] font-medium font-sans">No items found for the selected filter criteria.</div>
            ) : (
              <CoachTable
                viewType={viewType}
                activeTab={viewType === "Withdrawals" ? withdrawalTab : coachTab}
                transactions={filteredCoachTransactions}
                withdrawals={filteredCoachWithdrawals}
                disputes={filteredCoachDisputes}
                onRowClick={handleRowClick}
                onUpdateWithdrawalStatus={handleUpdateWithdrawalStatusClick}
                onUpdateTransactionStatus={handleUpdateTransactionStatusClick}
                activeMenuId={activeMenuId}
                setActiveMenuId={setActiveMenuId}
              />
            )
          )}
        </div>
      </div>

      {/* Date picker modal */}
      <DateRangeModal
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        startDate={startDate}
        endDate={endDate}
        onSelectRange={(start, end, label) => {
          setStartDate(start);
          setEndDate(end);
          setSelectedRangeText(label);
        }}
      />

      {/* Payout Action decision modals */}
      <PayoutModals
        isOpen={!!activeModalType}
        type={activeModalType}
        defaultAmount={modalAmountValue}
        onClose={() => {
          setActiveModalType(null);
          setSelectedRecordId(null);
          setSelectedRecordType(null);
        }}
        onSubmit={handleModalSubmit}
      />

    </div>
  );
}
