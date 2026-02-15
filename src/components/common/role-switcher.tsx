"use client";

import { useState, useRef, useEffect } from "react";
import { useAppContext } from "@/hooks/use-app-context";
import { ROLE_CONFIGS } from "@/lib/constants";
import type { UserRole } from "@/lib/constants";

export function RoleSwitcher() {
  const { state, switchRole, roleConfig } = useAppContext();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const roles = Object.values(ROLE_CONFIGS);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-lg border border-border bg-white px-3 py-2 text-sm font-medium text-text-primary hover:bg-surface-muted transition-colors"
      >
        <span>{roleConfig.icon}</span>
        <span className="hidden sm:inline">{roleConfig.shortLabel}</span>
        <svg
          className={`h-4 w-4 text-text-muted transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-1 z-50 w-72 rounded-xl border border-border bg-white shadow-lg py-2">
          <p className="px-4 py-1.5 text-xs font-semibold text-text-muted uppercase tracking-wide">
            Switch Portal
          </p>
          {roles.map((role) => (
            <button
              key={role.id}
              onClick={() => {
                switchRole(role.id);
                setOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-surface-muted transition-colors ${
                state.activeRole === role.id ? "bg-surface-muted" : ""
              }`}
            >
              <span className={`flex h-9 w-9 items-center justify-center rounded-lg text-lg ${role.bgColor}`}>
                {role.icon}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary">{role.label}</p>
                <p className="text-xs text-text-muted truncate">{role.description}</p>
              </div>
              {state.activeRole === role.id && (
                <span className="text-brand text-sm">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
