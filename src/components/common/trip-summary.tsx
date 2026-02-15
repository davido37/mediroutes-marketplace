"use client";

import { TripRequest } from "@/lib/types";
import { formatDate, formatTime } from "@/lib/utils";
import { Badge } from "./badge";

interface TripSummaryProps {
  trip: TripRequest;
  compact?: boolean;
}

export function TripSummary({ trip, compact = false }: TripSummaryProps) {
  return (
    <div className="rounded-lg border border-border bg-white p-4">
      {!compact && (
        <h3 className="text-sm font-semibold text-text-primary mb-3">
          Trip Details
        </h3>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-text-muted mb-1">Patient</p>
          <p className="font-medium">
            {trip.patient.firstName} {trip.patient.lastName}
          </p>
          <p className="text-text-secondary text-xs">
            ID: {trip.patient.memberId}
          </p>
        </div>

        <div>
          <p className="text-text-muted mb-1">Date & Time</p>
          <p className="font-medium">{formatDate(trip.requestedDate)}</p>
          <p className="text-text-secondary text-xs">
            Requested: {formatTime(trip.requestedTime)}
          </p>
        </div>

        <div>
          <p className="text-text-muted mb-1">Pickup</p>
          <p className="font-medium">{trip.pickup.label}</p>
          <p className="text-text-secondary text-xs">
            {trip.pickup.street}, {trip.pickup.city}, {trip.pickup.state}{" "}
            {trip.pickup.zip}
          </p>
        </div>

        <div>
          <p className="text-text-muted mb-1">Dropoff</p>
          <p className="font-medium">{trip.dropoff.label}</p>
          <p className="text-text-secondary text-xs">
            {trip.dropoff.street}, {trip.dropoff.city}, {trip.dropoff.state}{" "}
            {trip.dropoff.zip}
          </p>
        </div>
      </div>

      {!compact && (
        <div className="mt-3 flex flex-wrap gap-2">
          <Badge variant="brand">{trip.constraints.mobilityType}</Badge>
          {trip.constraints.needsEscort && (
            <Badge variant="info">
              Escort ({trip.constraints.escortCount})
            </Badge>
          )}
          {trip.constraints.specialNeeds.map((need) => (
            <Badge key={need} variant="warning">
              {need}
            </Badge>
          ))}
          <Badge variant="default">{trip.tripType.replace("_", " ")}</Badge>
          {trip.willCall && <Badge variant="purple">Will-Call</Badge>}
          {trip.fundingSource && (
            <Badge variant="muted">{trip.fundingSource.replace("_", " ")}</Badge>
          )}
        </div>
      )}
    </div>
  );
}
