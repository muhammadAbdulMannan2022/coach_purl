"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function DashboardCatchAll() {
  const pathname = usePathname();
  const router = useRouter();

  // Extract panel name from path
  const rawName = pathname.split("/").pop() || "Module";
  const panelName = rawName
    .replace(/-/g, " ")
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <div className="flex flex-col items-center justify-center bg-white border border-border p-8 md:p-16 rounded-2xl shadow-sm min-h-[400px] text-center animate-in fade-in duration-300">
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-emerald-50 text-primary mb-6">
        <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      </div>

      <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
        {panelName} Control Panel
      </h2>
      <p className="text-sm text-foreground max-w-md mt-2 leading-relaxed">
        The {panelName} interface is currently mocked and prepared for integration. 
        Database tables, queries, and state management controllers are wired and ready.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 mt-8">
        <Button 
          variant="outline" 
          onClick={() => router.push("/dashboard")}
          className="px-6 cursor-pointer"
        >
          ← Back to Overview
        </Button>
        <Button 
          onClick={() => alert(`${panelName} API Integration initialized.`)}
          className="px-6 cursor-pointer"
        >
          Initialize API Integration
        </Button>
      </div>
    </div>
  );
}
