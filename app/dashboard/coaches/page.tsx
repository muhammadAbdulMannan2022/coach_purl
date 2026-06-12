"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { mockApi, CoachDetailProfile } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import StatCard from "@/components/ui/dashboardCard";
import { MdSearch, MdMoreVert, MdClose, MdStar, MdStarBorder, MdInfoOutline } from "react-icons/md";

export default function CoachManagementPage() {
  const router = useRouter();
  
  // Tab states
  const [activeTab, setActiveTab] = React.useState<"all" | "info">("all");
  
  // All Coaches states
  const [loadingCoaches, setLoadingCoaches] = React.useState(true);
  const [coaches, setCoaches] = React.useState<CoachDetailProfile[]>([]);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("All Coaches");
  const [activeMenuCoachId, setActiveMenuCoachId] = React.useState<string | null>(null);

  // Coache info Tags states
  const [loadingTags, setLoadingTags] = React.useState(true);
  const [styles, setStyles] = React.useState<string[]>([]);
  const [expertise, setExpertise] = React.useState<string[]>([]);
  const [levels, setLevels] = React.useState<string[]>([]);
  
  // Tag input fields
  const [newStyle, setNewStyle] = React.useState("");
  const [newExpertise, setNewExpertise] = React.useState("");
  const [newLevel, setNewLevel] = React.useState("");

  // Confirmation actions
  const [confirmingCoach, setConfirmingCoach] = React.useState<CoachDetailProfile | null>(null);
  const [pendingAction, setPendingAction] = React.useState<"approve" | "reject" | "block" | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [rejectReasonText, setRejectReasonText] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Load coaches
  const loadCoaches = React.useCallback(async () => {
    try {
      const data = await mockApi.getDashboardCoaches(statusFilter, searchQuery);
      setCoaches(data);
    } catch (err) {
      console.error(err);
    }
  }, [statusFilter, searchQuery]);

  React.useEffect(() => {
    if (activeTab === "all") {
      setLoadingCoaches(true);
      const timer = setTimeout(() => {
        loadCoaches().then(() => setLoadingCoaches(false));
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [activeTab, loadCoaches]);

  // Load tags
  const loadTags = React.useCallback(async () => {
    try {
      setLoadingTags(true);
      const [s, e, l] = await Promise.all([
        mockApi.getCoachingTags("style"),
        mockApi.getCoachingTags("expertise"),
        mockApi.getCoachingTags("level")
      ]);
      setStyles(s);
      setExpertise(e);
      setLevels(l);
      setLoadingTags(false);
    } catch (err) {
      console.error(err);
    }
  }, []);

  React.useEffect(() => {
    if (activeTab === "info") {
      loadTags();
    }
  }, [activeTab, loadTags]);

  // Close menus on window click
  React.useEffect(() => {
    const handleOutsideClick = () => setActiveMenuCoachId(null);
    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, []);

  // Filter actions
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleStatusFilterClick = (filter: string) => {
    setStatusFilter(filter);
  };

  const toggleActionsMenu = (e: React.MouseEvent, coachId: string) => {
    e.stopPropagation();
    setActiveMenuCoachId(prev => (prev === coachId ? null : coachId));
  };

  // Tag interactions
  const handleAddTag = async (category: "style" | "expertise" | "level") => {
    let tag = "";
    if (category === "style") {
      tag = newStyle.trim();
      if (!tag) return;
      const updated = await mockApi.addCoachingTag("style", tag);
      setStyles(updated);
      setNewStyle("");
    } else if (category === "expertise") {
      tag = newExpertise.trim();
      if (!tag) return;
      const updated = await mockApi.addCoachingTag("expertise", tag);
      setExpertise(updated);
      setNewExpertise("");
    } else {
      tag = newLevel.trim();
      if (!tag) return;
      const updated = await mockApi.addCoachingTag("level", tag);
      setLevels(updated);
      setNewLevel("");
    }
  };

  const handleDeleteTag = async (category: "style" | "expertise" | "level", tag: string) => {
    if (category === "style") {
      const updated = await mockApi.deleteCoachingTag("style", tag);
      setStyles(updated);
    } else if (category === "expertise") {
      const updated = await mockApi.deleteCoachingTag("expertise", tag);
      setExpertise(updated);
    } else {
      const updated = await mockApi.deleteCoachingTag("level", tag);
      setLevels(updated);
    }
  };

  // Modal actions
  const initiateAction = (e: React.MouseEvent, coach: CoachDetailProfile, action: "approve" | "reject" | "block") => {
    e.stopPropagation();
    setActiveMenuCoachId(null);
    setConfirmingCoach(coach);
    setPendingAction(action);
    setRejectReasonText("");
    setIsModalOpen(true);
  };

  const handleCancelModal = () => {
    setIsModalOpen(false);
    setConfirmingCoach(null);
    setPendingAction(null);
  };

  const handleConfirmModal = async () => {
    if (!confirmingCoach || !pendingAction) return;
    setIsSubmitting(true);
    
    let targetStatus: CoachDetailProfile["status"] = "Approved";
    if (pendingAction === "reject") targetStatus = "Rejected";
    if (pendingAction === "block") targetStatus = "Rejected"; // Block maps to rejected in details

    try {
      await mockApi.updateCoachStatus(
        confirmingCoach.id, 
        targetStatus, 
        pendingAction === "reject" ? rejectReasonText : undefined
      );
      setTimeout(async () => {
        await loadCoaches();
        setIsSubmitting(false);
        setIsModalOpen(false);
        setConfirmingCoach(null);
        setPendingAction(null);
      }, 600);
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 font-sans animate-in fade-in duration-300">
      
      {/* 4-Card Stats Row (Switches values based on active tab to match screenshots) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Coaches" 
          value={activeTab === "all" ? "1,545" : "448"} 
          valueColor="text-[#b08b5c] font-bold" 
        />
        <StatCard 
          title="Pending Approval" 
          value="13" 
          valueColor="text-[#0da34c] font-bold" 
        />
        <StatCard 
          title="Featured Slots" 
          value="05" 
          valueColor="text-[#0f766e] font-bold" 
        />
        <StatCard 
          title="Average Rating" 
          value="4.8" 
          valueColor="text-[#c2410c] font-bold" 
        />
      </div>

      {/* Main Tab Navigation Subheader */}
      <div className="flex border-b border-border/80 gap-6">
        <button
          onClick={() => setActiveTab("all")}
          className={`
            pb-3 text-[15px] font-bold transition-all border-b-2 cursor-pointer
            ${activeTab === "all" ? "text-[#0da34c] border-[#0da34c]" : "text-[#6D6D6D]/85 border-transparent hover:text-[#585858]"}
          `}
        >
          All Coaches
        </button>
        <button
          onClick={() => setActiveTab("info")}
          className={`
            pb-3 text-[15px] font-bold transition-all border-b-2 cursor-pointer
            ${activeTab === "info" ? "text-[#0da34c] border-[#0da34c]" : "text-[#6D6D6D]/85 border-transparent hover:text-[#585858]"}
          `}
        >
          Coache info
        </button>
      </div>

      {/* Tab Content Rendering */}
      {activeTab === "all" ? (
        /* ALL COACHES TAB VIEW */
        <div className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 pt-6 pb-2">
            <h2 className="text-lg font-bold text-slate-800">All Coaches</h2>
          </div>

          {/* Table filters */}
          <div className="px-6 py-4 flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
            {/* Search */}
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

            {/* Sub-tabs */}
            <div className="flex bg-[#f3f4f3] p-1 rounded-xl items-center gap-1 self-start md:self-auto overflow-x-auto max-w-full">
              {["All Coaches", "Approved", "Pending", "Rejected"].map((tab) => {
                const isActive = statusFilter === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => handleStatusFilterClick(tab)}
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

          {/* Coach list table */}
          <div className="overflow-x-auto">
            {loadingCoaches ? (
              <div className="px-6 py-12 space-y-4 animate-pulse">
                {[1, 2, 3, 4].map((i) => (
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
            ) : coaches.length === 0 ? (
              <div className="text-center py-16 text-[#6D6D6D]">
                <p className="text-base font-semibold">No coaches found</p>
                <p className="text-xs text-foreground/60 mt-1">Try adapting filters or your search term.</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-50 border-b border-border text-[13px] font-semibold text-[#6D6D6D] tracking-wide">
                    <th className="px-6 py-4">Coach</th>
                    <th className="px-6 py-4">Specialty</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Sessions (April)</th>
                    <th className="px-6 py-4">Ratings</th>
                    <th className="px-6 py-4">Earnings (April)</th>
                    <th className="px-6 py-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-[14px]">
                  {coaches.map((coach) => (
                    <tr
                      key={coach.id}
                      onClick={() => router.push(`/dashboard/coaches/${coach.id}`)}
                      className="hover:bg-zinc-50/50 cursor-pointer transition-colors"
                    >
                      {/* Coach Name/Avatar */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="relative w-9 h-9 rounded-full overflow-hidden border border-border shrink-0 bg-zinc-100">
                            <img
                              src={coach.avatar}
                              alt={coach.name}
                              className="object-cover w-full h-full"
                            />
                          </div>
                          <span className="font-bold text-slate-800">{coach.name}</span>
                        </div>
                      </td>

                      {/* Specialty */}
                      <td className="px-6 py-4 text-[#6D6D6D] truncate max-w-[180px]">
                        {coach.specialty}
                      </td>

                      {/* Status badge */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`
                            inline-flex px-2.5 py-0.5 rounded text-xs font-semibold uppercase tracking-wider
                            ${coach.status === "Approved" ? "bg-emerald-50 text-[#0da34c] border border-emerald-100" : ""}
                            ${coach.status === "Pending" ? "bg-amber-50 text-amber-600 border border-amber-100" : ""}
                            ${coach.status === "Rejected" ? "bg-red-50 text-red-500 border border-red-100" : ""}
                          `}
                        >
                          {coach.status}
                        </span>
                      </td>

                      {/* Sessions */}
                      <td className="px-6 py-4 font-medium text-slate-800">
                        {coach.status === "Approved" ? coach.totalSessions : 0}
                      </td>

                      {/* Ratings */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        {coach.status === "Approved" ? (
                          <span className="flex items-center gap-1 text-[#6D6D6D] font-medium">
                            <MdStarBorder className="w-4 h-4 text-amber-500 shrink-0 -mt-0.5" />
                            {coach.avgRating.toFixed(1)}
                          </span>
                        ) : (
                          <span className="text-[#6D6D6D]/60 font-semibold text-xs">N/A</span>
                        )}
                      </td>

                      {/* Earnings */}
                      <td className="px-6 py-4 font-bold text-slate-800">
                        {coach.status === "Approved" ? coach.totalEarnings : "$0"}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-center relative whitespace-nowrap">
                        <button
                          onClick={(e) => toggleActionsMenu(e, coach.id)}
                          className="p-1.5 hover:bg-zinc-100 rounded-full transition-colors inline-block focus:outline-none cursor-pointer"
                          aria-label="Actions menu"
                        >
                          <MdMoreVert className="w-5 h-5 text-slate-500" />
                        </button>

                        {/* Floating actions dropdown */}
                        {activeMenuCoachId === coach.id && (
                          <div
                            className="absolute right-6 top-10 mt-1 z-30 w-44 bg-white border border-border rounded-xl shadow-lg p-1.5 animate-in fade-in slide-in-from-top-1 duration-100 text-left flex flex-col whitespace-normal"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {coach.status !== "Approved" && (
                              <button
                                onClick={(e) => initiateAction(e, coach, "approve")}
                                className="w-full px-3.5 py-2 text-xs font-semibold text-[#6D6D6D] hover:bg-[#f8faf8] hover:text-[#0da34c] rounded-lg transition-colors text-left cursor-pointer"
                              >
                                Approve
                              </button>
                            )}
                            {coach.status !== "Rejected" && (
                              <button
                                onClick={(e) => initiateAction(e, coach, "reject")}
                                className="w-full px-3.5 py-2 text-xs font-semibold text-[#6D6D6D] hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors text-left cursor-pointer"
                              >
                                Reject
                              </button>
                            )}
                            <button
                              onClick={() => router.push(`/dashboard/coaches/${coach.id}`)}
                              className="w-full px-3.5 py-2 text-xs font-semibold text-[#6D6D6D] hover:bg-[#f8faf8] hover:text-[#0da34c] rounded-lg transition-colors text-left cursor-pointer"
                            >
                              View profile
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
      ) : (
        /* COACH INFO TAB VIEW (TAGS MANAGER) */
        <div className="space-y-6">
          {loadingTags ? (
            <div className="space-y-6 animate-pulse">
              <div className="bg-white border border-border rounded-2xl h-48" />
              <div className="bg-white border border-border rounded-2xl h-48" />
            </div>
          ) : (
            <>
              {/* Coaching Style Options */}
              <div className="bg-white border border-border rounded-2xl p-6 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-slate-800">Coaching Style Options</h3>
                
                {/* Important alert banner */}
                <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-4 flex items-start gap-3 text-[#0da34c]">
                  <MdInfoOutline className="w-5 h-5 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <p className="font-bold text-[#0da34c]">Important Note</p>
                    <p className="text-[#6D6D6D] mt-0.5">These are multi-select tags. Coaches can choose multiple styles that describe their approach.</p>
                  </div>
                </div>

                {/* Input row */}
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Add new coaching style..."
                    value={newStyle}
                    onChange={(e) => setNewStyle(e.target.value)}
                    className="flex-1 bg-[#f8faf8] border border-border rounded-xl px-4 py-2.5 text-[14px] text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                  />
                  <Button
                    onClick={() => handleAddTag("style")}
                    className="bg-[#0da34c] hover:bg-[#0da34c]/95 text-white font-semibold text-sm px-6 h-10 shadow-sm cursor-pointer shrink-0"
                  >
                    Save
                  </Button>
                </div>

                <div className="text-xs font-semibold text-[#6D6D6D] pt-1">Available Coaching Styles</div>
                {/* Tags row */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {styles.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#f3f4f3] rounded-lg text-xs font-semibold text-slate-800 border border-border"
                    >
                      {tag}
                      <button
                        onClick={() => handleDeleteTag("style", tag)}
                        className="hover:text-red-600 transition-colors p-0.5 rounded-full hover:bg-black/5 cursor-pointer"
                        aria-label={`Remove style ${tag}`}
                      >
                        <MdClose className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Expertise Areas */}
              <div className="bg-white border border-border rounded-2xl p-6 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-slate-800">Expertise Areas</h3>
                
                {/* Input row */}
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Add new coaching style..." // matches mockup label
                    value={newExpertise}
                    onChange={(e) => setNewExpertise(e.target.value)}
                    className="flex-1 bg-[#f8faf8] border border-border rounded-xl px-4 py-2.5 text-[14px] text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                  />
                  <Button
                    onClick={() => handleAddTag("expertise")}
                    className="bg-[#0da34c] hover:bg-[#0da34c]/95 text-white font-semibold text-sm px-6 h-10 shadow-sm cursor-pointer shrink-0"
                  >
                    Save
                  </Button>
                </div>

                <div className="text-xs font-semibold text-[#6D6D6D] pt-1">Available Expertise Areas</div>
                {/* Tags row */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {expertise.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#f3f4f3] rounded-lg text-xs font-semibold text-slate-800 border border-border"
                    >
                      {tag}
                      <button
                        onClick={() => handleDeleteTag("expertise", tag)}
                        className="hover:text-red-600 transition-colors p-0.5 rounded-full hover:bg-black/5 cursor-pointer"
                        aria-label={`Remove expertise ${tag}`}
                      >
                        <MdClose className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Expertise Levels */}
              <div className="bg-white border border-border rounded-2xl p-6 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-slate-800">Expertise Levels</h3>
                
                {/* Input row */}
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Add new coaching style..." // matches mockup label
                    value={newLevel}
                    onChange={(e) => setNewLevel(e.target.value)}
                    className="flex-1 bg-[#f8faf8] border border-border rounded-xl px-4 py-2.5 text-[14px] text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                  />
                  <Button
                    onClick={() => handleAddTag("level")}
                    className="bg-[#0da34c] hover:bg-[#0da34c]/95 text-white font-semibold text-sm px-6 h-10 shadow-sm cursor-pointer shrink-0"
                  >
                    Save
                  </Button>
                </div>

                <div className="text-xs font-semibold text-[#6D6D6D] pt-1">Available Expertise Levels</div>
                {/* Tags row */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {levels.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#f3f4f3] rounded-lg text-xs font-semibold text-slate-800 border border-border"
                    >
                      {tag}
                      <button
                        onClick={() => handleDeleteTag("level", tag)}
                        className="hover:text-red-600 transition-colors p-0.5 rounded-full hover:bg-black/5 cursor-pointer"
                        aria-label={`Remove level ${tag}`}
                      >
                        <MdClose className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Rejection / Action Dialog Modal */}
      <Modal isOpen={isModalOpen} onClose={handleCancelModal} size="md">
        <div className="flex flex-col text-left py-2 font-sans space-y-4">
          {pendingAction === "reject" ? (
            <>
              {/* Reject Application Modal content layout */}
              <h3 className="text-[20px] font-bold text-slate-800 tracking-tight leading-snug">
                Reject Coach Application
              </h3>
              <p className="text-[14px] text-[#6D6D6D] leading-relaxed">
                Please provide a reason for rejecting {confirmingCoach?.name}&apos;s application. This message will be sent directly to them.
              </p>
              <div className="space-y-1.5 pt-1">
                <label className="text-xs font-bold text-[#6D6D6D]">Message to coach</label>
                <textarea
                  placeholder="Write here....."
                  rows={6}
                  
                  value={rejectReasonText}
                  onChange={(e) => setRejectReasonText(e.target.value)}
                  className="w-full bg-[#f8faf8] resize-none border border-border rounded-xl px-4 py-3 text-[14px] text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all placeholder:text-foreground/45"
                />
              </div>
              <div className="flex justify-end gap-3 pt-3">
                <Button
                  variant="outline"
                  onClick={handleCancelModal}
                  disabled={isSubmitting}
                  className="px-5 text-sm h-10 border-border text-[#6D6D6D] hover:bg-zinc-50 cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirmModal}
                  disabled={isSubmitting}
                  className="px-6 text-sm h-10 bg-[#0da34c] hover:bg-[#0da34c]/95 text-white shadow-sm font-semibold cursor-pointer"
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </Button>
              </div>
            </>
          ) : (
            <>
              {/* General action modals (Approve / Block) */}
              <h3 className="text-[20px] font-bold text-slate-800 tracking-tight leading-snug">
                {pendingAction === "approve" ? "Approve Coach Application" : "Suspend Coach Account"}
              </h3>
              <p className="text-[14px] text-[#6D6D6D] leading-relaxed">
                {pendingAction === "approve"
                  ? `Are you sure you want to approve ${confirmingCoach?.name}'s application? They will gain access to host paid sessions.`
                  : `Are you sure you want to block or suspend ${confirmingCoach?.name}'s account? They will not be able to accept bookings.`}
              </p>
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={handleCancelModal}
                  disabled={isSubmitting}
                  className="px-5 text-sm h-10 border-border text-[#6D6D6D] hover:bg-zinc-50 cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirmModal}
                  disabled={isSubmitting}
                  className="px-6 text-sm h-10 bg-[#0da34c] hover:bg-[#0da34c]/95 text-white shadow-sm font-semibold cursor-pointer"
                >
                  {isSubmitting ? "Processing..." : "Yes, Confirm"}
                </Button>
              </div>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
}
