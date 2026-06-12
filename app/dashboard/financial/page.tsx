"use client";

import * as React from "react";
import { mockApi, FinancialStats, FinancialChartDataPoint, TransactionRecord } from "@/lib/mock-data";
import StatCard from "@/components/ui/dashboardCard";
import { Button } from "@/components/ui/button";
import { 
  MdFilterList, 
  MdFileDownload, 
  MdCalendarToday, 
  MdKeyboardArrowDown, 
  MdAttachMoney, 
  MdAccountBalanceWallet, 
  MdAutorenew, 
  MdWarning,
  MdSearch,
  MdClose
} from "react-icons/md";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

type ModeType = "Net" | "Total" | "Gross";

export default function FinancialReportsPage() {
  const [loading, setLoading] = React.useState(true);
  const [mode, setMode] = React.useState<ModeType>("Net");
  const [stats, setStats] = React.useState<FinancialStats | null>(null);
  const [chartData, setChartData] = React.useState<FinancialChartDataPoint[]>([]);
  const [transactions, setTransactions] = React.useState<TransactionRecord[]>([]);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [exporting, setExporting] = React.useState(false);

  // Date picker mocks states
  const [fromDate, setFromDate] = React.useState("");
  const [toDate, setToDate] = React.useState("");
  const [selectedYear, setSelectedYear] = React.useState("Select Year");
  const [isYearDropdownOpen, setIsYearDropdownOpen] = React.useState(false);

  const loadFinancialData = React.useCallback(async () => {
    try {
      const [s, c, t] = await Promise.all([
        mockApi.getFinancialStats(mode),
        mockApi.getFinancialChartData(mode),
        mockApi.getTransactions(searchQuery)
      ]);
      setStats(s);
      setChartData(c);
      setTransactions(t);
    } catch (err) {
      console.error(err);
    }
  }, [mode, searchQuery]);

  React.useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      loadFinancialData().then(() => setLoading(false));
    }, 450);
    return () => clearTimeout(timer);
  }, [loadFinancialData]);

  // Handle outside click to close year dropdown
  React.useEffect(() => {
    const handleOutside = () => setIsYearDropdownOpen(false);
    window.addEventListener("click", handleOutside);
    return () => window.removeEventListener("click", handleOutside);
  }, []);

  const handleModeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMode(e.target.value as ModeType);
  };

  const handleExport = () => {
    setExporting(true);
    setTimeout(() => {
      setExporting(false);
      // Simulate file download
      const headers = ["Transaction ID", "Date", "Service", "Gross", "Net", "Platform 20%", "Coach Payout"];
      const rows = transactions.map(t => [t.id, t.date, t.service, t.gross, t.net, t.platformFee, t.payout]);
      const csvContent = [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
      
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `Financial_Reports_${mode}_2026.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }, 800);
  };

  return (
    <div className="space-y-6 font-sans animate-in fade-in duration-300">
      
      {/* 4-Card Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Today's Revenue"
          value={stats?.revenueToday || "$0"}
          valueColor="text-[#b08b5c] font-bold"
          icon={<MdAttachMoney className="w-6 h-6 text-blue-600" />}
          iconBg="bg-blue-50"
        />
        <StatCard
          title="Platform Earnings"
          value={stats?.platformEarnings || "$0"}
          valueColor="text-[#0da34c] font-bold"
          icon={<MdAccountBalanceWallet className="w-6 h-6 text-amber-600" />}
          iconBg="bg-amber-50"
        />
        <StatCard
          title="Pending Payouts"
          value={stats?.pendingPayouts || "$0"}
          valueColor="text-[#0f766e] font-bold"
          icon={<MdAutorenew className="w-6 h-6 text-emerald-600" />}
          iconBg="bg-emerald-50"
        />
        <StatCard
          title="Open Disputes"
          value={stats?.openDisputes || "0"}
          valueColor="text-[#c2410c] font-bold"
          icon={<MdWarning className="w-6 h-6 text-red-500 animate-pulse" />}
          iconBg="bg-red-50"
        />
      </div>

      {/* Main Filter & Recharts Card */}
      <div className="bg-white border border-border rounded-2xl p-6 shadow-sm space-y-6 flex flex-col">
        
        {/* Header toolbar */}
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 border-b border-border pb-4">
          <div className="flex items-center gap-2 text-slate-800">
            <MdFilterList className="w-6 h-6 text-slate-500 shrink-0" />
            <span className="text-lg font-bold">Filter</span>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
            {/* Mode selection dropdown */}
            <div className="relative">
              <select
                value={mode}
                onChange={handleModeChange}
                className="appearance-none bg-[#f8faf8] border border-border rounded-xl px-4 py-2 pr-10 text-xs font-semibold text-[#6D6D6D] focus:outline-none focus:ring-2 focus:ring-ring transition-all cursor-pointer h-10 min-w-[100px]"
              >
                <option value="Net">Net</option>
                <option value="Total">Total</option>
                <option value="Gross">Gross</option>
              </select>
              <MdKeyboardArrowDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
            </div>

            {/* Export button */}
            <Button
              onClick={handleExport}
              disabled={exporting}
              className="bg-[#0da34c] hover:bg-[#0da34c]/95 text-white font-semibold text-xs h-10 px-5 flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <MdFileDownload className="w-4.5 h-4.5" />
              <span>{exporting ? "Exporting..." : "Export"}</span>
            </Button>
          </div>
        </div>

        {/* Mocks Filter Inputs Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* From date */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#6D6D6D]">From</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full bg-[#f8faf8] border border-border rounded-xl px-4 py-2.5 text-[14px] text-[#6D6D6D] focus:outline-none focus:ring-2 focus:ring-ring transition-all font-semibold h-11 cursor-pointer"
            />
          </div>

          {/* To date */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#6D6D6D]">To</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="w-full bg-[#f8faf8] border border-border rounded-xl px-4 py-2.5 text-[14px] text-[#6D6D6D] focus:outline-none focus:ring-2 focus:ring-ring transition-all font-semibold h-11 cursor-pointer"
            />
          </div>

          {/* Year select */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#6D6D6D]">Year</label>
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                onClick={() => setIsYearDropdownOpen(prev => !prev)}
                className="w-full bg-[#f8faf8] border border-border rounded-xl px-4 py-2.5 text-[14px] text-foreground font-semibold flex items-center justify-between text-left focus:outline-none focus:ring-2 focus:ring-ring transition-all h-11 cursor-pointer"
              >
                <span className={selectedYear === "Select Year" ? "text-foreground/40 font-semibold" : "text-foreground font-semibold"}>
                  {selectedYear}
                </span>
                <MdKeyboardArrowDown className="w-5 h-5 text-slate-500 shrink-0" />
              </button>

              {isYearDropdownOpen && (
                <div className="absolute top-12 left-0 right-0 z-20 bg-white border border-border rounded-xl shadow-lg p-1.5 flex flex-col text-left">
                  {["2026", "2025", "2024"].map((yr) => (
                    <button
                      key={yr}
                      type="button"
                      onClick={() => {
                        setSelectedYear(yr);
                        setIsYearDropdownOpen(false);
                      }}
                      className="w-full px-3 py-2 text-xs font-semibold text-[#6D6D6D] hover:bg-[#f8faf8] hover:text-[#0da34c] rounded-lg transition-colors text-left cursor-pointer"
                    >
                      {yr}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Aggregated Totals Indicators Bar */}
        <div className="pt-2 flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-6">
          {/* Total Sum label */}
          <div className="shrink-0 self-start lg:self-auto">
            <span className="text-xl font-extrabold text-slate-900 tracking-tight">
              {stats?.totalLabel || "Total : 10k"}
            </span>
          </div>

          {/* Category indicators progress values */}
          <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {/* Subscription */}
            <div className="flex flex-col">
              <div className="w-full h-1 bg-amber-400 rounded-full mb-2" />
              <p className="text-[11px] font-semibold text-[#6D6D6D] uppercase tracking-wide">Subscription</p>
              <p className="text-xl font-bold text-slate-800 mt-0.5">{stats?.subscription || "0"}k</p>
            </div>

            {/* Pay Per Minute */}
            <div className="flex flex-col">
              <div className="w-full h-1 bg-indigo-500 rounded-full mb-2" />
              <p className="text-[11px] font-semibold text-[#6D6D6D] uppercase tracking-wide">Pay Per Minute</p>
              <p className="text-xl font-bold text-slate-800 mt-0.5">{stats?.payPerMinute || "0"}k</p>
            </div>

            {/* Credit */}
            <div className="flex flex-col">
              <div className="w-full h-1 bg-rose-500 rounded-full mb-2" />
              <p className="text-[11px] font-semibold text-[#6D6D6D] uppercase tracking-wide">Credit</p>
              <p className="text-xl font-bold text-slate-800 mt-0.5">{stats?.credit || "0"}k</p>
            </div>

            {/* Session */}
            <div className="flex flex-col">
              <div className="w-full h-1 bg-[#06b6d4] rounded-full mb-2" />
              <p className="text-[11px] font-semibold text-[#6D6D6D] uppercase tracking-wide">Session</p>
              <p className="text-xl font-bold text-slate-800 mt-0.5">{stats?.session || "0"}k</p>
            </div>
          </div>
        </div>

        {/* Recharts Area Chart */}
        <div className="w-full h-80 pt-4">
          {loading ? (
            <div className="w-full h-full bg-zinc-50 border border-dashed border-border rounded-xl flex items-center justify-center text-[#6D6D6D] text-sm animate-pulse">
              Loading Recharts dataset...
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSub" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity="0.25"/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity="0.0"/>
                  </linearGradient>
                  <linearGradient id="colorPpm" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity="0.25"/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity="0.0"/>
                  </linearGradient>
                  <linearGradient id="colorCred" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity="0.25"/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity="0.0"/>
                  </linearGradient>
                  <linearGradient id="colorSess" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity="0.25"/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity="0.0"/>
                  </linearGradient>
                </defs>
                
                <CartesianGrid strokeDasharray="4 4" stroke="#f1f5f9" vertical={false} />
                
                <XAxis 
                  dataKey="label" 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fontFamily: '"Segoe UI", sans-serif', fill: "#6d6d6d", fontSize: 11 }}
                />
                
                <YAxis 
                  axisLine={false} 
                  tickLine={false}
                  tickFormatter={(val) => val === 0 ? "0" : `${val / 1000}k`}
                  tick={{ fontFamily: '"Segoe UI", sans-serif', fill: "#6d6d6d", fontSize: 11 }}
                  domain={[0, 40000]}
                  ticks={[1000, 5000, 10000, 20000, 25000, 30000, 35000]}
                />
                
                <Tooltip
                  contentStyle={{
                    fontFamily: '"Segoe UI", sans-serif',
                    fontSize: "12px",
                    borderRadius: "12px",
                    borderColor: "#e2e8e2",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
                  }}
                  formatter={(val) => [`$${Number(val).toLocaleString()}`]}
                />

                <Area 
                  type="monotone" 
                  dataKey="subscription" 
                  stroke="#f59e0b" 
                  strokeWidth={2.5} 
                  fillOpacity={1} 
                  fill="url(#colorSub)"
                  dot={{ r: 4, fill: "#f59e0b", stroke: "#ffffff", strokeWidth: 1.5 }}
                />
                <Area 
                  type="monotone" 
                  dataKey="payPerMinute" 
                  stroke="#6366f1" 
                  strokeWidth={2.5} 
                  fillOpacity={1} 
                  fill="url(#colorPpm)"
                  dot={{ r: 4, fill: "#6366f1", stroke: "#ffffff", strokeWidth: 1.5 }}
                />
                <Area 
                  type="monotone" 
                  dataKey="credit" 
                  stroke="#f43f5e" 
                  strokeWidth={2.5} 
                  fillOpacity={1} 
                  fill="url(#colorCred)"
                  dot={{ r: 4, fill: "#f43f5e", stroke: "#ffffff", strokeWidth: 1.5 }}
                />
                <Area 
                  type="monotone" 
                  dataKey="session" 
                  stroke="#06b6d4" 
                  strokeWidth={2.5} 
                  fillOpacity={1} 
                  fill="url(#colorSess)"
                  dot={{ r: 4, fill: "#06b6d4", stroke: "#ffffff", strokeWidth: 1.5 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Transaction History Card */}
      <div className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden flex flex-col">
        <div className="px-6 pt-6 pb-2">
          <h2 className="text-lg font-bold text-slate-800">Transaction</h2>
        </div>

        {/* Search Input Bar for Ledger */}
        <div className="px-6 py-4 flex max-w-md">
          <div className="relative w-full">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <MdSearch className="w-5 h-5 text-foreground/50" />
            </span>
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#f8faf8] border border-border rounded-xl pl-10 pr-4 py-2 text-[14px] text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
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
        </div>

        {/* Ledger Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="px-6 py-8 space-y-3 animate-pulse">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-10 bg-zinc-50 rounded" />
              ))}
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-10 text-[#6D6D6D]/80">No transactions match your search</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50 border-b border-border text-[13px] font-semibold text-[#6D6D6D] tracking-wide">
                  <th className="px-6 py-4">Transaction ID</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Service</th>
                  <th className="px-6 py-4">Gross</th>
                  <th className="px-6 py-4">Net</th>
                  <th className="px-6 py-4">Platform 20%</th>
                  <th className="px-6 py-4">Coach Payout</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-[14px]">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-zinc-50/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-800">{tx.id}</td>
                    <td className="px-6 py-4 text-[#6D6D6D]">{tx.date}</td>
                    <td className="px-6 py-4 font-medium text-slate-800">{tx.service}</td>
                    <td className="px-6 py-4 text-slate-800 font-semibold">{tx.gross}</td>
                    <td className="px-6 py-4 text-slate-850 font-bold">{tx.net}</td>
                    <td className="px-6 py-4 text-slate-800">{tx.platformFee}</td>
                    <td className="px-6 py-4 text-[#0da34c] font-bold">{tx.payout}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
