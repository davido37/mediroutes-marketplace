import {
  FulfillmentOption,
  FleetOption,
  TNCOption,
  MarketplaceOption,
  TripConstraints,
  TripRequest,
  Address,
  SortCriteria,
  CostingConfig,
} from "./types";

// ============================================================
// Mileage
// ============================================================

export function calculateMileage(pickup: Address, dropoff: Address): number {
  const R = 3958.8; // Earth radius in miles
  const dLat = ((dropoff.lat - pickup.lat) * Math.PI) / 180;
  const dLng = ((dropoff.lng - pickup.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((pickup.lat * Math.PI) / 180) *
      Math.cos((dropoff.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const straightLine = R * c;
  return straightLine * 1.3;
}

// ============================================================
// Formatting
// ============================================================

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export function formatETA(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hrs} hr ${mins} min` : `${hrs} hr`;
}

export function formatTime(isoOrTime: string): string {
  if (!isoOrTime) return "\u2014";
  try {
    const date = isoOrTime.includes("T") ? new Date(isoOrTime) : null;
    if (date) {
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    }
    const [h, m] = isoOrTime.split(":").map(Number);
    const period = h >= 12 ? "PM" : "AM";
    const hour12 = h % 12 || 12;
    return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
  } catch {
    return isoOrTime;
  }
}

export function formatDate(iso: string): string {
  if (!iso) return "\u2014";
  const date = new Date(iso + "T00:00:00");
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// ============================================================
// Option helpers
// ============================================================

export function getOptionLabel(option: FulfillmentOption): string {
  switch (option.type) {
    case "fleet":
      return option.feasible
        ? `Fleet \u2014 ${option.driverName} (${option.vehicleType})`
        : "Fleet \u2014 Not Feasible";
    case "tnc":
      return `${option.providerDisplayName} ${option.serviceLevel}`;
    case "marketplace":
      return option.providerName;
  }
}

export function getOptionCost(option: FulfillmentOption): number {
  switch (option.type) {
    case "fleet":
      return option.internalCost;
    case "tnc":
      return option.cost;
    case "marketplace":
      return option.cost;
  }
}

export function getOptionETA(option: FulfillmentOption): number {
  switch (option.type) {
    case "fleet":
      return option.additionalMinutes || 25;
    case "tnc":
      return option.etaMinutes;
    case "marketplace":
      return option.etaMinutes;
  }
}

// ============================================================
// Compatibility
// ============================================================

export function isCompatible(
  option: FulfillmentOption,
  constraints: TripConstraints
): boolean {
  if (option.type === "fleet") {
    return option.feasible;
  }

  const caps = option.type === "tnc" ? option.capabilities : option.capabilities;

  if (constraints.mobilityType === "wheelchair") {
    if (!caps.includes("wheelchair_accessible")) return false;
  }
  if (constraints.mobilityType === "stretcher") {
    if (!caps.includes("stretcher")) return false;
  }
  if (constraints.specialNeeds.includes("oxygen")) {
    if (option.type === "tnc" && !caps.includes("oxygen")) return false;
  }
  if (constraints.specialNeeds.includes("bariatric")) {
    if (!caps.includes("bariatric")) return false;
  }

  return true;
}

// ============================================================
// Scoring
// ============================================================

export function scoreOption(
  option: FulfillmentOption,
  constraints: TripConstraints
): number {
  if (!isCompatible(option, constraints)) return 0;
  if (option.type === "fleet" && !option.feasible) return 0;

  const cost = getOptionCost(option);
  const eta = getOptionETA(option);

  const maxCost = 40;
  const maxETA = 35;
  const costScore = 1 - Math.min(cost / maxCost, 1);
  const etaScore = 1 - Math.min(eta / maxETA, 1);

  let reliabilityScore = 0.7;
  if (option.type === "fleet") reliabilityScore = 0.9;
  if (option.type === "marketplace") reliabilityScore = option.reliabilityScore / 100;

  const fleetBonus = option.type === "fleet" ? 0.1 : 0;

  const disruptionPenalty =
    option.type === "fleet" ? option.tripsImpacted.length * 0.05 : 0;

  return (
    costScore * 0.3 +
    etaScore * 0.25 +
    reliabilityScore * 0.3 +
    fleetBonus -
    disruptionPenalty +
    0.15
  );
}

// ============================================================
// Sorting
// ============================================================

export function sortOptions(
  options: FulfillmentOption[],
  criteria: SortCriteria,
  constraints: TripConstraints
): FulfillmentOption[] {
  const sorted = [...options];

  switch (criteria) {
    case "cheapest":
      sorted.sort((a, b) => {
        const compA = isCompatible(a, constraints) ? 0 : 1;
        const compB = isCompatible(b, constraints) ? 0 : 1;
        if (compA !== compB) return compA - compB;
        return getOptionCost(a) - getOptionCost(b);
      });
      break;
    case "soonest":
      sorted.sort((a, b) => {
        const compA = isCompatible(a, constraints) ? 0 : 1;
        const compB = isCompatible(b, constraints) ? 0 : 1;
        if (compA !== compB) return compA - compB;
        return getOptionETA(a) - getOptionETA(b);
      });
      break;
    case "least_disruption":
      sorted.sort((a, b) => {
        const compA = isCompatible(a, constraints) ? 0 : 1;
        const compB = isCompatible(b, constraints) ? 0 : 1;
        if (compA !== compB) return compA - compB;
        const disA = a.type === "fleet" ? a.tripsImpacted.length : 0;
        const disB = b.type === "fleet" ? b.tripsImpacted.length : 0;
        return disA - disB;
      });
      break;
    case "recommended":
    default:
      sorted.sort(
        (a, b) =>
          scoreOption(b, constraints) - scoreOption(a, constraints)
      );
      break;
  }

  return sorted;
}

// ============================================================
// Badge assignment
// ============================================================

export type OptionBadge = "recommended" | "cheapest" | "fastest";

function pickFirst(
  sorted: FulfillmentOption[],
  claimed: Set<string>
): FulfillmentOption | null {
  for (const opt of sorted) {
    if (!claimed.has(opt.id)) return opt;
  }
  return null;
}

export function getTopOptions(
  options: FulfillmentOption[],
  constraints: TripConstraints
): { option: FulfillmentOption; badge: OptionBadge }[] {
  const compatible = options.filter((o) => isCompatible(o, constraints));
  if (compatible.length === 0) return [];

  const claimed = new Set<string>();
  const result: { option: FulfillmentOption; badge: OptionBadge }[] = [];

  const byScore = [...compatible].sort(
    (a, b) => scoreOption(b, constraints) - scoreOption(a, constraints)
  );
  const recommended = pickFirst(byScore, claimed);
  if (recommended) {
    claimed.add(recommended.id);
    result.push({ option: recommended, badge: "recommended" });
  }

  const byETA = [...compatible].sort(
    (a, b) => getOptionETA(a) - getOptionETA(b)
  );
  const fastest = pickFirst(byETA, claimed);
  if (fastest) {
    claimed.add(fastest.id);
    result.push({ option: fastest, badge: "fastest" });
  }

  const byCost = [...compatible].sort(
    (a, b) => getOptionCost(a) - getOptionCost(b)
  );
  const cheapest = pickFirst(byCost, claimed);
  if (cheapest) {
    claimed.add(cheapest.id);
    result.push({ option: cheapest, badge: "cheapest" });
  }

  return result;
}

export function getRemainingOptions(
  options: FulfillmentOption[],
  topIds: Set<string>,
  constraints: TripConstraints
): { compatible: FulfillmentOption[]; incompatible: FulfillmentOption[] } {
  const rest = options.filter((o) => !topIds.has(o.id));
  return {
    compatible: rest.filter((o) => isCompatible(o, constraints)),
    incompatible: rest.filter((o) => !isCompatible(o, constraints)),
  };
}

// ============================================================
// Validation
// ============================================================

export function validateTripForm(
  trip: Partial<TripRequest>
): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!trip.pickup?.street) errors["pickup.street"] = "Pickup street is required";
  if (!trip.pickup?.city) errors["pickup.city"] = "Pickup city is required";
  if (!trip.pickup?.state) errors["pickup.state"] = "Pickup state is required";
  if (!trip.pickup?.zip) errors["pickup.zip"] = "Pickup ZIP is required";

  if (!trip.dropoff?.street) errors["dropoff.street"] = "Dropoff street is required";
  if (!trip.dropoff?.city) errors["dropoff.city"] = "Dropoff city is required";
  if (!trip.dropoff?.state) errors["dropoff.state"] = "Dropoff state is required";
  if (!trip.dropoff?.zip) errors["dropoff.zip"] = "Dropoff ZIP is required";

  if (!trip.requestedDate) errors.requestedDate = "Date is required";
  if (!trip.requestedTime) errors.requestedTime = "Time is required";

  return errors;
}

// ============================================================
// ID generators (from Pinnacle)
// ============================================================

const ID_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function randomId(prefix: string, length: number): string {
  let id = prefix;
  for (let i = 0; i < length; i++) {
    id += ID_CHARS[Math.floor(Math.random() * ID_CHARS.length)];
  }
  return id;
}

export function generateTripId(): string {
  return randomId("TR-", 6);
}

export function generateConfirmationNumber(): string {
  return randomId("MR-", 8);
}

// ============================================================
// ID generators (new for Marketplace)
// ============================================================

export function generateOfferId(): string {
  return randomId("OF-", 8);
}

export function generateMarketplaceTripId(): string {
  return randomId("MT-", 6);
}

export function generateClaimId(): string {
  return randomId("CL-", 8);
}

export function generateSettlementId(): string {
  return randomId("ST-", 8);
}

// ============================================================
// Delay helper
// ============================================================

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ============================================================
// Pricing engine (mock)
// ============================================================

const LOS_BASE_RATES: Record<string, number> = {
  ambulatory: 2.5,
  wheelchair: 3.5,
  stretcher: 5.0,
  bariatric: 6.0,
  bls: 8.0,
};

export function calculateMockPricing(
  distanceMiles: number,
  los: string,
  isUrban: boolean
): { suggestedRate: number; low: number; high: number; sampleSize: number } {
  const baseRate = LOS_BASE_RATES[los] ?? 2.5;
  const urbanMultiplier = isUrban ? 1.0 : 1.15;
  const raw = distanceMiles * baseRate * urbanMultiplier;
  const suggestedRate = Math.max(raw, 15);
  const low = Math.round(suggestedRate * 0.8 * 100) / 100;
  const high = Math.round(suggestedRate * 1.25 * 100) / 100;
  const sampleSize = Math.floor(Math.random() * 1800) + 200;

  return {
    suggestedRate: Math.round(suggestedRate * 100) / 100,
    low,
    high,
    sampleSize,
  };
}

// ============================================================
// Market indicator
// ============================================================

export function getMarketIndicator(
  price: number,
  suggested: number
): "below_market" | "at_market" | "above_market" {
  if (price < suggested * 0.9) return "below_market";
  if (price > suggested * 1.1) return "above_market";
  return "at_market";
}

// ============================================================
// Acceptance probability
// ============================================================

export function calculateAcceptanceProbability(
  price: number,
  suggested: number
): number {
  if (price >= suggested * 1.2) return 0.95;
  if (price >= suggested) return 0.8;
  if (price >= suggested * 0.85) return 0.5;
  if (price >= suggested * 0.7) return 0.2;
  return 0.05;
}

// ============================================================
// Explainability text
// ============================================================

export function generateExplainabilityText(
  los: string,
  distance: number,
  sampleSize: number,
  suggested: number,
  city: string
): string {
  const losLabel = los.charAt(0).toUpperCase() + los.slice(1);
  const low = Math.round(suggested * 0.95);
  const high = Math.round(suggested * 1.05);
  return (
    `Suggested ${formatCurrency(suggested)} based on ${formatNumber(sampleSize)} similar ` +
    `${losLabel.toLowerCase()} trips in the ${city} metro area over the past 6 months ` +
    `averaging ${formatCurrency(low)}\u2013${formatCurrency(high)}`
  );
}

// ============================================================
// Fleet costing
// ============================================================

export function calculateFleetCost(
  miles: number,
  durationMinutes: number,
  config: CostingConfig
): number {
  const mileageCost = miles * config.mileageRate;
  const hourlyCost = (durationMinutes / 60) * config.hourlyRate;
  const fuelCost = (miles / config.avgMPG) * config.fuelCostPerGallon;
  const subtotal = mileageCost + hourlyCost + fuelCost;
  const total = subtotal * (1 + config.overheadPercent / 100);
  return Math.max(total, config.minimumFare);
}

// ============================================================
// Credential helpers
// ============================================================

export function getCredentialStatusColor(status: string): string {
  switch (status) {
    case "current":
      return "success";
    case "expiring_soon":
      return "warning";
    case "expired":
      return "danger";
    case "pending":
      return "info";
    default:
      return "muted";
  }
}

export function isCredentialValid(credential: { status: string }): boolean {
  return credential.status === "current" || credential.status === "expiring_soon";
}

// ============================================================
// Time helpers
// ============================================================

export function timeFromNow(minutesFromNow: number): string {
  const now = new Date();
  now.setMinutes(now.getMinutes() + minutesFromNow);
  return now.toISOString();
}

export function timeAgo(isoString: string): string {
  const now = Date.now();
  const then = new Date(isoString).getTime();
  const diffMs = now - then;
  const diffMin = Math.floor(diffMs / 60_000);

  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin} min ago`;

  const diffHrs = Math.floor(diffMin / 60);
  if (diffHrs < 24) return `${diffHrs} hr ago`;

  const diffDays = Math.floor(diffHrs / 24);
  if (diffDays === 1) return "1 day ago";
  return `${diffDays} days ago`;
}

export function formatDateShort(iso: string): string {
  if (!iso) return "\u2014";
  const date = new Date(iso);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function formatDateTime(iso: string): string {
  if (!iso) return "\u2014";
  const date = new Date(iso);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

// ============================================================
// Trip status helpers
// ============================================================

export function getTripStatusColor(
  status: string
): "success" | "warning" | "danger" | "info" | "muted" {
  switch (status) {
    case "completed":
    case "confirmed":
      return "success";
    case "in_progress":
    case "en_route":
    case "claimed":
      return "info";
    case "pending":
    case "searching":
    case "posted":
      return "warning";
    case "cancelled":
    case "expired":
    case "failed":
    case "no_show":
      return "danger";
    default:
      return "muted";
  }
}

export function getTripStatusLabel(status: string): string {
  switch (status) {
    case "pending":
      return "Pending";
    case "searching":
      return "Searching";
    case "posted":
      return "Posted";
    case "claimed":
      return "Claimed";
    case "confirmed":
      return "Confirmed";
    case "in_progress":
      return "In Progress";
    case "en_route":
      return "En Route";
    case "completed":
      return "Completed";
    case "cancelled":
      return "Cancelled";
    case "expired":
      return "Expired";
    case "failed":
      return "Failed";
    case "no_show":
      return "No Show";
    case "draft":
      return "Draft";
    case "bidding":
      return "Bidding";
    case "assigned":
      return "Assigned";
    case "settled":
      return "Settled";
    case "disputed":
      return "Disputed";
    default:
      return status
        .split("_")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
  }
}

// ============================================================
// Number formatting
// ============================================================

export function formatNumber(n: number): string {
  return new Intl.NumberFormat("en-US").format(n);
}

export function formatPercent(n: number): string {
  return `${n.toFixed(1)}%`;
}

export function formatRating(n: number): string {
  return n.toFixed(1);
}
