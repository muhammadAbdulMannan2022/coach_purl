"use client";

import * as React from "react";
import { mockApi, ReportRecord, StoryWordOption, DemographicsData } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import {
  MdSearch,
  MdClose,
  MdAdd
} from "react-icons/md";
import { FaChevronDown } from "react-icons/fa6";

const CHART_COLORS = [
  "#8c7dff", // purple/blue
  "#ff8d85", // pink
  "#3cbcd8", // cyan
  "#ffa746", // orange
  "#4e7ef6", // blue
  "#60cf8c", // green
  "#9c6ce1", // violet
  "#ff6c6c", // red
  "#38bdf8", // sky blue
  "#2563eb", // blue
  "#facc15", // yellow
  "#10b981", // emerald
  "#64748b", // slate
  "#f97316", // orange
  "#84cc16"  // lime
];

const LOCATION_COLORS: Record<string, string> = {
  "London, UK": "#8c7dff",
  "New York, NY": "#ff8d85",
  "Los Angeles, CA": "#3cbcd8",
  "Austin, TX": "#ffa746",
  "Sydney, AU": "#4e7ef6",
  "Miami, FL": "#60cf8c",
  "Others": "#9c6ce1"
};

export default function ReportsAndModerationPage() {
  const [role, setRole] = React.useState<"User" | "Coach">("User");
  const [demographics, setDemographics] = React.useState<DemographicsData | null>(null);
  const [loadingDemo, setLoadingDemo] = React.useState(true);

  const [reports, setReports] = React.useState<ReportRecord[]>([]);
  const [expandedReports, setExpandedReports] = React.useState<Record<string, boolean>>({});

  const [storyWords, setStoryWords] = React.useState<StoryWordOption[]>([]);
  const [newCategoryName, setNewCategoryName] = React.useState("");

  // Modal State
  const [isModModalOpen, setIsModModalOpen] = React.useState(false);
  const [searchWordQuery, setSearchWordQuery] = React.useState("");
  const [checkedWordIds, setCheckedWordIds] = React.useState<string[]>([]);

  // Fetch demographics based on role select
  const fetchDemographics = React.useCallback(async () => {
    setLoadingDemo(true);
    try {
      const data = await mockApi.getDemographics(role);
      setDemographics(data);
    } catch (err) {
      console.error("Failed to load demographics:", err);
    } finally {
      setLoadingDemo(false);
    }
  }, [role]);

  // Fetch report list and story categories
  const loadInitialData = React.useCallback(async () => {
    try {
      const [reportsData, storyData] = await Promise.all([
        mockApi.getReports(),
        mockApi.getStoryWords()
      ]);
      setReports(reportsData);
      setStoryWords(storyData);
    } catch (err) {
      console.error("Failed to load moderation data:", err);
    }
  }, []);

  React.useEffect(() => {
    fetchDemographics();
  }, [fetchDemographics]);

  React.useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Add new story category handler
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    try {
      const weight = Math.floor(Math.random() * 50) + 10;
      const updated = await mockApi.addStoryCategory(newCategoryName.trim(), weight);
      setStoryWords(updated);
      setNewCategoryName("");
    } catch (err) {
      console.error("Failed to add category:", err);
    }
  };

  // Word Moderation Modal handlers
  const handleCloseModModal = () => {
    setIsModModalOpen(false);
    setSearchWordQuery("");
    setCheckedWordIds([]);
  };

  // Filter words inside modal based on search filter
  const filteredWords = storyWords.filter(w =>
    w.name.toLowerCase().includes(searchWordQuery.toLowerCase())
  );

  const toggleWordCheckbox = (wordId: string) => {
    setCheckedWordIds(prev =>
      prev.includes(wordId) ? prev.filter(id => id !== wordId) : [...prev, wordId]
    );
  };

  const handleToggleAllFiltered = () => {
    const filteredIds = filteredWords.map(w => w.id);
    const allFilteredChecked = filteredIds.every(id => checkedWordIds.includes(id));

    if (allFilteredChecked) {
      setCheckedWordIds(prev => prev.filter(id => !filteredIds.includes(id)));
    } else {
      setCheckedWordIds(prev => {
        const unique = new Set([...prev, ...filteredIds]);
        return Array.from(unique);
      });
    }
  };

  const handleDeleteChecked = async () => {
    if (checkedWordIds.length === 0) return;
    try {
      const updated = await mockApi.deleteStoryWords(checkedWordIds);
      setStoryWords(updated);
      setCheckedWordIds([]);
      setIsModModalOpen(false);
    } catch (err) {
      console.error("Failed to delete story words:", err);
    }
  };

  // Static Data for Emotional States Pie Chart
  const emotionalStateData = [
    { name: "Moving On", value: 38, count: 250, color: "#ff7171", legendName: "Moving Mode" },
    { name: "Want Soulmate Back", value: 38, count: 250, color: "#1fd2c4", legendName: "Want Soulmate Back" },
    { name: "Crisis Mode", value: 62, count: 250, color: "#4a3bf5", legendName: "Crisis Mode" },
    { name: "No Contact", value: 38, count: 250, color: "#0da34c", legendName: "No Contact" }
  ];

  // Custom label renderer for Location Donut Chart
  const renderLocationLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name, value }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 20;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
      <text
        x={x}
        y={y}
        fill="#6d6d6d"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        style={{ fontSize: '10px', fontFamily: '"Segoe UI", sans-serif', fontWeight: 600 }}
      >
        {`${name} (${value}%)`}
      </text>
    );
  };

  // Custom label renderer for Emotional States Donut Chart
  const renderEmotionalLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, value, name }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 20;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
      <text
        x={x}
        y={y}
        fill="#6d6d6d"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        style={{ fontSize: '11px', fontFamily: '"Segoe UI", sans-serif', fontWeight: 500 }}
      >
        {`${name} ${value}%`}
      </text>
    );
  };

  return (
    <div className="space-y-6 font-sans animate-in fade-in duration-300">

      {/* Demographics Card Section */}
      <div className="bg-white border border-border rounded-2xl p-6 shadow-sm space-y-6 flex flex-col">
        {/* Card Header title & Subtitle & Dropdown */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-col">
            <h2 className="text-2xl font-sans font-bold text-slate-800">Demographics</h2>
            <p className="text-sm text-slate-500 font-sans mt-1">Select a role to view age, gender, and location distribution</p>
          </div>

          {/* Role select pill filter dropdown */}
          <div className="relative self-end sm:self-auto shrink-0">
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as "User" | "Coach")}
              className="appearance-none bg-[#e8f5e9] border border-[#c8e6c9] rounded-xl px-4 py-2 pr-10 text-sm font-semibold text-[#0da34c] focus:outline-none focus:ring-2 focus:ring-ring transition-all cursor-pointer h-10 min-w-[100px]"
            >
              <option value="User">User</option>
              <option value="Coach">Coach</option>
            </select>
            <FaChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-3 h-3 text-[#0da34c] pointer-events-none" />
          </div>
        </div>

        {loadingDemo || !demographics ? (
          <div className="h-80 w-full bg-[#f8faf8] border border-dashed border-border rounded-xl flex items-center justify-center text-[#6D6D6D] text-sm animate-pulse">
            Loading Demographic Analysis...
          </div>
        ) : (
          <div className="space-y-8">
            
            {/* Age & Gender Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Age Bar Chart */}
              <div className="flex flex-col space-y-3">
                <h3 className="text-lg font-sans font-bold text-slate-800">Age</h3>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={demographics.ageData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                      <XAxis 
                        dataKey="label" 
                        axisLine={false} 
                        tickLine={false}
                        tick={{ fontFamily: '"Segoe UI", sans-serif', fill: "#6d6d6d", fontSize: 11 }}
                      />
                      <YAxis 
                        domain={[0, 100]}
                        ticks={[0, 20, 40, 60, 80, 100]}
                        axisLine={false} 
                        tickLine={false}
                        tick={{ fontFamily: '"Segoe UI", sans-serif', fill: "#6d6d6d", fontSize: 11 }}
                      />
                      <RechartsTooltip 
                        contentStyle={{ fontFamily: '"Segoe UI", sans-serif', borderRadius: "12px", border: "1px solid #e2e8e2" }}
                      />
                      <Bar 
                        dataKey="value" 
                        fill="#a1a1fe" 
                        background={{ fill: '#f8faf8' }} 
                        radius={4} 
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                {/* Age Custom centered legend */}
                <div className="flex items-center justify-center gap-2 text-xs text-[#6D6D6D]">
                  <span className="w-3 h-3 bg-[#a1a1fe] rounded-sm shrink-0" />
                  <span className="font-semibold">Age</span>
                </div>
              </div>

              {/* Gender Double-Column Bar Chart */}
              <div className="flex flex-col space-y-3">
                <h3 className="text-lg font-sans font-bold text-slate-800">Gender</h3>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={demographics.genderData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                      <XAxis 
                        dataKey="label" 
                        axisLine={false} 
                        tickLine={false}
                        tick={{ fontFamily: '"Segoe UI", sans-serif', fill: "#6d6d6d", fontSize: 11 }}
                      />
                      <YAxis 
                        domain={[0, 100]}
                        ticks={[0, 20, 40, 60, 80, 100]}
                        axisLine={false} 
                        tickLine={false}
                        tick={{ fontFamily: '"Segoe UI", sans-serif', fill: "#6d6d6d", fontSize: 11 }}
                      />
                      <RechartsTooltip 
                        contentStyle={{ fontFamily: '"Segoe UI", sans-serif', borderRadius: "12px", border: "1px solid #e2e8e2" }}
                      />
                      <Bar 
                        dataKey="male" 
                        name="Male" 
                        fill="#53c389" 
                        background={{ fill: '#f8faf8' }} 
                        radius={4} 
                      />
                      <Bar 
                        dataKey="female" 
                        name="Female" 
                        fill="#528c5a" 
                        background={{ fill: '#f8faf8' }} 
                        radius={4} 
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                {/* Gender custom centered legends */}
                <div className="flex items-center justify-center gap-4 text-xs text-[#6D6D6D]">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-[#53c389] rounded-sm shrink-0" />
                    <span className="font-semibold">Male</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-[#528c5a] rounded-sm shrink-0" />
                    <span className="font-semibold">Female</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Location Section */}
            <div className="border-t border-border/80 pt-6 flex flex-col space-y-3">
              <h3 className="text-xl font-sans font-bold text-slate-800">Location</h3>
              
              <div className="flex flex-col md:flex-row items-center justify-center gap-12 py-4">
                {/* Location Donut Pie Chart */}
                <div className="h-72 w-[450px] relative flex items-center justify-center shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart style={{ outline: 'none' }}>
                      <RechartsTooltip 
                        contentStyle={{ fontFamily: '"Segoe UI", sans-serif', borderRadius: "12px", border: "1px solid #e2e8e2" }}
                      />
                      <Pie
                        data={demographics.locationData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                        labelLine={true}
                        label={renderLocationLabel}
                        style={{ outline: 'none' }}
                      >
                        {demographics.locationData.map((entry) => {
                          const sliceColor = LOCATION_COLORS[entry.name] || CHART_COLORS[0];
                          return <Cell key={`cell-${entry.name}`} fill={sliceColor} style={{ outline: 'none' }} />;
                        })}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Location Legend list on the right */}
                <div className="space-y-3 w-64 text-sm font-sans">
                  {demographics.locationData.map((loc) => {
                    const color = LOCATION_COLORS[loc.name] || CHART_COLORS[0];
                    return (
                      <div key={loc.name} className="flex items-center gap-3 text-[#6D6D6D]">
                        <span 
                          className="w-3 h-3 rounded-full shrink-0" 
                          style={{ backgroundColor: color }}
                        />
                        <span className="font-semibold text-slate-700">{loc.name} ({loc.percentage})</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

          </div>
        )}
      </div>

      {/* Emotional State Card Section */}
      <div className="bg-white border border-border rounded-2xl p-6 shadow-sm space-y-6 flex flex-col">
        <h2 className="text-xl font-sans font-bold text-slate-800">Emotional State</h2>
        
        <div className="flex flex-col md:flex-row items-center justify-center gap-12 py-4 border-b border-border pb-8">
          {/* Legend on the Left */}
          <div className="space-y-3.5 w-64 text-sm font-sans">
            {emotionalStateData.map((item) => (
              <div key={item.name} className="flex items-center gap-3 text-[#6D6D6D]">
                <span 
                  className="w-3 h-3 rounded-full shrink-0" 
                  style={{ backgroundColor: item.color }}
                />
                <span className="font-semibold text-slate-700">{item.legendName} ({item.count})</span>
              </div>
            ))}
          </div>

          {/* Donut Chart in the Center/Right */}
          <div className="h-72 w-[450px] relative flex items-center justify-center shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart style={{ outline: 'none' }}>
                <RechartsTooltip 
                  contentStyle={{ fontFamily: '"Segoe UI", sans-serif', borderRadius: "12px", border: "1px solid #e2e8e2" }}
                />
                <Pie
                  data={emotionalStateData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  labelLine={true}
                  label={renderEmotionalLabel}
                  style={{ outline: 'none' }}
                >
                  {emotionalStateData.map((entry) => (
                    <Cell key={`cell-${entry.name}`} fill={entry.color} style={{ outline: 'none' }} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* User Reports list Table inside card */}
        <div className="overflow-x-auto -mx-6 pt-2">
          <table className="w-full text-left border-collapse min-w-[500px]">
            <thead>
              <tr className="bg-zinc-100/80 border-b border-border text-[13px] font-semibold text-[#6D6D6D]">
                <th className="px-6 py-3.5 font-sans">User Name</th>
                <th className="px-6 py-3.5 font-sans">Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-[14px] font-sans">
              {reports.map((report) => (
                <tr key={report.id} className="hover:bg-zinc-50/50 transition-colors">
                  {/* User Profile */}
                  <td className="px-6 py-4.5 whitespace-nowrap align-middle">
                    <div className="flex items-center gap-3">
                      <div className="relative w-8 h-8 rounded-full overflow-hidden border border-border shrink-0 bg-zinc-100">
                        <img
                          src={report.userAvatar}
                          alt={report.userName}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <span className="font-bold text-slate-800">{report.userName}</span>
                    </div>
                  </td>
                  
                  {/* Reason Text with Read More */}
                  <td className="px-6 py-4.5 text-[#6D6D6D] align-middle">
                    <div className="max-w-[550px]">
                      {expandedReports[report.id] ? (
                        <span className="leading-relaxed text-slate-700">
                          {report.reason}{" "}
                          <button
                            type="button"
                            onClick={() => setExpandedReports(prev => ({ ...prev, [report.id]: false }))}
                            className="font-bold text-slate-800 hover:underline cursor-pointer ml-1 inline"
                          >
                            Read less
                          </button>
                        </span>
                      ) : (
                        <span className="leading-relaxed text-slate-700">
                          {report.reason}{" "}
                          <button
                            type="button"
                            onClick={() => setExpandedReports(prev => ({ ...prev, [report.id]: true }))}
                            className="font-bold text-slate-800 hover:underline cursor-pointer ml-1 inline"
                          >
                            Read more
                          </button>
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Story Analytics Section */}
      <div className="bg-white border border-border rounded-2xl p-6 shadow-sm space-y-6 flex flex-col">
        {/* Header toolbar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-xl font-sans font-bold text-slate-800">User Story Analytics</h2>

          {/* Inline Form on the Right */}
          <form onSubmit={handleAddCategory} className="flex gap-2 w-full sm:w-auto self-end sm:self-auto">
            <input
              type="text"
              placeholder="Enter here"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="bg-[#f1f1f1] border-none text-sm rounded-xl px-4 py-2 w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-ring transition-all"
            />
            <Button
              type="submit"
              className="bg-[#0da34c] hover:bg-[#0da34c]/95 text-white font-semibold rounded-xl text-sm px-6 h-10 shrink-0"
            >
              Add
            </Button>
          </form>
        </div>

        {/* Total Words & View indicator link */}
        <div className="flex items-center gap-2 -mt-2.5">
          <span className="text-[#6D6D6D] font-semibold text-sm">Total Words {storyWords.length}</span>
          <button
            type="button"
            onClick={() => setIsModModalOpen(true)}
            className="text-[#0DA34C] hover:underline font-bold text-sm cursor-pointer"
          >
            View
          </button>
        </div>

        {/* Donut and Legends Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 py-4 border-t border-border/80 pt-6">
          {/* Donut Chart on Left */}
          <div className="h-72 w-[350px] relative flex items-center justify-center col-span-1 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart style={{ outline: 'none' }}>
                <Pie
                  data={storyWords}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={2}
                  dataKey="percentage"
                  nameKey="name"
                  style={{ outline: 'none' }}
                >
                  {storyWords.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={CHART_COLORS[idx % CHART_COLORS.length]} style={{ outline: 'none' }} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ fontFamily: '"Segoe UI", sans-serif', borderRadius: "12px", border: "1px solid #e2e8e2" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legends Column Grid list on Right */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3.5 text-sm font-sans self-center">
            {storyWords.map((word, idx) => (
              <div key={word.id} className="flex items-center gap-3 text-[#6D6D6D]">
                <span 
                  className="w-3 h-3 rounded-full shrink-0" 
                  style={{ backgroundColor: CHART_COLORS[idx % CHART_COLORS.length] }}
                />
                <span className="font-semibold text-slate-700">{word.name} {word.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Word Moderation Modal (Titled "Please confirm Payment" matching layout) */}
      <Modal isOpen={isModModalOpen} onClose={handleCloseModModal} size="lg" title="Please confirm Payment">
        <div className="space-y-4 font-sans text-left">
          
          <p className="text-xs text-foreground/80 leading-relaxed">
            Select the categories or flag keywords you want to moderate. Checked entries will be purged from tracking databases.
          </p>

          {/* Search bar */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <MdSearch className="w-5 h-5 text-foreground/50" />
            </span>
            <input
              type="text"
              placeholder="Search category word..."
              value={searchWordQuery}
              onChange={(e) => setSearchWordQuery(e.target.value)}
              className="w-full bg-[#f8faf8] border border-border rounded-xl pl-10 pr-4 py-2.5 text-[14px] text-[#6D6D6D] focus:outline-none focus:ring-2 focus:ring-ring transition-all"
            />
            {searchWordQuery && (
              <button
                type="button"
                onClick={() => setSearchWordQuery("")}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-foreground/50 hover:text-foreground cursor-pointer"
              >
                <MdClose className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Toggle all trigger */}
          <div className="flex justify-between items-center text-xs border-b border-border pb-2">
            <span className="text-[#6D6D6D] font-bold">Showing {filteredWords.length} terms</span>
            <button
              type="button"
              onClick={handleToggleAllFiltered}
              className="text-[#0DA34C] hover:underline font-extrabold cursor-pointer"
            >
              Mark as delete
            </button>
          </div>

          {/* Checklist word box */}
          <div className="max-h-60 overflow-y-auto border border-border rounded-xl divide-y divide-border bg-[#f8faf8]">
            {filteredWords.length === 0 ? (
              <div className="text-center py-8 text-xs text-[#6D6D6D] font-medium">
                No matching terms found.
              </div>
            ) : (
              filteredWords.map((word) => {
                const isChecked = checkedWordIds.includes(word.id);
                return (
                  <label
                    key={word.id}
                    className="flex items-center justify-between px-4 py-2.5 hover:bg-zinc-50 cursor-pointer select-none"
                  >
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleWordCheckbox(word.id)}
                        className="h-4 w-4 rounded border-border text-primary focus:ring-ring accent-primary cursor-pointer"
                      />
                      <span className="ml-3 font-semibold text-slate-800 text-[14px]">
                        {word.name}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-[#6D6D6D]/80">
                      Weight: {word.percentage}%
                    </span>
                  </label>
                );
              })
            )}
          </div>

          {/* Footer action buttons */}
          <div className="flex items-center justify-between gap-4 pt-3 border-t border-border mt-5">
            <span className="text-xs font-bold text-slate-700">
              {checkedWordIds.length} word(s) selected
            </span>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                type="button"
                onClick={handleCloseModModal}
                className="px-4 text-xs h-9 text-[#6D6D6D] border-border hover:bg-zinc-50 font-semibold cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                type="button"
                onClick={handleDeleteChecked}
                disabled={checkedWordIds.length === 0}
                className="px-4 text-xs h-9 bg-red-600 hover:bg-red-700 text-white font-semibold cursor-pointer"
              >
                Delete
              </Button>
            </div>
          </div>

        </div>
      </Modal>

    </div>
  );
}
