import type { UserRole } from "./constants";

// ============================================================================
// CHAT / MESSAGING TYPES
// ============================================================================

export interface ChatParticipant {
  userId: string;
  name: string;
  role: UserRole;
  orgName: string;
}

export type ConversationType = "direct" | "trip" | "broadcast" | "cross_org";

export interface Conversation {
  id: string;
  type: ConversationType;
  title: string;
  participants: ChatParticipant[];
  tripId?: string;
  visibleToRoles: UserRole[];
  isBroadcast: boolean;
  broadcastSenderId?: string;
  unreadCount: number;
  lastMessagePreview: string;
  lastMessageTime: string;
}

export type ChatMessageType = "text" | "system" | "trip_update" | "broadcast";

export interface TripReference {
  tripId: string;
  label: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  content: string;
  timestamp: string;
  type: ChatMessageType;
  tripReferences: TripReference[];
}

// ============================================================================
// STATE & ACTIONS
// ============================================================================

export interface ChatState {
  conversations: Conversation[];
  messages: Record<string, ChatMessage[]>; // keyed by conversationId
  activeConversationId: string | null;
  drawerOpen: boolean;
  searchQuery: string;
}

export type ChatAction =
  | { type: "OPEN_DRAWER" }
  | { type: "CLOSE_DRAWER" }
  | { type: "TOGGLE_DRAWER" }
  | { type: "SET_ACTIVE_CONVERSATION"; payload: string | null }
  | { type: "SEND_MESSAGE"; payload: { conversationId: string; message: ChatMessage } }
  | { type: "CREATE_CONVERSATION"; payload: { conversation: Conversation; message: ChatMessage } }
  | { type: "MARK_CONVERSATION_READ"; payload: string }
  | { type: "SET_SEARCH_QUERY"; payload: string };
