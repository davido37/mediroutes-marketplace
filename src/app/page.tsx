"use client";

import { useAppContext } from "@/hooks/use-app-context";
import { ROLE_CONFIGS } from "@/lib/constants";
import type { UserRole } from "@/lib/constants";
import { VendorLogo } from "@/components/common/vendor-logo";
import { StatCard } from "@/components/common/stat-card";

export default function HomePage() {
  const { state, switchRole } = useAppContext();
  const roles = Object.values(ROLE_CONFIGS);

  return (
    <div>
      {/* Welcome header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary">
          Welcome to NEMT Command Central
        </h1>
        <p className="mt-1 text-sm text-text-muted">
          The unified booking, pricing, and marketplace platform for non-emergency medical transportation.
          Select a portal below to get started.
        </p>
      </div>

      {/* Platform stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <StatCard label="Active Trips" value="2,847" change="+12% this week" changeType="positive" icon="🚗" />
        <StatCard label="Marketplace Trips" value="438" change="67 open" changeType="neutral" icon="🏪" />
        <StatCard label="Network Providers" value="1,247" change="+23 this month" changeType="positive" icon="🚐" />
        <StatCard label="Avg Cost/Trip" value="$34.20" change="-3.2% vs last month" changeType="positive" icon="💰" />
      </div>

      {/* Portal selector grid */}
      <h2 className="text-lg font-semibold text-text-primary mb-4">Select Portal</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {roles.map((role) => (
          <button
            key={role.id}
            onClick={() => switchRole(role.id)}
            className={`flex flex-col items-start rounded-xl border-2 bg-white p-5 text-left transition-all hover:shadow-md ${
              state.activeRole === role.id
                ? "border-accent ring-1 ring-accent-lightest"
                : "border-border hover:border-accent-light"
            }`}
          >
            <span className={`flex h-12 w-12 items-center justify-center rounded-xl text-2xl ${role.bgColor}`}>
              {role.icon}
            </span>
            <h3 className="mt-3 text-base font-semibold text-text-primary">
              {role.label}
            </h3>
            <p className="mt-1 text-xs text-text-muted leading-relaxed">
              {role.description}
            </p>
            {state.activeRole === role.id && (
              <span className="mt-3 inline-flex items-center rounded-full bg-accent-lightest px-2.5 py-0.5 text-xs font-medium text-accent">
                Active
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Quick info */}
      <div className="mt-8 rounded-lg border border-border bg-white p-5">
        <h3 className="text-sm font-semibold text-text-primary mb-3">
          About NEMT Command Central
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-text-secondary">
          <div>
            <p className="font-medium text-text-primary mb-1">Multi-Source Comparison</p>
            <p>Compare options across your own fleet, TNCs (Uber/Lyft), and MediRoutes network providers in one view.</p>
          </div>
          <div>
            <p className="font-medium text-text-primary mb-1">ML-Powered Pricing</p>
            <p>Fair market rate suggestions powered by 100M+ historical NEMT trips with explainable AI.</p>
          </div>
          <div>
            <p className="font-medium text-text-primary mb-1">EHR Integration</p>
            <p>SMART on FHIR embedded booking within Epic and Oracle Health discharge workflows.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
