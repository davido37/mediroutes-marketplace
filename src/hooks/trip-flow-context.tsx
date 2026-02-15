"use client";

import React, { createContext, useContext } from "react";
import { useTripFlow, TripFlowState, TripFlowAction } from "./use-trip-flow";
import { FulfillmentOption, TripConstraints } from "@/lib/types";

interface TripFlowContextValue {
  state: TripFlowState;
  dispatch: React.Dispatch<TripFlowAction>;
  simulateSearch: (constraints: TripConstraints) => Promise<void>;
  confirmBooking: (option: FulfillmentOption) => Promise<void>;
}

const TripFlowContext = createContext<TripFlowContextValue | null>(null);

export function TripFlowProvider({ children }: { children: React.ReactNode }) {
  const tripFlow = useTripFlow();
  return (
    <TripFlowContext.Provider value={tripFlow}>
      {children}
    </TripFlowContext.Provider>
  );
}

export function useTripFlowContext(): TripFlowContextValue {
  const ctx = useContext(TripFlowContext);
  if (!ctx) {
    throw new Error("useTripFlowContext must be used within TripFlowProvider");
  }
  return ctx;
}
