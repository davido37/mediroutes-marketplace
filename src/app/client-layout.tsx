"use client";

import { AppProvider, useAppContext } from "@/hooks/use-app-context";
import { RoleSwitcher } from "@/components/common/role-switcher";
import { SidebarNav } from "@/components/common/sidebar-nav";
import { NotificationBell } from "@/components/common/notification-bell";
import { VendorLogo } from "@/components/common/vendor-logo";
import { useDemoAuth } from "@/hooks/use-demo-auth";
import { LandingPage } from "@/components/landing-page";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, authenticate } = useDemoAuth();

  // Avoid hydration flash — wait for sessionStorage check
  if (isAuthenticated === null) return null;

  if (!isAuthenticated) {
    return <LandingPage onAuthenticate={authenticate} />;
  }

  return (
    <AppProvider>
      <AppShell>{children}</AppShell>
    </AppProvider>
  );
}

function AppShell({ children }: { children: React.ReactNode }) {
  const { state, dispatch, roleConfig } = useAppContext();

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      {/* Top Header */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-white px-4">
        <div className="flex items-center gap-4">
          {/* Hamburger for sidebar toggle */}
          <button
            onClick={() => dispatch({ type: "TOGGLE_SIDEBAR" })}
            className="flex items-center justify-center h-8 w-8 rounded-lg text-text-muted hover:bg-surface-muted transition-colors lg:hidden"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <VendorLogo vendor="mediroutes" size={28} />
            <div className="hidden sm:block">
              <h1 className="text-sm font-bold text-text-primary leading-tight">
                NEMT Command Central
              </h1>
              <p className="text-[10px] text-text-muted leading-tight">MediRoutes</p>
            </div>
          </div>

          <div className="h-6 w-px bg-border mx-1 hidden sm:block" />

          {/* Role Switcher */}
          <RoleSwitcher />
        </div>

        <div className="flex items-center gap-3">
          {/* Notifications */}
          <NotificationBell />

          {/* User info */}
          <div className="hidden md:flex items-center gap-2 pl-2 border-l border-border">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-white text-xs font-bold">
              {state.currentUser.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div className="hidden lg:block">
              <p className="text-xs font-medium text-text-primary leading-tight">
                {state.currentUser.name}
              </p>
              <p className="text-[10px] text-text-muted leading-tight">
                {state.currentUser.orgName || state.currentUser.email}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Body: Sidebar + Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`${
            state.sidebarOpen ? "w-56" : "w-0"
          } shrink-0 border-r border-border bg-white transition-all duration-200 overflow-hidden lg:w-56`}
        >
          <div className="w-56 px-3 py-2">
            {/* Portal label */}
            <div className={`flex items-center gap-2 px-3 py-2 mb-1 rounded-lg ${roleConfig.bgColor}`}>
              <span>{roleConfig.icon}</span>
              <span className={`text-xs font-semibold ${roleConfig.color}`}>
                {roleConfig.label}
              </span>
            </div>

            {/* Nav items */}
            <SidebarNav />
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6">
            {children}
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="shrink-0 border-t border-border bg-white px-4 py-1.5">
        <p className="text-[10px] text-text-muted text-center">
          NEMT Command Central — Prototype — Mock Data Only — MediRoutes v1.0
        </p>
      </footer>
    </div>
  );
}
