"use client";

import * as React from "react";
import { MdTrendingUp, MdPeopleOutline, MdAttachMoney } from "react-icons/md";

interface Feature {
  name: string;
  active: boolean;
}

interface PricingPlan {
  id: string;
  name: string;
  price: number;
  billingCycle: string;
  queryLimit: number;
  badge?: string;
  enabled: boolean;
  features: Feature[];
  userCount: number;
  revenue: number;
}

interface PlanAnalyticsProps {
  activeType: "User" | "Coach";
  plans: PricingPlan[];
}

export default function PlanAnalytics({ activeType, plans }: PlanAnalyticsProps) {
  const totalSubscribers = plans.reduce((sum, p) => sum + p.userCount, 0);
  const totalRevenue = plans.reduce((sum, p) => sum + p.revenue, 0);

  return (
    <div className="bg-white border border-border p-6 rounded-2xl shadow-sm flex flex-col transition-all duration-200 hover:shadow-md">
      <div className="flex items-center gap-2 mb-6">
        <div className="bg-primary/10 p-1.5 rounded-lg text-primary">
          <MdTrendingUp className="w-4 h-4" />
        </div>
        <h3 className="text-sm font-bold text-slate-800 tracking-tight font-sans">
          Plan Analytics & Metrics
        </h3>
      </div>

      {/* Aggregate Summaries Row */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="border border-border bg-card/40 rounded-xl p-4 flex items-center gap-3">
          <div className="bg-white border border-border p-2 rounded-lg text-slate-500 shadow-xs">
            <MdPeopleOutline className="w-5 h-5 text-primary" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-sans">
              Total Active {activeType}s
            </span>
            <span className="text-base font-extrabold text-slate-800 font-sans">
              {totalSubscribers.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="border border-border bg-card/40 rounded-xl p-4 flex items-center gap-3">
          <div className="bg-white border border-border p-2 rounded-lg text-slate-500 shadow-xs">
            <MdAttachMoney className="w-5 h-5 text-primary" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-sans">
              Total Revenue
            </span>
            <span className="text-base font-extrabold text-slate-800 font-sans">
              ${totalRevenue.toLocaleString()} <span className="text-[10px] font-semibold text-foreground">/ mo</span>
            </span>
          </div>
        </div>
      </div>

      {/* Breakdowns list */}
      <div className="border border-border rounded-xl p-5">
        <span className="text-xs font-bold text-slate-800 tracking-tight block mb-4 font-sans uppercase">
          Distribution & Revenue by Package
        </span>

        <div className="space-y-5">
          {plans.map((plan) => {
            const userProportion = totalSubscribers > 0 ? (plan.userCount / totalSubscribers) * 100 : 0;

            return (
              <div key={plan.id} className="space-y-2">
                <div className="flex justify-between items-baseline text-xs font-semibold">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-slate-800 font-bold font-sans">
                      {plan.name} Plan
                    </span>
                    <span className="text-foreground font-medium font-sans">
                      {plan.userCount.toLocaleString()} {activeType.toLowerCase()}s
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-primary font-extrabold font-sans">
                      ${plan.revenue.toLocaleString()}
                    </span>
                    <span className="text-foreground font-medium font-sans">
                      Monthly revenue
                    </span>
                  </div>
                </div>
                
                {/* Custom Progress bar container */}
                <div className="w-full bg-border/40 rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.max(userProportion, 5)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
