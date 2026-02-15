"use client";

import React, { createContext, useContext, useReducer, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ROLE_CONFIGS, MOCK_USERS } from "@/lib/constants";
import type { UserRole } from "@/lib/constants";
import type { AppNotification } from "@/lib/types";

// === State ===

export interface AppState {
  activeRole: UserRole;
  currentUser: {
    id: string;
    name: string;
    email: string;
    orgName: string;
  };
  notifications: AppNotification[];
  sidebarOpen: boolean;
}

const initialState: AppState = {
  activeRole: "facility",
  currentUser: MOCK_USERS.facility,
  notifications: [],
  sidebarOpen: true,
};

// === Actions ===

export type AppAction =
  | { type: "SWITCH_ROLE"; payload: UserRole }
  | { type: "ADD_NOTIFICATION"; payload: AppNotification }
  | { type: "DISMISS_NOTIFICATION"; payload: string }
  | { type: "MARK_NOTIFICATION_READ"; payload: string }
  | { type: "TOGGLE_SIDEBAR" }
  | { type: "SET_SIDEBAR"; payload: boolean };

// === Reducer ===

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "SWITCH_ROLE":
      return {
        ...state,
        activeRole: action.payload,
        currentUser: MOCK_USERS[action.payload],
        sidebarOpen: true,
      };

    case "ADD_NOTIFICATION":
      return {
        ...state,
        notifications: [action.payload, ...state.notifications].slice(0, 50),
      };

    case "DISMISS_NOTIFICATION":
      return {
        ...state,
        notifications: state.notifications.filter((n) => n.id !== action.payload),
      };

    case "MARK_NOTIFICATION_READ":
      return {
        ...state,
        notifications: state.notifications.map((n) =>
          n.id === action.payload ? { ...n, read: true } : n
        ),
      };

    case "TOGGLE_SIDEBAR":
      return { ...state, sidebarOpen: !state.sidebarOpen };

    case "SET_SIDEBAR":
      return { ...state, sidebarOpen: action.payload };

    default:
      return state;
  }
}

// === Context ===

interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  switchRole: (role: UserRole) => void;
  roleConfig: (typeof ROLE_CONFIGS)[UserRole];
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const router = useRouter();

  const switchRole = useCallback(
    (role: UserRole) => {
      dispatch({ type: "SWITCH_ROLE", payload: role });
      router.push(ROLE_CONFIGS[role].basePath);
    },
    [router]
  );

  const roleConfig = ROLE_CONFIGS[state.activeRole];

  return (
    <AppContext.Provider value={{ state, dispatch, switchRole, roleConfig }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error("useAppContext must be used within AppProvider");
  }
  return ctx;
}
