"use client";

import * as React from "react";
import CommissionCard from "./components/CommissionCard";
import CategoryDropdown from "./components/CategoryDropdown";
import PlanCard from "./components/PlanCard";
import EditPlanModal from "./components/EditPlanModal";
import PlanAnalytics from "./components/PlanAnalytics";

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

export default function PlatformSettingsPage() {
  // Commission slider state
  const [commission, setCommission] = React.useState(20);

  // Type Selector: "User" vs "Coach"
  const [activeType, setActiveType] = React.useState<"User" | "Coach">("User");

  // Subscription Plan states for Users
  const [userPlans, setUserPlans] = React.useState<PricingPlan[]>([
    {
      id: "free",
      name: "Free",
      price: 0,
      billingCycle: "forever",
      queryLimit: 100,
      enabled: true,
      userCount: 3240,
      revenue: 0,
      features: [
        { name: "Basic support", active: true },
        { name: "Community access", active: true },
        { name: "Email updates", active: true },
      ],
    },
    {
      id: "premium",
      name: "Premium",
      price: 29,
      billingCycle: "monthly",
      queryLimit: 1000,
      badge: "Most Popular",
      enabled: true,
      userCount: 1234,
      revenue: 35786,
      features: [
        { name: "Priority support", active: true },
        { name: "Advanced analytics", active: true },
        { name: "Webinar access", active: true },
        { name: "API integration", active: true },
        { name: "Custom branding", active: true },
      ],
    },
    {
      id: "business",
      name: "Business",
      price: 99,
      billingCycle: "monthly",
      queryLimit: 5000,
      enabled: true,
      userCount: 333,
      revenue: 32967,
      features: [
        { name: "24/7 dedicated support", active: true },
        { name: "Advanced analytics & reports", active: true },
        { name: "All webinars included", active: true },
        { name: "Full API access", active: true },
        { name: "White-label options", active: true },
        { name: "Team collaboration", active: true },
        { name: "Custom integrations", active: true },
      ],
    },
  ]);

  // Subscription Plan states for Coaches
  const [coachPlans, setCoachPlans] = React.useState<PricingPlan[]>([
    {
      id: "free",
      name: "Free",
      price: 0,
      billingCycle: "forever",
      queryLimit: 100,
      enabled: true,
      userCount: 840,
      revenue: 0,
      features: [
        { name: "Basic support", active: true },
        { name: "Community access", active: true },
        { name: "Email updates", active: true },
      ],
    },
    {
      id: "premium",
      name: "Premium",
      price: 29,
      billingCycle: "monthly",
      queryLimit: 1000,
      badge: "Most Popular",
      enabled: true,
      userCount: 432,
      revenue: 12528,
      features: [
        { name: "Priority support", active: true },
        { name: "Advanced analytics", active: true },
        { name: "Webinar access", active: true },
        { name: "API integration", active: true },
        { name: "Custom branding", active: true },
      ],
    },
    {
      id: "business",
      name: "Business",
      price: 99,
      billingCycle: "monthly",
      queryLimit: 5000,
      enabled: true,
      userCount: 154,
      revenue: 15246,
      features: [
        { name: "24/7 dedicated support", active: true },
        { name: "Advanced analytics & reports", active: true },
        { name: "All webinars included", active: true },
        { name: "Full API access", active: true },
        { name: "White-label options", active: true },
        { name: "Team collaboration", active: true },
        { name: "Custom integrations", active: true },
      ],
    },
  ]);

  // Modal control states
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [editingPlan, setEditingPlan] = React.useState<PricingPlan | null>(null);

  // Get active plans list based on selected User/Coach dropdown type
  const activePlans = activeType === "User" ? userPlans : coachPlans;

  // Toggle active/inactive plan
  const handleTogglePlanActive = (planId: string) => {
    const updater = (prev: PricingPlan[]) =>
      prev.map(p => (p.id === planId ? { ...p, enabled: !p.enabled } : p));
    if (activeType === "User") {
      setUserPlans(updater);
    } else {
      setCoachPlans(updater);
    }
  };

  // Open edit modal for plan
  const handleOpenEditModal = (plan: PricingPlan) => {
    setEditingPlan(plan);
    setIsEditModalOpen(true);
  };

  // Save changes to state
  const handleSavePlanChanges = (updatedPlan: PricingPlan) => {
    const updater = (prev: PricingPlan[]) =>
      prev.map(p => (p.id === updatedPlan.id ? updatedPlan : p));

    if (activeType === "User") {
      setUserPlans(updater);
    } else {
      setCoachPlans(updater);
    }

    setIsEditModalOpen(false);
    setEditingPlan(null);
  };

  return (
    <div className="space-y-6 font-sans animate-in fade-in duration-300">
      
      {/* Pricing & Commissions slider card */}
      <CommissionCard commission={commission} setCommission={setCommission} />

      {/* Header category selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
        <div>
          <h2 className="text-lg font-bold text-slate-800 tracking-tight font-sans">
            Subscription Packages
          </h2>
          <p className="text-xs text-foreground font-medium mt-0.5 font-sans">
            Configure default and premium pricing plans and query allocations.
          </p>
        </div>
        <CategoryDropdown activeType={activeType} onSelectType={setActiveType} />
      </div>

      {/* Pricing Plans Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {activePlans.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            onToggleActive={handleTogglePlanActive}
            onOpenEdit={handleOpenEditModal}
          />
        ))}
      </div>

      {/* Plan Analytics */}
      <PlanAnalytics activeType={activeType} plans={activePlans} />

      {/* Edit Plan Modal */}
      {editingPlan && (
        <EditPlanModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingPlan(null);
          }}
          plan={editingPlan}
          onSave={handleSavePlanChanges}
        />
      )}

    </div>
  );
}
