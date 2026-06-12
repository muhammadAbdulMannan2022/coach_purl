"use client";

import * as React from "react";
import { useRouter, useParams } from "next/navigation";
import { mockApi, UserProfile } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { 
  MdArrowBack, 
  MdMoreHoriz, 
  MdCalendarToday, 
  MdEvent, 
  MdAttachMoney, 
  MdAccessTime,
  MdBook,
  MdMessage,
  MdCall,
  MdStar
} from "react-icons/md";

type ActionType = "activate" | "flag" | "block" | null;

export default function UserDetailPage() {
  const router = useRouter();
  const { id } = useParams() as { id: string };

  const [loading, setLoading] = React.useState(true);
  const [user, setUser] = React.useState<UserProfile | null>(null);
  
  // Dropdown menu state
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  // Modal confirmation states
  const [pendingAction, setPendingAction] = React.useState<ActionType>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Active payment tab
  const [activeTab, setActiveTab] = React.useState("Completed Sessions");

  const loadUser = React.useCallback(async () => {
    try {
      const data = await mockApi.getUserById(id);
      setUser(data);
    } catch (error) {
      console.error("Failed to load user:", error);
    }
  }, [id]);

  React.useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      loadUser().then(() => setLoading(false));
    }, 450);
    return () => clearTimeout(timer);
  }, [loadUser]);

  // Handle outside clicks to close dropdown menus
  React.useEffect(() => {
    const handleOutsideClick = () => {
      setIsMenuOpen(false);
    };
    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, []);

  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(prev => !prev);
  };

  const initiateAction = (e: React.MouseEvent, action: ActionType) => {
    e.stopPropagation();
    setIsMenuOpen(false);
    setPendingAction(action);
    setIsModalOpen(true);
  };

  const handleCancelAction = () => {
    setIsModalOpen(false);
    setPendingAction(null);
  };

  const handleConfirmAction = async () => {
    if (!user || !pendingAction) return;
    setIsSubmitting(true);

    let targetStatus: UserProfile["status"] = "Active";
    if (pendingAction === "block") targetStatus = "Blocked";
    if (pendingAction === "flag") targetStatus = "Flagged";

    try {
      await mockApi.updateUserStatus(user.id, targetStatus);
      setTimeout(async () => {
        await loadUser();
        setIsSubmitting(false);
        setIsModalOpen(false);
        setPendingAction(null);
      }, 600);
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  const getModalContent = () => {
    if (pendingAction === "block") {
      return {
        title: "Are You sure About Blocking the Person?",
        subtext: "Your request has been successfully submitted. You will receive a notification once it has been processed. Thank you for your patience!",
      };
    }
    if (pendingAction === "flag") {
      return {
        title: "Are You sure About Marking the Person Flagged?",
        subtext: "Your request has been successfully submitted. You will receive a notification once it has been processed. Thank you for your patience!",
      };
    }
    return {
      title: "You are Activating the Account",
      subtext: "Your request has been successfully submitted. You will receive a notification once it has been processed. Thank you for your patience!",
    };
  };

  if (loading) {
    return (
      <div className="space-y-6 font-sans animate-pulse">
        <div className="h-6 bg-zinc-100 rounded w-20" />
        <div className="bg-white border border-border p-6 rounded-2xl h-40" />
        <div className="grid grid-cols-4 gap-4 h-24" />
        <div className="bg-white border border-border p-6 rounded-2xl h-80" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-16 font-sans">
        <h3 className="text-xl font-bold text-slate-800">User Not Found</h3>
        <p className="text-sm text-[#6D6D6D] mt-2">The requested user profile does not exist or has been deleted.</p>
        <Button 
          variant="outline" 
          onClick={() => router.push("/dashboard/users")}
          className="mt-6 cursor-pointer"
        >
          Return to Users Directory
        </Button>
      </div>
    );
  }

  const modalContent = getModalContent();

  return (
    <div className="space-y-6 font-sans animate-in fade-in duration-300">
      
      {/* Back to User Management Directory */}
      <div>
        <button
          onClick={() => router.push("/dashboard/users")}
          className="inline-flex items-center gap-2 text-[14px] font-semibold text-[#6D6D6D] hover:text-[#0da34c] transition-colors cursor-pointer"
        >
          <MdArrowBack className="w-4 h-4" />
          <span>Back</span>
        </button>
      </div>

      {/* User Bio Header Section */}
      <div className="bg-white border border-border rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          {/* Large Avatar */}
          <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-border shrink-0 bg-zinc-50">
            <img
              src={user.avatar}
              alt={user.name}
              className="object-cover w-full h-full"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200";
              }}
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-slate-800 tracking-tight">{user.name}</h2>
              <span
                className={`
                  inline-flex px-2 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider
                  ${user.status === "Active" ? "bg-emerald-50 text-[#0da34c] border border-emerald-100" : ""}
                  ${user.status === "Flagged" ? "bg-amber-50 text-amber-600 border border-amber-100" : ""}
                  ${user.status === "Blocked" ? "bg-red-50 text-red-500 border border-red-100" : ""}
                `}
              >
                {user.status}
              </span>
            </div>
            <p className="text-[14px] text-[#6D6D6D]">{user.email}</p>
            <p className="text-xs text-[#6D6D6D]/80 flex items-center gap-1.5 pt-0.5">
              <MdCalendarToday className="w-3.5 h-3.5" />
              Joined {user.joinDate}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3.5 relative">
          <Button
            onClick={() => alert(`Initiating instant messaging with ${user.name}...`)}
            className="bg-[#0da34c] hover:bg-[#0da34c]/95 text-white font-semibold text-sm px-6 h-10 shadow-sm cursor-pointer"
          >
            Message
          </Button>

          {/* Actions Menu Trigger */}
          <button
            onClick={toggleMenu}
            className="p-2 border border-border hover:bg-zinc-50 rounded-xl transition-colors cursor-pointer"
            aria-label="More options"
          >
            <MdMoreHoriz className="w-6 h-6 text-[#6D6D6D]" />
          </button>

          {/* Context Options Overlay */}
          {isMenuOpen && (
            <div
              className="absolute right-0 top-12 z-30 w-44 bg-white border border-border rounded-xl shadow-lg p-1.5 animate-in fade-in slide-in-from-top-1 duration-100 flex flex-col whitespace-normal"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={(e) => initiateAction(e, "activate")}
                className="w-full px-3.5 py-2 text-xs font-semibold text-[#6D6D6D] hover:bg-[#f8faf8] hover:text-[#0da34c] rounded-lg transition-colors text-left cursor-pointer"
              >
                Activate
              </button>
              <button
                onClick={(e) => initiateAction(e, "flag")}
                className="w-full px-3.5 py-2 text-xs font-semibold text-[#6D6D6D] hover:bg-[#f8faf8] hover:text-amber-600 rounded-lg transition-colors text-left cursor-pointer"
              >
                Mark Flag
              </button>
              <button
                onClick={(e) => initiateAction(e, "block")}
                className="w-full px-3.5 py-2 text-xs font-semibold text-red-500 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors text-left cursor-pointer"
              >
                Block Account
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Row of 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-white border border-border p-5 rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center gap-4 min-h-[100px]">
          <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-orange-50 text-orange-600 shrink-0">
            <MdCalendarToday className="w-5.5 h-5.5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[#6D6D6D]">No Contact Days</p>
            <p className="text-2xl font-bold text-slate-800 mt-0.5">{user.noContactDays}</p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white border border-border p-5 rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center gap-4 min-h-[100px]">
          <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-purple-50 text-purple-600 shrink-0">
            <MdEvent className="w-5.5 h-5.5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[#6D6D6D]">Total Session</p>
            <p className="text-2xl font-bold text-slate-800 mt-0.5">{user.totalSessions}</p>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white border border-border p-5 rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center gap-4 min-h-[100px]">
          <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-emerald-50 text-[#0da34c] shrink-0">
            <MdAttachMoney className="w-5.5 h-5.5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[#6D6D6D]">Total Spent</p>
            <p className="text-2xl font-bold text-slate-800 mt-0.5">{user.totalSpent}</p>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white border border-border p-5 rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center gap-4 min-h-[100px]">
          <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 shrink-0">
            <MdAccessTime className="w-5.5 h-5.5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[#6D6D6D]">Last Active</p>
            <p className="text-2xl font-bold text-slate-800 mt-0.5">{user.lastActive}</p>
          </div>
        </div>
      </div>

      {/* Activity Overview */}
      <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 mb-5 border-b border-border pb-3">Activity Overview</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Journal Entries */}
          <div className="bg-[#f8faf8] border border-border/80 rounded-xl p-4.5 flex items-center gap-4.5">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-orange-100 text-orange-600 shrink-0">
              <MdBook className="w-5.5 h-5.5" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-slate-800">{user.activityOverview.journalEntries}</p>
              <p className="text-xs text-[#6D6D6D]/95 mt-0.5">Journal Entries</p>
              <p className="text-[10px] text-[#6D6D6D]/75 mt-0.5">Total Entries</p>
            </div>
          </div>

          {/* Total Texts */}
          <div className="bg-[#f8faf8] border border-border/80 rounded-xl p-4.5 flex items-center gap-4.5">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-purple-100 text-purple-600 shrink-0">
              <MdMessage className="w-5.5 h-5.5" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-slate-800">{user.activityOverview.totalTexts}</p>
              <p className="text-xs text-[#6D6D6D]/95 mt-0.5">Total Text with coaches</p>
              <p className="text-[10px] text-[#6D6D6D]/75 mt-0.5">Total Message</p>
            </div>
          </div>

          {/* Total Calls */}
          <div className="bg-[#f8faf8] border border-border/80 rounded-xl p-4.5 flex items-center gap-4.5">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-100 text-blue-600 shrink-0">
              <MdCall className="w-5.5 h-5.5" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-slate-800">{user.activityOverview.totalCalls}</p>
              <p className="text-xs text-[#6D6D6D]/95 mt-0.5">Total Call with coaches</p>
              <p className="text-[10px] text-[#6D6D6D]/75 mt-0.5">Total Entries</p>
            </div>
          </div>

          {/* Time Relapsed */}
          <div className="bg-[#f8faf8] border border-border/80 rounded-xl p-4.5 flex items-center gap-4.5">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-red-100 text-red-500 shrink-0">
              <MdAccessTime className="w-5.5 h-5.5" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-slate-800">{user.activityOverview.timeRelapsed}</p>
              <p className="text-xs text-[#6D6D6D]/95 mt-0.5">Time Relapsed</p>
              <p className="text-[10px] text-[#6D6D6D]/75 mt-0.5">{user.activityOverview.timeRelapsedLabel}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Last Session & Payments Section */}
      <div className="bg-white border border-border rounded-2xl p-6 shadow-sm flex flex-col">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Last Session & Payments</h3>
        
        {/* Navigation Tabs */}
        <div className="flex bg-[#f3f4f3] p-1 rounded-xl items-center gap-1 self-start overflow-x-auto max-w-full mb-6">
          {["Completed Sessions", "Upcoming Session", "Payment History"].map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`
                  px-4 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer
                  ${isActive ? "bg-[#0da34c] text-white shadow-sm" : "text-[#6D6D6D] hover:text-[#585858]"}
                `}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Payments / Sessions Table */}
        <div className="overflow-x-auto">
          {user.sessionsLog.length === 0 ? (
            <div className="text-center py-10 text-[#6D6D6D]/80">
              <p className="text-sm font-semibold">No transactions found</p>
              <p className="text-xs text-foreground/55 mt-1">There are no records for this section.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border text-[12px] font-semibold text-[#6D6D6D] uppercase tracking-wider">
                  <th className="py-3.5 pr-4 text-left">Session Description</th>
                  <th className="py-3.5 px-4 text-right">Amount</th>
                  <th className="py-3.5 pl-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 text-[14px]">
                {user.sessionsLog.map((log) => (
                  <tr key={log.id} className="hover:bg-zinc-50/30 transition-colors">
                    {/* Description & DateTime */}
                    <td className="py-4.5 pr-4 text-left">
                      <p className="font-bold text-slate-800">{log.title}</p>
                      <p className="text-xs text-[#6D6D6D]/80 mt-0.5">{log.dateTime}</p>
                    </td>

                    {/* Amount */}
                    <td className="py-4.5 px-4 text-right font-bold text-slate-800">
                      {log.amount}
                    </td>

                    {/* Status badge */}
                    <td className="py-4.5 pl-4 text-right whitespace-nowrap">
                      <span
                        className={`
                          inline-flex px-3 py-1 rounded-full text-xs font-semibold
                          ${log.status === "Complete" ? "bg-zinc-100 text-zinc-600 border border-zinc-200" : ""}
                          ${log.status === "Pending" ? "bg-amber-50 text-amber-600 border border-amber-100" : ""}
                        `}
                      >
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Action Confirmation Modal */}
      <Modal isOpen={isModalOpen} onClose={handleCancelAction} size="md">
        <div className="flex flex-col text-center md:text-left py-2 font-sans">
          {/* Header Title */}
          <h3 className="text-[20px] font-bold text-slate-800 tracking-tight leading-snug">
            {modalContent.title}
          </h3>
          
          {/* Description subtext */}
          <p className="text-[14px] text-[#6D6D6D] mt-2.5 leading-relaxed">
            {modalContent.subtext}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-end mt-7">
            <Button
              variant="outline"
              onClick={handleCancelAction}
              disabled={isSubmitting}
              className="px-5 text-sm h-10 border-border text-[#6D6D6D] hover:bg-zinc-50 cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmAction}
              disabled={isSubmitting}
              className="px-5 text-sm h-10 bg-[#0da34c] hover:bg-[#0da34c]/95 text-white shadow-sm font-semibold cursor-pointer"
            >
              {isSubmitting ? "Processing..." : "Yes, Confirm"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
