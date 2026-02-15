// ============================================================================
// MediRoutes Marketplace — NEMT Command Central
// Comprehensive TypeScript Interfaces
// ============================================================================

// ============================================================================
// 1. PINNACLE CORE TYPES (Extended)
// ============================================================================

// --- Source metadata ---

export interface SourceMetadata {
  system: "salesforce" | "manual" | "ehr" | "broker_import";
  recordId?: string;
  token?: string;
  prefilled: boolean;
  timestamp: string;
}

// --- Patient ---

export type EligibilityStatus =
  | "eligible"
  | "ineligible"
  | "pending_verification"
  | "expired";

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  memberId: string;
  phone: string;
  email?: string;
  healthPlanId?: string;
  eligibilityStatus: EligibilityStatus;
  authorizedTripsRemaining?: number;
  preferredLanguage?: string;
  mobilityType: MobilityType;
  needsEscort: boolean;
  specialNeeds: string[];
}

// --- Mobility ---

export type MobilityType =
  | "ambulatory"
  | "wheelchair"
  | "stretcher"
  | "bariatric"
  | "bls";

// --- Address ---

export interface Address {
  label: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  lat: number;
  lng: number;
}

// --- Trip constraints ---

export interface Companion {
  name: string;
  relationship: string;
  phone?: string;
}

export interface TripConstraints {
  mobilityType: MobilityType;
  needsEscort: boolean;
  escortCount: number;
  specialNeeds: string[];
  companions: Companion[];
}

// --- Level of service ---

export type LevelOfService =
  | "ambulatory"
  | "wheelchair"
  | "stretcher"
  | "bariatric"
  | "bls";

// --- Funding source ---

export type FundingSource =
  | "medicaid"
  | "medicare"
  | "commercial"
  | "self_pay"
  | "grant"
  | "other";

// --- Trip request ---

export interface TripRequest {
  id: string;
  patient: Patient;
  pickup: Address;
  dropoff: Address;
  requestedDate: string;
  requestedTime: string;
  appointmentTime?: string;
  tripType: "one_way" | "round_trip";
  constraints: TripConstraints;
  notes: string;
  source: SourceMetadata;
  payerId?: string;
  willCall: boolean;
  companions: Companion[];
  levelOfService: LevelOfService;
  fundingSource: FundingSource;
  scheduledReturn?: string;
  authorizationNumber?: string;
}

// --- Trip flow step ---

export type TripStep =
  | "prefill"
  | "confirm"
  | "searching"
  | "compare"
  | "booking"
  | "confirmed";

// --- Fulfillment options ---

export interface TripImpact {
  tripId: string;
  patientName: string;
  delayMinutes: number;
  description: string;
}

export interface FleetOption {
  type: "fleet";
  id: string;
  feasible: boolean;
  vehicleId?: string;
  driverName?: string;
  vehicleType?: string;
  estimatedPickupTime: string;
  additionalMiles: number;
  additionalMinutes: number;
  internalCost: number;
  tripsImpacted: TripImpact[];
  scheduleChanges: string[];
  confidence: number;
  reasons?: string[];
}

export interface TNCOption {
  type: "tnc";
  id: string;
  provider: "uber" | "lyft";
  providerDisplayName: string;
  serviceLevel: string;
  etaMinutes: number;
  cost: number;
  surgeMultiplier: number;
  capabilities: string[];
  estimatedPickupTime: string;
}

export interface MarketplaceOption {
  type: "marketplace";
  id: string;
  providerName: string;
  providerRating: number;
  reliabilityScore: number;
  etaMinutes: number;
  cost: number;
  capabilities: string[];
  estimatedPickupTime: string;
  completedTrips: number;
}

export type FulfillmentOption = FleetOption | TNCOption | MarketplaceOption;

// --- Booking confirmation ---

export interface BookingConfirmation {
  tripId: string;
  confirmationNumber: string;
  selectedOption: FulfillmentOption;
  estimatedPickupTime: string;
  nextSteps: string[];
}

// --- Sort / filter ---

export type SortCriteria =
  | "cheapest"
  | "soonest"
  | "least_disruption"
  | "recommended";

// --- Search progress ---

export type SearchStatus = "pending" | "loading" | "done" | "error";

export interface SearchProgress {
  fleet: SearchStatus;
  tnc: SearchStatus;
  marketplace: SearchStatus;
}

// --- Option badge ---

export type OptionBadge =
  | "best_value"
  | "fastest"
  | "least_disruption"
  | "recommended"
  | "surge_pricing"
  | "low_supply";

// ============================================================================
// 2. USER / ROLE TYPES
// ============================================================================

export type UserRole =
  | "facility"
  | "healthplan"
  | "broker"
  | "provider"
  | "marketplace"
  | "passenger";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  organizationId: string;
  avatar?: string;
}

// ============================================================================
// 3. ORGANIZATION
// ============================================================================

export type OrganizationType =
  | "facility"
  | "health_plan"
  | "broker"
  | "provider"
  | "marketplace_admin";

export interface Organization {
  id: string;
  name: string;
  type: OrganizationType;
  address: Address;
  phone: string;
  logo?: string;
  npi?: string;
}

// ============================================================================
// 4. VEHICLE & DRIVER
// ============================================================================

// --- Vehicle ---

export type VehicleType =
  | "sedan"
  | "suv"
  | "minivan"
  | "wav_van"
  | "stretcher_van"
  | "bariatric_van";

export type VehicleStatus =
  | "available"
  | "on_trip"
  | "maintenance"
  | "off_duty";

export interface VehicleCapacity {
  ambulatory: number;
  wheelchair: number;
  stretcher: number;
}

export interface VehicleCredential {
  type: "insurance" | "registration" | "inspection" | "ada_compliance";
  status: "current" | "expiring_soon" | "expired" | "pending";
  expiryDate: string;
}

export interface Vehicle {
  id: string;
  providerId: string;
  type: VehicleType;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  vin: string;
  capacity: VehicleCapacity;
  equipment: string[];
  status: VehicleStatus;
  currentLocation?: { lat: number; lng: number };
  fuelLevel: number;
  mileage: number;
  lastInspection: string;
  credentials: VehicleCredential[];
}

// --- Driver ---

export type DriverCredentialType =
  | "cpr"
  | "first_aid"
  | "defensive_driving"
  | "background_check"
  | "drug_test"
  | "cdl"
  | "hipaa"
  | "ada_sensitivity";

export type CredentialStatus =
  | "current"
  | "expiring_soon"
  | "expired"
  | "pending";

export interface DriverCredential {
  type: DriverCredentialType;
  status: CredentialStatus;
  expiryDate: string;
  verifiedDate: string;
}

export type DriverStatus =
  | "available"
  | "on_trip"
  | "on_break"
  | "off_duty";

export interface Driver {
  id: string;
  providerId: string;
  firstName: string;
  lastName: string;
  phone: string;
  photo?: string;
  licenseNumber: string;
  licenseExpiry: string;
  credentials: DriverCredential[];
  status: DriverStatus;
  rating: number;
  completedTrips: number;
  currentVehicleId?: string;
  currentShiftId?: string;
}

// ============================================================================
// 5. TRIP LIFECYCLE
// ============================================================================

export type TripStatus =
  | "requested"
  | "authorized"
  | "assigned"
  | "dispatched"
  | "en_route_pickup"
  | "arrived_pickup"
  | "picked_up"
  | "in_transit"
  | "arrived_dropoff"
  | "completed"
  | "cancelled"
  | "no_show";

export interface StatusHistoryEntry {
  status: TripStatus;
  timestamp: string;
  note?: string;
}

export type AuthorizationStatus =
  | "pending"
  | "approved"
  | "denied"
  | "expired";

export interface TripAuthorization {
  id: string;
  ruleId?: string;
  status: AuthorizationStatus;
  authorizedAt?: string;
  expiresAt?: string;
}

export interface SignatureData {
  signedBy: string;
  signedAt: string;
  imageUrl?: string;
}

export interface CompletionData {
  actualPickupTime: string;
  actualDropoffTime: string;
  actualMiles: number;
  waitTime: number;
  signatures: SignatureData[];
  odometer: {
    start: number;
    end: number;
  };
}

export interface Trip {
  id: string;
  request: TripRequest;
  status: TripStatus;
  fulfillment?: FulfillmentOption;
  assignedVehicleId?: string;
  assignedDriverId?: string;
  authorization?: TripAuthorization;
  statusHistory: StatusHistoryEntry[];
  trackingUrl?: string;
  willCall: boolean;
  completionData?: CompletionData;
  brokerReference?: string;
  claimId?: string;
}

// ============================================================================
// 6. MARKETPLACE
// ============================================================================

export type MarketplaceTripStatus =
  | "open"
  | "offered"
  | "accepted"
  | "in_progress"
  | "completed"
  | "expired"
  | "cancelled";

export interface MarketplaceTrip {
  id: string;
  tripId: string;
  posterId: string;
  posterName: string;
  cityLevel: string;
  appointmentWindow: {
    start: string;
    end: string;
  };
  levelOfService: LevelOfService;
  estimatedMiles: number;
  suggestedPrice: number;
  floorPrice: number;
  ceilingPrice: number;
  currentBestOffer?: number;
  status: MarketplaceTripStatus;
  expiresAt: string;
  specialRequirements: string[];
  offers: MarketplaceOffer[];
}

export type MarketplaceOfferStatus =
  | "pending"
  | "accepted"
  | "declined"
  | "countered"
  | "expired";

export interface MarketplaceOffer {
  id: string;
  tripId: string;
  providerId: string;
  providerName: string;
  providerRating: number;
  offeredPrice: number;
  status: MarketplaceOfferStatus;
  counterPrice?: number;
  counterNotes?: string;
  submittedAt: string;
  respondedAt?: string;
  credentialVerified: boolean;
}

// ============================================================================
// 7. ML PRICING
// ============================================================================

export type MarketIndicator = "below_market" | "at_market" | "above_market";

export type PayerType =
  | "medicaid"
  | "medicare"
  | "commercial"
  | "self_pay";

export interface PricingRequest {
  pickupZip: string;
  dropoffZip: string;
  distanceMiles: number;
  levelOfService: LevelOfService;
  datetime: string;
  payerType: PayerType;
}

export interface PricingFactor {
  name: string;
  impact: "increases" | "decreases" | "neutral";
  weight: number;
}

export interface PricingResult {
  suggestedBuyerRate: number;
  suggestedSellerRate: number;
  percentile25: number;
  percentile75: number;
  medianRate: number;
  marketIndicator: MarketIndicator;
  confidence: number;
  sampleSize: number;
  explainabilityText: string;
  factors: PricingFactor[];
  acceptanceProbability: number;
}

// ============================================================================
// 8. EHR (Electronic Health Record)
// ============================================================================

export type EHREventType = "ADT_A03" | "ADT_A04" | "ADT_A08";

export type EHREventStatus =
  | "received"
  | "processing"
  | "trip_created"
  | "ignored"
  | "error";

export interface EHREncounter {
  id: string;
  admissionDate: string;
  dischargeDate: string;
  dischargeDisposition: string;
  attendingPhysician: string;
  department: string;
  diagnosis: string[];
}

export interface EHRDischargeEvent {
  id: string;
  eventType: EHREventType;
  patientId: string;
  patient: Patient;
  encounter: EHREncounter;
  destination: Address;
  origin: Address;
  status: EHREventStatus;
  receivedAt: string;
  autoPopulatedTrip?: Partial<TripRequest>;
}

// ============================================================================
// 9. HEALTH PLAN
// ============================================================================

export type HealthPlanType =
  | "medicaid_mco"
  | "medicare_advantage"
  | "commercial";

export interface BenefitConfig {
  maxTripsPerYear: number;
  maxMilesPerTrip: number;
  coveredLOS: LevelOfService[];
  requiresAuthorization: boolean;
  copay: number;
  coinsurancePercent: number;
  escortCovered: boolean;
  maxEscorts: number;
  willCallAllowed: boolean;
  roundTripAllowed: boolean;
}

export interface HealthPlanProduct {
  id: string;
  name: string;
  benefitConfig: BenefitConfig;
}

export interface HealthPlan {
  id: string;
  name: string;
  organizationId: string;
  type: HealthPlanType;
  products: HealthPlanProduct[];
}

// --- Authorization rules ---

export type AuthConditionOperator =
  | "gt"
  | "lt"
  | "eq"
  | "in"
  | "between";

export interface AuthCondition {
  field: string;
  operator: AuthConditionOperator;
  value: string | number | string[] | [number, number];
}

export type AuthorizationAction =
  | "auto_approve"
  | "require_review"
  | "deny";

export interface AuthorizationRule {
  id: string;
  name: string;
  healthPlanId: string;
  conditions: AuthCondition[];
  action: AuthorizationAction;
  priority: number;
  active: boolean;
}

// ============================================================================
// 10. BROKER
// ============================================================================

export type BrokerSystem =
  | "modivcare"
  | "mtm"
  | "saferide"
  | "alivi";

export type SyncStatus =
  | "synced"
  | "pending"
  | "error"
  | "stale";

export interface BrokerTripImport {
  id: string;
  brokerSystem: BrokerSystem;
  externalId: string;
  importedAt: string;
  patient: {
    name: string;
    phone: string;
  };
  pickup: Address;
  dropoff: Address;
  requestedDate: string;
  requestedTime: string;
  levelOfService: LevelOfService;
  syncStatus: SyncStatus;
  lastSyncAt: string;
  internalTripId?: string;
}

// --- Claims ---

export type ClaimStatus =
  | "draft"
  | "submitted"
  | "under_review"
  | "approved"
  | "denied"
  | "paid";

export interface Claim {
  id: string;
  tripId: string;
  brokerReference: string;
  status: ClaimStatus;
  amount: number;
  submittedAt?: string;
  paidAt?: string;
  denialReason?: string;
  completionData?: CompletionData;
}

// ============================================================================
// 11. PASSENGER
// ============================================================================

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

export interface InsuranceCard {
  id: string;
  planName: string;
  memberId: string;
  groupNumber: string;
  frontImage?: string;
  backImage?: string;
}

export type PaymentMethodType =
  | "credit_card"
  | "fsa"
  | "hsa"
  | "plan_benefit";

export interface PaymentMethod {
  id: string;
  type: PaymentMethodType;
  lastFour: string;
  expiryDate: string;
  isDefault: boolean;
}

export interface PassengerProfile {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  homeAddress: Address;
  defaultPickup?: Address;
  defaultDropoff?: Address;
  preferredLanguage: string;
  accessibilityNeeds: string[];
  emergencyContact: EmergencyContact;
  insuranceCards: InsuranceCard[];
  paymentMethods: PaymentMethod[];
  healthPlanId?: string;
}

export interface RecurringRide {
  id: string;
  destination: Address;
  pickup: Address;
  dayOfWeek: number[];
  time: string;
  levelOfService: LevelOfService;
  active: boolean;
}

export type PassengerTripStatus =
  | "upcoming"
  | "in_progress"
  | "completed"
  | "cancelled";

export interface PassengerTrip {
  id: string;
  date: string;
  pickup: Address;
  dropoff: Address;
  status: PassengerTripStatus;
  cost: number;
  coveredAmount: number;
  patientResponsibility: number;
  rating?: number;
  provider?: string;
}

// ============================================================================
// 12. SETTLEMENT & BILLING
// ============================================================================

export type SettlementStatus =
  | "pending"
  | "processing"
  | "settled"
  | "disputed"
  | "refunded";

export interface Settlement {
  id: string;
  offerId: string;
  tripId: string;
  providerId: string;
  providerName: string;
  amount: number;
  fee: number;
  netAmount: number;
  status: SettlementStatus;
  settledAt?: string;
  period: string;
}

export type BillingClaimStatus =
  | "unbilled"
  | "billed"
  | "paid"
  | "denied"
  | "adjusted";

export interface BillingRecord {
  id: string;
  bookingId: string;
  payerId: string;
  amountBilled: number;
  amountPaid: number;
  claimStatus: BillingClaimStatus;
  claimNumber?: string;
}

// ============================================================================
// 13. PROVIDER EXTRAS
// ============================================================================

export type ShiftStatus =
  | "scheduled"
  | "active"
  | "completed"
  | "cancelled";

export interface Shift {
  id: string;
  driverId: string;
  vehicleId: string;
  startTime: string;
  endTime: string;
  status: ShiftStatus;
  trips: string[];
}

export interface CostingConfig {
  mileageRate: number;
  hourlyRate: number;
  fuelCostPerGallon: number;
  avgMPG: number;
  overheadPercent: number;
  minimumFare: number;
}

export type PriorityAction =
  | "fleet_first"
  | "marketplace_first"
  | "cheapest"
  | "fastest";

export interface PriorityRule {
  id: string;
  name: string;
  condition: string;
  priority: number;
  action: PriorityAction;
  active: boolean;
}

export interface EarningsSummary {
  today: number;
  thisWeek: number;
  thisMonth: number;
  totalTrips: number;
}

// ============================================================================
// 14. TRACKING
// ============================================================================

export interface LatLng {
  lat: number;
  lng: number;
}

export interface TrackingSession {
  tripId: string;
  driverLocation: LatLng;
  etaMinutes: number;
  status: TripStatus;
  driverName: string;
  vehicleDescription: string;
  driverPhone: string;
  lastUpdated: string;
  pickupAddress: string;
  dropoffAddress: string;
  route: LatLng[];
}

export interface TrackingUpdate {
  tripId: string;
  lat: number;
  lng: number;
  eta: number;
  status: TripStatus;
  timestamp: string;
}

// ============================================================================
// 15. NOTIFICATIONS
// ============================================================================

export type NotificationType =
  | "trip_update"
  | "marketplace_offer"
  | "credential_alert"
  | "ehr_event"
  | "system"
  | "message";

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  portal: UserRole;
}

// ============================================================================
// 16. ANALYTICS (Health Plan)
// ============================================================================

export interface TopDestination {
  name: string;
  address: Address;
  tripCount: number;
}

export interface MonthlyTripData {
  month: string;
  tripCount: number;
  totalSpend: number;
}

export interface UtilizationData {
  totalTrips: number;
  totalSpend: number;
  avgCostPerTrip: number;
  tripsPerMember: number;
  topDestinations: TopDestination[];
  tripsByLOS: Record<LevelOfService, number>;
  tripsByMonth: MonthlyTripData[];
}

export interface SavedFilter {
  id: string;
  name: string;
  conditions: Record<string, string | number | boolean>;
  alertEnabled: boolean;
}

// ============================================================================
// 17. ACTIVE TRACKING (Facility ride tracking dashboard)
// ============================================================================

export type ActiveTrackingStatus =
  | "driver_assigned"
  | "en_route_pickup"
  | "at_pickup"
  | "in_transit"
  | "at_dropoff"
  | "completed";

export interface TrackingStatusHistoryEntry {
  status: string;
  timestamp: string;
  description: string;
}

export interface ActiveTracking {
  tripId: string;
  patientName: string;
  driverName: string;
  driverPhone: string;
  vehicleDescription: string;
  vehicleId: string;
  status: ActiveTrackingStatus;
  pickupLabel: string;
  pickupAddress: string;
  pickupLat: number;
  pickupLng: number;
  dropoffLabel: string;
  dropoffAddress: string;
  dropoffLat: number;
  dropoffLng: number;
  driverLat: number;
  driverLng: number;
  etaMinutes: number;
  scheduledTime: string;
  levelOfService: string;
  providerName: string;
  channel: "Fleet" | "Marketplace" | "TNC";
  lastUpdated: string;
  statusHistory: TrackingStatusHistoryEntry[];
}

// ============================================================================
// 18. COMPLIANCE METRICS (Broker SLA Monitoring)
// ============================================================================

export interface ComplianceMetric {
  broker: BrokerSystem;
  brokerLabel: string;
  onTimePercent: number;
  noShowPercent: number;
  complaintRate: number;
  avgResponseMinutes: number;
  slaTarget: number;
  tripsThisMonth: number;
  credentialCompliance: number;
}
