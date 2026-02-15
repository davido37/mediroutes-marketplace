"use client";

import { useState } from "react";
import { CHAT_USERS } from "@/lib/mock-chat-data";
import type { ChatParticipant } from "@/lib/chat-types";
import { OrgBadge } from "./org-badge";

interface ComposeViewProps {
  currentUserId: string;
  onSend: (recipient: ChatParticipant, message: string) => void;
  onCancel: () => void;
}

export function ComposeView({ currentUserId, onSend, onCancel }: ComposeViewProps) {
  const [selectedRecipient, setSelectedRecipient] = useState<ChatParticipant | null>(null);
  const [message, setMessage] = useState("");
  const [recipientSearch, setRecipientSearch] = useState("");

  const contacts = Object.values(CHAT_USERS).filter((u) => u.userId !== currentUserId);
  const filteredContacts = contacts.filter((c) => {
    if (!recipientSearch) return true;
    const q = recipientSearch.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.orgName.toLowerCase().includes(q) || c.role.toLowerCase().includes(q);
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRecipient || !message.trim()) return;
    onSend(selectedRecipient, message.trim());
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-border px-4 py-3 shrink-0">
        <button
          onClick={onCancel}
          className="flex items-center justify-center h-7 w-7 rounded-lg text-text-muted hover:bg-surface-muted transition-colors"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-sm font-semibold text-text-primary">New Message</h2>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
        {/* Recipient selection */}
        <div className="border-b border-border px-4 py-3 shrink-0">
          <label className="text-[10px] text-text-muted font-medium uppercase tracking-wider">To</label>
          {selectedRecipient ? (
            <div className="flex items-center gap-2 mt-1.5">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-lightest px-3 py-1 text-sm font-medium text-accent">
                {selectedRecipient.name}
                <button
                  type="button"
                  onClick={() => setSelectedRecipient(null)}
                  className="ml-0.5 text-accent hover:text-accent-light"
                >
                  x
                </button>
              </span>
              <OrgBadge orgName={selectedRecipient.orgName} role={selectedRecipient.role} />
            </div>
          ) : (
            <input
              type="text"
              value={recipientSearch}
              onChange={(e) => setRecipientSearch(e.target.value)}
              placeholder="Search contacts..."
              className="mt-1.5 w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-accent-light focus:outline-none focus:ring-2 focus:ring-accent-light/20"
              autoFocus
            />
          )}
        </div>

        {/* Contact list (when no recipient selected) */}
        {!selectedRecipient && (
          <div className="flex-1 overflow-y-auto">
            {filteredContacts.map((contact) => (
              <button
                key={contact.userId}
                type="button"
                onClick={() => {
                  setSelectedRecipient(contact);
                  setRecipientSearch("");
                }}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-surface-muted transition-colors"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-white text-xs font-bold">
                  {contact.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-primary">{contact.name}</p>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-text-muted capitalize">{contact.role}</span>
                    {contact.orgName && (
                      <>
                        <span className="text-[10px] text-text-muted">-</span>
                        <OrgBadge orgName={contact.orgName} role={contact.role} />
                      </>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Message input (when recipient selected) */}
        {selectedRecipient && (
          <>
            <div className="flex-1 flex items-center justify-center text-text-muted px-4">
              <p className="text-sm text-center">Start a conversation with {selectedRecipient.name}</p>
            </div>
            <div className="flex items-end gap-2 border-t border-border p-3 bg-white shrink-0">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                placeholder="Type your message..."
                rows={1}
                autoFocus
                className="flex-1 resize-none rounded-lg border border-border bg-white px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-accent-light focus:outline-none focus:ring-2 focus:ring-accent-light/20"
              />
              <button
                type="submit"
                disabled={!message.trim()}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent text-white hover:bg-accent-light transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
}
