"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/page-header";
import { Card } from "@/components/common/card";
import { Button } from "@/components/common/button";
import { Badge } from "@/components/common/badge";

type FilterLOS = "all" | "ambulatory" | "wheelchair" | "stretcher" | "bariatric";

const marketplaceTrips = [
  {
    id: "MKT-2290",
    los: "Wheelchair",
    losBadge: "brand" as const,
    pickup: "Downtown Medical Plaza",
    pickupAddress: "3800 N Central Ave, Phoenix, AZ",
    dropoff: "Sunrise Senior Living",
    dropoffAddress: "9201 E Mountain View Rd, Scottsdale, AZ",
    distance: 8.2,
    suggestedPrice: 58.0,
    floorPrice: 42.0,
    currentBest: null as number | null,
    postedBy: "Valley Medical Center",
    appointmentTime: "3:30 PM",
    expiresIn: "42 min",
    urgent: false,
    specialNeeds: ["wheelchair_ramp"],
  },
  {
    id: "MKT-2288",
    los: "Stretcher",
    losBadge: "danger" as const,
    pickup: "Valley General Hospital",
    pickupAddress: "1111 E McDowell Rd, Phoenix, AZ",
    dropoff: "Home - 2200 Elm Ave",
    dropoffAddress: "2200 Elm Ave, Tempe, AZ",
    distance: 14.5,
    suggestedPrice: 195.0,
    floorPrice: 150.0,
    currentBest: 180.0,
    postedBy: "St. Joseph's Hospital",
    appointmentTime: "2:00 PM",
    expiresIn: "18 min",
    urgent: true,
    specialNeeds: ["stretcher", "bariatric"],
  },
  {
    id: "MKT-2285",
    los: "Ambulatory",
    losBadge: "success" as const,
    pickup: "Oak Street Dialysis",
    pickupAddress: "4545 E Oak St, Phoenix, AZ",
    dropoff: "Home - 540 Pine Rd",
    dropoffAddress: "540 Pine Rd, Glendale, AZ",
    distance: 5.1,
    suggestedPrice: 32.0,
    floorPrice: 22.0,
    currentBest: 28.0,
    postedBy: "Banner Health Network",
    appointmentTime: "5:00 PM",
    expiresIn: "1h 15m",
    urgent: false,
    specialNeeds: ["oxygen"],
  },
  {
    id: "MKT-2282",
    los: "Wheelchair",
    losBadge: "brand" as const,
    pickup: "Kaiser Permanente Central",
    pickupAddress: "2600 E Camelback Rd, Phoenix, AZ",
    dropoff: "Home - 1210 W Baseline",
    dropoffAddress: "1210 W Baseline Rd, Tempe, AZ",
    distance: 11.3,
    suggestedPrice: 72.0,
    floorPrice: 55.0,
    currentBest: null,
    postedBy: "Valley Medical Center",
    appointmentTime: "4:45 PM",
    expiresIn: "2h 10m",
    urgent: false,
    specialNeeds: ["wheelchair_ramp", "escort"],
  },
  {
    id: "MKT-2279",
    los: "Ambulatory",
    losBadge: "success" as const,
    pickup: "Mayo Clinic Phoenix",
    pickupAddress: "5777 E Mayo Blvd, Phoenix, AZ",
    dropoff: "Home - 8800 N Scottsdale Rd",
    dropoffAddress: "8800 N Scottsdale Rd, Scottsdale, AZ",
    distance: 6.8,
    suggestedPrice: 38.0,
    floorPrice: 25.0,
    currentBest: 35.0,
    postedBy: "Banner Health Network",
    appointmentTime: "5:30 PM",
    expiresIn: "3h 5m",
    urgent: false,
    specialNeeds: [],
  },
];

export default function ProviderMarketplace() {
  const [filter, setFilter] = useState<FilterLOS>("all");
  const [acceptedIds, setAcceptedIds] = useState<Set<string>>(new Set());

  const filtered = filter === "all"
    ? marketplaceTrips
    : marketplaceTrips.filter((t) => t.los.toLowerCase() === filter);

  const handleAccept = (id: string) => {
    setAcceptedIds((prev) => new Set(prev).add(id));
  };

  return (
    <div>
      <PageHeader
        title="Marketplace Opportunities"
        description="Browse and accept open trip opportunities from the MediRoutes marketplace."
        actions={
          <div className="flex items-center gap-2">
            <Badge variant="info">{marketplaceTrips.length} Available</Badge>
            <Badge variant="success">{acceptedIds.size} Accepted</Badge>
          </div>
        }
      />

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        {(["all", "ambulatory", "wheelchair", "stretcher", "bariatric"] as FilterLOS[]).map(
          (f) => (
            <button
              key={f}
              className={`px-3 py-1.5 text-xs rounded-lg border transition-colors capitalize ${
                filter === f
                  ? "bg-brand text-white border-brand"
                  : "bg-white text-text-secondary border-border hover:bg-surface-muted"
              }`}
              onClick={() => setFilter(f)}
            >
              {f === "all" ? "All Types" : f}
            </button>
          )
        )}
      </div>

      {/* Trip Cards */}
      <div className="space-y-4">
        {filtered.map((trip) => {
          const isAccepted = acceptedIds.has(trip.id);
          return (
            <Card
              key={trip.id}
              className={isAccepted ? "border-success bg-success-light/20" : ""}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-semibold text-text-primary">{trip.id}</span>
                    <Badge variant={trip.losBadge}>{trip.los}</Badge>
                    {trip.urgent && <Badge variant="danger">Urgent</Badge>}
                    {isAccepted && <Badge variant="success">Accepted</Badge>}
                    <span className="text-xs text-text-muted">{trip.distance} mi</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm mb-3">
                    <div>
                      <p className="text-text-muted text-xs">Pickup</p>
                      <p className="text-text-primary font-medium">{trip.pickup}</p>
                      <p className="text-xs text-text-secondary">{trip.pickupAddress}</p>
                    </div>
                    <div>
                      <p className="text-text-muted text-xs">Dropoff</p>
                      <p className="text-text-primary font-medium">{trip.dropoff}</p>
                      <p className="text-xs text-text-secondary">{trip.dropoffAddress}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-text-secondary">
                    <span>Posted by: <strong>{trip.postedBy}</strong></span>
                    <span>Appt: <strong>{trip.appointmentTime}</strong></span>
                    {trip.specialNeeds.length > 0 && (
                      <span className="flex gap-1">
                        {trip.specialNeeds.map((need) => (
                          <Badge key={need} variant="warning">
                            {need.replace(/_/g, " ")}
                          </Badge>
                        ))}
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <p className="text-2xl font-bold text-text-primary">
                    ${trip.suggestedPrice.toFixed(2)}
                  </p>
                  <p className="text-xs text-text-muted">suggested price</p>
                  {trip.currentBest && (
                    <p className="text-xs text-text-secondary mt-1">
                      Current best: <strong>${trip.currentBest.toFixed(2)}</strong>
                    </p>
                  )}
                  <p className="text-xs text-text-muted mt-1">
                    Floor: ${trip.floorPrice.toFixed(2)}
                  </p>
                  <p
                    className={`text-xs font-medium mt-2 ${
                      trip.urgent ? "text-danger" : "text-text-muted"
                    }`}
                  >
                    {trip.urgent && "⏱ "}{trip.expiresIn} left
                  </p>
                  <div className="mt-3 flex flex-col gap-1.5">
                    {!isAccepted ? (
                      <>
                        <Button size="sm" onClick={() => handleAccept(trip.id)}>
                          Accept at ${trip.suggestedPrice.toFixed(0)}
                        </Button>
                        <Button variant="secondary" size="sm">
                          Counter Offer
                        </Button>
                      </>
                    ) : (
                      <Badge variant="success" className="text-center">
                        Accepted
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
