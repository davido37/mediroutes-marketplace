import type { Conversation, ChatMessage, ChatParticipant } from "./chat-types";
import type { UserRole } from "./constants";

// ============================================================================
// CHAT PARTICIPANTS (reusing user-001–006, adding 007–010)
// ============================================================================

export const CHAT_USERS: Record<string, ChatParticipant> = {
  "user-001": { userId: "user-001", name: "Jennifer Santos", role: "facility", orgName: "St. Joseph's Hospital" },
  "user-002": { userId: "user-002", name: "Michael Torres", role: "healthplan", orgName: "SunHealth Medicaid MCO" },
  "user-003": { userId: "user-003", name: "Lisa Chen", role: "broker", orgName: "Modivcare" },
  "user-004": { userId: "user-004", name: "Carlos Rivera", role: "provider", orgName: "Valley Medical Transport" },
  "user-005": { userId: "user-005", name: "Sarah Johnson", role: "marketplace", orgName: "Desert Care Rides" },
  "user-006": { userId: "user-006", name: "Maria Gonzalez", role: "passenger", orgName: "" },
  "user-007": { userId: "user-007", name: "Derek Washington", role: "provider", orgName: "Valley Medical Transport" },
  "user-008": { userId: "user-008", name: "Angela Kim", role: "provider", orgName: "Valley Medical Transport" },
  "user-009": { userId: "user-009", name: "Roberto Mendez", role: "facility", orgName: "Banner Desert Medical" },
  "user-010": { userId: "user-010", name: "Priya Sharma", role: "broker", orgName: "MTM / Veyo" },
};

// ============================================================================
// TIMESTAMP HELPERS
// ============================================================================

function minutesAgo(min: number): string {
  const d = new Date();
  d.setMinutes(d.getMinutes() - min);
  return d.toISOString();
}

function hoursAgo(hrs: number): string {
  const d = new Date();
  d.setHours(d.getHours() - hrs);
  return d.toISOString();
}

function daysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(9, 0, 0, 0);
  return d.toISOString();
}

// ============================================================================
// 18 CONVERSATIONS
// ============================================================================

export const MOCK_CONVERSATIONS: Conversation[] = [
  // 1. Direct: Provider dispatcher ↔ Driver — "ETA for Maria Gonzalez pickup?"
  {
    id: "conv-001",
    type: "direct",
    title: "Derek Washington",
    participants: [CHAT_USERS["user-004"], CHAT_USERS["user-007"]],
    visibleToRoles: ["provider"],
    isBroadcast: false,
    unreadCount: 2,
    lastMessagePreview: "I'll be there in 8 minutes, traffic is light",
    lastMessageTime: minutesAgo(3),
  },
  // 2. Direct: Provider dispatcher ↔ Driver — Vehicle breakdown
  {
    id: "conv-002",
    type: "direct",
    title: "Angela Kim",
    participants: [CHAT_USERS["user-004"], CHAT_USERS["user-008"]],
    visibleToRoles: ["provider"],
    isBroadcast: false,
    unreadCount: 1,
    lastMessagePreview: "Tow truck is on the way, ETA 20 min",
    lastMessageTime: minutesAgo(15),
  },
  // 3. Trip: Facility + Provider — Trip #trip-2001 wheelchair instructions
  {
    id: "conv-003",
    type: "trip",
    title: "Trip #trip-2001 — Wheelchair Instructions",
    participants: [CHAT_USERS["user-001"], CHAT_USERS["user-004"]],
    tripId: "trip-2001",
    visibleToRoles: ["facility", "provider"],
    isBroadcast: false,
    unreadCount: 1,
    lastMessagePreview: "Patient needs power wheelchair ramp, not manual",
    lastMessageTime: minutesAgo(25),
  },
  // 4. Trip: Broker + Provider — Trip #trip-2003 late pickup complaint
  {
    id: "conv-004",
    type: "trip",
    title: "Trip #trip-2003 — Late Pickup Report",
    participants: [CHAT_USERS["user-003"], CHAT_USERS["user-004"]],
    tripId: "trip-2003",
    visibleToRoles: ["broker", "provider"],
    isBroadcast: false,
    unreadCount: 0,
    lastMessagePreview: "I've noted the 12-minute delay in our system",
    lastMessageTime: hoursAgo(2),
  },
  // 5. Trip: Marketplace + Provider — Trip pricing negotiation
  {
    id: "conv-005",
    type: "trip",
    title: "Trip #trip-2005 — Pricing Discussion",
    participants: [CHAT_USERS["user-005"], CHAT_USERS["user-004"]],
    tripId: "trip-2005",
    visibleToRoles: ["marketplace", "provider"],
    isBroadcast: false,
    unreadCount: 3,
    lastMessagePreview: "Can you do $42 for the stretcher trip?",
    lastMessageTime: minutesAgo(10),
  },
  // 6. Broadcast: Dispatcher → all drivers — "Ice on roads"
  {
    id: "conv-006",
    type: "broadcast",
    title: "Weather Alert — All Drivers",
    participants: [CHAT_USERS["user-004"], CHAT_USERS["user-007"], CHAT_USERS["user-008"]],
    visibleToRoles: ["provider"],
    isBroadcast: true,
    broadcastSenderId: "user-004",
    unreadCount: 0,
    lastMessagePreview: "Roads are clearing up, stay safe out there",
    lastMessageTime: hoursAgo(1),
  },
  // 7. Broadcast: Dispatcher → all drivers — "Submit time-off requests"
  {
    id: "conv-007",
    type: "broadcast",
    title: "Admin — Time Off Requests",
    participants: [CHAT_USERS["user-004"], CHAT_USERS["user-007"], CHAT_USERS["user-008"]],
    visibleToRoles: ["provider"],
    isBroadcast: true,
    broadcastSenderId: "user-004",
    unreadCount: 0,
    lastMessagePreview: "Reminder: Submit time-off requests by Friday 5 PM",
    lastMessageTime: daysAgo(1),
  },
  // 8. Cross-org: Broker ↔ Provider — Contract/SLA discussion
  {
    id: "conv-008",
    type: "cross_org",
    title: "Modivcare ↔ Valley Medical — SLA Review",
    participants: [CHAT_USERS["user-003"], CHAT_USERS["user-004"]],
    visibleToRoles: ["broker", "provider"],
    isBroadcast: false,
    unreadCount: 1,
    lastMessagePreview: "New SLA terms look good, we'll sign by EOD",
    lastMessageTime: hoursAgo(3),
  },
  // 9. Cross-org: Health Plan ↔ Provider — Authorization hold
  {
    id: "conv-009",
    type: "cross_org",
    title: "SunHealth ↔ Valley Medical — Auth Hold",
    participants: [CHAT_USERS["user-002"], CHAT_USERS["user-004"]],
    visibleToRoles: ["healthplan", "provider"],
    isBroadcast: false,
    unreadCount: 2,
    lastMessagePreview: "The stretcher auth hold has been lifted",
    lastMessageTime: minutesAgo(45),
  },
  // 10. Cross-org: Health Plan ↔ Broker — Monthly utilization review
  {
    id: "conv-010",
    type: "cross_org",
    title: "SunHealth ↔ Modivcare — Utilization Review",
    participants: [CHAT_USERS["user-002"], CHAT_USERS["user-003"]],
    visibleToRoles: ["healthplan", "broker"],
    isBroadcast: false,
    unreadCount: 0,
    lastMessagePreview: "January numbers look strong, 94% on-time rate",
    lastMessageTime: daysAgo(2),
  },
  // 11. Direct: Passenger ↔ Provider — "Where is my driver?"
  {
    id: "conv-011",
    type: "direct",
    title: "Maria Gonzalez — Ride Status",
    participants: [CHAT_USERS["user-006"], CHAT_USERS["user-004"]],
    visibleToRoles: ["passenger", "provider"],
    isBroadcast: false,
    unreadCount: 1,
    lastMessagePreview: "Your driver Derek is 5 minutes away",
    lastMessageTime: minutesAgo(5),
  },
  // 12. Trip: Facility + Broker + Provider — Multi-party stretcher coordination
  {
    id: "conv-012",
    type: "trip",
    title: "Trip #trip-2007 — Stretcher Coordination",
    participants: [CHAT_USERS["user-001"], CHAT_USERS["user-003"], CHAT_USERS["user-004"]],
    tripId: "trip-2007",
    visibleToRoles: ["facility", "broker", "provider"],
    isBroadcast: false,
    unreadCount: 0,
    lastMessagePreview: "Confirmed: stretcher van dispatched from Bay 3",
    lastMessageTime: hoursAgo(4),
  },
  // 13. Cross-org: Marketplace ↔ Broker — Onboarding/credentialing
  {
    id: "conv-013",
    type: "cross_org",
    title: "Desert Care ↔ Modivcare — Onboarding",
    participants: [CHAT_USERS["user-005"], CHAT_USERS["user-003"]],
    visibleToRoles: ["marketplace", "broker"],
    isBroadcast: false,
    unreadCount: 1,
    lastMessagePreview: "We need your updated insurance certificate",
    lastMessageTime: hoursAgo(6),
  },
  // 14. Trip: Passenger + Provider — Appointment time question
  {
    id: "conv-014",
    type: "trip",
    title: "Trip #trip-2002 — Appointment Time",
    participants: [CHAT_USERS["user-006"], CHAT_USERS["user-004"]],
    tripId: "trip-2002",
    visibleToRoles: ["passenger", "provider"],
    isBroadcast: false,
    unreadCount: 0,
    lastMessagePreview: "We'll pick you up at 9:15 AM for your 10 AM appt",
    lastMessageTime: hoursAgo(5),
  },
  // 15. Broadcast: Marketplace → all providers — New pricing tiers
  {
    id: "conv-015",
    type: "broadcast",
    title: "Marketplace — New Pricing Tiers",
    participants: [CHAT_USERS["user-005"], CHAT_USERS["user-004"]],
    visibleToRoles: ["marketplace", "provider"],
    isBroadcast: true,
    broadcastSenderId: "user-005",
    unreadCount: 1,
    lastMessagePreview: "New tier pricing takes effect March 1st",
    lastMessageTime: daysAgo(1),
  },
  // 16. Direct: Facility ↔ Facility — Coordination tips
  {
    id: "conv-016",
    type: "direct",
    title: "Roberto Mendez — Banner Desert",
    participants: [CHAT_USERS["user-001"], CHAT_USERS["user-009"]],
    visibleToRoles: ["facility"],
    isBroadcast: false,
    unreadCount: 0,
    lastMessagePreview: "Thanks for the tip on the EHR discharge workflow!",
    lastMessageTime: daysAgo(3),
  },
  // 17. Cross-org: Facility ↔ Health Plan — Authorization appeal
  {
    id: "conv-017",
    type: "cross_org",
    title: "St. Joseph's ↔ SunHealth — Auth Appeal",
    participants: [CHAT_USERS["user-001"], CHAT_USERS["user-002"]],
    visibleToRoles: ["facility", "healthplan"],
    isBroadcast: false,
    unreadCount: 1,
    lastMessagePreview: "Appeal approved — 6 additional trips authorized",
    lastMessageTime: hoursAgo(8),
  },
  // 18. Trip: MTM Broker + Provider — Broker system sync issue
  {
    id: "conv-018",
    type: "trip",
    title: "Trip #trip-2010 — MTM Sync Issue",
    participants: [CHAT_USERS["user-010"], CHAT_USERS["user-004"]],
    tripId: "trip-2010",
    visibleToRoles: ["broker", "provider"],
    isBroadcast: false,
    unreadCount: 0,
    lastMessagePreview: "Status sync is working again, confirmed on our end",
    lastMessageTime: daysAgo(1),
  },
];

// ============================================================================
// ~100 MESSAGES (3–8 per conversation)
// ============================================================================

export const MOCK_MESSAGES: Record<string, ChatMessage[]> = {
  // Conv 1: Provider dispatcher ↔ Driver — ETA for Maria Gonzalez pickup
  "conv-001": [
    { id: "msg-001", conversationId: "conv-001", senderId: "user-004", senderName: "Carlos Rivera", senderRole: "provider", content: "Derek, what's your ETA for Maria Gonzalez pickup at St. Joseph's?", timestamp: minutesAgo(12), type: "text", tripReferences: [] },
    { id: "msg-002", conversationId: "conv-001", senderId: "user-007", senderName: "Derek Washington", senderRole: "provider", content: "Just dropped off my last passenger. Heading there now.", timestamp: minutesAgo(10), type: "text", tripReferences: [] },
    { id: "msg-003", conversationId: "conv-001", senderId: "user-004", senderName: "Carlos Rivera", senderRole: "provider", content: "Good. She's in a wheelchair so use the side entrance at Bay 2.", timestamp: minutesAgo(8), type: "text", tripReferences: [] },
    { id: "msg-004", conversationId: "conv-001", senderId: "user-007", senderName: "Derek Washington", senderRole: "provider", content: "Copy that, Bay 2. Do I need the power ramp?", timestamp: minutesAgo(6), type: "text", tripReferences: [] },
    { id: "msg-005", conversationId: "conv-001", senderId: "user-004", senderName: "Carlos Rivera", senderRole: "provider", content: "Yes, power wheelchair. Make sure it's secured before departing.", timestamp: minutesAgo(5), type: "text", tripReferences: [] },
    { id: "msg-006", conversationId: "conv-001", senderId: "user-007", senderName: "Derek Washington", senderRole: "provider", content: "I'll be there in 8 minutes, traffic is light", timestamp: minutesAgo(3), type: "text", tripReferences: [] },
  ],

  // Conv 2: Provider dispatcher ↔ Driver — Vehicle breakdown
  "conv-002": [
    { id: "msg-007", conversationId: "conv-002", senderId: "user-008", senderName: "Angela Kim", senderRole: "provider", content: "Carlos, Vehicle 12 won't start. Getting a check engine light.", timestamp: minutesAgo(30), type: "text", tripReferences: [] },
    { id: "msg-008", conversationId: "conv-002", senderId: "user-004", senderName: "Carlos Rivera", senderRole: "provider", content: "Where are you parked? I'll reassign your next two trips.", timestamp: minutesAgo(28), type: "text", tripReferences: [] },
    { id: "msg-009", conversationId: "conv-002", senderId: "user-008", senderName: "Angela Kim", senderRole: "provider", content: "I'm at the Walmart on McDowell & 75th Ave. Tried restarting twice.", timestamp: minutesAgo(25), type: "text", tripReferences: [] },
    { id: "msg-010", conversationId: "conv-002", senderId: "user-004", senderName: "Carlos Rivera", senderRole: "provider", content: "OK, calling AAA now. Derek will cover your 2 PM and 3:15 PM runs.", timestamp: minutesAgo(22), type: "text", tripReferences: [] },
    { id: "msg-011", conversationId: "conv-002", senderId: "user-004", senderName: "Carlos Rivera", senderRole: "provider", content: "System message: Trips reassigned to Derek Washington (Vehicle 7)", timestamp: minutesAgo(20), type: "system", tripReferences: [] },
    { id: "msg-012", conversationId: "conv-002", senderId: "user-008", senderName: "Angela Kim", senderRole: "provider", content: "Tow truck is on the way, ETA 20 min", timestamp: minutesAgo(15), type: "text", tripReferences: [] },
  ],

  // Conv 3: Facility + Provider — Trip #trip-2001 wheelchair instructions
  "conv-003": [
    { id: "msg-013", conversationId: "conv-003", senderId: "user-001", senderName: "Jennifer Santos", senderRole: "facility", content: "Hi Carlos, I need to update the transport instructions for this trip.", timestamp: minutesAgo(40), type: "text", tripReferences: [{ tripId: "trip-2001", label: "Trip #trip-2001" }] },
    { id: "msg-014", conversationId: "conv-003", senderId: "user-004", senderName: "Carlos Rivera", senderRole: "provider", content: "Sure, what's changed?", timestamp: minutesAgo(38), type: "text", tripReferences: [] },
    { id: "msg-015", conversationId: "conv-003", senderId: "user-001", senderName: "Jennifer Santos", senderRole: "facility", content: "Patient needs power wheelchair ramp, not manual. Also, she has an oxygen tank that needs to be secured.", timestamp: minutesAgo(35), type: "text", tripReferences: [] },
    { id: "msg-016", conversationId: "conv-003", senderId: "user-004", senderName: "Carlos Rivera", senderRole: "provider", content: "Got it. I'll assign a vehicle with O2 tie-downs. Vehicle 3 has both.", timestamp: minutesAgo(30), type: "text", tripReferences: [] },
    { id: "msg-017", conversationId: "conv-003", senderId: "user-004", senderName: "Carlos Rivera", senderRole: "provider", content: "Trip updated: Vehicle 3 assigned, power ramp + O2 secured", timestamp: minutesAgo(28), type: "trip_update", tripReferences: [{ tripId: "trip-2001", label: "Trip #trip-2001" }] },
    { id: "msg-018", conversationId: "conv-003", senderId: "user-001", senderName: "Jennifer Santos", senderRole: "facility", content: "Patient needs power wheelchair ramp, not manual", timestamp: minutesAgo(25), type: "text", tripReferences: [] },
  ],

  // Conv 4: Broker + Provider — Trip #trip-2003 late pickup complaint
  "conv-004": [
    { id: "msg-019", conversationId: "conv-004", senderId: "user-003", senderName: "Lisa Chen", senderRole: "broker", content: "Carlos, we received a complaint about a late pickup on this trip. Can you check?", timestamp: hoursAgo(3), type: "text", tripReferences: [{ tripId: "trip-2003", label: "Trip #trip-2003" }] },
    { id: "msg-020", conversationId: "conv-004", senderId: "user-004", senderName: "Carlos Rivera", senderRole: "provider", content: "Let me pull up the GPS log. One moment.", timestamp: hoursAgo(3) + "", type: "text", tripReferences: [] },
    { id: "msg-021", conversationId: "conv-004", senderId: "user-004", senderName: "Carlos Rivera", senderRole: "provider", content: "Driver arrived at 10:12 AM, 12 minutes past the window. There was an accident on I-10 that caused the delay.", timestamp: hoursAgo(2.5), type: "text", tripReferences: [{ tripId: "trip-2003", label: "Trip #trip-2003" }] },
    { id: "msg-022", conversationId: "conv-004", senderId: "user-003", senderName: "Lisa Chen", senderRole: "broker", content: "OK, I understand. Please try to leave a larger buffer for trips coming from that corridor.", timestamp: hoursAgo(2.3), type: "text", tripReferences: [] },
    { id: "msg-023", conversationId: "conv-004", senderId: "user-003", senderName: "Lisa Chen", senderRole: "broker", content: "I've noted the 12-minute delay in our system", timestamp: hoursAgo(2), type: "text", tripReferences: [] },
  ],

  // Conv 5: Marketplace + Provider — Trip pricing negotiation
  "conv-005": [
    { id: "msg-024", conversationId: "conv-005", senderId: "user-005", senderName: "Sarah Johnson", senderRole: "marketplace", content: "Hi Carlos, I see you posted a stretcher trip on the marketplace.", timestamp: minutesAgo(30), type: "text", tripReferences: [{ tripId: "trip-2005", label: "Trip #trip-2005" }] },
    { id: "msg-025", conversationId: "conv-005", senderId: "user-004", senderName: "Carlos Rivera", senderRole: "provider", content: "Yes, it's a 15-mile stretcher run to Banner Desert. We're asking $48.", timestamp: minutesAgo(25), type: "text", tripReferences: [] },
    { id: "msg-026", conversationId: "conv-005", senderId: "user-005", senderName: "Sarah Johnson", senderRole: "marketplace", content: "Market rate for that corridor is around $40-45. Can you do $42 for the stretcher trip?", timestamp: minutesAgo(20), type: "text", tripReferences: [{ tripId: "trip-2005", label: "Trip #trip-2005" }] },
    { id: "msg-027", conversationId: "conv-005", senderId: "user-004", senderName: "Carlos Rivera", senderRole: "provider", content: "That's a bit low. Fuel costs have gone up. How about $45?", timestamp: minutesAgo(15), type: "text", tripReferences: [] },
    { id: "msg-028", conversationId: "conv-005", senderId: "user-005", senderName: "Sarah Johnson", senderRole: "marketplace", content: "I can do $44 if you can confirm availability for tomorrow 8 AM.", timestamp: minutesAgo(12), type: "text", tripReferences: [] },
    { id: "msg-029", conversationId: "conv-005", senderId: "user-005", senderName: "Sarah Johnson", senderRole: "marketplace", content: "Can you do $42 for the stretcher trip?", timestamp: minutesAgo(10), type: "text", tripReferences: [{ tripId: "trip-2005", label: "Trip #trip-2005" }] },
  ],

  // Conv 6: Broadcast — Ice on roads
  "conv-006": [
    { id: "msg-030", conversationId: "conv-006", senderId: "user-004", senderName: "Carlos Rivera", senderRole: "provider", content: "WEATHER ALERT: Ice reported on I-17 and Loop 101. All drivers please reduce speed and increase following distance.", timestamp: hoursAgo(3), type: "broadcast", tripReferences: [] },
    { id: "msg-031", conversationId: "conv-006", senderId: "user-004", senderName: "Carlos Rivera", senderRole: "provider", content: "ADOT has closed the I-17 northbound ramp at Dunlap. Use alternate routes.", timestamp: hoursAgo(2.5), type: "broadcast", tripReferences: [] },
    { id: "msg-032", conversationId: "conv-006", senderId: "user-004", senderName: "Carlos Rivera", senderRole: "provider", content: "Update: Salt trucks are on I-17 now. Expect delays of 15-20 minutes in the north valley.", timestamp: hoursAgo(2), type: "broadcast", tripReferences: [] },
    { id: "msg-033", conversationId: "conv-006", senderId: "user-004", senderName: "Carlos Rivera", senderRole: "provider", content: "Roads are clearing up, stay safe out there", timestamp: hoursAgo(1), type: "broadcast", tripReferences: [] },
  ],

  // Conv 7: Broadcast — Time off requests
  "conv-007": [
    { id: "msg-034", conversationId: "conv-007", senderId: "user-004", senderName: "Carlos Rivera", senderRole: "provider", content: "Team: Please submit all time-off requests for March by this Friday at 5 PM. We need to finalize the schedule.", timestamp: daysAgo(1), type: "broadcast", tripReferences: [] },
    { id: "msg-035", conversationId: "conv-007", senderId: "user-004", senderName: "Carlos Rivera", senderRole: "provider", content: "Also, Spring Training starts next month — expect higher volume in Scottsdale and Tempe areas.", timestamp: daysAgo(1), type: "broadcast", tripReferences: [] },
    { id: "msg-036", conversationId: "conv-007", senderId: "user-004", senderName: "Carlos Rivera", senderRole: "provider", content: "Reminder: Submit time-off requests by Friday 5 PM", timestamp: daysAgo(1), type: "broadcast", tripReferences: [] },
  ],

  // Conv 8: Cross-org — Broker ↔ Provider SLA
  "conv-008": [
    { id: "msg-037", conversationId: "conv-008", senderId: "user-003", senderName: "Lisa Chen", senderRole: "broker", content: "Carlos, we need to review the Q1 SLA metrics before renewing the contract.", timestamp: hoursAgo(6), type: "text", tripReferences: [] },
    { id: "msg-038", conversationId: "conv-008", senderId: "user-004", senderName: "Carlos Rivera", senderRole: "provider", content: "Sure. Our on-time rate was 96.2% and complaint rate was 0.3%. Both above target.", timestamp: hoursAgo(5.5), type: "text", tripReferences: [] },
    { id: "msg-039", conversationId: "conv-008", senderId: "user-003", senderName: "Lisa Chen", senderRole: "broker", content: "Great numbers. We'd like to increase volume by 15% in Q2. Can your fleet handle it?", timestamp: hoursAgo(5), type: "text", tripReferences: [] },
    { id: "msg-040", conversationId: "conv-008", senderId: "user-004", senderName: "Carlos Rivera", senderRole: "provider", content: "We're bringing on two new wheelchair vans next month, so yes.", timestamp: hoursAgo(4), type: "text", tripReferences: [] },
    { id: "msg-041", conversationId: "conv-008", senderId: "user-003", senderName: "Lisa Chen", senderRole: "broker", content: "New SLA terms look good, we'll sign by EOD", timestamp: hoursAgo(3), type: "text", tripReferences: [] },
  ],

  // Conv 9: Cross-org — Health Plan ↔ Provider auth hold
  "conv-009": [
    { id: "msg-042", conversationId: "conv-009", senderId: "user-004", senderName: "Carlos Rivera", senderRole: "provider", content: "Michael, we have 3 stretcher trips on hold pending authorization. Can you expedite?", timestamp: hoursAgo(4), type: "text", tripReferences: [] },
    { id: "msg-043", conversationId: "conv-009", senderId: "user-002", senderName: "Michael Torres", senderRole: "healthplan", content: "Let me check those auth requests. Which member IDs?", timestamp: hoursAgo(3.5), type: "text", tripReferences: [] },
    { id: "msg-044", conversationId: "conv-009", senderId: "user-004", senderName: "Carlos Rivera", senderRole: "provider", content: "MBR-44892, MBR-51023, and MBR-33847. All are dialysis patients.", timestamp: hoursAgo(3), type: "text", tripReferences: [] },
    { id: "msg-045", conversationId: "conv-009", senderId: "user-002", senderName: "Michael Torres", senderRole: "healthplan", content: "Found them. Two were auto-approved but stuck in queue. Releasing now.", timestamp: hoursAgo(2), type: "text", tripReferences: [] },
    { id: "msg-046", conversationId: "conv-009", senderId: "user-002", senderName: "Michael Torres", senderRole: "healthplan", content: "Third one (MBR-33847) needs clinical review. Should be done by end of day.", timestamp: hoursAgo(1.5), type: "text", tripReferences: [] },
    { id: "msg-047", conversationId: "conv-009", senderId: "user-002", senderName: "Michael Torres", senderRole: "healthplan", content: "The stretcher auth hold has been lifted", timestamp: minutesAgo(45), type: "text", tripReferences: [] },
  ],

  // Conv 10: Cross-org — Health Plan ↔ Broker utilization review
  "conv-010": [
    { id: "msg-048", conversationId: "conv-010", senderId: "user-002", senderName: "Michael Torres", senderRole: "healthplan", content: "Lisa, sharing the January utilization report. 2,847 trips completed.", timestamp: daysAgo(2), type: "text", tripReferences: [] },
    { id: "msg-049", conversationId: "conv-010", senderId: "user-003", senderName: "Lisa Chen", senderRole: "broker", content: "Thanks Michael. I see the wheelchair trips increased 12% MoM. Is that sustainable?", timestamp: daysAgo(2), type: "text", tripReferences: [] },
    { id: "msg-050", conversationId: "conv-010", senderId: "user-002", senderName: "Michael Torres", senderRole: "healthplan", content: "Yes, we expanded the benefit to cover more facility types. Expect continued growth.", timestamp: daysAgo(2), type: "text", tripReferences: [] },
    { id: "msg-051", conversationId: "conv-010", senderId: "user-003", senderName: "Lisa Chen", senderRole: "broker", content: "January numbers look strong, 94% on-time rate", timestamp: daysAgo(2), type: "text", tripReferences: [] },
  ],

  // Conv 11: Passenger ↔ Provider — "Where is my driver?"
  "conv-011": [
    { id: "msg-052", conversationId: "conv-011", senderId: "user-006", senderName: "Maria Gonzalez", senderRole: "passenger", content: "Hello, where is my driver? My appointment is at 10 AM.", timestamp: minutesAgo(20), type: "text", tripReferences: [] },
    { id: "msg-053", conversationId: "conv-011", senderId: "user-004", senderName: "Carlos Rivera", senderRole: "provider", content: "Hi Maria! Let me check your driver's location.", timestamp: minutesAgo(18), type: "text", tripReferences: [] },
    { id: "msg-054", conversationId: "conv-011", senderId: "user-004", senderName: "Carlos Rivera", senderRole: "provider", content: "Driver assigned: Derek Washington, Vehicle 7", timestamp: minutesAgo(16), type: "trip_update", tripReferences: [] },
    { id: "msg-055", conversationId: "conv-011", senderId: "user-004", senderName: "Carlos Rivera", senderRole: "provider", content: "Your driver Derek is 5 minutes away", timestamp: minutesAgo(5), type: "text", tripReferences: [] },
  ],

  // Conv 12: Trip multi-party — Stretcher coordination
  "conv-012": [
    { id: "msg-056", conversationId: "conv-012", senderId: "user-001", senderName: "Jennifer Santos", senderRole: "facility", content: "We have a stretcher discharge scheduled for 2 PM. Patient is stable, needs bariatric stretcher.", timestamp: hoursAgo(6), type: "text", tripReferences: [{ tripId: "trip-2007", label: "Trip #trip-2007" }] },
    { id: "msg-057", conversationId: "conv-012", senderId: "user-003", senderName: "Lisa Chen", senderRole: "broker", content: "Authorization confirmed for bariatric stretcher. Provider, can you handle?", timestamp: hoursAgo(5.5), type: "text", tripReferences: [{ tripId: "trip-2007", label: "Trip #trip-2007" }] },
    { id: "msg-058", conversationId: "conv-012", senderId: "user-004", senderName: "Carlos Rivera", senderRole: "provider", content: "Yes, we have a bariatric-capable unit. Need 2 attendants for this one.", timestamp: hoursAgo(5), type: "text", tripReferences: [] },
    { id: "msg-059", conversationId: "conv-012", senderId: "user-001", senderName: "Jennifer Santos", senderRole: "facility", content: "Please come to Emergency Bay 3. We'll have the patient ready by 1:45 PM.", timestamp: hoursAgo(4.5), type: "text", tripReferences: [] },
    { id: "msg-060", conversationId: "conv-012", senderId: "user-004", senderName: "Carlos Rivera", senderRole: "provider", content: "Trip updated: Bariatric stretcher van + 2 attendants", timestamp: hoursAgo(4.3), type: "trip_update", tripReferences: [{ tripId: "trip-2007", label: "Trip #trip-2007" }] },
    { id: "msg-061", conversationId: "conv-012", senderId: "user-004", senderName: "Carlos Rivera", senderRole: "provider", content: "Confirmed: stretcher van dispatched from Bay 3", timestamp: hoursAgo(4), type: "text", tripReferences: [] },
  ],

  // Conv 13: Cross-org — Marketplace ↔ Broker onboarding
  "conv-013": [
    { id: "msg-062", conversationId: "conv-013", senderId: "user-005", senderName: "Sarah Johnson", senderRole: "marketplace", content: "Hi Lisa, we'd like to join the Modivcare network for Maricopa County.", timestamp: hoursAgo(12), type: "text", tripReferences: [] },
    { id: "msg-063", conversationId: "conv-013", senderId: "user-003", senderName: "Lisa Chen", senderRole: "broker", content: "Welcome! I'll start the credentialing process. Can you send over your DOT number and insurance?", timestamp: hoursAgo(10), type: "text", tripReferences: [] },
    { id: "msg-064", conversationId: "conv-013", senderId: "user-005", senderName: "Sarah Johnson", senderRole: "marketplace", content: "DOT: 3847291. Insurance COI attached to our profile. Expires 12/2026.", timestamp: hoursAgo(9), type: "text", tripReferences: [] },
    { id: "msg-065", conversationId: "conv-013", senderId: "user-003", senderName: "Lisa Chen", senderRole: "broker", content: "We need your updated insurance certificate", timestamp: hoursAgo(6), type: "text", tripReferences: [] },
  ],

  // Conv 14: Trip — Passenger + Provider appointment time
  "conv-014": [
    { id: "msg-066", conversationId: "conv-014", senderId: "user-006", senderName: "Maria Gonzalez", senderRole: "passenger", content: "My doctor moved my appointment from 10 AM to 11 AM. Can we adjust the pickup?", timestamp: hoursAgo(7), type: "text", tripReferences: [{ tripId: "trip-2002", label: "Trip #trip-2002" }] },
    { id: "msg-067", conversationId: "conv-014", senderId: "user-004", senderName: "Carlos Rivera", senderRole: "provider", content: "Of course! I'll move your pickup to 10:15 AM instead.", timestamp: hoursAgo(6.5), type: "text", tripReferences: [] },
    { id: "msg-068", conversationId: "conv-014", senderId: "user-004", senderName: "Carlos Rivera", senderRole: "provider", content: "Trip updated: Pickup time changed to 10:15 AM", timestamp: hoursAgo(6), type: "trip_update", tripReferences: [{ tripId: "trip-2002", label: "Trip #trip-2002" }] },
    { id: "msg-069", conversationId: "conv-014", senderId: "user-006", senderName: "Maria Gonzalez", senderRole: "passenger", content: "Thank you so much! That gives me extra time to get ready.", timestamp: hoursAgo(5.5), type: "text", tripReferences: [] },
    { id: "msg-070", conversationId: "conv-014", senderId: "user-004", senderName: "Carlos Rivera", senderRole: "provider", content: "We'll pick you up at 9:15 AM for your 10 AM appt", timestamp: hoursAgo(5), type: "text", tripReferences: [] },
  ],

  // Conv 15: Broadcast — New pricing tiers
  "conv-015": [
    { id: "msg-071", conversationId: "conv-015", senderId: "user-005", senderName: "Sarah Johnson", senderRole: "marketplace", content: "Attention all providers: We're introducing new pricing tiers for the NEMT Marketplace effective March 1st.", timestamp: daysAgo(1), type: "broadcast", tripReferences: [] },
    { id: "msg-072", conversationId: "conv-015", senderId: "user-005", senderName: "Sarah Johnson", senderRole: "marketplace", content: "Tier 1 (Ambulatory): Base rate $2.50/mi. Tier 2 (Wheelchair): $3.75/mi. Tier 3 (Stretcher): $5.25/mi.", timestamp: daysAgo(1), type: "broadcast", tripReferences: [] },
    { id: "msg-073", conversationId: "conv-015", senderId: "user-005", senderName: "Sarah Johnson", senderRole: "marketplace", content: "Providers with 95%+ on-time rates get a 5% bonus on all marketplace trips.", timestamp: daysAgo(1), type: "broadcast", tripReferences: [] },
    { id: "msg-074", conversationId: "conv-015", senderId: "user-005", senderName: "Sarah Johnson", senderRole: "marketplace", content: "New tier pricing takes effect March 1st", timestamp: daysAgo(1), type: "broadcast", tripReferences: [] },
  ],

  // Conv 16: Direct — Facility ↔ Facility coordination
  "conv-016": [
    { id: "msg-075", conversationId: "conv-016", senderId: "user-009", senderName: "Roberto Mendez", senderRole: "facility", content: "Jennifer, how did you set up the EHR-to-transport auto-trigger? We're trying to implement the same thing.", timestamp: daysAgo(4), type: "text", tripReferences: [] },
    { id: "msg-076", conversationId: "conv-016", senderId: "user-001", senderName: "Jennifer Santos", senderRole: "facility", content: "We configured it through the EHR Discharge page. Go to Settings > Transport Triggers and enable auto-booking.", timestamp: daysAgo(4), type: "text", tripReferences: [] },
    { id: "msg-077", conversationId: "conv-016", senderId: "user-009", senderName: "Roberto Mendez", senderRole: "facility", content: "Found it! Do you pre-authorize through the broker or direct to provider?", timestamp: daysAgo(3.5), type: "text", tripReferences: [] },
    { id: "msg-078", conversationId: "conv-016", senderId: "user-001", senderName: "Jennifer Santos", senderRole: "facility", content: "We go through the broker for Medicaid patients (auto-auth) and direct for self-pay.", timestamp: daysAgo(3.2), type: "text", tripReferences: [] },
    { id: "msg-079", conversationId: "conv-016", senderId: "user-009", senderName: "Roberto Mendez", senderRole: "facility", content: "Thanks for the tip on the EHR discharge workflow!", timestamp: daysAgo(3), type: "text", tripReferences: [] },
  ],

  // Conv 17: Cross-org — Facility ↔ Health Plan auth appeal
  "conv-017": [
    { id: "msg-080", conversationId: "conv-017", senderId: "user-001", senderName: "Jennifer Santos", senderRole: "facility", content: "Michael, we need to appeal the authorization denial for patient MBR-44892. She needs ongoing dialysis transport.", timestamp: hoursAgo(12), type: "text", tripReferences: [] },
    { id: "msg-081", conversationId: "conv-017", senderId: "user-002", senderName: "Michael Torres", senderRole: "healthplan", content: "I see the denial. It was flagged because she exceeded the monthly trip limit. Let me review.", timestamp: hoursAgo(11), type: "text", tripReferences: [] },
    { id: "msg-082", conversationId: "conv-017", senderId: "user-001", senderName: "Jennifer Santos", senderRole: "facility", content: "Her nephrologist increased dialysis to 3x/week. I can send the clinical justification.", timestamp: hoursAgo(10), type: "text", tripReferences: [] },
    { id: "msg-083", conversationId: "conv-017", senderId: "user-002", senderName: "Michael Torres", senderRole: "healthplan", content: "Please send it. With clinical documentation, we can expedite the appeal.", timestamp: hoursAgo(9.5), type: "text", tripReferences: [] },
    { id: "msg-084", conversationId: "conv-017", senderId: "user-002", senderName: "Michael Torres", senderRole: "healthplan", content: "Appeal approved — 6 additional trips authorized", timestamp: hoursAgo(8), type: "text", tripReferences: [] },
  ],

  // Conv 18: Trip — MTM Broker + Provider sync issue
  "conv-018": [
    { id: "msg-085", conversationId: "conv-018", senderId: "user-010", senderName: "Priya Sharma", senderRole: "broker", content: "Carlos, our MTM system isn't syncing trip statuses from your dispatch software.", timestamp: daysAgo(2), type: "text", tripReferences: [{ tripId: "trip-2010", label: "Trip #trip-2010" }] },
    { id: "msg-086", conversationId: "conv-018", senderId: "user-004", senderName: "Carlos Rivera", senderRole: "provider", content: "I noticed that too. Looks like the API token may have expired. Checking now.", timestamp: daysAgo(2), type: "text", tripReferences: [] },
    { id: "msg-087", conversationId: "conv-018", senderId: "user-004", senderName: "Carlos Rivera", senderRole: "provider", content: "Token refreshed. Can you test a status update on your end?", timestamp: daysAgo(1.5), type: "text", tripReferences: [] },
    { id: "msg-088", conversationId: "conv-018", senderId: "user-010", senderName: "Priya Sharma", senderRole: "broker", content: "Testing now... I see the pickup confirmation came through for trip-2010!", timestamp: daysAgo(1.2), type: "text", tripReferences: [{ tripId: "trip-2010", label: "Trip #trip-2010" }] },
    { id: "msg-089", conversationId: "conv-018", senderId: "user-010", senderName: "Priya Sharma", senderRole: "broker", content: "Status sync is working again, confirmed on our end", timestamp: daysAgo(1), type: "text", tripReferences: [] },
  ],
};

// ============================================================================
// HELPER: Get conversations visible to a specific role
// ============================================================================

export function getConversationsForRole(role: UserRole): Conversation[] {
  return MOCK_CONVERSATIONS.filter((c) => c.visibleToRoles.includes(role));
}

export function getUnreadCountForRole(role: UserRole): number {
  return getConversationsForRole(role).reduce((sum, c) => sum + c.unreadCount, 0);
}
