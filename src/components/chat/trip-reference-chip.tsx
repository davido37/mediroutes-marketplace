"use client";

import Link from "next/link";
import type { TripReference } from "@/lib/chat-types";

interface TripReferenceChipProps {
  reference: TripReference;
}

export function TripReferenceChip({ reference }: TripReferenceChipProps) {
  return (
    <Link
      href={`/provider/trips/${reference.tripId}`}
      className="inline-flex items-center gap-1 rounded-full bg-accent-lightest text-accent px-2 py-0.5 text-xs font-medium hover:bg-accent hover:text-white transition-colors"
      onClick={(e) => e.stopPropagation()}
    >
      🚗 {reference.label}
    </Link>
  );
}
