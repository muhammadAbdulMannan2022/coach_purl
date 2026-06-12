"use client";

import * as React from "react";
import { mockApi, DashboardMetrics, RecentActivity, CoachBid, CoachApproval, RevenueOverviewData } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { 
  MdSupervisedUserCircle, 
  MdMessage, 
  MdCall, 
  MdReportProblem,
  MdCheckCircle,
  MdStar
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
import StatCard from "@/components/ui/dashboardCard";


export default function DashboardOverview() {
  const [loading, setLoading] = React.useState(true);
  const [metrics, setMetrics] = React.useState<DashboardMetrics | null>(null);
  const [activities, setActivities] = React.useState<RecentActivity[]>([]);
  const [bids, setBids] = React.useState<CoachBid[]>([]);
  const [approvals, setApprovals] = React.useState<CoachApproval[]>([]);
  const [revenue, setRevenue] = React.useState<RevenueOverviewData[]>([]);

  React.useEffect(() => {
    // Fetch dashboard dataset concurrently
    Promise.all([
      mockApi.getDashboardMetrics(),
      mockApi.getRecentActivities(),
      mockApi.getCoachBids(),
      mockApi.getPendingApprovals(),
      mockApi.getRevenueOverview(),
    ]).then(([m, a, b, ap, r]) => {
      setMetrics(m);
      setActivities(a);
      setBids(b);
      setApprovals(ap);
      setRevenue(r);
      // Timeout to ensure smooth transition from skeletons
      setTimeout(() => setLoading(false), 500);
    });
  }, []);

  // Approve action inside approvals panel
  const handleApprove = (id: string) => {
    mockApi.approveCoach(id).then(() => {
      setApprovals(prev => prev.filter(appr => appr.id !== id));
    });
  };

  if (loading) {
    return (
      <div className="space-y-6 font-sans">
        {/* Skeleton Stat Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <div key={i} className="bg-white border border-border p-6 rounded-2xl space-y-3 shadow-sm min-h-[120px] flex flex-col justify-center animate-pulse">
              <div className="h-3.5 bg-zinc-200 rounded w-2/3" />
              <div className="h-7 bg-zinc-200 rounded w-1/2" />
            </div>
          ))}
        </div>

        {/* Skeleton Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-border p-6 rounded-2xl h-80 animate-pulse shadow-sm" />
          <div className="bg-white border border-border p-6 rounded-2xl h-80 animate-pulse shadow-sm" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans animate-in fade-in duration-300">
      
      {/* 8-Card Stat Grid Layout (100% same size & custom alignments) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Row 1 Metrics (without icons) */}
        <StatCard title="Total Users" value={metrics?.totalUsers.toLocaleString() || "0"} />
        <StatCard title="Active Coaches" value={metrics?.activeCoaches.toLocaleString() || "0"} />
        <StatCard title="Total Revenue" value={metrics?.totalRevenue || "0"} />
        <StatCard title="New Signups (Today)" value={metrics?.newSignupsToday || 0} />
        
        {/* Row 2 Metrics (with icons) */}
        <StatCard 
          title="Bookings Today" 
          value={`${metrics?.bookingsToday} Sessions`} 
          icon={<MdSupervisedUserCircle className="w-6 h-6" />}
          iconBg="bg-indigo-50"
          iconColor="text-indigo-600"
        />
        <StatCard 
          title="Instant Texts" 
          value={`${metrics?.instantTexts} Chats`} 
          icon={<MdMessage className="w-6 h-6" />}
          iconBg="bg-amber-50"
          iconColor="text-amber-600"
        />
        <StatCard 
          title="Instant Calls" 
          value={`${metrics?.instantCalls} Calls`} 
          icon={<MdCall className="w-6 h-6" />}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
        />
        <StatCard 
          title="Pending Reports" 
          value={`${metrics?.pendingReports} Issues`} 
          icon={<MdReportProblem className="w-6 h-6" />}
          iconBg="bg-red-50"
          iconColor="text-red-600"
        />
      </div>

      {/* Main Grid: Activities & Bidding (60/40 horizontal split) */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
        {/* Recent Activity Panel (60% width) */}
        <div className="bg-white border border-border p-6 rounded-2xl shadow-sm flex flex-col lg:col-span-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4 border-b border-border pb-3">Recent Activity</h2>
          <div className="space-y-4 overflow-y-auto flex-1 max-h-[300px] pr-1">
            {activities.map((act) => (
              <div key={act.id} className="flex items-center gap-3 py-1">
                <div className="relative w-9 h-9 rounded-full overflow-hidden border border-border shrink-0">
                  <img src={act.avatar} alt={act.user} className="object-cover w-full h-full" />
                </div>
                <div className="flex-1 text-sm min-w-0">
                  <p className="text-foreground text-sm">
                    <span className="font-semibold text-slate-900">{act.user}</span> {act.action}
                  </p>
                  <p className="text-xs text-foreground/60 mt-0.5">{act.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Coaches Bidding Panel (40% width) */}
        <div className="bg-white border border-border p-6 rounded-2xl shadow-sm flex flex-col lg:col-span-4">
          <h2 className="text-lg font-bold text-slate-900 mb-4 border-b border-border pb-3">Featured Coaches Bidding</h2>
          <div className="space-y-4 overflow-y-auto flex-1 max-h-[300px]">
            {bids.map((bid) => (
              <div key={bid.rank} className="flex items-center justify-between text-sm py-1.5 border-b border-dashed border-zinc-100 last:border-b-0">
                <div className="flex items-center gap-3">
                  <span className={`font-bold text-sm min-w-[24px] ${bid.rank <= 2 ? "text-primary" : "text-foreground/50"}`}>
                    #{bid.rank}
                  </span>
                  <span className="font-semibold text-slate-800">{bid.name}</span>
                </div>
                <div>
                  {bid.isRaffleWinner ? (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">
                      <MdStar className="w-3.5 h-3.5" />
                      Raffle Draw Winner
                    </span>
                  ) : (
                    <span className="text-xs font-medium text-foreground">
                      Current Winning Bid: <span className="font-bold text-amber-600">${bid.bidAmount}</span>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Grid: Approvals & Revenue Recharts Area Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Coach Approval Panel */}
        <div className="bg-white border border-border p-6 rounded-2xl shadow-sm flex flex-col justify-between min-h-[360px]">
          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-4 border-b border-border pb-3">Coach Approval</h2>
            <div className="space-y-4 max-h-[200px] overflow-y-auto pr-1">
              {approvals.length === 0 ? (
                <div className="text-center py-6 text-sm text-foreground/50">No pending applications</div>
              ) : (
                approvals.map((appr) => (
                  <div key={appr.id} className="flex items-center justify-between py-2 border-b border-zinc-100 last:border-b-0">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-full overflow-hidden border border-border shrink-0">
                        <img src={appr.avatar} alt={appr.name} className="object-cover w-full h-full" />
                      </div>
                      <div className="text-sm min-w-0">
                        <p className="font-semibold text-slate-900 truncate">{appr.name}</p>
                        <p className="text-xs text-foreground/70 truncate">{appr.specialty} • {appr.experience}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold text-amber-600 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-md uppercase">
                        {appr.status}
                      </span>
                      <button 
                        onClick={() => handleApprove(appr.id)}
                        className="p-1 text-primary hover:bg-emerald-50 rounded-full transition-colors cursor-pointer"
                        title="Approve immediately"
                      >
                        <MdCheckCircle className="w-6 h-6" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <Button 
            className="w-full mt-4 flex items-center justify-center gap-2 py-3 cursor-pointer text-sm font-semibold tracking-wide"
          >
            Review Applications →
          </Button>
        </div>

        {/* Revenue Overview Recharts Panel */}
        <div className="bg-white border border-border p-6 rounded-2xl shadow-sm flex flex-col justify-between min-h-[360px]">
          <div className="flex flex-col h-full justify-between">
            <h2 className="text-lg font-bold text-slate-900 mb-2">Revenue Overview</h2>
            
            {/* Recharts Area Graph */}
            <div className="w-full h-44 mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={revenue.map(r => ({ ...r, revenueAmount: r.revenue * 1000 }))}
                  margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="recharts-grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0DA34C" stopOpacity="0.3"/>
                      <stop offset="95%" stopColor="#0DA34C" stopOpacity="0.0"/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="4 4" stroke="#f1f5f9" vertical={false} />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontFamily: '"Segoe UI", sans-serif', fill: "#6d6d6d", fontSize: 11 }}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tickFormatter={(val) => val === 0 ? "0" : `${val / 1000}k`}
                    tick={{ fontFamily: '"Segoe UI", sans-serif', fill: "#6d6d6d", fontSize: 11 }}
                    domain={[0, 100000]}
                    ticks={[0, 10000, 20000, 50000, 100000]}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      fontFamily: '"Segoe UI", sans-serif', 
                      fontSize: "12px", 
                      borderRadius: "12px", 
                      borderColor: "#e2e8e2",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.05)" 
                    }}
                    formatter={(value) => [`$${Number(value).toLocaleString()}`, "Revenue"]}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenueAmount" 
                    stroke="#0DA34C" 
                    strokeWidth={3} 
                    fillOpacity={1} 
                    fill="url(#recharts-grad)"
                    dot={{ r: 4.5, fill: "#0DA34C", stroke: "#ffffff", strokeWidth: 2 }}
                    activeDot={{ r: 6.5, fill: "#0DA34C", stroke: "#ffffff", strokeWidth: 2.5 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Breakdown Stats */}
          <div className="grid grid-cols-3 gap-2 border-t border-border pt-4 mt-4 text-center">
            <div>
              <p className="text-xs text-foreground/60">Monthly Revenue</p>
              <p className="text-base font-bold text-amber-600 mt-0.5">$35,000</p>
            </div>
            <div>
              <p className="text-xs text-foreground/60">Platform Fees(20%)</p>
              <p className="text-base font-bold text-slate-800 mt-0.5">-$5,500</p>
            </div>
            <div>
              <p className="text-xs text-foreground/60">Net Earnings</p>
              <p className="text-base font-bold text-primary mt-0.5">$27,000</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
