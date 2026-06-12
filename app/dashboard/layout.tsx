"use client";

import * as React from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { 
  MdDashboard, 
  MdPeople, 
  MdSupervisedUserCircle, 
  MdBarChart, 
  MdCreditCard, 
  MdGavel, 
  MdFlag, 
  MdAnalytics, 
  MdSmartToy, 
  MdNotifications, 
  MdSettings, 
  MdLogout,
  MdMenu,
  MdChevronLeft,
  MdStackedLineChart
} from "react-icons/md";

interface SidebarItem {
  name: string;
  path: string;
  icon: React.ReactNode;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  const getHeaderContent = () => {
    if (pathname === "/dashboard") {
      return {
        title: "Dashboard Overview",
        description: "Welcome back, manage your Mental Health support platform",
      };
    }
    if (pathname.startsWith("/dashboard/users")) {
      return {
        title: "User Management",
        description: "Manage and monitor platform user accounts and permissions",
      };
    }
    if (pathname.startsWith("/dashboard/coaches")) {
      return {
        title: "Coach Management",
        description: "Manage and monitor platform certified coaches and applications",
      };
    }
    if (pathname.startsWith("/dashboard/reports")) {
      return {
        title: "Reports and Moderation",
        description: "Manage and resolve user reports, flag contents, and moderation settings",
      };
    }
    if (pathname.startsWith("/dashboard/marketing-analytics")) {
      return {
        title: "Marketing Analytics",
        description: "Select a role to view age, gender, and location distribution",
      };
    }
    if (pathname.startsWith("/dashboard/financial")) {
      return {
        title: "Financial Reports",
        description: "Manage and view platform financial statements, transactions, and overview",
      };
    }
    if (pathname.startsWith("/dashboard/payout")) {
      return {
        title: "Payment and Payout",
        description: "Manage and monitor platform transactions, disputes, and payouts",
      };
    }
    if (pathname.startsWith("/dashboard/bidding")) {
      return {
        title: "Bidding Management",
        description: "Manage and configure live bidding slots and bidder applications",
      };
    }
    // Extract panel name from path
    const rawName = pathname.split("/").pop() || "Module";
    const panelName = rawName
      .replace(/-/g, " ")
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
    return {
      title: panelName,
      description: `Manage and view ${panelName} settings and data`,
    };
  };

  const headerContent = getHeaderContent();

  const menuItems: SidebarItem[] = [
    { name: "Dashboard", path: "/dashboard", icon: <MdDashboard className="w-5 h-5" /> },
    { name: "Users", path: "/dashboard/users", icon: <MdPeople className="w-5 h-5" /> },
    { name: "Coaches", path: "/dashboard/coaches", icon: <MdSupervisedUserCircle className="w-5 h-5" /> },
    { name: "Financial Reports", path: "/dashboard/financial", icon: <MdBarChart className="w-5 h-5" /> },
    { name: "Payment & Payout", path: "/dashboard/payout", icon: <MdCreditCard className="w-5 h-5" /> },
    { name: "Bidding Management", path: "/dashboard/bidding", icon: <MdGavel className="w-5 h-5" /> },
    { name: "Reports & Moderation", path: "/dashboard/reports", icon: <MdFlag className="w-5 h-5" /> },
    { name: "Marketing Analytics", path: "/dashboard/marketing-analytics", icon: <MdStackedLineChart className="w-5 h-5" /> },
    { name: "Analytics & Insights", path: "/dashboard/analytics", icon: <MdAnalytics className="w-5 h-5" /> },
    { name: "AI Control Panel", path: "/dashboard/ai", icon: <MdSmartToy className="w-5 h-5" /> },
    { name: "Notifications", path: "/dashboard/notifications", icon: <MdNotifications className="w-5 h-5" /> },
    { name: "Settings", path: "/dashboard/settings", icon: <MdSettings className="w-5 h-5" /> },
  ];

  const handleSignOut = () => {
    router.push("/");
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground font-sans">
      {/* Mobile Drawer Overlay Backdrop */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm md:hidden"
        />
      )}

      {/* Sidebar navigation */}
      <aside
        className={`
          fixed top-0 bottom-0 left-0 z-40 flex flex-col w-[260px] text-white transition-transform duration-300 ease-in-out bg-sidebar-gradient shadow-sidebar
          md:translate-x-0
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Sidebar Header with Large Gold Logo and Collapse Arrow */}
        <div className="flex flex-col items-center justify-center pt-8 pb-4 relative">
          <div className="relative w-28 h-28 rounded-full overflow-hidden border border-[#b5945b]/80 p-0.5 flex items-center justify-center bg-black/10">
            <Image
              src="/logo.png"
              alt="SB2 Logo"
              width={100}
              height={100}
              className="object-cover rounded-full"
            />
          </div>

          {/* Toggle Arrow (Only visible under md) */}
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Collapse sidebar"
          >
            <MdChevronLeft className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Scrollable Navigation Items */}
        <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.path || (item.path !== "/dashboard" && pathname.startsWith(item.path));
            return (
              <button
                key={item.name}
                onClick={() => {
                  setIsSidebarOpen(false);
                  router.push(item.path);
                }}
                className={`
                  flex items-center gap-3 w-full px-4 py-2.5 text-[14px] font-medium rounded-lg transition-all duration-150 text-left cursor-pointer
                  ${
                    isActive
                      ? "bg-primary text-white shadow-md font-semibold"
                      : "text-sidebar-text hover:text-white hover:bg-white/5"
                  }
                `}
              >
                {item.icon}
                <span>{item.name}</span>
              </button>
            );
          })}

          {/* Sign Out Button (Highlighted in soft red) */}
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 w-full px-4 py-2.5 text-[14px] font-medium rounded-lg text-[#f87171] hover:text-red-300 hover:bg-white/5 transition-all text-left cursor-pointer"
          >
            <MdLogout className="w-5 h-5 text-[#f87171]" />
            <span>Sign Out</span>
          </button>
        </nav>

        {/* User profile section at the bottom (Borderless, matching mockup background) */}
        <div className="p-6 bg-transparent">
          <div className="flex items-center gap-3">
            <div className="relative w-11 h-11 rounded-full overflow-hidden border border-white/20">
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt="Admin Avatar"
                className="object-cover w-full h-full"
              />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-semibold text-white truncate">Admin User</span>
              <span className="text-xs text-white/50 truncate">admin@gmail.com</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content body */}
      <div className="flex flex-col flex-1 min-w-0 md:pl-[260px]">
        {/* Main Content Header */}
        <header className="flex items-center justify-between bg-background px-6 py-4 sticky top-0 z-20">
          <div className="flex items-center gap-4 min-w-0">
            {/* Mobile Sidebar Hamburger Trigger */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 -ml-2 rounded-xl text-foreground hover:bg-card transition-colors cursor-pointer"
              aria-label="Toggle sidebar"
            >
              <MdMenu className="w-6 h-6 text-slate-800" />
            </button>

            <div className="flex flex-col min-w-0">
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 truncate">
                {headerContent.title}
              </h1>
              <p className="text-xs md:text-sm text-foreground/80 truncate">
                {headerContent.description}
              </p>
            </div>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-4">
            {/* Notification Bell */}
            <button className="relative p-2 rounded-full hover:bg-card transition-colors text-foreground/80 hover:text-foreground cursor-pointer">
              <MdNotifications className="w-6 h-6 text-slate-800" />
              {/* Notification badge dot */}
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-primary rounded-full ring-2 ring-white animate-pulse" />
            </button>

            {/* Profile Avatar */}
            <div className="relative w-9 h-9 rounded-full overflow-hidden border border-border">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100"
                alt="Profile Avatar"
                className="object-cover w-full h-full"
              />
            </div>
          </div>
        </header>

        {/* Content Page Section */}
        <main className="flex-1 p-6 md:p-8 bg-background overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
