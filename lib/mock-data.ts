// Mock data types for the Coach Purl platform
export interface CoachProfile {
  id: string;
  name: string;
  avatar: string;
  title: string;
  bio: string;
  rating: number;
  reviewsCount: number;
  specialties: string[];
  hourlyRate: number;
  availability: string[]; // e.g. ["Mon 9:00 AM", "Wed 2:00 PM"]
}

export interface CoachingSession {
  id: string;
  coachId: string;
  coachName: string;
  clientName: string;
  dateTime: string;
  durationMinutes: number;
  status: "scheduled" | "completed" | "cancelled" | "pending";
  meetingLink?: string;
  topic?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning";
  timestamp: string;
  read: boolean;
}

export interface DashboardStats {
  totalSessions: number;
  activeCoaches: number;
  upcomingSessionsCount: number;
  totalHoursCoached: number;
}

export interface RecentActivity {
  id: string;
  user: string;
  avatar: string;
  action: string;
  time: string;
}

export interface CoachBid {
  rank: number;
  name: string;
  bidAmount?: number;
  isRaffleWinner?: boolean;
}

export interface CoachApproval {
  id: string;
  name: string;
  avatar: string;
  status: "pending" | "approved" | "rejected";
  specialty: string;
  experience: string;
}

export interface RevenueOverviewData {
  month: string;
  revenue: number;
}

export interface DashboardMetrics {
  totalUsers: number;
  activeCoaches: number;
  totalRevenue: string;
  newSignupsToday: number;
  bookingsToday: number;
  instantTexts: number;
  instantCalls: number;
  pendingReports: number;
}

export interface UserSessionLog {
  id: string;
  title: string;
  dateTime: string;
  amount: string;
  status: "Complete" | "Pending";
}

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  email: string;
  status: "Active" | "Flagged" | "Blocked";
  noContactDays: number;
  joinDate: string; // e.g. "15/01/2026"
  lastActive: string; // e.g. "2 Hours Ago"
  totalSessions: number;
  totalSpent: string;
  activityOverview: {
    journalEntries: number;
    totalTexts: number;
    totalCalls: number;
    timeRelapsed: number;
    timeRelapsedLabel: string;
  };
  sessionsLog: UserSessionLog[];
}

export interface CoachReview {
  id: string;
  reviewerName: string;
  reviewerAvatar: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Certification {
  id: string;
  title: string;
  authority: string;
  issuedDate: string;
}

export interface CoachDetailProfile {
  id: string;
  name: string;
  avatar: string;
  email: string;
  status: "Approved" | "Pending" | "Rejected";
  specialty: string;
  experienceYears: number;
  location: string;
  phone: string;
  bio: string;
  elevatorPitch?: string;
  specialtiesList: string[];
  availabilityDays: string[]; // for pending calendar (e.g. Mon, Tue, Wed)
  availabilityHours: { day: string; timeRange: string }[]; // for approved hours
  rates: {
    perMinute: string;
    perText: string;
  };
  cancellationPolicy?: string;
  certifications?: Certification[];
  
  // Stats for Approved state
  totalSessions: number;
  totalEarnings: string;
  avgRating: number;
  lastActive: string;
  
  // Session overview breakdown
  sessionOverview: {
    completed: number;
    upcoming: number;
    cancelled: number;
  };
  
  // Session statistics
  sessionStats: {
    videoCall: number;
    textSession: number;
    voiceCall: number;
    avgDuration: number;
  };
  
  // Bidding & Featured
  biddingFeatured: {
    totalSpent: string;
    featuredPosition: number;
    featuredExpiry: string;
  };
  
  // Subscription
  subscription: {
    planName: string;
    startDate: string;
    billingDate: string;
  };
  
  // Reviews
  reviews: CoachReview[];
}

export interface TransactionRecord {
  id: string;
  date: string;
  service: string;
  gross: string;
  net: string;
  platformFee: string;
  payout: string;
}

export interface FinancialStats {
  revenueToday: string;
  platformEarnings: string;
  pendingPayouts: string;
  openDisputes: string;
  totalLabel: string;
  subscription: string;
  payPerMinute: string;
  credit: string;
  session: string;
}

export interface FinancialChartDataPoint {
  label: string;
  subscription: number;
  payPerMinute: number;
  credit: number;
  session: number;
}

export interface ReportRecord {
  id: string;
  userName: string;
  userAvatar: string;
  reason: string;
}

export interface StoryWordOption {
  id: string;
  name: string;
  percentage: number;
}

export interface DemographicsDataPoint {
  label: string;
  value: number;
}

export interface GenderDataPoint {
  label: string;
  male: number;
  female: number;
}

export interface LocationDataPoint {
  name: string;
  value: number;
  percentage: string;
}

export interface DemographicsData {
  ageData: DemographicsDataPoint[];
  genderData: GenderDataPoint[];
  locationData: LocationDataPoint[];
}

// Simulated Network Latency Helper
const simulateLatency = <T>(data: T, ms: number = 600): Promise<T> => {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms));
};

// In-Memory Database State for Session Prototyping
const coaches: CoachProfile[] = [
  {
    id: "coach-1",
    name: "Dr. Sarah Jenkins",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200",
    title: "Executive & Leadership Coach",
    bio: "Helping leaders scale their organizations, build high-performing teams, and find alignment. 10+ years of tech industry coaching.",
    rating: 4.9,
    reviewsCount: 124,
    specialties: ["Leadership", "Career Transition", "Conflict Resolution", "Scaleups"],
    hourlyRate: 150,
    availability: ["Mon 10:00 AM", "Mon 2:00 PM", "Wed 11:00 AM", "Fri 4:00 PM"],
  },
  {
    id: "coach-2",
    name: "Marcus Aurelius Chen",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200",
    title: "High Performance & Mindset Coach",
    bio: "Specializing in athletic performance, mental resilience, and peak focus. Train your mind to thrive under extreme pressure.",
    rating: 4.8,
    reviewsCount: 98,
    specialties: ["Mindset", "Stress Management", "Habits & Routine", "Productivity"],
    hourlyRate: 120,
    availability: ["Tue 9:00 AM", "Tue 1:00 PM", "Thu 10:00 AM", "Thu 3:00 PM"],
  },
  {
    id: "coach-3",
    name: "Elena Rostova",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200",
    title: "Career Strategy & Personal Branding Specialist",
    bio: "Passionate about empowering professionals to define their value proposition, land high-impact roles, and build authentic brands.",
    rating: 5.0,
    reviewsCount: 76,
    specialties: ["Resume Writing", "Interview Prep", "Personal Branding", "Networking"],
    hourlyRate: 135,
    availability: ["Wed 9:00 AM", "Wed 1:00 PM", "Thu 2:00 PM", "Fri 11:00 AM"],
  },
];

let sessions: CoachingSession[] = [
  {
    id: "sess-1",
    coachId: "coach-1",
    coachName: "Dr. Sarah Jenkins",
    clientName: "Alex Mercer",
    dateTime: "2026-06-15T10:00:00Z",
    durationMinutes: 50,
    status: "scheduled",
    meetingLink: "https://meet.google.com/abc-defg-hij",
    topic: "Q3 Strategic Goal Setting & Delegation",
  },
  {
    id: "sess-2",
    coachId: "coach-2",
    coachName: "Marcus Aurelius Chen",
    clientName: "Alex Mercer",
    dateTime: "2026-06-18T13:00:00Z",
    durationMinutes: 50,
    status: "pending",
    topic: "Managing High-Stakes Investor Pitch Stress",
  },
  {
    id: "sess-3",
    coachId: "coach-3",
    coachName: "Elena Rostova",
    clientName: "Alex Mercer",
    dateTime: "2026-06-08T09:00:00Z",
    durationMinutes: 50,
    status: "completed",
    topic: "LinkedIn Profile Optimization Review",
  },
];

let notifications: Notification[] = [
  {
    id: "notif-1",
    title: "Session Approved",
    message: "Your upcoming session with Dr. Sarah Jenkins has been scheduled and confirmed.",
    type: "success",
    timestamp: "2 hours ago",
    read: false,
  },
  {
    id: "notif-2",
    title: "New Coach Available",
    message: "Elena Rostova joined Coach Purl. View her specialties and check scheduling.",
    type: "info",
    timestamp: "1 day ago",
    read: true,
  },
];

const activities: RecentActivity[] = [
  {
    id: "act-1",
    user: "Joseph",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100",
    action: "purchased Elite Plan",
    time: "15 mins ago",
  },
  {
    id: "act-2",
    user: "Helene",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100",
    action: "flagged a message",
    time: "20 mins ago",
  },
  {
    id: "act-3",
    user: "Micheal",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100",
    action: "booked a session with Coach Amanda",
    time: "1 hour ago",
  },
  {
    id: "act-4",
    user: "Thomas",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100",
    action: "Missed call from user",
    time: "3 hours ago",
  },
  {
    id: "act-5",
    user: "Micheal",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100",
    action: "booked a session with Coach Amanda",
    time: "1 hour ago",
  },
];

const coachBids: CoachBid[] = [
  { rank: 1, name: "Amanda Byrd", bidAmount: 75 },
  { rank: 2, name: "Jonathon Pricchet", bidAmount: 60 },
  { rank: 3, name: "Roberta Tucker", bidAmount: 40 },
  { rank: 4, name: "Roberta Tucker", bidAmount: 40 },
  { rank: 5, name: "Roberta Tucker", isRaffleWinner: true },
];

let coachApprovals: CoachApproval[] = [
  {
    id: "appr-1",
    name: "Robert McFall",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100",
    status: "pending",
    specialty: "Relationship Recovery",
    experience: "8 Years Exp.",
  },
  {
    id: "appr-2",
    name: "Leslie Knope",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100",
    status: "pending",
    specialty: "Dating Strategy",
    experience: "Certified Coach",
  },
  {
    id: "appr-3",
    name: "Joseph McFall",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=100",
    status: "pending",
    specialty: "Self-Love and Confidence",
    experience: "8 Years Exp.",
  },
];

const revenueData: RevenueOverviewData[] = [
  { month: "Sep", revenue: 15 },
  { month: "Oct", revenue: 25 },
  { month: "Nov", revenue: 45 },
  { month: "Dec", revenue: 55 },
  { month: "Jan", revenue: 20 },
  { month: "Feb", revenue: 35 },
  { month: "March", revenue: 65 },
  { month: "April", revenue: 90 },
];

const dashboardMetrics: DashboardMetrics = {
  totalUsers: 9480,
  activeCoaches: 1545,
  totalRevenue: "940.5$",
  newSignupsToday: 45,
  bookingsToday: 48,
  instantTexts: 154,
  instantCalls: 94,
  pendingReports: 45,
};

// Mock API Call functions
export const mockApi = {
  // Fetch all coaches
  getCoaches: async (): Promise<CoachProfile[]> => {
    return simulateLatency([...coaches]);
  },

  // Fetch coach by ID
  getCoachById: async (id: string): Promise<CoachProfile | null> => {
    const coach = coaches.find((c) => c.id === id) || null;
    return simulateLatency(coach);
  },

  // Fetch all user sessions
  getSessions: async (): Promise<CoachingSession[]> => {
    return simulateLatency([...sessions]);
  },

  // Schedule a new coaching session
  scheduleSession: async (sessionData: Omit<CoachingSession, "id" | "status" | "clientName">): Promise<CoachingSession> => {
    const newSession: CoachingSession = {
      ...sessionData,
      id: `sess-${sessions.length + 1}`,
      clientName: "Alex Mercer",
      status: "scheduled",
      meetingLink: `https://meet.google.com/mock-${Math.random().toString(36).substring(2, 7)}`,
    };
    sessions = [newSession, ...sessions];
    return simulateLatency(newSession, 800);
  },

  // Update session status (e.g. complete, cancel)
  updateSessionStatus: async (id: string, status: CoachingSession["status"]): Promise<CoachingSession | null> => {
    const sessionIndex = sessions.findIndex((s) => s.id === id);
    if (sessionIndex === -1) return simulateLatency(null);

    sessions[sessionIndex] = { ...sessions[sessionIndex], status };
    return simulateLatency(sessions[sessionIndex], 500);
  },

  // Get notifications
  getNotifications: async (): Promise<Notification[]> => {
    return simulateLatency([...notifications]);
  },

  // Mark all notifications as read
  markNotificationsRead: async (): Promise<boolean> => {
    notifications = notifications.map((n) => ({ ...n, read: true }));
    return simulateLatency(true, 300);
  },

  // Fetch dashboard metrics
  getDashboardMetrics: async (): Promise<DashboardMetrics> => {
    return simulateLatency({ ...dashboardMetrics }, 500);
  },

  // Fetch recent activity
  getRecentActivities: async (): Promise<RecentActivity[]> => {
    return simulateLatency([...activities], 400);
  },

  // Fetch coach bidding info
  getCoachBids: async (): Promise<CoachBid[]> => {
    return simulateLatency([...coachBids], 400);
  },

  // Fetch pending approvals
  getPendingApprovals: async (): Promise<CoachApproval[]> => {
    return simulateLatency([...coachApprovals], 400);
  },

  // Approve a coach application
  approveCoach: async (id: string): Promise<boolean> => {
    coachApprovals = coachApprovals.map((appr) => 
      appr.id === id ? { ...appr, status: "approved" as const } : appr
    );
    return simulateLatency(true, 500);
  },

  // Fetch revenue details
  getRevenueOverview: async (): Promise<RevenueOverviewData[]> => {
    return simulateLatency([...revenueData], 400);
  },

  // Fetch dashboard aggregate statistics (Legacy fallback)
  getDashboardStats: async (): Promise<DashboardStats> => {
    const stats: DashboardStats = {
      totalSessions: sessions.length,
      activeCoaches: coaches.length,
      upcomingSessionsCount: sessions.filter((s) => s.status === "scheduled" || s.status === "pending").length,
      totalHoursCoached: sessions.filter((s) => s.status === "completed").reduce((acc, s) => acc + s.durationMinutes / 60, 0),
    };
    return simulateLatency(stats, 400);
  },

  // Fetch users with search and filter
  getUsers: async (filterStatus?: string, searchQuery?: string): Promise<UserProfile[]> => {
    let result = [...users];
    if (filterStatus && filterStatus !== "All Users") {
      result = result.filter((u) => u.status.toLowerCase() === filterStatus.toLowerCase());
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
    }
    return simulateLatency(result, 400);
  },

  // Fetch user profile by ID
  getUserById: async (id: string): Promise<UserProfile | null> => {
    const user = users.find((u) => u.id === id) || null;
    return simulateLatency(user ? { ...user } : null, 400);
  },

  // Update user account status
  updateUserStatus: async (id: string, status: UserProfile["status"]): Promise<UserProfile | null> => {
    const userIndex = users.findIndex((u) => u.id === id);
    if (userIndex === -1) return simulateLatency(null);
    users[userIndex] = { ...users[userIndex], status };
    return simulateLatency({ ...users[userIndex] }, 500);
  },

  // Fetch coaches with search and filter
  getDashboardCoaches: async (filterStatus?: string, searchQuery?: string): Promise<CoachDetailProfile[]> => {
    let result = [...dashboardCoaches];
    if (filterStatus && filterStatus !== "All Coaches") {
      result = result.filter((c) => c.status.toLowerCase() === filterStatus.toLowerCase());
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((c) => c.name.toLowerCase().includes(q) || c.specialty.toLowerCase().includes(q));
    }
    return simulateLatency(result, 400);
  },

  // Fetch coach details by ID
  getCoachDetails: async (id: string): Promise<CoachDetailProfile | null> => {
    const coach = dashboardCoaches.find((c) => c.id === id) || null;
    return simulateLatency(coach ? { ...coach } : null, 400);
  },

  // Update coach application status
  updateCoachStatus: async (id: string, status: CoachDetailProfile["status"], rejectReason?: string): Promise<CoachDetailProfile | null> => {
    const coachIndex = dashboardCoaches.findIndex((c) => c.id === id);
    if (coachIndex === -1) return simulateLatency(null);
    dashboardCoaches[coachIndex] = { 
      ...dashboardCoaches[coachIndex], 
      status,
      bio: rejectReason ? `Rejected Reason: ${rejectReason}. ${dashboardCoaches[coachIndex].bio}` : dashboardCoaches[coachIndex].bio 
    };
    return simulateLatency({ ...dashboardCoaches[coachIndex] }, 500);
  },

  // Fetch coaching tags by category
  getCoachingTags: async (category: "style" | "expertise" | "level"): Promise<string[]> => {
    if (category === "style") return simulateLatency([...coachingStyles], 200);
    if (category === "expertise") return simulateLatency([...expertiseAreas], 200);
    return simulateLatency([...expertiseLevels], 200);
  },

  // Add new coaching tag
  addCoachingTag: async (category: "style" | "expertise" | "level", tag: string): Promise<string[]> => {
    if (category === "style") {
      if (!coachingStyles.includes(tag)) coachingStyles.push(tag);
      return simulateLatency([...coachingStyles], 200);
    }
    if (category === "expertise") {
      if (!expertiseAreas.includes(tag)) expertiseAreas.push(tag);
      return simulateLatency([...expertiseAreas], 200);
    }
    if (!expertiseLevels.includes(tag)) expertiseLevels.push(tag);
    return simulateLatency([...expertiseLevels], 200);
  },

  // Delete coaching tag
  deleteCoachingTag: async (category: "style" | "expertise" | "level", tag: string): Promise<string[]> => {
    if (category === "style") {
      coachingStyles = coachingStyles.filter((t) => t !== tag);
      return simulateLatency([...coachingStyles], 200);
    }
    if (category === "expertise") {
      expertiseAreas = expertiseAreas.filter((t) => t !== tag);
      return simulateLatency([...expertiseAreas], 200);
    }
    expertiseLevels = expertiseLevels.filter((t) => t !== tag);
    return simulateLatency([...expertiseLevels], 200);
  },

  // Fetch financial stats based on Net / Total / Gross filter
  getFinancialStats: async (mode: "Net" | "Total" | "Gross"): Promise<FinancialStats> => {
    if (mode === "Net") return simulateLatency({ ...financialStatsNet }, 350);
    if (mode === "Total") return simulateLatency({ ...financialStatsTotal }, 350);
    return simulateLatency({ ...financialStatsGross }, 350);
  },

  // Fetch chart coordinate points based on mode
  getFinancialChartData: async (mode: "Net" | "Total" | "Gross"): Promise<FinancialChartDataPoint[]> => {
    if (mode === "Net") return simulateLatency([...financialChartDataNet], 350);
    if (mode === "Total") return simulateLatency([...financialChartDataTotal], 350);
    return simulateLatency([...financialChartDataGross], 350);
  },

  // Fetch transactions log ledger
  getTransactions: async (searchQuery?: string): Promise<TransactionRecord[]> => {
    let result = [...transactions];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((t) => t.id.toLowerCase().includes(q) || t.service.toLowerCase().includes(q));
    }
    return simulateLatency(result, 400);
  },

  // Fetch demographics based on selected role
  getDemographics: async (role: "User" | "Coach"): Promise<DemographicsData> => {
    if (role === "User") return simulateLatency({ ...userDemographics }, 350);
    return simulateLatency({ ...coachDemographics }, 350);
  },

  // Fetch user reports list
  getReports: async (): Promise<ReportRecord[]> => {
    return simulateLatency([...reportRecords], 350);
  },

  // Fetch story words
  getStoryWords: async (): Promise<StoryWordOption[]> => {
    return simulateLatency([...storyWordOptions], 300);
  },

  // Add new story category
  addStoryCategory: async (name: string, percentage: number): Promise<StoryWordOption[]> => {
    const newCat: StoryWordOption = {
      id: `word-${storyWordOptions.length + 1}`,
      name,
      percentage
    };
    storyWordOptions = [...storyWordOptions, newCat];
    return simulateLatency([...storyWordOptions], 300);
  },

  // Delete moderated story words
  deleteStoryWords: async (wordIds: string[]): Promise<StoryWordOption[]> => {
    storyWordOptions = storyWordOptions.filter(w => !wordIds.includes(w.id));
    return simulateLatency([...storyWordOptions], 400);
  },

  // Fetch payout transactions
  getPayoutUserTransactions: async (): Promise<UserTransaction[]> => {
    return simulateLatency([...userTransactionsData], 400);
  },

  // Fetch payout disputes
  getPayoutCoachDisputes: async (): Promise<CoachDispute[]> => {
    return simulateLatency([...coachDisputesData], 400);
  },

  // Fetch payout withdrawals
  getPayoutCoachWithdrawals: async (): Promise<CoachWithdrawal[]> => {
    return simulateLatency([...coachWithdrawalsData], 400);
  },

  // Fetch payout coach transactions
  getPayoutCoachTransactions: async (): Promise<CoachTransaction[]> => {
    return simulateLatency([...coachTransactionsData], 400);
  },

  // Update user transaction status
  updateUserTransactionStatus: async (id: string, status: UserTransaction["status"]): Promise<UserTransaction | null> => {
    const index = userTransactionsData.findIndex(t => t.id === id);
    if (index === -1) return simulateLatency(null);
    userTransactionsData[index] = { ...userTransactionsData[index], status };
    return simulateLatency({ ...userTransactionsData[index] }, 300);
  },

  // Update coach withdrawal status
  updateCoachWithdrawalStatus: async (id: string, status: CoachWithdrawal["status"]): Promise<CoachWithdrawal | null> => {
    const index = coachWithdrawalsData.findIndex(w => w.id === id);
    if (index === -1) return simulateLatency(null);
    coachWithdrawalsData[index] = { ...coachWithdrawalsData[index], status };
    return simulateLatency({ ...coachWithdrawalsData[index] }, 300);
  },

  // Update coach transaction status
  updateCoachTransactionStatus: async (id: string, status: CoachTransaction["status"]): Promise<CoachTransaction | null> => {
    const index = coachTransactionsData.findIndex(t => t.id === id);
    if (index === -1) return simulateLatency(null);
    coachTransactionsData[index] = { ...coachTransactionsData[index], status };
    return simulateLatency({ ...coachTransactionsData[index] }, 300);
  },
};

// Demographics mock data
let userDemographics: DemographicsData = {
  ageData: [
    { label: "Under 18", value: 45 },
    { label: "18-24", value: 43 },
    { label: "24-34", value: 42 },
    { label: "34-44", value: 52 },
    { label: "45+", value: 85 }
  ],
  genderData: [
    { label: "Under 18", male: 45, female: 38 },
    { label: "18-24", male: 43, female: 52 },
    { label: "24-34", male: 42, female: 48 },
    { label: "34-44", male: 52, female: 65 },
    { label: "45+", male: 85, female: 82 }
  ],
  locationData: [
    { name: "London, UK", value: 14, percentage: "14%" },
    { name: "New York, NY", value: 21, percentage: "21%" },
    { name: "Los Angeles, CA", value: 17, percentage: "17%" },
    { name: "Austin, TX", value: 9, percentage: "9%" },
    { name: "Sydney, AU", value: 8, percentage: "8%" },
    { name: "Miami, FL", value: 7, percentage: "7%" },
    { name: "Others", value: 15, percentage: "15%" }
  ]
};

let coachDemographics: DemographicsData = {
  ageData: [
    { label: "Under 18", value: 0 },
    { label: "18-24", value: 15 },
    { label: "24-34", value: 55 },
    { label: "34-44", value: 75 },
    { label: "45+", value: 65 }
  ],
  genderData: [
    { label: "Under 18", male: 0, female: 0 },
    { label: "18-24", male: 15, female: 25 },
    { label: "24-34", male: 55, female: 60 },
    { label: "34-44", male: 75, female: 70 },
    { label: "45+", male: 65, female: 62 }
  ],
  locationData: [
    { name: "London, UK", value: 10, percentage: "10%" },
    { name: "New York, NY", value: 25, percentage: "25%" },
    { name: "Los Angeles, CA", value: 20, percentage: "20%" },
    { name: "Austin, TX", value: 15, percentage: "15%" },
    { name: "Sydney, AU", value: 10, percentage: "10%" },
    { name: "Miami, FL", value: 5, percentage: "5%" },
    { name: "Others", value: 15, percentage: "15%" }
  ]
};

let reportRecords: ReportRecord[] = [
  { id: "rep-1", userName: "Bonnie Green", userAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100", reason: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sollicitudin porttitor justo eu condimentum." },
  { id: "rep-2", userName: "Bonnie Green", userAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100", reason: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sollicitudin porttitor justo eu condimentum." },
  { id: "rep-3", userName: "Bonnie Green", userAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100", reason: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sollicitudin porttitor justo eu condimentum." },
  { id: "rep-4", userName: "Bonnie Green", userAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100", reason: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sollicitudin porttitor justo eu condimentum." },
  { id: "rep-5", userName: "Bonnie Green", userAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100", reason: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sollicitudin porttitor justo eu condimentum." }
];

let storyWordOptions: StoryWordOption[] = [
  { id: "word-1", name: "Cheating", percentage: 10 },
  { id: "word-2", name: "Narcissist", percentage: 20 },
  { id: "word-3", name: "Toxic Relationship", percentage: 25 },
  { id: "word-4", name: "Lack of Trust", percentage: 30 },
  { id: "word-5", name: "Neglect", percentage: 35 },
  { id: "word-6", name: "Distance", percentage: 40 },
  { id: "word-7", name: "Betrayal", percentage: 45 },
  { id: "word-8", name: "Depression", percentage: 18 },
  { id: "word-9", name: "Lying", percentage: 50 },
  { id: "word-10", name: "Emotional Abuse", percentage: 55 },
  { id: "word-11", name: "Anger Issues", percentage: 60 },
  { id: "word-12", name: "Trust Issues", percentage: 12 },
  { id: "word-13", name: "Communication Problems", percentage: 8 },
  { id: "word-14", name: "Behavioral Red Flags", percentage: 16 },
  { id: "word-15", name: "Immaturity", percentage: 4 }
];

// In-Memory Financial Data
let financialStatsNet: FinancialStats = {
  revenueToday: "$3,128",
  platformEarnings: "$1,230",
  pendingPayouts: "$3,120",
  openDisputes: "02",
  totalLabel: "Total : 10k",
  subscription: "90.6",
  payPerMinute: "123.2",
  credit: "125.2",
  session: "115.3"
};

let financialStatsTotal: FinancialStats = {
  revenueToday: "$4,582",
  platformEarnings: "$1,894",
  pendingPayouts: "$4,320",
  openDisputes: "02",
  totalLabel: "Total : 14.5k",
  subscription: "125.4",
  payPerMinute: "168.8",
  credit: "185.0",
  session: "154.2"
};

let financialStatsGross: FinancialStats = {
  revenueToday: "$6,240",
  platformEarnings: "$2,460",
  pendingPayouts: "$6,240",
  openDisputes: "02",
  totalLabel: "Total : 20k",
  subscription: "181.2",
  payPerMinute: "246.4",
  credit: "250.4",
  session: "230.6"
};

let financialChartDataNet: FinancialChartDataPoint[] = [
  { label: "Jan", subscription: 12000, payPerMinute: 15000, credit: 8000, session: 10000 },
  { label: "Feb", subscription: 9000, payPerMinute: 22000, credit: 14000, session: 5000 },
  { label: "Mar", subscription: 28000, payPerMinute: 18000, credit: 12000, session: 19000 },
  { label: "Apr", subscription: 16000, payPerMinute: 25000, credit: 15000, session: 24000 },
  { label: "May", subscription: 24000, payPerMinute: 21000, credit: 20000, session: 11000 },
  { label: "Jun", subscription: 29000, payPerMinute: 28000, credit: 10000, session: 28000 },
  { label: "Jul", subscription: 5000, payPerMinute: 5000, credit: 20000, session: 20000 },
  { label: "Aug", subscription: 5000, payPerMinute: 5000, credit: 20000, session: 20000 }
];

let financialChartDataTotal: FinancialChartDataPoint[] = [
  { label: "Jan", subscription: 15000, payPerMinute: 19000, credit: 11000, session: 13000 },
  { label: "Feb", subscription: 11000, payPerMinute: 28000, credit: 18000, session: 8000 },
  { label: "Mar", subscription: 35000, payPerMinute: 24000, credit: 16000, session: 25000 },
  { label: "Apr", subscription: 22000, payPerMinute: 32000, credit: 21000, session: 31000 },
  { label: "May", subscription: 30000, payPerMinute: 27000, credit: 26000, session: 15000 },
  { label: "Jun", subscription: 38000, payPerMinute: 36000, credit: 14000, session: 36000 },
  { label: "Jul", subscription: 8000, payPerMinute: 7000, credit: 25000, session: 26000 },
  { label: "Aug", subscription: 8000, payPerMinute: 7000, credit: 25000, session: 26000 }
];

let financialChartDataGross: FinancialChartDataPoint[] = [
  { label: "Jan", subscription: 24000, payPerMinute: 30000, credit: 16000, session: 20000 },
  { label: "Feb", subscription: 18000, payPerMinute: 44000, credit: 28000, session: 10000 },
  { label: "Mar", subscription: 56000, payPerMinute: 36000, credit: 24000, session: 38000 },
  { label: "Apr", subscription: 32000, payPerMinute: 50000, credit: 30000, session: 48000 },
  { label: "May", subscription: 48000, payPerMinute: 42000, credit: 40000, session: 22000 },
  { label: "Jun", subscription: 58000, payPerMinute: 56000, credit: 20000, session: 56000 },
  { label: "Jul", subscription: 10000, payPerMinute: 10000, credit: 40000, session: 40000 },
  { label: "Aug", subscription: 10000, payPerMinute: 10000, credit: 40000, session: 40000 }
];

let transactions: TransactionRecord[] = [
  { id: "TXN-2026-320", date: "May 22, 2026", service: "Pay-Per-Minute", gross: "$20.00", net: "$14.00", platformFee: "$2.80", payout: "$11.20" },
  { id: "TXN-2026-321", date: "May 22, 2026", service: "Pay-Per-Minute", gross: "$20.00", net: "$14.00", platformFee: "$2.80", payout: "$11.20" },
  { id: "TXN-2026-322", date: "May 22, 2026", service: "Pay-Per-Minute", gross: "$20.00", net: "$14.00", platformFee: "$2.80", payout: "$11.20" },
  { id: "TXN-2026-323", date: "May 22, 2026", service: "Pay-Per-Minute", gross: "$20.00", net: "$14.00", platformFee: "$2.80", payout: "$11.20" },
  { id: "TXN-2026-324", date: "May 22, 2026", service: "Pay-Per-Minute", gross: "$20.00", net: "$14.00", platformFee: "$2.80", payout: "$11.20" },
  { id: "TXN-2026-325", date: "May 22, 2026", service: "Pay-Per-Minute", gross: "$20.00", net: "$14.00", platformFee: "$2.80", payout: "$11.20" },
  { id: "TXN-2026-326", date: "May 22, 2026", service: "Subscription", gross: "$99.00", net: "$79.20", platformFee: "$19.80", payout: "$59.40" },
  { id: "TXN-2026-327", date: "May 21, 2026", service: "Session", gross: "$154.00", net: "$123.20", platformFee: "$30.85", payout: "$92.40" }
];

// In-Memory Coaching Tags
let coachingStyles = [
  "Direct & Honest",
  "Empathetic & Soft",
  "Data-Driven",
  "Spiritual",
  "Action-Oriented"
];

let expertiseAreas = [
  "Breakup Recovery",
  "Divorce Support",
  "Relationship Coaching",
  "Emotional Healing",
  "Self-Discovery",
  "Moving Forward",
  "Co-parenting",
  "Dating After Breakup"
];

let expertiseLevels = [
  "0-2 Years",
  "3-5 Years",
  "6-10 Years",
  "10+ Years",
  "Licensed Therapists",
  "Certified Coach"
];

// In-Memory Coaches Details Database
let dashboardCoaches: CoachDetailProfile[] = [
  {
    id: "sarah-johnson",
    name: "Sarah Johnson",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200",
    email: "sarah@gmail.com",
    status: "Approved",
    specialty: "Breakup Recovery",
    experienceYears: 6,
    location: "Austin, TX",
    phone: "+125698-742459",
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Viverra posuere bibendum placerat vitae in amet ipsum eu. Suspendisse in blandit massa netus gravida. Netus sed ultrices ornare aliquam. Ipsum nisl arcu platea at ac.",
    elevatorPitch: "I help busy professionals reduce burnout in 30 days through breath-led yoga and daily mindfulness rituals.",
    specialtiesList: [
      "Breakup Recovery",
      "No Contact Strategy",
      "Relationship Coaching",
      "Emotional Healing",
      "Self love & confident"
    ],
    availabilityDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    availabilityHours: [
      { day: "Monday", timeRange: "10:10 AM - 12:00 PM" },
      { day: "Wednesday", timeRange: "10:10 AM - 12:00 PM" }
    ],
    rates: {
      perMinute: "$150",
      perText: "$150"
    },
    cancellationPolicy: "Full refund if cancelled before the cutoff window. Late cancellations are charged 50% of the session fee.",
    certifications: [
      { id: "cert-1", title: "RYT 200 Yoga Certification", authority: "Yoga Alliance", issuedDate: "Issued 2020-08-15" },
      { id: "cert-2", title: "RYT 200 Yoga Certification", authority: "Yoga Alliance", issuedDate: "Issued 2020-08-15" }
    ],
    totalSessions: 48,
    totalEarnings: "$3,40.00", // to match mockup typo of $3,40.00 or $340.00
    avgRating: 4.5,
    lastActive: "2 hr ago",
    sessionOverview: {
      completed: 96,
      upcoming: 76,
      cancelled: 4
    },
    sessionStats: {
      videoCall: 28,
      textSession: 28,
      voiceCall: 28,
      avgDuration: 28
    },
    biddingFeatured: {
      totalSpent: "$560.00",
      featuredPosition: 1,
      featuredExpiry: "15 Jul 2026"
    },
    subscription: {
      planName: "$99.00/month",
      startDate: "1 March 2026",
      billingDate: "15 Jul 2026"
    },
    reviews: [
      {
        id: "rev-1",
        reviewerName: "Bonnie Green",
        reviewerAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100",
        rating: 5,
        comment: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Est at suscipit quam sed mauris eros massa id diam.",
        date: "1 March 2026"
      }
    ]
  },
  {
    id: "coach-mick",
    name: "Michael Dunphy",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    email: "michael.dunphy@gmail.com",
    status: "Approved",
    specialty: "Relationship recovery",
    experienceYears: 10,
    location: "San Francisco, CA",
    phone: "+1555-019-2834",
    bio: "Passionate relationship recovery expert helping couples rebuild boundaries and trust. Over 10 years of clinical and coaching practice.",
    specialtiesList: ["Relationship recovery", "Trust Rebuilding", "Couples therapy"],
    availabilityDays: ["Mon", "Wed", "Fri"],
    availabilityHours: [
      { day: "Monday", timeRange: "09:00 AM - 11:00 AM" },
      { day: "Wednesday", timeRange: "02:00 PM - 04:00 PM" }
    ],
    rates: {
      perMinute: "$120",
      perText: "$80"
    },
    totalSessions: 450,
    totalEarnings: "$12,250",
    avgRating: 4.9,
    lastActive: "2 hr ago",
    sessionOverview: {
      completed: 420,
      upcoming: 25,
      cancelled: 5
    },
    sessionStats: {
      videoCall: 250,
      textSession: 100,
      voiceCall: 100,
      avgDuration: 50
    },
    biddingFeatured: {
      totalSpent: "$1,200.00",
      featuredPosition: 2,
      featuredExpiry: "30 Jun 2026"
    },
    subscription: {
      planName: "$99.00/month",
      startDate: "10 Jan 2025",
      billingDate: "30 Jun 2026"
    },
    reviews: []
  },
  {
    id: "coach-robert",
    name: "Robert Perry",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
    email: "robertperry452@gmail.com",
    status: "Approved",
    specialty: "Emotional healing",
    experienceYears: 8,
    location: "New York, NY",
    phone: "+1555-023-4589",
    bio: "Focusing on mindfulness and trauma-informed healing processes to help you unlock emotional blockages and live stress-free.",
    specialtiesList: ["Emotional healing", "Mindfulness", "Trauma healing"],
    availabilityDays: ["Tue", "Thu"],
    availabilityHours: [
      { day: "Tuesday", timeRange: "10:00 AM - 12:00 PM" }
    ],
    rates: {
      perMinute: "$130",
      perText: "$90"
    },
    totalSessions: 235,
    totalEarnings: "$6,500",
    avgRating: 4.8,
    lastActive: "30 mins ago",
    sessionOverview: {
      completed: 220,
      upcoming: 10,
      cancelled: 5
    },
    sessionStats: {
      videoCall: 130,
      textSession: 55,
      voiceCall: 50,
      avgDuration: 45
    },
    biddingFeatured: {
      totalSpent: "$800.00",
      featuredPosition: 3,
      featuredExpiry: "01 Jul 2026"
    },
    subscription: {
      planName: "$99.00/month",
      startDate: "15 Feb 2025",
      billingDate: "01 Jul 2026"
    },
    reviews: []
  },
  {
    id: "coach-joseph",
    name: "Joseph McFall",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200",
    email: "mcfalljoseph@yahoo.com",
    status: "Approved",
    specialty: "Self-esteem building",
    experienceYears: 5,
    location: "Seattle, WA",
    phone: "+1555-112-9843",
    bio: "Empowering young professionals to discover self-worth and build lasting confidence in corporate and personal settings.",
    specialtiesList: ["Self-esteem building", "Confidence", "Career advice"],
    availabilityDays: ["Mon", "Tue", "Wed"],
    availabilityHours: [],
    rates: {
      perMinute: "$100",
      perText: "$60"
    },
    totalSessions: 150,
    totalEarnings: "$3,375",
    avgRating: 4.6,
    lastActive: "45 mins ago",
    sessionOverview: {
      completed: 140,
      upcoming: 8,
      cancelled: 2
    },
    sessionStats: {
      videoCall: 80,
      textSession: 40,
      voiceCall: 30,
      avgDuration: 35
    },
    biddingFeatured: {
      totalSpent: "$0.00",
      featuredPosition: 0,
      featuredExpiry: "N/A"
    },
    subscription: {
      planName: "$99.00/month",
      startDate: "01 Apr 2025",
      billingDate: "15 Jul 2026"
    },
    reviews: []
  },
  {
    id: "coach-karen",
    name: "Karen Nelson",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200",
    email: "nelson325@gmail.com",
    status: "Pending",
    specialty: "Dating Strategy",
    experienceYears: 6,
    location: "Austin, TX",
    phone: "+125698-742459",
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Viverra posuere bibendum placerat vitae in amet ipsum eu. Suspendisse in blandit massa netus gravida. Netus sed ultrices ornare aliquam. Ipsum nisl arcu platea at ac.",
    elevatorPitch: "I help busy professionals reduce burnout in 30 days through breath-led yoga and daily mindfulness rituals.",
    specialtiesList: [
      "Relationship Coaching",
      "Life Coaching",
      "Divorce Support",
      "Personal Growth",
      "Health Support"
    ],
    availabilityDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    availabilityHours: [],
    rates: {
      perMinute: "$150",
      perText: "$150"
    },
    cancellationPolicy: "Full refund if cancelled before the cutoff window. Late cancellations are charged 50% of the session fee.",
    certifications: [
      { id: "cert-1", title: "RYT 200 Yoga Certification", authority: "Yoga Alliance", issuedDate: "Issued 2020-08-15" },
      { id: "cert-2", title: "RYT 200 Yoga Certification", authority: "Yoga Alliance", issuedDate: "Issued 2020-08-15" }
    ],
    totalSessions: 0,
    totalEarnings: "$0",
    avgRating: 0,
    lastActive: "N/A",
    sessionOverview: { completed: 0, upcoming: 0, cancelled: 0 },
    sessionStats: { videoCall: 0, textSession: 0, voiceCall: 0, avgDuration: 0 },
    biddingFeatured: { totalSpent: "$0", featuredPosition: 0, featuredExpiry: "" },
    subscription: { planName: "", startDate: "", billingDate: "" },
    reviews: []
  },
  {
    id: "coach-lana",
    name: "Lana Byrd",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
    email: "lanabyrd52@gmail.com",
    status: "Approved",
    specialty: "Breakup Support",
    experienceYears: 7,
    location: "Los Angeles, CA",
    phone: "+1555-894-3019",
    bio: "Helping individuals navigate emotional turbulence during relationship endings, rediscover personal goals, and transition with grace.",
    specialtiesList: ["Breakup Support", "Recovery", "Personal Growth"],
    availabilityDays: ["Mon", "Tue", "Wed", "Thu"],
    availabilityHours: [],
    rates: {
      perMinute: "$110",
      perText: "$70"
    },
    totalSessions: 175,
    totalEarnings: "$4,250",
    avgRating: 4.8,
    lastActive: "2 days ago",
    sessionOverview: {
      completed: 165,
      upcoming: 8,
      cancelled: 2
    },
    sessionStats: {
      videoCall: 100,
      textSession: 40,
      voiceCall: 35,
      avgDuration: 40
    },
    biddingFeatured: {
      totalSpent: "$300.00",
      featuredPosition: 4,
      featuredExpiry: "15 Jul 2026"
    },
    subscription: {
      planName: "$99.00/month",
      startDate: "05 May 2025",
      billingDate: "15 Jul 2026"
    },
    reviews: []
  },
  {
    id: "coach-leslie",
    name: "Leslie Livingston",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200",
    email: "leslie_livingston@gmail.com",
    status: "Pending",
    specialty: "Self-love and Confidence",
    experienceYears: 4,
    location: "Boston, MA",
    phone: "+1555-301-4958",
    bio: "Specializing in self-compassion tools, building self-love habits, and coaching individuals to overcome deep-seated self-doubt.",
    specialtiesList: ["Self-love and Confidence", "Self-compassion", "Body positivity"],
    availabilityDays: ["Mon", "Wed", "Fri"],
    availabilityHours: [],
    rates: {
      perMinute: "$100",
      perText: "$50"
    },
    totalSessions: 0,
    totalEarnings: "$0",
    avgRating: 0,
    lastActive: "N/A",
    sessionOverview: { completed: 0, upcoming: 0, cancelled: 0 },
    sessionStats: { videoCall: 0, textSession: 0, voiceCall: 0, avgDuration: 0 },
    biddingFeatured: { totalSpent: "$0", featuredPosition: 0, featuredExpiry: "" },
    subscription: { planName: "", startDate: "", billingDate: "" },
    reviews: []
  },
  {
    id: "coach-bonnie",
    name: "Bonnie Green",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
    email: "bonnie_g12@gmail.com",
    status: "Rejected",
    specialty: "Meditation and Yoga",
    experienceYears: 6,
    location: "Miami, FL",
    phone: "+1555-839-4058",
    bio: "Teaching Vinyasa flow and somatic meditation to release stress and ground the mind.",
    specialtiesList: ["Meditation and Yoga", "Stress release", "Somatic healing"],
    availabilityDays: ["Tue", "Thu", "Sat"],
    availabilityHours: [],
    rates: {
      perMinute: "$90",
      perText: "$50"
    },
    totalSessions: 0,
    totalEarnings: "$0",
    avgRating: 0,
    lastActive: "N/A",
    sessionOverview: { completed: 0, upcoming: 0, cancelled: 0 },
    sessionStats: { videoCall: 0, textSession: 0, voiceCall: 0, avgDuration: 0 },
    biddingFeatured: { totalSpent: "$0", featuredPosition: 0, featuredExpiry: "" },
    subscription: { planName: "", startDate: "", billingDate: "" },
    reviews: []
  }
];


// In-Memory Users Database
let users: UserProfile[] = [
  {
    id: "sarah-johnson",
    name: "Sarah Johnson",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200",
    email: "sarah@gmail.com",
    status: "Active",
    noContactDays: 45,
    joinDate: "5 March 2026",
    lastActive: "2 hr ago",
    totalSessions: 12,
    totalSpent: "$240.00",
    activityOverview: {
      journalEntries: 28,
      totalTexts: 67,
      totalCalls: 28,
      timeRelapsed: 2,
      timeRelapsedLabel: "Last on 2 hr ago",
    },
    sessionsLog: [
      { id: "log-1", title: "Session with Coach Pearl", dateTime: "1 may 2025, 30 Mins (Video Call)", amount: "$154.00", status: "Pending" },
      { id: "log-2", title: "Session with Coach Pearl", dateTime: "1 may 2025, 30 Mins (Video Call)", amount: "$154.00", status: "Complete" },
      { id: "log-3", title: "Session with Coach Pearl", dateTime: "1 may 2025, 30 Mins (Video Call)", amount: "$154.00", status: "Complete" },
      { id: "log-4", title: "Session with Coach Pearl", dateTime: "1 may 2025, 30 Mins (Video Call)", amount: "$154.00", status: "Complete" },
      { id: "log-5", title: "Session with Coach Pearl", dateTime: "1 may 2025, 30 Mins (Video Call)", amount: "$154.00", status: "Complete" },
      { id: "log-6", title: "Session with Coach Pearl", dateTime: "1 may 2025, 30 Mins (Video Call)", amount: "$154.00", status: "Complete" },
      { id: "log-7", title: "Session with Coach Pearl", dateTime: "1 may 2025, 30 Mins (Video Call)", amount: "$154.00", status: "Complete" },
      { id: "log-8", title: "Session with Coach Pearl", dateTime: "1 may 2025, 30 Mins (Video Call)", amount: "$154.00", status: "Complete" },
      { id: "log-9", title: "Session with Coach Pearl", dateTime: "1 may 2025, 30 Mins (Video Call)", amount: "$154.00", status: "Complete" },
    ],
  },
  {
    id: "user-1",
    name: "Michael Dunphy",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    email: "michael.dunphy@gmail.com",
    status: "Active",
    noContactDays: 45,
    joinDate: "15/01/2026",
    lastActive: "2 Hours Ago",
    totalSessions: 8,
    totalSpent: "$160.00",
    activityOverview: {
      journalEntries: 14,
      totalTexts: 42,
      totalCalls: 12,
      timeRelapsed: 1,
      timeRelapsedLabel: "Last on 1 day ago",
    },
    sessionsLog: [
      { id: "log-1", title: "Session with Coach Jenkins", dateTime: "10 jan 2026, 50 Mins", amount: "$150.00", status: "Complete" },
    ],
  },
  {
    id: "user-2",
    name: "Bonnie Green",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
    email: "bonnie_g12@gmail.com",
    status: "Flagged",
    noContactDays: 12,
    joinDate: "12/11/2025",
    lastActive: "1 Day Ago",
    totalSessions: 4,
    totalSpent: "$80.00",
    activityOverview: {
      journalEntries: 8,
      totalTexts: 24,
      totalCalls: 5,
      timeRelapsed: 3,
      timeRelapsedLabel: "Last on 3 days ago",
    },
    sessionsLog: [
      { id: "log-1", title: "Session with Coach Chen", dateTime: "12 nov 2025, 50 Mins", amount: "$120.00", status: "Complete" },
    ],
  },
  {
    id: "user-3",
    name: "Robert Perry",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
    email: "robertperry452@gmail.com",
    status: "Active",
    noContactDays: 32,
    joinDate: "08/10/2025",
    lastActive: "30 Mins Ago",
    totalSessions: 15,
    totalSpent: "$300.00",
    activityOverview: {
      journalEntries: 32,
      totalTexts: 98,
      totalCalls: 40,
      timeRelapsed: 0,
      timeRelapsedLabel: "Last active now",
    },
    sessionsLog: [
      { id: "log-1", title: "Session with Coach Rostova", dateTime: "8 oct 2025, 50 Mins", amount: "$135.00", status: "Complete" },
    ],
  },
  {
    id: "user-4",
    name: "Joseph McFall",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200",
    email: "mcfalljoseph@yahoo.com",
    status: "Active",
    noContactDays: 15,
    joinDate: "11/09/2025",
    lastActive: "45 Mins Ago",
    totalSessions: 10,
    totalSpent: "$200.00",
    activityOverview: {
      journalEntries: 20,
      totalTexts: 50,
      totalCalls: 18,
      timeRelapsed: 2,
      timeRelapsedLabel: "Last active 45 mins ago",
    },
    sessionsLog: [],
  },
  {
    id: "user-5",
    name: "Karen Nelson",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200",
    email: "nelson325@gmail.com",
    status: "Flagged",
    noContactDays: 24,
    joinDate: "03/06/2025",
    lastActive: "2 Hours Ago",
    totalSessions: 6,
    totalSpent: "$120.00",
    activityOverview: {
      journalEntries: 10,
      totalTexts: 30,
      totalCalls: 8,
      timeRelapsed: 5,
      timeRelapsedLabel: "Last active 2 hours ago",
    },
    sessionsLog: [],
  },
  {
    id: "user-6",
    name: "Lana Byrd",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
    email: "lanabyrd52@gmail.com",
    status: "Active",
    noContactDays: 63,
    joinDate: "25/02/2025",
    lastActive: "2 Days Ago",
    totalSessions: 18,
    totalSpent: "$360.00",
    activityOverview: {
      journalEntries: 45,
      totalTexts: 120,
      totalCalls: 35,
      timeRelapsed: 4,
      timeRelapsedLabel: "Last active 2 days ago",
    },
    sessionsLog: [],
  },
  {
    id: "user-7",
    name: "Leslie Livingston",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200",
    email: "leslie_livingston@gmail.com",
    status: "Blocked",
    noContactDays: 0,
    joinDate: "08/12/2024",
    lastActive: "12 Hours Ago",
    totalSessions: 0,
    totalSpent: "$0.00",
    activityOverview: {
      journalEntries: 0,
      totalTexts: 0,
      totalCalls: 0,
      timeRelapsed: 0,
      timeRelapsedLabel: "No recent activity",
    },
    sessionsLog: [],
  },
  {
    id: "user-8",
    name: "Jese Leos",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200",
    email: "leos19@gmail.com",
    status: "Active",
    noContactDays: 90,
    joinDate: "11/11/2024",
    lastActive: "15 Mins Ago",
    totalSessions: 24,
    totalSpent: "$480.00",
    activityOverview: {
      journalEntries: 60,
      totalTexts: 150,
      totalCalls: 50,
      timeRelapsed: 1,
      timeRelapsedLabel: "Last active 15 mins ago",
    },
    sessionsLog: [],
  },
];

export interface UserTransaction {
  id: string;
  user: string;
  avatar: string;
  userPaid: string;
  type: string;
  platformFee: string;
  date: string;
  status: "Completed" | "Pending" | "Refunded" | "Cancelled" | "Cancel by Stripe" | "Accepted" | "Rejected";
}

export interface CoachDispute {
  id: string;
  user: string;
  coach: string;
  amount: string;
  reason: string;
  date: string;
  status: "Refunded" | "Completed" | "Pending";
}

export interface CoachWithdrawal {
  id: string;
  coach: string;
  totalBalance: string;
  withdrawalRequest: string;
  withdrawalAmount: string;
  currentBalance: string;
  date: string;
  requestAmount: string;
  note: string;
  status: "Cancel" | "Cancel by Stripe" | "Completed" | "Pending" | "Refunded" | "Hold" | "Rejected";
}

export interface CoachTransaction {
  id: string;
  coach: string;
  coachFee: string;
  type: string;
  platformFee: string;
  date: string;
  status: "Completed" | "Pending" | "Refunded" | "Cancelled" | "Cancel by Stripe" | "Accepted" | "Rejected" | "Cancel" | "Hold" | "Cancel"}

export const initialUserTransactions: UserTransaction[] = [
  { id: "TXN-2026 321", user: "Michael Dunphy", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100", userPaid: "$125", type: "Elite", platformFee: "$30", date: "12/04/2026", status: "Completed" },
  { id: "TXN-2026 320", user: "Robert Perry", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100", userPaid: "$80", type: "Manual", platformFee: "$10", date: "12/04/2026", status: "Completed" },
  { id: "TXN-2026 319", user: "Joseph McFall", avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=100", userPaid: "$200", type: "Essential", platformFee: "$45", date: "12/04/2026", status: "Completed" },
  { id: "TXN-2026 318", user: "Karen Smith", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100", userPaid: "$90", type: "Manual", platformFee: "$15", date: "11/04/2026", status: "Pending" },
  { id: "TXN-2026 317", user: "Bonnie Chan", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100", userPaid: "$30", type: "Manual", platformFee: "$06", date: "11/04/2026", status: "Pending" },
  { id: "TXN-2026 316", user: "Karen Smith", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100", userPaid: "$90", type: "Manual", platformFee: "$15", date: "11/04/2026", status: "Refunded" },
  { id: "TXN-2026 315", user: "Joseph McFall", avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=100", userPaid: "$200", type: "Essential", platformFee: "$45", date: "12/04/2026", status: "Completed" },
  { id: "TXN-2026 314", user: "Michael Dunphy", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100", userPaid: "$125", type: "Essential", platformFee: "$30", date: "12/04/2026", status: "Completed" },
  { id: "TXN-2026 313", user: "Robert Perry", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100", userPaid: "$80", type: "Elite", platformFee: "$10", date: "12/04/2026", status: "Completed" }
];

export const initialCoachDisputes: CoachDispute[] = [
  { id: "DIS-20260425-03", user: "Hailey James", coach: "Alex Tucker", amount: "$110", reason: "Service not delivered", date: "12/04/2026", status: "Refunded" },
  { id: "DIS-20260425-02", user: "Claire Tucker", coach: "Mathew Perry", amount: "$80", reason: "Quality of service", date: "02/03/2026", status: "Refunded" },
  { id: "DIS-20260425-01", user: "Luke Dunphy", coach: "Joseph McFall", amount: "$65", reason: "User Absence", date: "25/02/2026", status: "Refunded" }
];

export const initialCoachWithdrawals: CoachWithdrawal[] = [
  { id: "WTH-001", coach: "Michael Dunphy", totalBalance: "$550", withdrawalRequest: "12/04/2026 14:23", withdrawalAmount: "$125", currentBalance: "$550", date: "12/04/2026", requestAmount: "$125", note: "consectetur. Sed vitae...", status: "Completed" },
  { id: "WTH-002", coach: "Karen Smith", totalBalance: "$550", withdrawalRequest: "11/04/2026 11:23", withdrawalAmount: "$90", currentBalance: "$550", date: "11/04/2026", requestAmount: "$90", note: "consectetur. Sed vitae...", status: "Completed" },
  { id: "WTH-003", coach: "Robert Perry", totalBalance: "$550", withdrawalRequest: "12/04/2026 15:45", withdrawalAmount: "$80", currentBalance: "$550", date: "12/04/2026", requestAmount: "$80", note: "", status: "Pending" },
  { id: "WTH-004", coach: "Joseph McFall", totalBalance: "$550", withdrawalRequest: "12/04/2026 09:12", withdrawalAmount: "$200", currentBalance: "$550", date: "12/04/2026", requestAmount: "$200", note: "consectetur. Sed vitae...", status: "Completed" },
  { id: "WTH-005", coach: "Bonnie Chan", totalBalance: "$550", withdrawalRequest: "11/04/2026 08:30", withdrawalAmount: "$30", currentBalance: "$550", date: "11/04/2026", requestAmount: "$30", note: "consectetur. Sed vitae...", status: "Completed" },
  { id: "WTH-006", coach: "Joseph McFall", totalBalance: "$550", withdrawalRequest: "12/04/2026 09:12", withdrawalAmount: "$200", currentBalance: "$550", date: "12/04/2026", requestAmount: "$200", note: "consectetur. Sed vitae...", status: "Completed" },
  { id: "WTH-007", coach: "Michael Dunphy", totalBalance: "$550", withdrawalRequest: "12/04/2026 14:23", withdrawalAmount: "$125", currentBalance: "$550", date: "12/04/2026", requestAmount: "$125", note: "consectetur. Sed vitae...", status: "Completed" },
  { id: "WTH-008", coach: "Karen Smith", totalBalance: "$550", withdrawalRequest: "11/04/2026 11:23", withdrawalAmount: "$90", currentBalance: "$550", date: "11/04/2026", requestAmount: "$90", note: "consectetur. Sed vitae...", status: "Completed" },
  { id: "WTH-009", coach: "Robert Perry", totalBalance: "$550", withdrawalRequest: "12/04/2026 15:45", withdrawalAmount: "$80", currentBalance: "$550", date: "12/04/2026", requestAmount: "$80", note: "consectetur. Sed vitae...", status: "Completed" },
  // Canceled / stripe cancel items
  { id: "WTH-010", coach: "Alex Tucker", totalBalance: "$125", withdrawalRequest: "28/04/2026 14:23", withdrawalAmount: "$125", currentBalance: "$125", date: "28/04/2026", requestAmount: "$125", note: "Requested cancel via dashboard", status: "Cancel" },
  { id: "WTH-011", coach: "Claire Jones", totalBalance: "$80", withdrawalRequest: "27/04/2026 12:23", withdrawalAmount: "$125", currentBalance: "$80", date: "27/04/2026", requestAmount: "$125", note: "", status: "Cancel" },
  { id: "WTH-012", coach: "Phil Hopes", totalBalance: "$250", withdrawalRequest: "22/03/2026 20:45", withdrawalAmount: "$125", currentBalance: "$250", date: "22/03/2026", requestAmount: "$125", note: "System cancellation", status: "Cancel" },
  { id: "WTH-013", coach: "Luke Brown", totalBalance: "$200", withdrawalRequest: "26/04/2026 10:12", withdrawalAmount: "$125", currentBalance: "$200", date: "26/04/2026", requestAmount: "$125", note: "", status: "Cancel" },
  { id: "WTH-014", coach: "Lisa Nilson", totalBalance: "$60", withdrawalRequest: "03/04/2026 08:30", withdrawalAmount: "$125", currentBalance: "$60", date: "03/04/2026", requestAmount: "$125", note: "", status: "Cancel" },
  { id: "WTH-015", coach: "Sarah Jenkins", totalBalance: "$900", withdrawalRequest: "10/04/2026 16:20", withdrawalAmount: "$400", currentBalance: "$900", date: "10/04/2026", requestAmount: "$400", note: "Payout issue", status: "Cancel by Stripe" },
  { id: "WTH-016", coach: "Marcus Aurelius", totalBalance: "$300", withdrawalRequest: "08/04/2026 11:15", withdrawalAmount: "$150", currentBalance: "$300", date: "08/04/2026", requestAmount: "$150", note: "Awaiting approval validation", status: "Hold" },
  { id: "WTH-017", coach: "Elena Rostova", totalBalance: "$450", withdrawalRequest: "15/04/2026 10:00", withdrawalAmount: "$225", currentBalance: "$450", date: "15/04/2026", requestAmount: "$225", note: "Rejected request", status: "Rejected" }
];

export const initialCoachTransactions: CoachTransaction[] = [
  { id: "TXN-2026 321", coach: "Michael Dunphy", coachFee: "$125", type: "Call", platformFee: "$30", date: "12/04/2026", status: "Completed" },
  { id: "TXN-2026 318", coach: "Karen Smith", coachFee: "$90", type: "Message", platformFee: "$15", date: "11/04/2026", status: "Completed" },
  { id: "TXN-2026 320", coach: "Robert Perry", coachFee: "$80", type: "Message", platformFee: "$10", date: "12/04/2026", status: "Pending" },
  { id: "TXN-2026 319", coach: "Joseph McFall", coachFee: "$200", type: "Session", platformFee: "$45", date: "12/04/2026", status: "Completed" },
  { id: "TXN-2026 317", coach: "Bonnie Chan", coachFee: "$30", type: "Call", platformFee: "$06", date: "11/04/2026", status: "Completed" },
  { id: "TXN-2026 316", coach: "Joseph McFall", coachFee: "$200", type: "Session", platformFee: "$45", date: "12/04/2026", status: "Completed" },
  { id: "TXN-2026 315", coach: "Michael Dunphy", coachFee: "$125", type: "Call", platformFee: "$30", date: "12/04/2026", status: "Completed" },
  { id: "TXN-2026 314", coach: "Karen Smith", coachFee: "$90", type: "Message", platformFee: "$15", date: "11/04/2026", status: "Completed" },
  { id: "TXN-2026 313", coach: "Robert Perry", coachFee: "$80", type: "Message", platformFee: "$10", date: "12/04/2026", status: "Completed" },
  { id: "TXN-2026 312", coach: "Alex Tucker", coachFee: "$120", type: "Call", platformFee: "$20", date: "28/04/2026", status: "Cancel" },
  { id: "TXN-2026 311", coach: "Claire Jones", coachFee: "$80", type: "Message", platformFee: "$10", date: "27/04/2026", status: "Cancel" },
  { id: "TXN-2026 310", coach: "Phil Hopes", coachFee: "$250", type: "Session", platformFee: "$50", date: "22/03/2026", status: "Cancel" },
  { id: "TXN-2026 309", coach: "Luke Brown", coachFee: "$200", type: "Session", platformFee: "$40", date: "26/04/2026", status: "Cancel" },
  { id: "TXN-2026 308", coach: "Lisa Nilson", coachFee: "$60", type: "Call", platformFee: "$08", date: "03/04/2026", status: "Cancel" },
  { id: "TXN-2026 307", coach: "Sarah Jenkins", coachFee: "$900", type: "Session", platformFee: "$180", date: "10/04/2026", status: "Cancel by Stripe" }
];

let userTransactionsData = [...initialUserTransactions];
let coachDisputesData = [...initialCoachDisputes];
let coachWithdrawalsData = [...initialCoachWithdrawals];
let coachTransactionsData = [...initialCoachTransactions];

