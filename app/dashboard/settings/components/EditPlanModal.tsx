"use client";

import * as React from "react";
import { Modal } from "@/components/ui/modal";
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

interface EditPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: PricingPlan;
  onSave: (updatedPlan: PricingPlan) => void;
}

export default function EditPlanModal({ isOpen, onClose, plan, onSave }: EditPlanModalProps) {
  const [name, setName] = React.useState(plan.name);
  const [price, setPrice] = React.useState(plan.price);
  const [billingCycle, setBillingCycle] = React.useState(plan.billingCycle);
  const [queryLimit, setQueryLimit] = React.useState(plan.queryLimit);
  const [badge, setBadge] = React.useState(plan.badge || "");
  const [features, setFeatures] = React.useState<Feature[]>([]);

  // Sync state with props when modal opens or plan changes
  React.useEffect(() => {
    setName(plan.name);
    setPrice(plan.price);
    setBillingCycle(plan.billingCycle);
    setQueryLimit(plan.queryLimit);
    setBadge(plan.badge || "");
    setFeatures(JSON.parse(JSON.stringify(plan.features))); // Deep copy
  }, [plan, isOpen]);

  const handleToggleFeature = (index: number) => {
    setFeatures((prev) =>
      prev.map((feat, idx) => (idx === index ? { ...feat, active: !feat.active } : feat))
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...plan,
      name,
      price: Number(price),
      billingCycle,
      queryLimit: Number(queryLimit),
      badge: badge.trim() || undefined,
      features,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} showCloseButton={true} size="md">
      <form onSubmit={handleSave} className="font-sans text-left p-1 space-y-5">
        <div>
          <h3 className="text-xl font-bold text-slate-800 tracking-tight leading-snug">
            Edit Plan
          </h3>
          <p className="text-xs text-foreground mt-0.5 font-medium">
            Modify settings and features for the <span className="font-bold text-primary">{plan.name}</span> plan.
          </p>
        </div>

        {/* Plan Name */}
        <div className="flex flex-col">
          <label className="text-xs font-bold text-slate-700 mb-1.5">
            Plan Name
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-white border border-border rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all h-9 font-sans"
          />
        </div>

        {/* Price & Billing Cycle */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="text-xs font-bold text-slate-700 mb-1.5">
              Price ($)
            </label>
            <input
              type="number"
              required
              min="0"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full bg-white border border-border rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all h-9 font-sans"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-bold text-slate-700 mb-1.5">
              Billing Cycle
            </label>
            <input
              type="text"
              required
              value={billingCycle}
              onChange={(e) => setBillingCycle(e.target.value)}
              className="w-full bg-white border border-border rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all h-9 font-sans"
            />
          </div>
        </div>

        {/* AI Query Limit */}
        <div className="flex flex-col">
          <label className="text-xs font-bold text-slate-700 mb-1.5">
            AI Query Limit (per month)
          </label>
          <input
            type="number"
            required
            min="0"
            value={queryLimit}
            onChange={(e) => setQueryLimit(Number(e.target.value))}
            className="w-full bg-white border border-border rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all h-9 font-sans"
          />
        </div>

        {/* Badge Label */}
        <div className="flex flex-col">
          <label className="text-xs font-bold text-slate-700 mb-1.5">
            Badge/Label Name
          </label>
          <input
            type="text"
            placeholder="e.g. Most Popular"
            value={badge}
            onChange={(e) => setBadge(e.target.value)}
            className="w-full bg-white border border-border rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all h-9 font-sans"
          />
        </div>

        {/* Features Toggle List */}
        <div className="flex flex-col">
          <span className="text-xs font-bold text-slate-700 mb-2">
            Included Features
          </span>
          <div className="space-y-2.5 max-h-[160px] overflow-y-auto pr-1">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center justify-between border border-border rounded-xl p-2.5 bg-background/50"
              >
                <span className="text-xs font-semibold text-slate-700 font-sans truncate pr-2">
                  {feature.name}
                </span>
                
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400 font-bold uppercase font-sans">
                    {feature.active ? "Active" : "Inactive"}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleToggleFeature(index)}
                    className={`w-9 h-5 rounded-full transition-colors duration-200 relative focus:outline-none cursor-pointer ${
                      feature.active ? "bg-primary" : "bg-border"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 ${
                        feature.active ? "translate-x-4" : ""
                      }`}
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Actions using pre-built Button UI */}
        <div className="flex gap-4 justify-between pt-2">
          <Button
            type="submit"
            className="flex-1 font-bold h-11"
            size="md"
          >
            Save Changes
          </Button>
          <Button
            type="button"
            variant="outline"
            className="flex-1 font-bold h-11"
            size="md"
            onClick={onClose}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
}
