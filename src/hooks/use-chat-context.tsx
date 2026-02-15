"use client";

import React, { createContext, useContext, useReducer, useCallback } from "react";
import type { ChatState, ChatAction, ChatMessage, Conversation } from "@/lib/chat-types";
import type { UserRole } from "@/lib/constants";
import { MOCK_CONVERSATIONS, MOCK_MESSAGES } from "@/lib/mock-chat-data";

// ============================================================================
// REDUCER
// ============================================================================

function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case "OPEN_DRAWER":
      return { ...state, drawerOpen: true };

    case "CLOSE_DRAWER":
      return { ...state, drawerOpen: false, activeConversationId: null };

    case "TOGGLE_DRAWER":
      return {
        ...state,
        drawerOpen: !state.drawerOpen,
        activeConversationId: state.drawerOpen ? null : state.activeConversationId,
      };

    case "SET_ACTIVE_CONVERSATION":
      return { ...state, activeConversationId: action.payload };

    case "SEND_MESSAGE": {
      const { conversationId, message } = action.payload;
      const existingMessages = state.messages[conversationId] || [];
      const updatedConversations = state.conversations.map((c) =>
        c.id === conversationId
          ? { ...c, lastMessagePreview: message.content, lastMessageTime: message.timestamp }
          : c
      );
      return {
        ...state,
        messages: {
          ...state.messages,
          [conversationId]: [...existingMessages, message],
        },
        conversations: updatedConversations,
      };
    }

    case "MARK_CONVERSATION_READ": {
      const updatedConversations = state.conversations.map((c) =>
        c.id === action.payload ? { ...c, unreadCount: 0 } : c
      );
      return { ...state, conversations: updatedConversations };
    }

    case "SET_SEARCH_QUERY":
      return { ...state, searchQuery: action.payload };

    default:
      return state;
  }
}

// ============================================================================
// INITIAL STATE
// ============================================================================

const initialState: ChatState = {
  conversations: MOCK_CONVERSATIONS,
  messages: MOCK_MESSAGES,
  activeConversationId: null,
  drawerOpen: false,
  searchQuery: "",
};

// ============================================================================
// CONTEXT
// ============================================================================

interface ChatContextValue {
  state: ChatState;
  dispatch: React.Dispatch<ChatAction>;
  getConversationsForRole: (role: UserRole) => Conversation[];
  getUnreadCountForRole: (role: UserRole) => number;
  getConversationsForTrip: (tripId: string) => Conversation[];
  sendMessage: (conversationId: string, content: string, senderId: string, senderName: string, senderRole: UserRole) => void;
}

const ChatContext = createContext<ChatContextValue | null>(null);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  const getConversationsForRole = useCallback(
    (role: UserRole): Conversation[] => {
      return state.conversations.filter((c) => c.visibleToRoles.includes(role));
    },
    [state.conversations]
  );

  const getUnreadCountForRole = useCallback(
    (role: UserRole): number => {
      return state.conversations
        .filter((c) => c.visibleToRoles.includes(role))
        .reduce((sum, c) => sum + c.unreadCount, 0);
    },
    [state.conversations]
  );

  const getConversationsForTrip = useCallback(
    (tripId: string): Conversation[] => {
      return state.conversations.filter((c) => c.tripId === tripId);
    },
    [state.conversations]
  );

  const sendMessage = useCallback(
    (conversationId: string, content: string, senderId: string, senderName: string, senderRole: UserRole) => {
      const message: ChatMessage = {
        id: `msg-${Date.now()}`,
        conversationId,
        senderId,
        senderName,
        senderRole,
        content,
        timestamp: new Date().toISOString(),
        type: "text",
        tripReferences: [],
      };
      dispatch({ type: "SEND_MESSAGE", payload: { conversationId, message } });
    },
    []
  );

  return (
    <ChatContext.Provider
      value={{ state, dispatch, getConversationsForRole, getUnreadCountForRole, getConversationsForTrip, sendMessage }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext(): ChatContextValue {
  const ctx = useContext(ChatContext);
  if (!ctx) {
    throw new Error("useChatContext must be used within ChatProvider");
  }
  return ctx;
}
