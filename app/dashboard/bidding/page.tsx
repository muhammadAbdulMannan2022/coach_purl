"use client";

import * as React from "react";
import StatCard from "@/components/ui/dashboardCard";
import BiddingConfigModal from "./components/BiddingConfigModal";
import { 
  MdEmojiEvents, 
  MdAttachMoney, 
  MdTrendingUp, 
  MdAccessTime, 
  MdAdd, 
  MdEdit, 
  MdSearch, 
  MdClose, 
  MdOutlineRemoveRedEye, 
  MdStar, 
  MdArrowBack 
} from "react-icons/md";
import { 
  mockApi, 
  BiddingSlot, 
  BidderRecord, 
  BiddingSystemConfig 
} from "@/lib/mock-data";

// Skeleton loader for asynchronous UX
const BiddingSkeleton = () => (
  <div className="w-full space-y-6 animate-pulse">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-28 bg-zinc-100 rounded-2xl"></div>
      ))}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
      <div className="lg:col-span-2 h-96 bg-zinc-100 rounded-2xl"></div>
      <div className="h-96 bg-zinc-100 rounded-2xl"></div>
    </div>
  </div>
);

export default function BiddingManagementPage() {
  const [loading, setLoading] = React.useState(true);
  const [biddingOn, setBiddingOn] = React.useState(true);
  const [isConfigModalOpen, setIsConfigModalOpen] = React.useState(false);
  const [activeSlotDetails, setActiveSlotDetails] = React.useState<string | null>(null);
  
  // Search query for bidders detail view
  const [searchQuery, setSearchQuery] = React.useState("");

  // Bidding states loaded from mock database
  const [slots, setSlots] = React.useState<BiddingSlot[]>([]);
  const [bidders, setBidders] = React.useState<BidderRecord[]>([]);
  const [config, setConfig] = React.useState<BiddingSystemConfig>({
    slot1Min: 50,
    slot2Min: 45,
    slot3Min: 40,
    slot4Min: 35,
    rafflePrice: 5,
    biddingDuration: "20h, 13 min",
    featuredDuration: "30 Days"
  });

  const [isConfigured, setIsConfigured] = React.useState(false);

  // Load bidding data from mockApi
  const loadBiddingData = React.useCallback(async () => {
    try {
      const [slotsData, configData] = await Promise.all([
        mockApi.getBiddingSlots(),
        mockApi.getBiddingConfig()
      ]);
      setSlots(slotsData);
      setConfig(configData);

      if (activeSlotDetails) {
        const biddersData = await mockApi.getBiddersForSlot(activeSlotDetails);
        setBidders(biddersData);
      }
    } catch (err) {
      console.error("Failed to load bidding data:", err);
    }
  }, [activeSlotDetails]);

  React.useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      loadBiddingData().then(() => setLoading(false));
    }, 450); // Simulate network latency
    return () => clearTimeout(timer);
  }, [loadBiddingData, activeSlotDetails]);

  // Handle configuration publish
  const handleConfigPublish = async (newConfig: BiddingSystemConfig) => {
    try {
      setLoading(true);
      await mockApi.updateBiddingConfig(newConfig);
      setIsConfigured(true);
      setIsConfigModalOpen(false);
      await loadBiddingData();
    } catch (err) {
      console.error("Failed to publish bidding config:", err);
    } finally {
      setLoading(false);
    }
  };

  // Filter bidders list by search term
  const filteredBidders = bidders.filter(b => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return b.coachName.toLowerCase().includes(q) || b.specialty.toLowerCase().includes(q);
  });

  // Render headers/status details
  const activeBidsTodayCount = biddingOn ? (activeSlotDetails ? 8 : 5) : 0;

  return (
    <div className="space-y-6 font-sans animate-in fade-in duration-300">
      
      {/* Loading state indicator */}
      {loading ? (
        <BiddingSkeleton />
      ) : (
        <>
          {/* Dashboard Stats Cards Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Active Bids Today"
              value={activeBidsTodayCount}
              valueColor="text-[#0da34c] font-bold"
              icon={<MdEmojiEvents className="w-6 h-6 text-[#0da34c]" />}
              iconBg="bg-emerald-50"
            />
            <StatCard
              title="Today's Revenue"
              value={`$${biddingOn ? 230 : 0}`}
              valueColor="text-blue-600 font-bold"
              icon={<MdAttachMoney className="w-6 h-6 text-blue-600" />}
              iconBg="bg-blue-50"
            />
            <StatCard
              title="Monthly Revenue"
              value={`$${biddingOn ? "3,120" : "2,890"}`}
              valueColor="text-amber-600 font-bold"
              icon={<MdTrendingUp className="w-6 h-6 text-amber-600" />}
              iconBg="bg-amber-50"
            />
            <StatCard
              title="Time Remaining"
              value={biddingOn ? "12 Hr 20 Mins" : "Ended"}
              valueColor="text-red-500 font-bold"
              icon={<MdAccessTime className="w-6 h-6 text-red-500" />}
              iconBg="bg-red-50"
            />
          </div>

          {!activeSlotDetails ? (
            /* VIEW 1: Main Bidding slots and current min bids dashboard */
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left Column: Bid Slots table card */}
              <div className="lg:col-span-2 bg-white border border-border p-6 rounded-2xl shadow-sm flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-slate-800 font-sans">
                    Bid Slots
                  </h3>
                  
                  {/* Bidding switch toggle button */}
                  <div className="flex items-center gap-3">
                    <span className="text-[13px] font-semibold text-[#6D6D6D]">
                      Turn off Bidding
                    </span>
                    <button 
                      onClick={() => setBiddingOn(!biddingOn)} 
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${biddingOn ? 'bg-[#0da34c]' : 'bg-gray-200'}`}
                      aria-label="Toggle bidding live state"
                    >
                      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${biddingOn ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                  </div>
                </div>

                {/* Slots Table */}
                <div className="overflow-x-auto -mx-6 border-t border-border">
                  <table className="w-full text-left border-collapse min-w-[550px] font-sans">
                    <thead>
                      <tr className="bg-zinc-50 border-b border-border text-[13px] font-semibold text-[#6D6D6D] tracking-wide">
                        <th className="px-6 py-4">Bid ID</th>
                        <th className="px-6 py-4">Slot</th>
                        <th className="px-6 py-4">Top Bid Amount</th>
                        <th className="px-6 py-4">Time Remaining</th>
                        <th className="px-6 py-4 text-center">Bidders List</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border text-[14px]">
                      {slots.map((slot) => (
                        <tr 
                          key={slot.id}
                          className="hover:bg-zinc-50/50 transition-colors"
                        >
                          <td className="px-6 py-4 text-slate-500 font-medium font-sans">
                            {slot.id}
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex px-2 py-0.5 rounded border border-border bg-slate-50 text-xs font-semibold text-slate-700">
                              {slot.slotName}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-bold text-slate-800">
                            ${biddingOn ? slot.topBidAmount : "-"}
                          </td>
                          <td className="px-6 py-4 text-[#6D6D6D] font-sans">
                            {biddingOn ? slot.timeRemaining : "-"}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <button
                              onClick={() => biddingOn && setActiveSlotDetails(slot.slotName)}
                              disabled={!biddingOn}
                              className={`
                                inline-flex items-center gap-1.5 text-xs font-semibold cursor-pointer py-1.5 px-3 rounded-lg hover:bg-slate-50 transition-all focus:outline-none
                                ${slot.slotName === "Slot 1" && biddingOn ? "text-[#0da34c]" : "text-[#6D6D6D]"}
                                ${!biddingOn ? "opacity-50 cursor-not-allowed" : ""}
                              `}
                            >
                              <MdOutlineRemoveRedEye className="w-4 h-4" />
                              <span>View ({slot.biddersCount})</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Right Column: Current Active Min Bids and config trigger button */}
              <div className="bg-white border border-border p-6 rounded-2xl shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-slate-800 font-sans">
                      Current Bid
                    </h3>
                    
                    {/* Setup / Modify Action green button */}
                    <button
                      onClick={() => setIsConfigModalOpen(true)}
                      className="inline-flex items-center gap-1.5 bg-[#0da34c] hover:bg-[#0da34c]/95 text-white text-xs font-bold px-3 py-2 rounded-lg shadow-sm transition-all cursor-pointer focus:outline-none"
                    >
                      {isConfigured ? (
                        <>
                          <MdEdit className="w-3.5 h-3.5" />
                          <span>Modify Bids</span>
                        </>
                      ) : (
                        <>
                          <MdAdd className="w-3.5 h-3.5" />
                          <span>Set Up Bids</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Active Min Bids Value settings list */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-zinc-100 text-sm">
                      <span className="text-[#6D6D6D] font-medium font-sans">Slot 1 (Top Position)</span>
                      <span className="font-bold text-slate-800">${config.slot1Min}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-zinc-100 text-sm">
                      <span className="text-[#6D6D6D] font-medium font-sans">Slot 2 (2nd Position)</span>
                      <span className="font-bold text-slate-800">${config.slot2Min}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-zinc-100 text-sm">
                      <span className="text-[#6D6D6D] font-medium font-sans">Slot 3 (3rd Position)</span>
                      <span className="font-bold text-slate-800">${config.slot3Min}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-zinc-100 text-sm">
                      <span className="text-[#6D6D6D] font-medium font-sans">Slot 4 (4th Position)</span>
                      <span className="font-bold text-slate-800">${config.slot4Min}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-zinc-100 text-sm">
                      <span className="text-[#6D6D6D] font-medium font-sans">Slot 5 (5th Position)</span>
                      <span className="font-bold text-slate-800">${config.rafflePrice * 6}</span>
                    </div>
                  </div>
                </div>

                {/* Ticket pricing details */}
                <div className="pt-6 border-t border-zinc-100 mt-6 space-y-4">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                    Raffle Ticket
                  </h4>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-[#6D6D6D] font-medium font-sans">Ticket Price</span>
                    <span className="font-bold text-slate-800">${config.rafflePrice}</span>
                  </div>
                </div>
              </div>

            </div>
          ) : (
            /* VIEW 2: Detailed Searchable Bidders ledger view */
            <div className="bg-white border border-border p-6 rounded-2xl shadow-sm flex flex-col">
              
              {/* Back navigation control */}
              <button
                onClick={() => {
                  setActiveSlotDetails(null);
                  setSearchQuery("");
                }}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0da34c] hover:underline mb-4 cursor-pointer focus:outline-none"
              >
                <MdArrowBack className="w-4 h-4" />
                <span>Back to Bids</span>
              </button>

              <h3 className="text-lg font-bold text-slate-800 mb-6 font-sans">
                Bidders list For Slot No. {activeSlotDetails.replace(/[^0-9]/g, "")}
              </h3>

              {/* Search input container */}
              <div className="relative w-full mb-6">
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

              {/* Bidders Table */}
              <div className="overflow-x-auto -mx-6 border-t border-border">
                {filteredBidders.length === 0 ? (
                  <div className="py-12 text-center text-[#6D6D6D] font-medium font-sans">
                    No bidders found for this slot.
                  </div>
                ) : (
                  <table className="w-full text-left border-collapse min-w-[700px] font-sans">
                    <thead>
                      <tr className="bg-zinc-50 border-b border-border text-[13px] font-semibold text-[#6D6D6D] tracking-wide">
                        <th className="px-6 py-4">Positon</th>
                        <th className="px-6 py-4">Coach</th>
                        <th className="px-6 py-4">Specialty</th>
                        <th className="px-6 py-4">Sessions (April)</th>
                        <th className="px-6 py-4">Ratings</th>
                        <th className="px-6 py-4">Bidding Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border text-[14px]">
                      {filteredBidders.map((bidder) => (
                        <tr 
                          key={bidder.coachName}
                          className="hover:bg-zinc-50/50 transition-colors"
                        >
                          <td className="px-6 py-4 text-[#6D6D6D] font-medium font-sans">
                            {bidder.position}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <img
                                src={bidder.avatar}
                                alt={bidder.coachName}
                                className="w-8 h-8 rounded-full object-cover border border-border shrink-0"
                              />
                              <span className="font-bold text-slate-800">{bidder.coachName}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-[#6D6D6D] font-sans">
                            {bidder.specialty}
                          </td>
                          <td className="px-6 py-4 text-[#6D6D6D] font-sans">
                            {bidder.sessions}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-1 text-[#6D6D6D] font-medium">
                              <MdStar className="w-4 h-4 text-amber-400" />
                              <span>{bidder.rating}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 font-bold text-slate-800">
                            ${bidder.bidAmount}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {/* Configuration modal overlay component */}
          <BiddingConfigModal
            isOpen={isConfigModalOpen}
            onClose={() => setIsConfigModalOpen(false)}
            onPublish={handleConfigPublish}
            currentConfig={config}
          />
        </>
      )}

    </div>
  );
}
