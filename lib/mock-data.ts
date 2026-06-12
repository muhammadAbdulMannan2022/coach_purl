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
};

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

