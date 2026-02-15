"use client";

import { useState } from "react";
import type { Conversation, ConversationType } from "@/lib/chat-types";
import { SearchInput } from "@/components/common/search-input";
import { Tabs } from "@/components/common/tabs";
import { ConversationListItem } from "./conversation-list-item";

interface ConversationListProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const FILTER_TABS = [
  { id: "all", label: "All" },
  { id: "direct", label: "Direct" },
  { id: "trip", label: "Trip" },
  { id: "broadcast", label: "Broadcast" },
  { id: "cross_org", label: "Cross-Org" },
];

export function ConversationList({
  conversations,
  activeConversationId,
  onSelectConversation,
  searchQuery,
  onSearchChange,
}: ConversationListProps) {
  const [activeTab, setActiveTab] = useState("all");

  const filtered = conversations
    .filter((c) => {
      if (activeTab !== "all" && c.type !== (activeTab as ConversationType)) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          c.title.toLowerCase().includes(q) ||
          c.lastMessagePreview.toLowerCase().includes(q) ||
          c.participants.some((p) => p.name.toLowerCase().includes(q) || p.orgName.toLowerCase().includes(q))
        );
      }
      return true;
    })
    .sort((a, b) => new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime());

  const tabsWithBadges = FILTER_TABS.map((tab) => ({
    ...tab,
    badge: tab.id === "all"
      ? conversations.length
      : conversations.filter((c) => c.type === tab.id).length,
  }));

  return (
    <div className="flex flex-col h-full">
      <div className="px-3 pt-3 pb-2">
        <SearchInput
          value={searchQuery}
          onChange={onSearchChange}
          placeholder="Search conversations..."
        />
      </div>
      <Tabs tabs={tabsWithBadges} activeTab={activeTab} onChange={setActiveTab} className="px-1" />
      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-text-muted">
            <span className="text-3xl mb-2">💬</span>
            <p className="text-sm">No conversations found</p>
          </div>
        ) : (
          filtered.map((conv) => (
            <ConversationListItem
              key={conv.id}
              conversation={conv}
              isActive={conv.id === activeConversationId}
              onClick={() => onSelectConversation(conv.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
