"use client";

import { TripFlowProvider } from "@/hooks/trip-flow-context";

export default function FacilityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <TripFlowProvider>{children}</TripFlowProvider>;
}
