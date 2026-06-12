"use client";

import * as React from "react";
import { useRouter, useParams } from "next/navigation";
import { mockApi, CoachDetailProfile } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { 
  MdArrowBack, 
  MdMoreHoriz, 
  MdEvent, 
  MdAttachMoney, 
  MdAccessTime, 
  MdStar, 
  MdStarBorder,
  MdCalendarToday,
  MdLocationOn,
  MdPhone,
  MdWork,
  MdInsertDriveFile,
  MdVideocam,
  MdMessage,
  MdCall
} from "react-icons/md";
import { FaX } from "react-icons/fa6";

export default function CoachDetailPage() {
  const router = useRouter();
  const { id } = useParams() as { id: string };

  const [loading, setLoading] = React.useState(true);
  const [coach, setCoach] = React.useState<CoachDetailProfile | null>(null);
  
  // Dropdown menu state
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  // Modal actions
  const [pendingAction, setPendingAction] = React.useState<"approve" | "reject" | "block" | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [rejectReasonText, setRejectReasonText] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const loadCoach = React.useCallback(async () => {
    try {
      const data = await mockApi.getCoachDetails(id);
      setCoach(data);
    } catch (err) {
      console.error(err);
    }
  }, [id]);

  React.useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      loadCoach().then(() => setLoading(false));
    }, 450);
    return () => clearTimeout(timer);
  }, [loadCoach]);

  // Handle outside clicks to close dropdown menus
  React.useEffect(() => {
    const handleOutsideClick = () => setIsMenuOpen(false);
    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, []);

  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(prev => !prev);
  };

  const initiateAction = (e: React.MouseEvent, action: "approve" | "reject" | "block") => {
    e.stopPropagation();
    setIsMenuOpen(false);
    setPendingAction(action);
    setRejectReasonText("");
    setIsModalOpen(true);
  };

  const handleCancelModal = () => {
    setIsModalOpen(false);
    setPendingAction(null);
  };

  const handleConfirmModal = async () => {
    if (!coach || !pendingAction) return;
    setIsSubmitting(true);

    let targetStatus: CoachDetailProfile["status"] = "Approved";
    if (pendingAction === "reject") targetStatus = "Rejected";
    if (pendingAction === "block") targetStatus = "Rejected";

    try {
      await mockApi.updateCoachStatus(
        coach.id, 
        targetStatus, 
        pendingAction === "reject" ? rejectReasonText : undefined
      );
      setTimeout(async () => {
        await loadCoach();
        setIsSubmitting(false);
        setIsModalOpen(false);
        setPendingAction(null);
      }, 600);
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 font-sans animate-pulse">
        <div className="h-6 bg-zinc-100 rounded w-20" />
        <div className="bg-white border border-border p-6 rounded-2xl h-40" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 h-24" />
        <div className="bg-white border border-border p-6 rounded-2xl h-80" />
      </div>
    );
  }

  if (!coach) {
    return (
      <div className="text-center py-16 font-sans">
        <h3 className="text-xl font-bold text-slate-800">Coach Not Found</h3>
        <p className="text-sm text-[#6D6D6D] mt-2">The requested coach profile does not exist.</p>
        <Button 
          variant="outline" 
          onClick={() => router.push("/dashboard/coaches")}
          className="mt-6 cursor-pointer"
        >
          Return to Coach Directory
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans animate-in fade-in duration-300">
      
      {/* Back button matching mockup text layout */}
      <div>
        <button
          onClick={() => router.push("/dashboard/coaches")}
          className="inline-flex items-center gap-2 text-[14px] font-semibold text-[#6D6D6D] hover:text-[#0da34c] transition-colors cursor-pointer"
        >
          <MdArrowBack className="w-4 h-4" />
          <span>User Management</span> {/* Exact mockup wording */}
        </button>
      </div>

      {/* ============================================================== */}
      {/* APPROVED COACH PROFILE LAYOUT */}
      {/* ============================================================== */}
      {coach.status === "Approved" && (
        <>
          {/* Bio Row Card */}
          <div className="bg-white border border-border rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-border shrink-0 bg-zinc-50">
                <img
                  src={coach.avatar}
                  alt={coach.name}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold text-slate-800 tracking-tight">{coach.name}</h2>
                  <span className="inline-flex px-2.5 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider bg-emerald-50 text-[#0da34c] border border-emerald-100">
                    {coach.status}
                  </span>
                </div>
                <p className="text-[14px] text-[#6D6D6D]">{coach.email}</p>
                <p className="text-xs text-[#6D6D6D]/80 flex items-center gap-1.5 pt-0.5">
                  <MdCalendarToday className="w-3.5 h-3.5" />
                  Joined 5 March 2026
                </p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-3.5 relative">
              <Button
                onClick={() => alert(`Starting messaging thread with Coach ${coach.name}...`)}
                className="bg-[#0da34c] hover:bg-[#0da34c]/95 text-white font-semibold text-sm px-6 h-10 shadow-sm cursor-pointer"
              >
                Message
              </Button>
              <button
                onClick={toggleMenu}
                className="p-2 border border-border hover:bg-zinc-50 rounded-xl transition-colors cursor-pointer"
                aria-label="More options"
              >
                <MdMoreHoriz className="w-6 h-6 text-[#6D6D6D]" />
              </button>

              {isMenuOpen && (
                <div
                  className="absolute right-0 top-12 z-30 w-44 bg-white border border-border rounded-xl shadow-lg p-1.5 animate-in fade-in slide-in-from-top-1 duration-100 flex flex-col whitespace-normal"
                  onClick={(e) => e.stopPropagation()}
                >
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

          {/* 4 Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-border p-5 rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center gap-4 min-h-[100px]">
              <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-orange-50 text-orange-600 shrink-0">
                <MdEvent className="w-5.5 h-5.5" />
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#6D6D6D]">Total Session</p>
                <p className="text-2xl font-bold text-slate-800 mt-0.5">{coach.totalSessions}</p>
              </div>
            </div>

            <div className="bg-white border border-border p-5 rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center gap-4 min-h-[100px]">
              <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-purple-50 text-purple-600 shrink-0">
                <MdAttachMoney className="w-5.5 h-5.5" />
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#6D6D6D]">Total Earning</p>
                <p className="text-2xl font-bold text-slate-800 mt-0.5">{coach.totalEarnings}</p>
              </div>
            </div>

            <div className="bg-white border border-border p-5 rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center gap-4 min-h-[100px]">
              <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-amber-50 text-amber-600 shrink-0">
                <MdStar className="w-5.5 h-5.5" />
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#6D6D6D]">Avg Rating</p>
                <p className="text-2xl font-bold text-slate-800 mt-0.5 flex items-center gap-1.5">
                  <span className="text-amber-500 text-xl shrink-0 -mt-0.5">★</span>
                  {coach.avgRating.toFixed(1)}
                </p>
              </div>
            </div>

            <div className="bg-white border border-border p-5 rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center gap-4 min-h-[100px]">
              <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 shrink-0">
                <MdAccessTime className="w-5.5 h-5.5" />
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#6D6D6D]">Last Active</p>
                <p className="text-2xl font-bold text-slate-800 mt-0.5">{coach.lastActive}</p>
              </div>
            </div>
          </div>

          {/* Specialties & Bio Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
            {/* Specialties & Bio Left Block (60% width equivalent) */}
            <div className="space-y-6 lg:col-span-5 flex flex-col justify-stretch">
              <div className="bg-white border border-border rounded-2xl p-6 shadow-sm flex-1">
                <h3 className="text-base font-bold text-slate-800 mb-4 pb-2 border-b border-border">Specialties</h3>
                <ul className="space-y-3">
                  {coach.specialtiesList.map((spec) => (
                    <li key={spec} className="flex items-center gap-2.5 text-[14px] font-medium text-slate-800">
                      <MdStarBorder className="w-5 h-5 text-amber-500 shrink-0" />
                      <span>{spec}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-white border border-border rounded-2xl p-6 shadow-sm flex-1">
                <h3 className="text-base font-bold text-slate-800 mb-3">Bio</h3>
                <p className="text-[14px] text-[#6D6D6D] leading-relaxed">{coach.bio}</p>
              </div>
            </div>

            {/* Availability & Session Overview Right Block (40% width equivalent) */}
            <div className="space-y-6 lg:col-span-5 flex flex-col justify-stretch">
              <div className="bg-white border border-border rounded-2xl p-6 shadow-sm flex-1">
                <h3 className="text-base font-bold text-slate-800 mb-4 pb-2 border-b border-border">Availability</h3>
                <p className="text-xs font-semibold text-[#6D6D6D] uppercase tracking-wider mb-3.5">Current Availability</p>
                <div className="space-y-2.5">
                  {coach.availabilityHours.map((av) => (
                    <div key={av.day} className="bg-[#f8faf8] border border-border/80 rounded-xl p-4.5">
                      <p className="text-xs font-bold text-slate-800">{av.day}</p>
                      <p className="text-[13px] text-[#6D6D6D] mt-1">{av.timeRange}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-border rounded-2xl p-6 shadow-sm flex-1">
                <h3 className="text-base font-bold text-slate-800 mb-4 pb-2 border-b border-border">Session Overview</h3>
                <div className="space-y-4 pt-1">
                  <div className="flex items-center justify-between text-[14px]">
                    <span className="flex items-center gap-2 text-slate-800">
                      <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full shrink-0" />
                      Completed
                    </span>
                    <span className="font-bold text-slate-900">{coach.sessionOverview.completed}</span>
                  </div>
                  <div className="flex items-center justify-between text-[14px]">
                    <span className="flex items-center gap-2 text-slate-800">
                      <span className="w-2.5 h-2.5 bg-amber-400 rounded-full shrink-0" />
                      Upcoming
                    </span>
                    <span className="font-bold text-slate-900">{coach.sessionOverview.upcoming}</span>
                  </div>
                  <div className="flex items-center justify-between text-[14px]">
                    <span className="flex items-center gap-2 text-slate-800">
                      <span className="w-2.5 h-2.5 bg-red-500 rounded-full shrink-0" />
                      Cancelled
                    </span>
                    <span className="font-bold text-slate-900">{coach.sessionOverview.cancelled}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Session Statistics Grid */}
          <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-800 mb-5 pb-2 border-b border-border">Session Statistics</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#f8faf8] border border-border/80 rounded-xl p-4.5 flex items-center gap-4.5">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-100 text-blue-600 shrink-0">
                  <MdVideocam className="w-5.5 h-5.5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#6D6D6D] uppercase tracking-wider">Video Call Session</p>
                  <p className="text-2xl font-bold text-slate-800 mt-1">{coach.sessionStats.videoCall}</p>
                </div>
              </div>
              
              <div className="bg-[#f8faf8] border border-border/80 rounded-xl p-4.5 flex items-center gap-4.5">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-purple-100 text-purple-600 shrink-0">
                  <MdMessage className="w-5.5 h-5.5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#6D6D6D] uppercase tracking-wider">Text Session</p>
                  <p className="text-2xl font-bold text-slate-800 mt-1">{coach.sessionStats.textSession}</p>
                </div>
              </div>

              <div className="bg-[#f8faf8] border border-border/80 rounded-xl p-4.5 flex items-center gap-4.5">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-100 text-[#0da34c] shrink-0">
                  <MdCall className="w-5.5 h-5.5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#6D6D6D] uppercase tracking-wider">Voice Call Session</p>
                  <p className="text-2xl font-bold text-slate-800 mt-1">{coach.sessionStats.voiceCall}</p>
                </div>
              </div>

              <div className="bg-[#f8faf8] border border-border/80 rounded-xl p-4.5 flex items-center gap-4.5">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-orange-100 text-orange-600 shrink-0">
                  <MdAccessTime className="w-5.5 h-5.5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#6D6D6D] uppercase tracking-wider">Avg Session Duration</p>
                  <p className="text-2xl font-bold text-slate-800 mt-1">{coach.sessionStats.avgDuration}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bidding & Subscription Cards Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border border-border rounded-2xl p-6 shadow-sm flex flex-col">
              <h3 className="text-base font-bold text-slate-800 mb-4 pb-2 border-b border-border">Bidding & Featured</h3>
              <div className="space-y-4 flex-1 flex flex-col justify-center">
                <div className="flex items-center justify-between text-[14px]">
                  <span className="text-[#6D6D6D] font-semibold">Total Bidding Spent</span>
                  <span className="font-extrabold text-slate-800">{coach.biddingFeatured.totalSpent}</span>
                </div>
                <div className="flex items-center justify-between text-[14px]">
                  <span className="text-[#6D6D6D] font-semibold">Current Featured Position</span>
                  <span className="font-extrabold text-slate-800 flex items-center gap-1">
                    <MdStar className="w-4 h-4 text-amber-500 shrink-0" />
                    {coach.biddingFeatured.featuredPosition}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[14px]">
                  <span className="text-[#6D6D6D] font-semibold">Next Featured Expiry</span>
                  <span className="font-extrabold text-slate-800">{coach.biddingFeatured.featuredExpiry}</span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-border rounded-2xl p-6 shadow-sm flex flex-col">
              <h3 className="text-base font-bold text-slate-800 mb-4 pb-2 border-b border-border">Subscription</h3>
              <div className="space-y-4 flex-1 flex flex-col justify-center">
                <div className="flex items-center justify-between text-[14px]">
                  <span className="text-[#6D6D6D] font-semibold">Price Plan</span>
                  <span className="font-extrabold text-[#0da34c]">{coach.subscription.planName}</span>
                </div>
                <div className="flex items-center justify-between text-[14px]">
                  <span className="text-[#6D6D6D] font-semibold">Start Date</span>
                  <span className="font-extrabold text-slate-800">{coach.subscription.startDate}</span>
                </div>
                <div className="flex items-center justify-between text-[14px]">
                  <span className="text-[#6D6D6D] font-semibold">Next Billing Date</span>
                  <span className="font-extrabold text-slate-800">{coach.subscription.billingDate}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Reviews List Section */}
          <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-800 mb-5 pb-2 border-b border-border">Recent Review</h3>
            {coach.reviews.length === 0 ? (
              <div className="text-center py-6 text-xs text-[#6D6D6D]/80">No reviews found for this coach</div>
            ) : (
              <div className="space-y-5">
                {coach.reviews.map((rev) => (
                  <div key={rev.id} className="flex flex-col gap-3 py-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-full overflow-hidden border border-border bg-zinc-50 shrink-0">
                          <img src={rev.reviewerAvatar} alt={rev.reviewerName} className="object-cover w-full h-full" />
                        </div>
                        <div>
                          <p className="text-[14px] font-bold text-slate-800">{rev.reviewerName}</p>
                          <div className="flex items-center gap-0.5 mt-0.5">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <MdStar
                                key={s}
                                className={`w-4 h-4 shrink-0 ${s <= rev.rating ? "text-amber-500" : "text-zinc-200"}`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-[#6D6D6D]/80">{rev.date}</span>
                    </div>
                    <p className="text-[14px] text-[#6D6D6D] leading-relaxed">{rev.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* ============================================================== */}
      {/* PENDING COACH PROFILE LAYOUT */}
      {/* ============================================================== */}
      {(coach.status === "Pending" || coach.status === "Rejected") && (
        <>
          {/* Pending Bio Header Info Card */}
          <div className="bg-white border border-border rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-border shrink-0 bg-zinc-50">
                <img
                  src={coach.avatar}
                  alt={coach.name}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="space-y-1 text-[#6D6D6D]">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold text-slate-800 tracking-tight">{coach.name}</h2>
                  <span
                    className={`
                      inline-flex px-2 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider
                      ${coach.status === "Pending" ? "bg-amber-50 text-amber-600 border border-amber-100" : "bg-red-50 text-red-500 border border-red-100"}
                    `}
                  >
                    {coach.status === "Pending" ? "Pending Approval" : "Rejected"}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs pt-1.5 font-medium">
                  <span className="flex items-center gap-1 text-[13px]">
                    <MdWork className="w-4 h-4 text-slate-400 shrink-0" />
                    {coach.experienceYears} years experience
                  </span>
                  <span className="flex items-center gap-1 text-[13px]">
                    <MdLocationOn className="w-4 h-4 text-slate-400 shrink-0" />
                    {coach.location}
                  </span>
                  <span className="flex items-center gap-1 text-[13px]">
                    <MdPhone className="w-4 h-4 text-slate-400 shrink-0" />
                    {coach.phone}
                  </span>
                </div>
                <p className="text-[13px] font-medium pt-0.5">{coach.email}</p>
              </div>
            </div>

            {/* Action buttons (Reject / Approve) */}
            {coach.status === "Pending" && (
              <div className="flex items-center gap-3">
                <button
                  onClick={(e) => initiateAction(e, "reject")}
                  className="px-6 h-10 border border-red-500 text-red-500 rounded-xl font-bold text-sm hover:bg-red-50 transition-colors cursor-pointer"
                >
                  Reject
                </button>
                <button
                  onClick={(e) => initiateAction(e, "approve")}
                  className="px-6 h-10 bg-[#0da34c] hover:bg-[#0da34c]/95 text-white rounded-xl font-bold text-sm shadow-sm transition-colors cursor-pointer"
                >
                  Approve
                </button>
              </div>
            )}
            
            {coach.status === "Rejected" && (
              <div className="flex items-center gap-3">
                <button
                  onClick={(e) => initiateAction(e, "approve")}
                  className="px-6 h-10 bg-[#0da34c] hover:bg-[#0da34c]/95 text-white rounded-xl font-bold text-sm shadow-sm transition-colors cursor-pointer"
                >
                  Re-approve / Reconsider
                </button>
              </div>
            )}
          </div>

          {/* Pending details columns */}
          <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
            
            {/* Left Column (Specialties, Bio, Elevator Pitch, Certifications) */}
            <div className="space-y-6 lg:col-span-5 flex flex-col justify-stretch">
              <div className="bg-white border border-border rounded-2xl p-6 shadow-sm flex-1">
                <h3 className="text-base font-bold text-slate-800 mb-4 pb-2 border-b border-border">Specialties</h3>
                <ul className="space-y-3">
                  {coach.specialtiesList.map((spec) => (
                    <li key={spec} className="flex items-center gap-2.5 text-[14px] font-semibold text-slate-800">
                      <MdStarBorder className="w-5 h-5 text-amber-500 shrink-0" />
                      <span>{spec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white border border-border rounded-2xl p-6 shadow-sm flex-1">
                <h3 className="text-base font-bold text-slate-800 mb-3">Bio</h3>
                <p className="text-[14px] text-[#6D6D6D] leading-relaxed">{coach.bio}</p>
              </div>

              {coach.elevatorPitch && (
                <div className="bg-white border border-border rounded-2xl p-6 shadow-sm flex-1">
                  <h3 className="text-base font-bold text-slate-800 mb-3">Elevator Pitch</h3>
                  <p className="text-[14px] text-slate-700 italic font-semibold leading-relaxed">
                    &ldquo;{coach.elevatorPitch}&rdquo;
                  </p>
                </div>
              )}

              {coach.certifications && coach.certifications.length > 0 && (
                <div className="bg-white border border-border rounded-2xl p-6 shadow-sm flex-1">
                  <h3 className="text-base font-bold text-slate-800 mb-4 pb-2 border-b border-border">Certifications</h3>
                  <div className="space-y-3">
                    {coach.certifications.map((cert) => (
                      <div key={cert.id} className="bg-[#f8faf8] border border-border/80 rounded-xl p-4 flex items-center gap-4">
                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-100 text-[#0da34c] shrink-0">
                          <MdInsertDriveFile className="w-5.5 h-5.5" />
                        </div>
                        <div>
                          <p className="text-[14px] font-bold text-slate-850">{cert.title}</p>
                          <p className="text-xs text-[#6D6D6D]/90 mt-0.5">{cert.authority} • {cert.issuedDate}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column (Availability Weekdays grid, Rates, Cancellation) */}
            <div className="space-y-6 lg:col-span-5 flex flex-col justify-stretch">
              {/* Availability Grid */}
              <div className="bg-white border border-border rounded-2xl p-6 shadow-sm flex-1">
                <h3 className="text-base font-bold text-slate-800 mb-4 pb-2 border-b border-border">Availability</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => {
                    const isAvailable = coach.availabilityDays.includes(day);
                    return (
                      <div
                        key={day}
                        className={`
                          py-3 rounded-lg text-center font-bold text-xs border uppercase tracking-wider
                          ${isAvailable 
                            ? "border-[#0da34c] text-[#0da34c] bg-emerald-50/50 shadow-sm" 
                            : "bg-zinc-100 text-zinc-400 border-zinc-200"
                          }
                        `}
                      >
                        {day}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Rates */}
              <div className="bg-white border border-border rounded-2xl p-6 shadow-sm flex-1">
                <h3 className="text-base font-bold text-slate-800 mb-4 pb-2 border-b border-border">Rates</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-[#f8faf8] border border-border/80 rounded-xl p-4.5 flex items-center gap-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-orange-100 text-orange-600 shrink-0">
                      <MdAccessTime className="w-5.5 h-5.5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[#6D6D6D] uppercase tracking-wider">Per minute</p>
                      <p className="text-2xl font-bold text-slate-800 mt-0.5">{coach.rates.perMinute}<span className="text-xs text-[#6D6D6D]/90 font-medium">/min</span></p>
                    </div>
                  </div>

                  <div className="bg-[#f8faf8] border border-border/80 rounded-xl p-4.5 flex items-center gap-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-purple-100 text-purple-600 shrink-0">
                      <MdMessage className="w-5.5 h-5.5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[#6D6D6D] uppercase tracking-wider">Per text</p>
                      <p className="text-2xl font-bold text-slate-800 mt-0.5">{coach.rates.perText}<span className="text-xs text-[#6D6D6D]/90 font-medium">/min</span></p> {/* matches mockup typo /min */}
                    </div>
                  </div>
                </div>
              </div>

              {/* Cancellation Policy */}
              {coach.cancellationPolicy && (
                <div className="bg-white border border-border rounded-2xl p-6 shadow-sm flex-1">
                  <h3 className="text-base font-bold text-slate-800 mb-3">Cancellation Policy</h3>
                  <p className="text-[14px] text-[#6D6D6D] leading-relaxed">{coach.cancellationPolicy}</p>
                </div>
              )}
            </div>

          </div>
        </>
      )}

      {/* Confirmation Actions / Reason Modals */}
      <Modal isOpen={isModalOpen} onClose={handleCancelModal} size="md">
        <div className="flex flex-col text-left py-2 font-sans space-y-4">
          {pendingAction === "reject" ? (
            <>
              {/* Reject Modal matching mockup styling */}
              <h3 className="text-[20px] font-bold text-slate-800 tracking-tight leading-snug">
                Reject Coach Application
              </h3>
              <p className="text-[14px] text-[#6D6D6D] leading-relaxed">
                Please provide a reason for rejecting {coach.name}&apos;s application. This message will be sent directly to them.
              </p>
              
              <div className="space-y-1.5 pt-1">
                <label className="text-xs font-bold text-[#6D6D6D]">Message to coach</label>
                <textarea
                  placeholder="Write here....."
                  rows={6}
                  value={rejectReasonText}
                  onChange={(e) => setRejectReasonText(e.target.value)}
                  className="w-full bg-[#f8faf8] border border-border resize-none rounded-xl px-4 py-3 text-[14px] text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all placeholder:text-foreground/45"
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
              <h3 className="text-[20px] font-bold text-slate-800 tracking-tight leading-snug">
                {pendingAction === "approve" ? "Approve Coach Application" : "Suspend Coach Account"}
              </h3>
              <p className="text-[14px] text-[#6D6D6D] leading-relaxed">
                {pendingAction === "approve"
                  ? `Are you sure you want to approve ${coach.name}'s application? They will gain access to Host sessions.`
                  : `Are you sure you want to block or suspend ${coach.name}'s account? They will not be able to accept client sessions.`}
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
