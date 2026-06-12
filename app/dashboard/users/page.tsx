"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { mockApi, UserProfile } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import StatCard from "@/components/ui/dashboardCard";
import { MdMoreVert, MdSearch, MdClose } from "react-icons/md";

type ActionType = "activate" | "flag" | "block" | null;

export default function UserManagementPage() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(true);
  const [users, setUsers] = React.useState<UserProfile[]>([]);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [activeFilter, setActiveFilter] = React.useState("All Users");
  
  // Action dropdown states
  const [activeMenuUserId, setActiveMenuUserId] = React.useState<string | null>(null);
  
  // Confirmation Modal states
  const [confirmingUser, setConfirmingUser] = React.useState<UserProfile | null>(null);
  const [pendingAction, setPendingAction] = React.useState<ActionType>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Load users
  const loadUsers = React.useCallback(async () => {
    try {
      const data = await mockApi.getUsers(activeFilter, searchQuery);
      setUsers(data);
    } catch (error) {
      console.error("Failed to load users:", error);
    }
  }, [activeFilter, searchQuery]);

  React.useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      loadUsers().then(() => setLoading(false));
    }, 450);
    return () => clearTimeout(timer);
  }, [loadUsers]);

  // Handle outside clicks to close dropdown menus
  React.useEffect(() => {
    const handleOutsideClick = () => {
      setActiveMenuUserId(null);
    };
    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterClick = (filter: string) => {
    setActiveFilter(filter);
  };

  const toggleMenu = (e: React.MouseEvent, userId: string) => {
    e.stopPropagation();
    setActiveMenuUserId(prev => (prev === userId ? null : userId));
  };

  const initiateAction = (e: React.MouseEvent, user: UserProfile, action: ActionType) => {
    e.stopPropagation();
    setActiveMenuUserId(null); // Close dropdown
    setConfirmingUser(user);
    setPendingAction(action);
    setIsModalOpen(true);
  };

  const handleCancelAction = () => {
    setIsModalOpen(false);
    setConfirmingUser(null);
    setPendingAction(null);
  };

  const handleConfirmAction = async () => {
    if (!confirmingUser || !pendingAction) return;
    setIsSubmitting(true);
    
    let targetStatus: UserProfile["status"] = "Active";
    if (pendingAction === "block") targetStatus = "Blocked";
    if (pendingAction === "flag") targetStatus = "Flagged";

    try {
      await mockApi.updateUserStatus(confirmingUser.id, targetStatus);
      // Success delay for realistic network update
      setTimeout(async () => {
        await loadUsers();
        setIsSubmitting(false);
        setIsModalOpen(false);
        setConfirmingUser(null);
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

  const modalContent = getModalContent();

  return (
    <div className="space-y-6 font-sans animate-in fade-in duration-300">
      
      {/* 4-Card Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Users" 
          value="9,480" 
          valueColor="text-[#b08b5c] font-bold" 
        />
        <StatCard 
          title="Active Today" 
          value="756" 
          valueColor="text-[#0da34c] font-bold" 
        />
        <StatCard 
          title="Flagged Users" 
          value="72" 
          valueColor="text-[#0f766e] font-bold" 
        />
        <StatCard 
          title="Suspended" 
          value="23" 
          valueColor="text-[#c2410c] font-bold" 
        />
      </div>

      {/* Directory Content Table Card */}
      <div className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden flex flex-col">
        {/* Title / Heading inside container */}
        <div className="px-6 pt-6 pb-2">
          <h2 className="text-lg font-bold text-slate-800">All Users</h2>
        </div>

        {/* Filter / Search Bar */}
        <div className="px-6 py-4 flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <MdSearch className="w-5 h-5 text-foreground/50" />
            </span>
            <input
              type="text"
              placeholder="Enter Name here"
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full bg-[#f8faf8] border border-border rounded-xl pl-10 pr-4 py-2.5 text-[14px] text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-foreground/50 hover:text-foreground"
              >
                <MdClose className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="flex bg-[#f3f4f3] p-1 rounded-xl items-center gap-1 self-start md:self-auto overflow-x-auto max-w-full">
            {["All Users", "Active", "Flagged", "Blocked"].map((tab) => {
              const isActive = activeFilter === tab;
              return (
                <button
                  key={tab}
                  onClick={() => handleFilterClick(tab)}
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
        </div>

        {/* Directory User Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="px-6 py-12 space-y-4 animate-pulse">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-4 py-3 border-b border-border last:border-b-0">
                  <div className="w-10 h-10 bg-zinc-100 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-zinc-100 rounded w-1/4" />
                    <div className="h-3 bg-zinc-100 rounded w-1/3" />
                  </div>
                  <div className="h-6 bg-zinc-100 rounded w-16" />
                </div>
              ))}
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-16 text-[#6D6D6D]">
              <p className="text-base font-semibold">No users found</p>
              <p className="text-xs text-foreground/60 mt-1">Try adjusting your search query or filter options.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50 border-b border-border text-[13px] font-semibold text-[#6D6D6D] tracking-wide">
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">E-mail</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">No Contact Days</th>
                  <th className="px-6 py-4">Join Date</th>
                  <th className="px-6 py-4">Last Active</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-[14px]">
                {users.map((user) => (
                  <tr
                    key={user.id}
                    onClick={() => router.push(`/dashboard/users/${user.id}`)}
                    className="hover:bg-zinc-50/50 cursor-pointer transition-colors"
                  >
                    {/* User Profile */}
                    <td className="px-6 py-4.5 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="relative w-9 h-9 rounded-full overflow-hidden border border-border shrink-0 bg-zinc-100">
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="object-cover w-full h-full"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100";
                            }}
                          />
                        </div>
                        <span className="font-bold text-slate-800">{user.name}</span>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-6 py-4.5 text-[#6D6D6D] max-w-[200px] truncate">
                      {user.email}
                    </td>

                    {/* Status Badge */}
                    <td className="px-6 py-4.5 whitespace-nowrap">
                      <span
                        className={`
                          inline-flex px-2.5 py-0.5 rounded-md text-xs font-semibold uppercase tracking-wider
                          ${user.status === "Active" ? "bg-emerald-50 text-[#0da34c] border border-emerald-100" : ""}
                          ${user.status === "Flagged" ? "bg-amber-50 text-amber-600 border border-amber-100" : ""}
                          ${user.status === "Blocked" ? "bg-red-50 text-red-500 border border-red-100" : ""}
                        `}
                      >
                        {user.status}
                      </span>
                    </td>

                    {/* No Contact Days */}
                    <td className="px-6 py-4.5 text-slate-800 font-medium">
                      {user.noContactDays} Days
                    </td>

                    {/* Join Date */}
                    <td className="px-6 py-4.5 text-[#6D6D6D]">
                      {user.joinDate}
                    </td>

                    {/* Last Active */}
                    <td className="px-6 py-4.5 text-[#6D6D6D]">
                      {user.lastActive}
                    </td>

                    {/* Actions dropdown */}
                    <td className="px-6 py-4.5 text-center relative whitespace-nowrap">
                      <button
                        onClick={(e) => toggleMenu(e, user.id)}
                        className="p-1.5 hover:bg-zinc-100 rounded-full transition-colors inline-block focus:outline-none cursor-pointer"
                        aria-label="Actions menu"
                      >
                        <MdMoreVert className="w-5 h-5 text-slate-500" />
                      </button>

                      {/* Floating Dropdown Context Panel */}
                      {activeMenuUserId === user.id && (
                        <div
                          className="absolute right-6 top-10 mt-1 z-30 w-44 bg-white border border-border rounded-xl shadow-lg p-1.5 animate-in fade-in slide-in-from-top-1 duration-100 text-left flex flex-col whitespace-normal"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={(e) => initiateAction(e, user, "activate")}
                            className="w-full px-3.5 py-2 text-xs font-semibold text-[#6D6D6D] hover:bg-[#f8faf8] hover:text-[#0da34c] rounded-lg transition-colors text-left cursor-pointer"
                          >
                            Activate
                          </button>
                          <button
                            onClick={(e) => initiateAction(e, user, "flag")}
                            className="w-full px-3.5 py-2 text-xs font-semibold text-[#6D6D6D] hover:bg-[#f8faf8] hover:text-amber-600 rounded-lg transition-colors text-left cursor-pointer"
                          >
                            Mark Flag
                          </button>
                          <button
                            onClick={(e) => initiateAction(e, user, "block")}
                            className="w-full px-3.5 py-2 text-xs font-semibold text-red-500 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors text-left cursor-pointer"
                          >
                            Block Account
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
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
