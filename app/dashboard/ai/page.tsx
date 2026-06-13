"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { MdArrowBack } from "react-icons/md";
import { mockApi, ModerationReport } from "@/lib/mock-data";

// Subcomponents imports
import ReportsTable from "./components/ReportsTable";
import ActionReportModal from "./components/ActionReportModal";
import MessageDetailModal from "./components/MessageDetailModal";

export default function AIControlPanelPage() {
  const router = useRouter();

  // View toggle state: "config" or "reports"
  const [view, setView] = React.useState<"config" | "reports">("config");

  // AI Personality states
  const [selectedTone, setSelectedTone] = React.useState("Choose one");
  const [empathyLevel, setEmpathyLevel] = React.useState(80);
  const [customInstructions, setCustomInstructions] = React.useState("");
  const [isToneDropdownOpen, setIsToneDropdownOpen] = React.useState(false);

  // Quick Settings toggle states
  const [dailyWisdomEnabled, setDailyWisdomEnabled] = React.useState(true);
  const [followUpEnabled, setFollowUpEnabled] = React.useState(true);
  const [emotionalDetectionEnabled, setEmotionalDetectionEnabled] = React.useState(true);

  // Daily Wisdom Source states
  const [wisdomMode, setWisdomMode] = React.useState<"Manual" | "AI">("Manual");
  const [manualDate, setManualDate] = React.useState("");
  const [manualQuote, setManualQuote] = React.useState("");
  const [manualQuotes, setManualQuotes] = React.useState([
    { id: 1, date: "26 June 2026", text: "Begin where you are. Use what you have. Do what you can." },
    { id: 2, date: "26 June 2026", text: "Begin where you are. Use what you have. Do what you can." },
  ]);
  const [aiTrainingInstructions, setAiTrainingInstructions] = React.useState(
    "Generate uplifting, secular, non-religious quotes under 25 words. Avoid clichés, politics, and references to weight loss or appearance. Voice: warm, grounded, calm."
  );

  // Milestone Days states
  const [milestoneDay, setMilestoneDay] = React.useState("");
  const [milestoneQuote, setMilestoneQuote] = React.useState("");
  const [milestones, setMilestones] = React.useState([
    { id: "3", day: "Day 3" }
  ]);

  // Reports data states
  const [reports, setReports] = React.useState<ModerationReport[]>([]);
  const [coachesList, setCoachesList] = React.useState<any[]>([]);
  const [usersList, setUsersList] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [activeMenuId, setActiveMenuId] = React.useState<string | null>(null);

  // Message detail modal states
  const [isMessageModalOpen, setIsMessageModalOpen] = React.useState(false);
  const [activeMessageContent, setActiveMessageContent] = React.useState("");

  // Action (Warn/Block) modal states
  const [isActionModalOpen, setIsActionModalOpen] = React.useState(false);
  const [actionTarget, setActionTarget] = React.useState<"user" | "coach" | null>(null);
  const [actionType, setActionType] = React.useState<"warn" | "block" | null>(null);
  const [actionReport, setActionReport] = React.useState<ModerationReport | null>(null);

  // Load reports, coaches and users from mockApi
  const loadData = React.useCallback(async () => {
    try {
      const reportsData = await mockApi.getModerationReports();
      // Show pending reports in the AI list
      setReports(reportsData.filter(r => r.status === "Pending"));
      
      const coachesData = await mockApi.getDashboardCoaches();
      setCoachesList(coachesData);
      
      const usersData = await mockApi.getUsers();
      setUsersList(usersData);
    } catch (err) {
      console.error("Failed to load reports and assets:", err);
    }
  }, []);

  React.useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      loadData().then(() => setLoading(false));
    }, 450); // Simulate network latency
    return () => clearTimeout(timer);
  }, [loadData]);

  // Close menus when clicking outside
  React.useEffect(() => {
    const handleOutsideClick = () => setActiveMenuId(null);
    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, []);

  // Helper names getters
  const getCoachForReportName = (report: ModerationReport) => {
    if (report.type === "Coach") return report.reported;
    if (report.type === "User") return report.reporter;
    return report.reported;
  };

  const getUserForReportName = (report: ModerationReport) => {
    if (report.type === "Coach") return report.reporter;
    if (report.type === "User") return report.reported;
    return report.reporter;
  };

  // Handle action confirmation submit
  const handleActionSubmit = async (reason: string) => {
    if (!actionTarget || !actionType || !actionReport) return;

    const targetName = actionTarget === "user"
      ? getUserForReportName(actionReport)
      : getCoachForReportName(actionReport);

    try {
      setLoading(true);

      // Simulate calling update status APIs
      if (actionTarget === "user") {
        const found = usersList.find(u => u.name.toLowerCase() === targetName.toLowerCase());
        if (found) {
          const nextStatus = actionType === "block" ? "Blocked" : "Flagged";
          await mockApi.updateUserStatus(found.id, nextStatus);
        }
      } else {
        const found = coachesList.find(c => c.name.toLowerCase() === targetName.toLowerCase());
        if (found) {
          const nextStatus = actionType === "block" ? "Rejected" : "Pending";
          await mockApi.updateCoachStatus(found.id, nextStatus, `Reason: ${reason}`);
        }
      }

      // Auto-resolve the report with the action details
      const resolutionNote = `${actionType === "block" ? "Blocked" : "Warned"} ${actionTarget === "user" ? "User" : "Coach"} (${targetName}). Reason: ${reason}`;
      await mockApi.resolveModerationReport(actionReport.id, resolutionNote);

      setIsActionModalOpen(false);
      setActionReport(null);
      setActionTarget(null);
      setActionType(null);

      // Reload reports and statuses
      await loadData();

    } catch (err) {
      console.error("Failed to perform action:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle adding manual quotes
  const handleAddManualQuote = () => {
    if (!manualDate || !manualQuote) return;
    
    let formattedDate = manualDate;
    try {
      const dateObj = new Date(manualDate);
      if (!isNaN(dateObj.getTime())) {
        formattedDate = dateObj.toLocaleDateString("en-US", {
          day: "numeric",
          month: "long",
          year: "numeric"
        });
      }
    } catch (e) {}

    const newQuote = {
      id: Date.now(),
      date: formattedDate,
      text: manualQuote
    };
    setManualQuotes([newQuote, ...manualQuotes]);
    setManualQuote("");
    setManualDate("");
  };

  // Handle deleting manual quote
  const handleDeleteManualQuote = (id: number) => {
    setManualQuotes(manualQuotes.filter(q => q.id !== id));
  };

  // Handle adding milestone
  const handleAddMilestone = () => {
    if (!milestoneDay) return;
    const cleanDay = milestoneDay.startsWith("Day") ? milestoneDay : `Day ${milestoneDay}`;
    if (milestones.some(m => m.day.toLowerCase() === cleanDay.toLowerCase())) return;

    setMilestones([...milestones, { id: String(Date.now()), day: cleanDay }]);
    setMilestoneDay("");
    setMilestoneQuote("");
  };

  // Handle deleting milestone
  const handleDeleteMilestone = (id: string) => {
    setMilestones(milestones.filter(m => m.id !== id));
  };

  const tonesList = ["Friendly", "Professional", "Empathetic", "Direct", "Encouraging"];

  // Dynamic names and titles for ActionModal
  const actionTargetName = actionReport && actionTarget
    ? (actionTarget === "user" ? getUserForReportName(actionReport) : getCoachForReportName(actionReport))
    : "";

  const actionModalTitle = actionTarget && actionType
    ? `${actionType === "block" ? "Block" : "Warn"} ${actionTarget === "user" ? "User" : "Coach"}`
    : "";

  if (loading) {
    return (
      <div className="w-full space-y-6 animate-pulse font-sans">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 bg-zinc-100 rounded-2xl"></div>
          ))}
        </div>
        <div className="h-96 bg-zinc-100 rounded-2xl"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans animate-in fade-in duration-300">
      
      {/* Stats Summary Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white border border-border p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 min-h-[120px] flex flex-col justify-between">
          <span className="text-xs font-semibold text-[#6D6D6D] uppercase tracking-wider">AI Triggers Today</span>
          <span className="text-3xl font-extrabold text-[#d97706] tracking-tight mt-1">1432</span>
        </div>
        <div className="bg-white border border-border p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 min-h-[120px] flex flex-col justify-between">
          <span className="text-xs font-semibold text-[#6D6D6D] uppercase tracking-wider">Success Rate</span>
          <span className="text-3xl font-extrabold text-[#0da34c] tracking-tight mt-1">85%</span>
        </div>
        <div className="bg-white border border-border p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 min-h-[120px] flex flex-col justify-between">
          <span className="text-xs font-semibold text-[#6D6D6D] uppercase tracking-wider">Active Rules</span>
          <span className="text-3xl font-extrabold text-[#0f766e] tracking-tight mt-1">24</span>
        </div>
        <div className="bg-white border border-border p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 min-h-[120px] flex flex-col justify-between">
          <span className="text-xs font-semibold text-[#6D6D6D] uppercase tracking-wider">Average Response Time</span>
          <span className="text-3xl font-extrabold text-[#b25e2e] tracking-tight mt-1">1.2s</span>
        </div>
      </div>

      {view === "config" ? (
        <>
          {/* Navigation Redirect Button to Reports list subview */}
          <div className="flex justify-end pr-1">
            <Button
              onClick={() => setView("reports")}
              className="bg-[#0da34c] hover:bg-[#0da34c]/95 text-white font-bold text-sm px-6 py-2 rounded-xl transition-all cursor-pointer shadow-sm font-sans"
            >
              AI Reports →
            </Button>
          </div>

          {/* Main Configurations Section */}
          <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
            
            {/* Left Section: Tone & Wisdom (6 columns) */}
            <div className="lg:col-span-6 space-y-6 flex flex-col">
              
              {/* AI Personality and Tones Card */}
              <div className="bg-white border border-border p-6 rounded-2xl shadow-sm flex flex-col">
                <h3 className="text-lg font-bold text-slate-800 font-sans tracking-tight mb-6">
                  AI Personality and Tones
                </h3>

                <div className="space-y-5">
                  {/* Dropdown tone selector */}
                  <div className="flex flex-col relative">
                    <span className="text-xs font-semibold text-[#6D6D6D] mb-2 font-sans">
                      Select a Tone
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsToneDropdownOpen(!isToneDropdownOpen)}
                      className="w-full bg-white border border-[#E2E8F0] rounded-xl px-4 py-3 text-sm text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-[#0da34c] transition-all flex justify-between items-center cursor-pointer font-sans h-11"
                    >
                      <span>{selectedTone}</span>
                      <svg className={`w-4 h-4 text-slate-400 transition-transform ${isToneDropdownOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                      </svg>
                    </button>

                    {isToneDropdownOpen && (
                      <div className="absolute top-[68px] z-30 w-full bg-white border border-border rounded-xl shadow-lg p-1.5 flex flex-col animate-in fade-in duration-100">
                        {tonesList.map((tone) => (
                          <button
                            key={tone}
                            type="button"
                            onClick={() => {
                              setSelectedTone(tone);
                              setIsToneDropdownOpen(false);
                            }}
                            className="w-full px-3 py-2 text-sm text-slate-700 hover:bg-[#f8faf8] hover:text-[#0da34c] rounded-lg transition-colors text-left cursor-pointer font-medium"
                          >
                            {tone}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Slider selector */}
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-[#6D6D6D] mb-2 font-sans">
                      Empathy Level
                    </span>
                    <div className="flex items-center gap-4 py-2">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={empathyLevel}
                        onChange={(e) => setEmpathyLevel(Number(e.target.value))}
                        className="flex-1 accent-[#0da34c] h-1.5 bg-[#e2e8e2] rounded-lg appearance-none cursor-pointer"
                      />
                      <span className="text-sm font-bold text-slate-800 w-8 text-right font-sans">
                        {empathyLevel}%
                      </span>
                    </div>
                  </div>

                  {/* Instructions text area */}
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-[#6D6D6D] mb-2 font-sans">
                      Custom AI Instructions
                    </span>
                    <textarea
                      placeholder="Enter here"
                      value={customInstructions}
                      onChange={(e) => setCustomInstructions(e.target.value)}
                      className="w-full bg-white border border-[#E2E8F0] rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0da34c] transition-all h-28 resize-none font-sans"
                    />
                  </div>

                  {/* Save Buttons */}
                  <div className="flex gap-4 pt-2">
                    <button
                      type="button"
                      onClick={() => alert("Changes saved successfully!")}
                      className="flex-1 border border-[#0da34c] text-[#0da34c] hover:bg-[#e8f5e9]/30 rounded-xl py-2.5 text-sm font-bold transition-all h-11 cursor-pointer font-sans bg-white"
                    >
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => alert("AI settings synchronized!")}
                      className="flex-1 bg-[#0da34c] hover:bg-[#0da34c]/95 text-white rounded-xl py-2.5 text-sm font-bold transition-all h-11 cursor-pointer shadow-sm font-sans"
                    >
                      Save →
                    </button>
                  </div>
                </div>
              </div>
              
            </div>

            {/* Right Section: Quick Settings (4 columns) */}
            <div className="lg:col-span-4 space-y-6 ">
              
              {/* Quick Settings Card */}
              <div className="bg-white border border-border p-6 rounded-2xl shadow-sm flex flex-col h-full">
                <h3 className="text-lg font-bold text-slate-800 font-sans tracking-tight mb-6">
                  Quick Settings
                </h3>

                <div className="space-y-6">
                  {/* Daily Wisdom toggle */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-slate-800 font-sans">Daily Wisdom</p>
                      <p className="text-xs text-[#6D6D6D] font-medium mt-0.5 font-sans">Auto-generated</p>
                    </div>
                    <button
                      onClick={() => setDailyWisdomEnabled(!dailyWisdomEnabled)}
                      className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none cursor-pointer ${dailyWisdomEnabled ? "bg-[#0da34c]" : "bg-[#e2e8e2]"}`}
                    >
                      <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${dailyWisdomEnabled ? "translate-x-5" : ""}`} />
                    </button>
                  </div>

                  {/* Milestone Messages toggle */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-slate-800 font-sans">Follow up Milestone Messages</p>
                      <p className="text-xs text-[#6D6D6D] font-medium mt-0.5 font-sans">7, 14, 30, 60, 90 days</p>
                    </div>
                    <button
                      onClick={() => setFollowUpEnabled(!followUpEnabled)}
                      className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none cursor-pointer ${followUpEnabled ? "bg-[#0da34c]" : "bg-[#e2e8e2]"}`}
                    >
                      <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${followUpEnabled ? "translate-x-5" : ""}`} />
                    </button>
                  </div>

                  {/* Emotional Detection toggle */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-slate-800 font-sans">Emotional Detection</p>
                      <p className="text-xs text-[#6D6D6D] font-medium mt-0.5 font-sans">Analyze patterns</p>
                    </div>
                    <button
                      onClick={() => setEmotionalDetectionEnabled(!emotionalDetectionEnabled)}
                      className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none cursor-pointer ${emotionalDetectionEnabled ? "bg-[#0da34c]" : "bg-[#e2e8e2]"}`}
                    >
                      <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${emotionalDetectionEnabled ? "translate-x-5" : ""}`} />
                    </button>
                  </div>
                </div>
              </div>
              
            </div>
          </div>

          {/* Wisdom Source Selector */}
          <div className="bg-white border border-border p-6 rounded-2xl shadow-sm flex flex-col">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-800 font-sans tracking-tight">
                  Daily Wisdom Source
                </h3>
                <p className="text-xs font-semibold text-[#6D6D6D] mt-1 font-sans">
                  Choose how daily quotes are produced for users.
                </p>
              </div>

              {/* Manual vs AI Mode Segmented Toggle Switch */}
              <div className="flex bg-[#f3f4f3] p-1 rounded-xl items-center gap-1 self-start font-sans h-9">
                <button
                  onClick={() => setWisdomMode("Manual")}
                  className={`
                    px-4 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer h-7
                    ${wisdomMode === "Manual" ? "bg-[#0da34c] text-white shadow-sm" : "text-[#6D6D6D] hover:text-[#585858]"}
                  `}
                >
                  Manual
                </button>
                <button
                  onClick={() => setWisdomMode("AI")}
                  className={`
                    px-4 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer h-7
                    ${wisdomMode === "AI" ? "bg-[#0da34c] text-white shadow-sm" : "text-[#6D6D6D] hover:text-[#585858]"}
                  `}
                >
                  AI Mode
                </button>
              </div>
            </div>

            {wisdomMode === "Manual" ? (
              <div className="space-y-6">
                
                {/* Input row */}
                <div className="grid grid-cols-1 md:grid-cols-10 gap-4 items-end bg-[#f8faf8] border border-border rounded-xl p-4">
                  <div className="flex flex-col md:col-span-3">
                    <span className="text-xs font-semibold text-[#6D6D6D] mb-1.5 font-sans">
                      Select the date
                    </span>
                    <input
                      type="date"
                      value={manualDate}
                      onChange={(e) => setManualDate(e.target.value)}
                      className="w-full bg-white border border-[#E2E8F0] rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0da34c] transition-all h-9 font-sans"
                    />
                  </div>

                  <div className="flex flex-col md:col-span-5">
                    <span className="text-xs font-semibold text-[#6D6D6D] mb-1.5 font-sans">
                      Write the quote for this day
                    </span>
                    <input
                      type="text"
                      placeholder="Enter quote message here..."
                      value={manualQuote}
                      onChange={(e) => setManualQuote(e.target.value)}
                      className="w-full bg-white border border-[#E2E8F0] rounded-xl px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0da34c] transition-all h-9 font-sans"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <button
                      type="button"
                      onClick={handleAddManualQuote}
                      className="w-full bg-[#0da34c] hover:bg-[#0da34c]/95 text-white rounded-xl py-2 text-xs font-bold transition-all h-9 cursor-pointer flex items-center justify-center gap-1.5 shadow-sm font-sans"
                    >
                      <span className="text-sm font-semibold">+</span> Add
                    </button>
                  </div>
                </div>

                {/* List entries */}
                <div className="space-y-3">
                  {manualQuotes.map((item) => (
                    <div 
                      key={item.id}
                      className="flex items-center justify-between border border-border rounded-xl p-4 hover:shadow-sm transition-all"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <span className="inline-flex px-3 py-1 rounded-md text-[11px] font-semibold bg-[#e8f5e9] text-[#0da34c] border border-[#c8e6c9]/40 whitespace-nowrap">
                          {item.date}
                        </span>
                        <p className="text-sm text-slate-700 font-medium truncate font-sans">
                          {item.text}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteManualQuote(item.id)}
                        className="p-1.5 hover:bg-red-50 text-red-400 hover:text-red-500 rounded-lg transition-colors cursor-pointer shrink-0"
                        title="Remove quote"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.34 9m-4.78 0L9 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>

              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-[#6D6D6D] mb-2 font-sans">
                    AI Training Instructions
                  </span>
                  <textarea
                    value={aiTrainingInstructions}
                    onChange={(e) => setAiTrainingInstructions(e.target.value)}
                    className="w-full bg-[#f8faf8] border border-border rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0da34c] transition-all h-32 resize-none font-sans"
                  />
                  <span className="text-[11px] text-[#6D6D6D]/70 font-semibold mt-2.5 font-sans">
                    {aiTrainingInstructions.length} characters
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Milestone Days Card */}
          <div className="bg-white border border-border p-6 rounded-2xl shadow-sm flex flex-col">
            <h3 className="text-lg font-bold text-slate-800 font-sans tracking-tight">
              Milestone Days
            </h3>
            <p className="text-xs font-semibold text-[#6D6D6D] mt-1 font-sans">
              Highlight specific days as milestones, regardless of source mode.
            </p>

            {/* Input row */}
            <div className="grid grid-cols-1 md:grid-cols-10 gap-4 items-end bg-[#f8faf8] border border-border rounded-xl p-4 mt-6">
              <div className="flex flex-col md:col-span-3">
                <span className="text-xs font-semibold text-[#6D6D6D] mb-1.5 font-sans">
                  Enter Day
                </span>
                <input
                  type="text"
                  placeholder="e.g. Day 3"
                  value={milestoneDay}
                  onChange={(e) => setMilestoneDay(e.target.value)}
                  className="w-full bg-white border border-[#E2E8F0] rounded-xl px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0da34c] transition-all h-9 font-sans"
                />
              </div>

              <div className="flex flex-col md:col-span-5">
                <span className="text-xs font-semibold text-[#6D6D6D] mb-1.5 font-sans">
                  Write the quote for this day
                </span>
                <input
                  type="text"
                  placeholder="Enter milestone message..."
                  value={milestoneQuote}
                  onChange={(e) => setMilestoneQuote(e.target.value)}
                  className="w-full bg-white border border-[#E2E8F0] rounded-xl px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0da34c] transition-all h-9 font-sans"
                />
              </div>

              <div className="md:col-span-2">
                <button
                  type="button"
                  onClick={handleAddMilestone}
                  className="w-full bg-[#0da34c] hover:bg-[#0da34c]/95 text-white rounded-xl py-2 text-xs font-bold transition-all h-9 cursor-pointer flex items-center justify-center gap-1.5 shadow-sm font-sans"
                >
                  <span className="text-sm font-semibold">+</span> Add
                </button>
              </div>
            </div>

            {/* Milestone tags */}
            <div className="flex flex-wrap gap-2.5 mt-5">
              {milestones.map((m) => (
                <span 
                  key={m.id}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold bg-[#e8f5e9] text-[#0da34c] border border-[#c8e6c9]/45 font-sans"
                >
                  <span>{m.day}</span>
                  <button
                    onClick={() => handleDeleteMilestone(m.id)}
                    className="text-[#0da34c] hover:text-[#0a6630] font-bold text-sm focus:outline-none transition-colors cursor-pointer"
                    title="Remove milestone"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </>
      ) : (
        /* REPORTS SUBVIEW (Image 3) */
        <div className="bg-white border border-border p-6 rounded-2xl shadow-sm flex flex-col animate-in fade-in duration-200">
          {/* Back button */}
          <button
            onClick={() => setView("config")}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0da34c] hover:underline mb-6 cursor-pointer focus:outline-none self-start font-sans"
          >
            <MdArrowBack className="w-4 h-4" />
            <span>Back to Settings</span>
          </button>

          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-800 tracking-tight leading-snug font-sans">
              Reports list
            </h2>
          </div>

          <ReportsTable 
            reports={reports}
            coachesList={coachesList}
            usersList={usersList}
            onReadMore={(msg: string) => {
              setActiveMessageContent(msg);
              setIsMessageModalOpen(true);
            }}
            onActionTrigger={(target, type, report) => {
              setActionTarget(target);
              setActionType(type);
              setActionReport(report);
              setIsActionModalOpen(true);
              setActiveMenuId(null);
            }}
            activeMenuId={activeMenuId}
            onToggleMenu={setActiveMenuId}
          />
        </div>
      )}

      {/* Confirmation and Message Detail Modals */}
      <ActionReportModal 
        isOpen={isActionModalOpen}
        onClose={() => setIsActionModalOpen(false)}
        onSubmit={handleActionSubmit}
        title={actionModalTitle}
        targetName={actionTargetName}
      />

      <MessageDetailModal 
        isOpen={isMessageModalOpen}
        onClose={() => setIsMessageModalOpen(false)}
        message={activeMessageContent}
      />

    </div>
  );
}
