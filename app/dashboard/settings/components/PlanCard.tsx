"use client";

import * as React from "react";
import { MdCheck, MdAutoAwesome } from "react-icons/md";
import { Button } from "@/components/ui/button";

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

interface PlanCardProps {
  plan: PricingPlan;
  onToggleActive: (planId: string) => void;
  onOpenEdit: (plan: PricingPlan) => void;
}

export default function PlanCard({ plan, onToggleActive, onOpenEdit }: PlanCardProps) {
  const hasBadge = plan.badge;

  return (
    <div
      className={`
        bg-white border p-6 rounded-2xl flex flex-col relative transition-all duration-300 hover:shadow-lg hover:-translate-y-1 aspect-4/5
        ${hasBadge ? "border-primary ring-1 ring-primary/20 pt-16 shadow-md" : "border-border shadow-sm hover:border-primary/40"}
      `}
    >
      {/* Dynamic Upper Accent Badge */}
      {hasBadge && (
        <div className="absolute top-0 inset-x-0 bg-primary text-white text-xs font-bold py-3 px-3 text-center rounded-t-xl uppercase tracking-wider">
          {plan.badge}
        </div>
      )}

      {/* Plan Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="text-lg font-extrabold text-slate-800 font-sans tracking-tight">
            {plan.name}
          </h4>
          <div className="flex items-baseline gap-1 mt-1.5">
            <span className="text-3xl font-black text-slate-800 font-sans tracking-tight">
              ${plan.price}
            </span>
            <span className="text-xs text-foreground font-semibold font-sans">
              /{plan.billingCycle}
            </span>
          </div>
        </div>

        {/* Dynamic Status Toggle */}
        <button
          onClick={() => onToggleActive(plan.id)}
          className={`w-9 h-5 rounded-full transition-colors duration-200 relative focus:outline-none cursor-pointer ${
            plan.enabled ? "bg-primary" : "bg-border"
          }`}
          aria-label={`Toggle active status of ${plan.name} plan`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 ${
              plan.enabled ? "translate-x-4" : ""
            }`}
          />
        </button>
      </div>

      {/* AI Limit Premium Stats Box */}
      <div className="bg-primary/5 border border-primary/10 rounded-xl p-3.5 mb-5 flex items-center gap-3">
        <div className="bg-primary/10 p-1.5 rounded-lg text-primary shrink-0">
          <MdAutoAwesome className="w-4 h-4 text-primary animate-pulse" />
        </div>
        <div className="text-left min-w-0">
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block font-sans">
            AI Query Limit
          </span>
          <span className="text-sm font-extrabold text-slate-800 block font-sans truncate">
            {plan.queryLimit.toLocaleString()} <span className="text-[10px] font-semibold text-foreground">/ month</span>
          </span>
        </div>
      </div>

      {/* Features Checklist */}
      <ul className="space-y-3 mb-6 flex-1">
        {plan.features.map((feature, idx) => (
          <li
            key={idx}
            className={`flex items-start gap-2.5 text-xs font-medium font-sans ${
              feature.active ? "text-slate-700" : "text-slate-400 line-through"
            }`}
          >
            {feature.active ? (
              <div className="bg-primary/15 rounded-full p-0.5 shrink-0 mt-0.5">
                <MdCheck className="w-3 h-3 text-primary" />
              </div>
            ) : (
              <span className="w-4 h-4 text-slate-300 shrink-0 text-center select-none font-bold mt-0.5">•</span>
            )}
            <span>{feature.name}</span>
          </li>
        ))}
      </ul>

      {/* Edit Trigger Button */}
      <Button
        onClick={() => onOpenEdit(plan)}
        variant={hasBadge ? "default" : "outline"}
        size="sm"
        className="w-full font-bold mt-auto h-10 rounded-xl flex items-center justify-center gap-1.5"
      >
        <span>Edit Plan</span>
      </Button>
    </div>
  );
}
