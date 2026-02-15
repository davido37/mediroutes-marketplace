// === Role Configuration ===

export type UserRole = 'facility' | 'healthplan' | 'broker' | 'provider' | 'marketplace' | 'passenger';

export interface RoleConfig {
  id: UserRole;
  label: string;
  shortLabel: string;
  description: string;
  icon: string;
  color: string;
  bgColor: string;
  basePath: string;
}

export const ROLE_CONFIGS: Record<UserRole, RoleConfig> = {
  facility: {
    id: 'facility',
    label: 'Facility Portal',
    shortLabel: 'Facility',
    description: 'Book rides for patients, EHR integration, Where\'s My Ride',
    icon: '🏥',
    color: 'text-accent',
    bgColor: 'bg-accent-lightest',
    basePath: '/facility/dashboard',
  },
  healthplan: {
    id: 'healthplan',
    label: 'Health Plan Portal',
    shortLabel: 'Health Plan',
    description: 'Benefits config, authorization rules, utilization analytics',
    icon: '🛡️',
    color: 'text-purple',
    bgColor: 'bg-purple-light',
    basePath: '/healthplan/dashboard',
  },
  broker: {
    id: 'broker',
    label: 'Broker Portal',
    shortLabel: 'Broker',
    description: 'Trip imports, provider network, compliance, claims',
    icon: '🔄',
    color: 'text-info',
    bgColor: 'bg-info-light',
    basePath: '/broker/dashboard',
  },
  provider: {
    id: 'provider',
    label: 'Provider Portal',
    shortLabel: 'Provider',
    description: 'Fleet dispatch, vehicles, drivers, marketplace pickup',
    icon: '🚐',
    color: 'text-brand',
    bgColor: 'bg-brand-lightest',
    basePath: '/provider/dashboard',
  },
  marketplace: {
    id: 'marketplace',
    label: 'Marketplace',
    shortLabel: 'Marketplace',
    description: 'Post trips, browse, offer/counter/accept, ML pricing',
    icon: '🏪',
    color: 'text-warning',
    bgColor: 'bg-warning-light',
    basePath: '/marketplace/dashboard',
  },
  passenger: {
    id: 'passenger',
    label: 'Passenger App',
    shortLabel: 'Passenger',
    description: 'Self-booking, ride tracking, insurance, payments',
    icon: '👤',
    color: 'text-success',
    bgColor: 'bg-success-light',
    basePath: '/passenger',
  },
};

// === Navigation Items per Role ===

export interface NavItem {
  label: string;
  path: string;
  icon: string;
  badge?: string;
}

export const NAV_ITEMS: Record<UserRole, NavItem[]> = {
  facility: [
    { label: 'Dashboard', path: '/facility/dashboard', icon: '📊' },
    { label: 'New Trip', path: '/facility/new-trip', icon: '➕' },
    { label: 'Active Trips', path: '/facility/trips', icon: '🚗' },
    { label: 'EHR Discharge', path: '/facility/ehr', icon: '🏥' },
    { label: 'Tracking', path: '/facility/tracking', icon: '📍' },
    { label: 'Messages', path: '/facility/messages', icon: '💬' },
  ],
  healthplan: [
    { label: 'Dashboard', path: '/healthplan/dashboard', icon: '📊' },
    { label: 'Benefits', path: '/healthplan/benefits', icon: '💊' },
    { label: 'Authorizations', path: '/healthplan/authorizations', icon: '✅' },
    { label: 'Analytics', path: '/healthplan/analytics', icon: '📈' },
    { label: 'Members', path: '/healthplan/members', icon: '👥' },
    { label: 'Messages', path: '/healthplan/messages', icon: '💬' },
  ],
  broker: [
    { label: 'Dashboard', path: '/broker/dashboard', icon: '📊' },
    { label: 'Trip Imports', path: '/broker/imports', icon: '📥' },
    { label: 'Providers', path: '/broker/providers', icon: '🚐' },
    { label: 'Compliance', path: '/broker/compliance', icon: '🛡️' },
    { label: 'Claims', path: '/broker/claims', icon: '💰' },
    { label: 'Messages', path: '/broker/messages', icon: '💬' },
  ],
  provider: [
    { label: 'Dashboard', path: '/provider/dashboard', icon: '📊' },
    { label: 'Dispatch', path: '/provider/dispatch', icon: '🗺️' },
    { label: 'Vehicles', path: '/provider/vehicles', icon: '🚐' },
    { label: 'Drivers', path: '/provider/drivers', icon: '👤' },
    { label: 'Marketplace', path: '/provider/marketplace', icon: '🏪' },
    { label: 'Trips', path: '/provider/trips', icon: '🚗' },
    { label: 'Costing', path: '/provider/costing', icon: '💲' },
    { label: 'Priority Rules', path: '/provider/priority', icon: '⚙️' },
    { label: 'Messages', path: '/provider/messages', icon: '💬' },
  ],
  marketplace: [
    { label: 'Dashboard', path: '/marketplace/dashboard', icon: '📊' },
    { label: 'Post Trip', path: '/marketplace/post', icon: '📤' },
    { label: 'Browse Trips', path: '/marketplace/browse', icon: '🔍' },
    { label: 'My Offers', path: '/marketplace/offers', icon: '🤝' },
    { label: 'Pricing Engine', path: '/marketplace/pricing', icon: '💡' },
    { label: 'Providers', path: '/marketplace/providers', icon: '🚐' },
    { label: 'Notifications', path: '/marketplace/notifications', icon: '🔔' },
    { label: 'Settlement', path: '/marketplace/settlement', icon: '💰' },
    { label: 'Messages', path: '/marketplace/messages', icon: '💬' },
  ],
  passenger: [
    { label: 'Home', path: '/passenger', icon: '🏠' },
    { label: 'Book a Ride', path: '/passenger/book', icon: '🚗' },
    { label: 'My Rides', path: '/passenger/history', icon: '📋' },
    { label: 'Recurring', path: '/passenger/recurring', icon: '🔄' },
    { label: 'Profile', path: '/passenger/profile', icon: '👤' },
    { label: 'Eligibility', path: '/passenger/eligibility', icon: '✅' },
    { label: 'Messages', path: '/passenger/messages', icon: '💬' },
  ],
};

// === Trip Status Config ===

export interface StatusConfig {
  label: string;
  color: 'success' | 'warning' | 'danger' | 'info' | 'muted' | 'brand' | 'default';
  icon: string;
}

export const TRIP_STATUS_CONFIG: Record<string, StatusConfig> = {
  requested: { label: 'Requested', color: 'info', icon: '📝' },
  authorized: { label: 'Authorized', color: 'info', icon: '✅' },
  assigned: { label: 'Assigned', color: 'brand', icon: '👤' },
  dispatched: { label: 'Dispatched', color: 'brand', icon: '📡' },
  en_route_pickup: { label: 'En Route to Pickup', color: 'warning', icon: '🚗' },
  arrived_pickup: { label: 'Arrived at Pickup', color: 'warning', icon: '📍' },
  picked_up: { label: 'Picked Up', color: 'success', icon: '✓' },
  in_transit: { label: 'In Transit', color: 'success', icon: '🚗' },
  arrived_dropoff: { label: 'Arrived at Dropoff', color: 'success', icon: '📍' },
  completed: { label: 'Completed', color: 'success', icon: '✓' },
  cancelled: { label: 'Cancelled', color: 'danger', icon: '✕' },
  no_show: { label: 'No Show', color: 'danger', icon: '⚠' },
};

// === Level of Service Config ===

export const LOS_CONFIG: Record<string, { label: string; icon: string; color: string }> = {
  ambulatory: { label: 'Ambulatory', icon: '🚶', color: 'brand' },
  wheelchair: { label: 'Wheelchair', icon: '♿', color: 'info' },
  stretcher: { label: 'Stretcher', icon: '🛏️', color: 'warning' },
  bariatric: { label: 'Bariatric', icon: '🏋️', color: 'purple' },
  bls: { label: 'BLS', icon: '🚑', color: 'danger' },
};

// === Broker Systems ===

export const BROKER_SYSTEMS = [
  { id: 'modivcare', name: 'Modivcare', color: '#1a73e8' },
  { id: 'mtm', name: 'MTM / Veyo', color: '#e91e63' },
  { id: 'saferide', name: 'SafeRide Health', color: '#4caf50' },
  { id: 'alivi', name: 'Alivi', color: '#ff9800' },
] as const;

// === Mock Users per Role ===

export const MOCK_USERS: Record<UserRole, { id: string; name: string; email: string; orgName: string }> = {
  facility: { id: 'user-001', name: 'Jennifer Santos', email: 'j.santos@stjoephs.org', orgName: "St. Joseph's Hospital" },
  healthplan: { id: 'user-002', name: 'Michael Torres', email: 'm.torres@sunhealth.com', orgName: 'SunHealth Medicaid MCO' },
  broker: { id: 'user-003', name: 'Lisa Chen', email: 'l.chen@modivcare.com', orgName: 'Modivcare' },
  provider: { id: 'user-004', name: 'Carlos Rivera', email: 'c.rivera@valleymedtrans.com', orgName: 'Valley Medical Transport' },
  marketplace: { id: 'user-005', name: 'Sarah Johnson', email: 's.johnson@desertcare.com', orgName: 'Desert Care Rides' },
  passenger: { id: 'user-006', name: 'Maria Gonzalez', email: 'm.gonzalez@email.com', orgName: '' },
};

// === Marketplace Fee Config ===

export const DEFAULT_MARKETPLACE_FEE = {
  percentFee: 5, // 5% platform fee
  flatFee: 0,
  minFee: 1.50,
  maxFee: 25.00,
};

// === Supported Languages ===

export const SUPPORTED_LANGUAGES = [
  'English', 'Spanish', 'Mandarin', 'Cantonese', 'Vietnamese',
  'Korean', 'Tagalog', 'Russian', 'Arabic', 'Haitian Creole',
  'Portuguese', 'French', 'Polish', 'Hindi', 'Urdu',
];
