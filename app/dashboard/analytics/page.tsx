"use client";

import * as React from "react";
import StatCard from "@/components/ui/dashboardCard";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  RadialBarChart, 
  RadialBar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";
import { 
  MdSearch, 
  MdClose, 
  MdOutlineRemoveRedEye, 
  MdStar, 
  MdArrowBack,
  MdArrowForward,
  MdTrendingUp,
  MdPeople,
  MdAccessTime,
  MdAttachMoney
} from "react-icons/md";
import { 
  mockApi, 
  CoachDetailProfile 
} from "@/lib/mock-data";

// Custom type for coach lists inside performance view
interface LocalCoachRow {
  name: string;
  specialty: string;
  plan: string;
  sessions: number;
  rating: number;
  earnings: string;
  avatar: string;
}

const initialCoachesData: LocalCoachRow[] = [
  { name: "Michael Dunphy", specialty: "Relationship recovery", plan: "Elite", sessions: 450, rating: 4.9, earnings: "$12,250", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200" },
  { name: "Robert Perry", specialty: "Emotional healing", plan: "Professional", sessions: 235, rating: 4.9, earnings: "$6,500", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200" },
  { name: "Joseph McFall", specialty: "Self-esteem building", plan: "Essential", sessions: 150, rating: 4.9, earnings: "$3,375", avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200" },
  { name: "Karen Nelson", specialty: "Dating Strategy", plan: "Elite", sessions: 0, rating: 4.9, earnings: "$0", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200" },
  { name: "Lana Byrd", specialty: "Breakup Support", plan: "Elite", sessions: 175, rating: 4.9, earnings: "$4,250", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200" },
  { name: "Leslie Livingston", specialty: "Self-love and Confidence", plan: "Professional", sessions: 0, rating: 4.9, earnings: "$0", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200" },
  { name: "Bonnie Green", specialty: "Meditation and Yoga", plan: "Professional", sessions: 0, rating: 4.9, earnings: "$0", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200" },
];

export default function AnalyticsAndInsightsPage() {
  const [activeView, setActiveView] = React.useState<"dashboard" | "performance">("dashboard");
  const [loading, setLoading] = React.useState(true);
  const [coaches, setCoaches] = React.useState<LocalCoachRow[]>([]);
  const [searchQuery, setSearchQuery] = React.useState("");

  // Dropdown filter selections
  const [revenueFilter, setRevenueFilter] = React.useState("Last 6 month");
  const [retentionFilter, setRetentionFilter] = React.useState("Last 6 month");

  React.useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      // Replicate loading state for dashboard items
      setCoaches(initialCoachesData);
      setLoading(false);
    }, 450);
    return () => clearTimeout(timer);
  }, []);

  // Filter coaches list by search text
  const filteredCoaches = coaches.filter(c => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.specialty.toLowerCase().includes(q);
  });

  // 1. User & Coach Growth Stacked Bar Dataset
  const growthData = [
    { name: "Sep", Users: 2800, Coach: 2900 },
    { name: "Oct", Users: 3200, Coach: 2000 },
    { name: "Nov", Users: 3200, Coach: 2400 },
    { name: "Dec", Users: 4800, Coach: 2600 },
    { name: "Jan", Users: 4900, Coach: 3000 },
    { name: "Feb", Users: 5500, Coach: 2900 },
    { name: "Mar", Users: 6200, Coach: 3100 },
    { name: "April", Users: 7000, Coach: 3300 },
  ];

  // 2. Revenue Trends Column dataset with background tracking pillars
  const revenueTrendsData = [
    { name: "Sep", Revenue: 2100 },
    { name: "Oct", Revenue: 1800 },
    { name: "Nov", Revenue: 2200 },
    { name: "Dec", Revenue: 1800 },
    { name: "Jan", Revenue: 2400 },
    { name: "Feb", Revenue: 2600 },
    { name: "Mar", Revenue: 2300 },
    { name: "April", Revenue: 2800 }
  ];

  // 3. User Retention Line dataset
  const retentionData = [
    { name: "Jan", Retention: 100 },
    { name: "Feb", Retention: 82 },
    { name: "Mar", Retention: 74 },
    { name: "Apr", Retention: 67 },
    { name: "May", Retention: 61 },
    { name: "Jun", Retention: 51 }
  ];

  // 4. User Engagement Concentric Rings dataset
  const engagementData = [
    { name: "Daily", value: 45, fill: "#b5894b" },
    { name: "Weekly", value: 65, fill: "#f0b85d" },
    { name: "Monthly", value: 80, fill: "#d87a66" },
    { name: "Inactive users", value: 95, fill: "#95a8b9" }
  ];

  if (loading) {
    return (
      <div className="w-full space-y-6 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 bg-zinc-100 rounded-2xl"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-96 bg-zinc-100 rounded-2xl"></div>
          <div className="h-96 bg-zinc-100 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans animate-in fade-in duration-300">
      
      {activeView === "dashboard" ? (
        /* MAIN DASHBOARD LAYOUT */
        <>
          {/* 4 Stats Cards Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="User Growth"
              value="+18.5%"
              valueColor="text-slate-800 font-bold"
              icon={<MdPeople className="w-6 h-6 text-blue-600" />}
              iconBg="bg-blue-50"
            />
            <StatCard
              title="Revenue Growth"
              value="+25%"
              valueColor="text-slate-800 font-bold"
              icon={<MdTrendingUp className="w-6 h-6 text-amber-600" />}
              iconBg="bg-amber-50"
            />
            <StatCard
              title="Inactive User"
              value="60%"
              valueColor="text-slate-800 font-bold"
              icon={<MdAccessTime className="w-6 h-6 text-emerald-600" />}
              iconBg="bg-emerald-50"
            />
            <StatCard
              title="Conversion Rate"
              value="12%"
              valueColor="text-slate-800 font-bold"
              icon={<MdAttachMoney className="w-6 h-6 text-red-500" />}
              iconBg="bg-red-50"
            />
          </div>

          {/* Grid Row 1: Users & Coach Growth (Left) vs Revenue Trends (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* User and Coach Growth Stacked Chart */}
            <div className="lg:col-span-2 bg-white border border-border p-6 rounded-2xl shadow-sm flex flex-col">
              <h3 className="text-base font-bold text-slate-800 mb-6 font-sans">
                User and Coach Growth
              </h3>
              <div className="h-80 w-full text-xs">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={growthData}
                    margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: "#6D6D6D", fontWeight: "semibold" }} 
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: "#6D6D6D" }} 
                    />
                    <Tooltip cursor={{ fill: "transparent" }} />
                    <Bar 
                      dataKey="Coach" 
                      stackId="a" 
                      fill="#7a693c" 
                      barSize={12}
                    />
                    <Bar 
                      dataKey="Users" 
                      stackId="a" 
                      fill="#0da34c" 
                      radius={[10, 10, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-6 mt-4 text-xs font-semibold text-slate-600">
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 bg-[#0da34c] rounded-md block shrink-0" />
                  <span>Users</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 bg-[#7a693c] rounded-md block shrink-0" />
                  <span>Coach</span>
                </div>
              </div>
            </div>

            {/* Revenue Trends Pillar Chart */}
            <div className="bg-white border border-border p-6 rounded-2xl shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-base font-bold text-slate-800 font-sans">
                  Revenue Trends
                </h3>
                
                {/* Duration Filter Dropdown */}
                <select
                  value={revenueFilter}
                  onChange={(e) => setRevenueFilter(e.target.value)}
                  className="bg-[#f8faf8] border border-border rounded-lg px-2.5 py-1 text-xs font-semibold text-[#6D6D6D] cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#0da34c]"
                >
                  <option value="Last 6 month">Last 6 month</option>
                  <option value="Last 12 month">Last 12 month</option>
                </select>
              </div>

              <div className="h-64 w-full text-xs">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={revenueTrendsData}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: "#6D6D6D" }} 
                    />
                    <Bar 
                      dataKey="Revenue" 
                      fill="#8bd87a" 
                      radius={[10, 10, 10, 10]}
                      background={{ fill: "#f3f4f3", radius: 10 }}
                      barSize={14}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Bottom revenue indicators */}
              <div className="pt-4 border-t border-zinc-100 mt-4 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-[#6D6D6D]">
                    <span className="w-2 h-2 rounded-full bg-[#8bd87a] block" />
                    <span>Revenue</span>
                  </div>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-extrabold text-slate-800">2.4K</span>
                    <span className="bg-emerald-50 text-[#0da34c] text-[10px] font-bold px-1.5 py-0.5 rounded">
                      +4.0%
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Grid Row 2: User Retention (Left) vs Concentric User Engagement (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* User Retention Line Chart */}
            <div className="bg-white border border-border p-6 rounded-2xl shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-base font-bold text-slate-800 font-sans">
                  User Retention
                </h3>
                <select
                  value={retentionFilter}
                  onChange={(e) => setRetentionFilter(e.target.value)}
                  className="bg-[#f8faf8] border border-border rounded-lg px-2.5 py-1 text-xs font-semibold text-[#6D6D6D] cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#0da34c]"
                >
                  <option value="Last 6 month">Last 6 month</option>
                  <option value="Last 12 month">Last 12 month</option>
                </select>
              </div>

              <div className="h-64 w-full text-xs">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart 
                    data={retentionData}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: "#6D6D6D" }} 
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: "#6D6D6D" }} 
                    />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="Retention" 
                      stroke="#dcb232" 
                      strokeWidth={2}
                      dot={{ fill: "#dcb232", stroke: "#fff", strokeWidth: 2, r: 5 }}
                      activeDot={{ r: 7 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* User Engagement Concentric Rings Card */}
            <div className="bg-white border border-border p-6 rounded-2xl shadow-sm flex flex-col">
              <div className="mb-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Statistics</span>
                <h3 className="text-base font-bold text-slate-800 font-sans">
                  User Engagement
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center flex-1">
                {/* Radial Chart Container */}
                <div className="h-60 w-full relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart 
                      cx="50%" 
                      cy="50%" 
                      innerRadius="30%" 
                      outerRadius="100%" 
                      barSize={10} 
                      data={engagementData}
                      startAngle={90}
                      endAngle={-270}
                    >
                      <RadialBar
                        background
                        dataKey="value"
                        cornerRadius={10}
                      />
                    </RadialBarChart>
                  </ResponsiveContainer>
                  
                  {/* Center Text Indicator */}
                  <div className="absolute inset-0 flex flex-col justify-center items-center pointer-events-none">
                    <span className="text-3xl font-extrabold text-slate-800">3205</span>
                    <span className="text-[11px] font-bold text-slate-400">Total</span>
                  </div>
                </div>

                {/* Legend list block */}
                <div className="space-y-3 pl-4 text-xs font-semibold text-slate-500">
                  <div className="flex items-center gap-2.5">
                    <span className="w-3.5 h-3.5 bg-[#95a8b9] rounded-full block shrink-0" />
                    <span>Inactive users</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="w-3.5 h-3.5 bg-[#d87a66] rounded-full block shrink-0" />
                    <span>Monthly</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="w-3.5 h-3.5 bg-[#f0b85d] rounded-full block shrink-0" />
                    <span>Weekly</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="w-3.5 h-3.5 bg-[#b5894b] rounded-full block shrink-0" />
                    <span>Daily</span>
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* Grid Row 3: Conversation Tracking (Funnel) vs Top Coaches preview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Conversation Tracking Funnel Bars */}
            <div className="bg-white border border-border p-6 rounded-2xl shadow-sm flex flex-col justify-between">
              <h3 className="text-base font-bold text-slate-800 mb-6 font-sans">
                Conversation Tracking
              </h3>
              
              <div className="space-y-4 font-sans text-xs">
                {/* Sign Ups progress */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center font-bold text-slate-700">
                    <span>Sign Ups</span>
                    <span>140k</span>
                  </div>
                  <div className="w-full bg-zinc-50 rounded-xl h-9 overflow-hidden relative">
                    <div className="bg-amber-100/50 hover:bg-amber-100 transition-colors h-full rounded-xl w-full" />
                  </div>
                </div>

                {/* Onboarding progress */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center font-bold text-slate-700">
                    <span>Onboarding</span>
                    <span>120k</span>
                  </div>
                  <div className="w-full bg-zinc-50 rounded-xl h-9 overflow-hidden relative">
                    <div className="bg-amber-100/50 hover:bg-amber-100 transition-colors h-full rounded-xl w-[85%]" />
                  </div>
                </div>

                {/* Started Timer progress */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center font-bold text-slate-700">
                    <span>Started No Contacts Timer</span>
                    <span>80k</span>
                  </div>
                  <div className="w-full bg-zinc-50 rounded-xl h-9 overflow-hidden relative">
                    <div className="bg-amber-100/50 hover:bg-amber-100 transition-colors h-full rounded-xl w-[58%]" />
                  </div>
                </div>

                {/* Contacted Coach progress */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center font-bold text-slate-700">
                    <span>Contacted Coach</span>
                    <span>60k</span>
                  </div>
                  <div className="w-full bg-zinc-50 rounded-xl h-9 overflow-hidden relative">
                    <div className="bg-amber-100/50 hover:bg-amber-100 transition-colors h-full rounded-xl w-[42%]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Coach Performance List Card */}
            <div className="bg-white border border-border p-6 rounded-2xl shadow-sm flex flex-col justify-between">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-base font-bold text-slate-800 font-sans">
                  Coach Performance
                </h3>
                <button
                  onClick={() => setActiveView("performance")}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#0da34c] hover:underline cursor-pointer focus:outline-none"
                >
                  <span>View All</span>
                  <MdArrowForward className="w-4 h-4" />
                </button>
              </div>

              {/* Top Bidders List Rows */}
              <div className="space-y-4">
                {coaches.slice(0, 3).map((coach, index) => {
                  let badgeClass = "";
                  let badgeText = "";
                  
                  if (index === 0) {
                    badgeClass = "bg-emerald-50 text-[#0da34c]";
                    badgeText = "1st";
                  } else if (index === 1) {
                    badgeClass = "bg-blue-50 text-blue-600";
                    badgeText = "2nd";
                  } else {
                    badgeClass = "bg-red-50 text-red-500";
                    badgeText = "3rd";
                  }

                  return (
                    <div 
                      key={coach.name}
                      className="flex items-center justify-between p-3 border border-border rounded-xl bg-zinc-50/20"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={coach.avatar}
                          alt={coach.name}
                          className="w-10 h-10 rounded-full object-cover shrink-0 border border-border"
                        />
                        <div>
                          <p className="font-bold text-slate-800 text-sm">{coach.name}</p>
                          <div className="flex items-center gap-2 mt-0.5 text-xs text-[#6D6D6D]">
                            <div className="flex items-center gap-0.5">
                              <MdStar className="w-3.5 h-3.5 text-amber-400" />
                              <span>{coach.rating}</span>
                            </div>
                            <span>•</span>
                            <span>{coach.sessions} Sessions</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className="font-bold text-slate-800 text-sm">{coach.earnings}</span>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${badgeClass}`}>
                          {badgeText}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </>
      ) : (
        /* VIEW 2: Detailed Coach Performance table view matching Image 2 */
        <div className="bg-white border border-border p-6 rounded-2xl shadow-sm flex flex-col">
          
          {/* Back Navigation control */}
          <button
            onClick={() => {
              setActiveView("dashboard");
              setSearchQuery("");
            }}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0da34c] hover:underline mb-6 cursor-pointer focus:outline-none"
          >
            <MdArrowBack className="w-4 h-4" />
            <span>Back to Analytics</span>
          </button>

          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800 font-sans">
              Coach Performance
            </h3>

            {/* Search bar inside the detailed ledger list */}
            <div className="relative max-w-[240px]">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MdSearch className="w-5 h-5 text-[#0da34c]" />
              </span>
              <input
                type="text"
                placeholder="Search coach..."
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

          {/* Coach performance ledger table */}
          <div className="overflow-x-auto -mx-6 border-t border-border">
            {filteredCoaches.length === 0 ? (
              <div className="py-12 text-center text-[#6D6D6D] font-medium font-sans">
                No coaches found matching your criteria.
              </div>
            ) : (
              <table className="w-full text-left border-collapse min-w-[800px] font-sans">
                <thead>
                  <tr className="bg-zinc-50 border-b border-border text-[13px] font-semibold text-[#6D6D6D] tracking-wide">
                    <th className="px-6 py-4">Coach</th>
                    <th className="px-6 py-4">Specialty</th>
                    <th className="px-6 py-4">Plan</th>
                    <th className="px-6 py-4">Sessions</th>
                    <th className="px-6 py-4">Ratings</th>
                    <th className="px-6 py-4">Earnings</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-[14px]">
                  {filteredCoaches.map((row) => (
                    <tr 
                      key={row.name}
                      className="hover:bg-zinc-50/50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <img
                            src={row.avatar}
                            alt={row.name}
                            className="w-9 h-9 rounded-full object-cover shrink-0 border border-border"
                          />
                          <span className="font-bold text-slate-800">{row.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[#6D6D6D] font-sans">
                        {row.specialty}
                      </td>
                      <td className="px-6 py-4 text-[#6D6D6D]">
                        {row.plan}
                      </td>
                      <td className="px-6 py-4 text-[#6D6D6D] font-sans">
                        {row.sessions}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1 text-[#6D6D6D] font-medium">
                          <MdStar className="w-4 h-4 text-amber-400" />
                          <span>{row.rating} (120 Reviews)</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-extrabold text-slate-800">
                        {row.earnings}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
