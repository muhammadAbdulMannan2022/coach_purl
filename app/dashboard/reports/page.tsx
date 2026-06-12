"use client";

import * as React from "react";
import StatCard from "@/components/ui/dashboardCard";
import ResolveReportModal from "./components/ResolveReportModal";
import { 
  MdSearch, 
  MdClose, 
  MdOutlineRemoveRedEye, 
  MdMoreVert, 
  MdArrowBack 
} from "react-icons/md";
import { 
  mockApi, 
  ModerationReport 
} from "@/lib/mock-data";

// Skeleton loader for async UX
const ReportsSkeleton = () => (
  <div className="w-full space-y-6 animate-pulse">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="h-28 bg-zinc-100 rounded-2xl"></div>
      ))}
    </div>
    <div className="h-96 bg-zinc-100 rounded-2xl"></div>
  </div>
);

export default function ReportsAndModerationPage() {
  const [loading, setLoading] = React.useState(true);
  const [reports, setReports] = React.useState<ModerationReport[]>([]);
  const [activeTab, setActiveTab] = React.useState<"Pending" | "Resolved">("Pending");
  
  // Navigation details state
  const [selectedReportId, setSelectedReportId] = React.useState<string | null>(null);

  // Search query state
  const [searchQuery, setSearchQuery] = React.useState("");
  
  // Dropdown menu state
  const [activeMenuId, setActiveMenuId] = React.useState<string | null>(null);

  // Modal control states
  const [isResolveModalOpen, setIsResolveModalOpen] = React.useState(false);
  const [resolvingReportId, setResolvingReportId] = React.useState<string | null>(null);

  // Load reports from mockApi
  const loadReportsData = React.useCallback(async () => {
    try {
      const reportsData = await mockApi.getModerationReports();
      setReports(reportsData);
    } catch (err) {
      console.error("Failed to load reports data:", err);
    }
  }, []);

  React.useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      loadReportsData().then(() => setLoading(false));
    }, 450); // Simulate network latency
    return () => clearTimeout(timer);
  }, [loadReportsData]);

  // Close menus when clicking outside
  React.useEffect(() => {
    const handleOutsideClick = () => setActiveMenuId(null);
    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, []);

  // Handle report resolution submit
  const handleResolveSubmit = async (note: string) => {
    const targetId = resolvingReportId || selectedReportId;
    if (!targetId) return;

    try {
      setLoading(true);
      await mockApi.resolveModerationReport(targetId, note);
      setIsResolveModalOpen(false);
      setResolvingReportId(null);
      
      // If we are in detail view, update the view state too
      await loadReportsData();
      
      // Navigate to Resolved tab
      setActiveTab("Resolved");
      setSelectedReportId(null); // Return to list view
    } catch (err) {
      console.error("Failed to resolve report:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleActionClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setActiveMenuId(activeMenuId === id ? null : id);
  };

  const handleViewDetails = (id: string) => {
    setSelectedReportId(id);
    setActiveMenuId(null);
  };

  const triggerResolveModal = (id: string) => {
    setResolvingReportId(id);
    setIsResolveModalOpen(true);
    setActiveMenuId(null);
  };

  // Filter reports by search queries and active tab
  const filteredReports = reports.filter(r => {
    if (r.status !== activeTab) return false;

    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      r.reporter.toLowerCase().includes(q) ||
      r.reported.toLowerCase().includes(q) ||
      r.reason.toLowerCase().includes(q) ||
      r.id.toLowerCase().includes(q)
    );
  });

  // Calculate stats values
  const totalOpen = reports.length;
  const totalPending = reports.filter(r => r.status === "Pending").length;
  const totalResolved = reports.filter(r => r.status === "Resolved").length;

  const currentReport = reports.find(r => r.id === selectedReportId);

  return (
    <div className="space-y-6 font-sans animate-in fade-in duration-300">
      
      {loading ? (
        <ReportsSkeleton />
      ) : (
        <>
          {/* Stats Summary Cards Row (No icons, matching layout mockup) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-border p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 min-h-[120px] flex flex-col justify-between">
              <span className="text-xs font-semibold text-[#6D6D6D] uppercase tracking-wider">Open Reports</span>
              <span className="text-3xl font-extrabold text-[#b25e2e] tracking-tight mt-1">{String(totalOpen).padStart(2, '0')}</span>
            </div>
            <div className="bg-white border border-border p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 min-h-[120px] flex flex-col justify-between">
              <span className="text-xs font-semibold text-[#6D6D6D] uppercase tracking-wider">Pending Reports</span>
              <span className="text-3xl font-extrabold text-[#d97706] tracking-tight mt-1">{String(totalPending).padStart(2, '0')}</span>
            </div>
            <div className="bg-white border border-border p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 min-h-[120px] flex flex-col justify-between">
              <span className="text-xs font-semibold text-[#6D6D6D] uppercase tracking-wider">Resolved</span>
              <span className="text-3xl font-extrabold text-[#0da34c] tracking-tight mt-1">{String(totalResolved).padStart(2, '0')}</span>
            </div>
          </div>

          {!selectedReportId ? (
            /* VIEW 1: Main reports lists with searching and tabs */
            <div className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden flex flex-col p-6">
              
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-slate-800 font-sans">
                  All Reports
                </h3>

                {/* Search toggle bar right-aligned */}
                <div className="relative max-w-[240px]">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MdSearch className="w-5 h-5 text-[#0da34c]" />
                  </span>
                  <input
                    type="text"
                    placeholder="Search reports..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#f8faf8] border border-border rounded-xl pl-9 pr-8 py-1.5 text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all h-9"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-foreground/50 hover:text-foreground cursor-pointer"
                    >
                      <MdClose className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Sub-tabs switch selectors: Pending vs Resolved (Pending green, unselected grey) */}
              <div className="flex bg-[#f3f4f3] p-1 rounded-xl items-center gap-1 self-start mb-6 font-sans">
                <button
                  onClick={() => {
                    setActiveTab("Pending");
                    setSearchQuery("");
                  }}
                  className={`
                    px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer
                    ${activeTab === "Pending" ? "bg-[#0da34c] text-white shadow-sm" : "text-[#6D6D6D] hover:text-[#585858]"}
                  `}
                >
                  Pending
                </button>
                <button
                  onClick={() => {
                    setActiveTab("Resolved");
                    setSearchQuery("");
                  }}
                  className={`
                    px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer
                    ${activeTab === "Resolved" ? "bg-[#0da34c] text-white shadow-sm" : "text-[#6D6D6D] hover:text-[#585858]"}
                  `}
                >
                  Resolved
                </button>
              </div>

              {/* Data Table */}
              <div className="overflow-x-auto -mx-6 border-t border-border">
                {filteredReports.length === 0 ? (
                  <div className="py-12 text-center text-[#6D6D6D] font-medium font-sans">
                    No reports found matching your criteria.
                  </div>
                ) : activeTab === "Pending" ? (
                  /* PENDING REPORTS TABLE */
                  <table className="w-full text-left border-collapse min-w-[750px] font-sans">
                    <thead>
                      <tr className="bg-zinc-50 border-b border-border text-[13px] font-semibold text-[#6D6D6D] tracking-wide">
                        <th className="px-6 py-4">Report ID</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Reporter</th>
                        <th className="px-6 py-4">Reported</th>
                        <th className="px-6 py-4">Reason</th>
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4">View Report</th>
                        <th className="px-6 py-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border text-[14px]">
                      {filteredReports.map((report) => (
                        <tr 
                          key={report.id}
                          className="hover:bg-zinc-50/50 transition-colors"
                        >
                          <td className="px-6 py-4 text-slate-500 font-medium">
                            {report.id}
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex px-2.5 py-0.5 rounded-md text-xs font-semibold bg-amber-50 text-amber-600 border border-amber-100">
                              Pending
                            </span>
                          </td>
                          <td className="px-6 py-4 font-bold text-slate-800">
                            {report.reporter}
                          </td>
                          <td className="px-6 py-4 font-bold text-slate-800">
                            {report.reported}
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex px-2.5 py-0.5 rounded-md text-xs font-medium border border-border bg-slate-50 text-slate-700">
                              {report.reason}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-[#6D6D6D]">
                            {report.date}
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => handleViewDetails(report.id)}
                              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6D6D6D] hover:text-[#0da34c] transition-all cursor-pointer focus:outline-none"
                            >
                              <MdOutlineRemoveRedEye className="w-4 h-4" />
                              <span>View</span>
                            </button>
                          </td>
                          <td className="px-6 py-4 text-center relative whitespace-nowrap">
                            <button
                              onClick={(e) => handleActionClick(e, report.id)}
                              className="p-1 hover:bg-zinc-100 rounded-full transition-colors inline-block focus:outline-none cursor-pointer"
                            >
                              <MdMoreVert className="w-5 h-5 text-slate-500" />
                            </button>

                            {/* Dropdown Menu block */}
                            {activeMenuId === report.id && (
                              <div 
                                className="absolute right-6 top-9 mt-1 z-30 w-32 bg-white border border-border rounded-xl shadow-lg p-1.5 text-left"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <button
                                  onClick={() => triggerResolveModal(report.id)}
                                  className="w-full px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-[#e8f5e9] hover:text-[#0da34c] rounded-lg transition-all text-left cursor-pointer"
                                >
                                  Resolve
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  /* RESOLVED REPORTS TABLE */
                  <table className="w-full text-left border-collapse min-w-[750px] font-sans">
                    <thead>
                      <tr className="bg-zinc-50 border-b border-border text-[13px] font-semibold text-[#6D6D6D] tracking-wide">
                        <th className="px-6 py-4">Report ID</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Type</th>
                        <th className="px-6 py-4">Reporter</th>
                        <th className="px-6 py-4">Reported</th>
                        <th className="px-6 py-4">Reason</th>
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4">View Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border text-[14px]">
                      {filteredReports.map((report) => (
                        <tr 
                          key={report.id}
                          className="hover:bg-zinc-50/50 transition-colors"
                        >
                          <td className="px-6 py-4 text-slate-500 font-medium">
                            {report.id}
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex px-2.5 py-0.5 rounded-md text-xs font-semibold bg-emerald-50 text-[#0da34c] border border-emerald-100">
                              Resolved
                            </span>
                          </td>
                          <td className="px-6 py-4 text-[#6D6D6D]">
                            {report.type}
                          </td>
                          <td className="px-6 py-4 font-bold text-slate-800">
                            {report.reporter}
                          </td>
                          <td className="px-6 py-4 font-bold text-slate-800">
                            {report.reported}
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex px-2.5 py-0.5 rounded-md text-xs font-medium border border-border bg-slate-50 text-slate-700">
                              {report.reason}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-[#6D6D6D]">
                            {report.date}
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => handleViewDetails(report.id)}
                              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6D6D6D] hover:text-[#0da34c] transition-all cursor-pointer focus:outline-none"
                            >
                              <MdOutlineRemoveRedEye className="w-4 h-4" />
                              <span>View</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          ) : (
            /* VIEW 2: Detailed report view panel matching Image 2 */
            <div className="bg-white border border-border p-6 rounded-2xl shadow-sm flex flex-col">
              
              {/* Back navigation control */}
              <button
                onClick={() => setSelectedReportId(null)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0da34c] hover:underline mb-6 cursor-pointer focus:outline-none"
              >
                <MdArrowBack className="w-4 h-4" />
                <span>Back to Reports</span>
              </button>

              {currentReport && (
                <div className="space-y-6">
                  {/* Title and Action header row */}
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">
                        {currentReport.reporter}
                      </h2>
                      <p className="text-sm font-semibold text-slate-500 mt-1">
                        Reason : <span className="text-slate-700">{currentReport.reason}</span>
                      </p>
                    </div>

                    {/* Resolve button (Only displays when report is Pending) */}
                    {currentReport.status === "Pending" ? (
                      <button
                        onClick={() => setIsResolveModalOpen(true)}
                        className="bg-[#0da34c] hover:bg-[#0da34c]/95 text-white text-sm font-bold px-6 py-2 rounded-lg shadow-sm transition-all cursor-pointer focus:outline-none"
                      >
                        Resolve
                      </button>
                    ) : (
                      <span className="inline-flex px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-50 text-[#0da34c] border border-emerald-100">
                        Resolved Report
                      </span>
                    )}
                  </div>

                  {/* Body description text block */}
                  <div className="pt-4 border-t border-zinc-100 text-slate-600 leading-relaxed text-sm whitespace-pre-wrap font-sans">
                    {currentReport.description}
                  </div>

                  {/* Resolution Notes detail (If report is Resolved) */}
                  {currentReport.status === "Resolved" && currentReport.resolutionNote && (
                    <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 mt-6">
                      <h4 className="text-sm font-bold text-[#0da34c] mb-1 font-sans">Resolution Notes</h4>
                      <p className="text-sm text-slate-700 leading-relaxed font-sans">
                        {currentReport.resolutionNote}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Resolve prompt overlay modal component */}
          <ResolveReportModal
            isOpen={isResolveModalOpen}
            onClose={() => setIsResolveModalOpen(false)}
            onSubmit={handleResolveSubmit}
          />
        </>
      )}

    </div>
  );
}
