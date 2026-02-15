"use client";

import { useState, useMemo, useCallback } from "react";
import { PageHeader } from "@/components/common/page-header";
import { StatCard } from "@/components/common/stat-card";
import { Card } from "@/components/common/card";
import { Badge } from "@/components/common/badge";
import { Button } from "@/components/common/button";
import { Modal } from "@/components/common/modal";
import { FormField, inputClassName } from "@/components/common/form-field";
import { MOCK_BROKER_CLAIMS } from "@/lib/mock-data";
import { formatCurrency, formatDateShort, generateClaimId } from "@/lib/utils";
import type { Claim, ClaimStatus } from "@/lib/types";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

type FilterTab = "all" | ClaimStatus;

const FILTER_TABS: { id: FilterTab; label: string }[] = [
  { id: "all", label: "All" },
  { id: "draft", label: "Draft" },
  { id: "submitted", label: "Submitted" },
  { id: "under_review", label: "Under Review" },
  { id: "approved", label: "Approved" },
  { id: "denied", label: "Denied" },
  { id: "paid", label: "Paid" },
];

const STATUS_BADGE_MAP: Record<ClaimStatus, "muted" | "info" | "warning" | "success" | "danger"> = {
  draft: "muted",
  submitted: "info",
  under_review: "warning",
  approved: "success",
  denied: "danger",
  paid: "success",
};

const STATUS_LABEL: Record<ClaimStatus, string> = {
  draft: "Draft",
  submitted: "Submitted",
  under_review: "Under Review",
  approved: "Approved",
  denied: "Denied",
  paid: "Paid",
};

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function Claims() {
  const [claims, setClaims] = useState<Claim[]>(MOCK_BROKER_CLAIMS);
  const [filter, setFilter] = useState<FilterTab>("all");
  const [modalOpen, setModalOpen] = useState(false);

  // Modal form state
  const [newTripId, setNewTripId] = useState("");
  const [newBrokerRef, setNewBrokerRef] = useState("");
  const [newAmount, setNewAmount] = useState("");

  // ---------------------------------------------------------------------------
  // Derived stats
  // ---------------------------------------------------------------------------

  const stats = useMemo(() => {
    const total = claims.length;
    const pending = claims.filter((c) =>
      c.status === "draft" || c.status === "submitted" || c.status === "under_review"
    ).length;
    const approved = claims.filter((c) =>
      c.status === "approved" || c.status === "paid"
    ).length;
    const totalAmount = claims.reduce((sum, c) => sum + c.amount, 0);
    return { total, pending, approved, totalAmount };
  }, [claims]);

  // ---------------------------------------------------------------------------
  // Filtered claims
  // ---------------------------------------------------------------------------

  const filteredClaims = useMemo(() => {
    if (filter === "all") return claims;
    return claims.filter((c) => c.status === filter);
  }, [claims, filter]);

  // ---------------------------------------------------------------------------
  // Actions
  // ---------------------------------------------------------------------------

  const updateClaim = useCallback(
    (id: string, updates: Partial<Claim>) => {
      setClaims((prev) =>
        prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
      );
    },
    []
  );

  const handleSubmitClaim = useCallback(
    (id: string) => {
      updateClaim(id, {
        status: "submitted",
        submittedAt: new Date().toISOString(),
      });
    },
    [updateClaim]
  );

  const handleCancelClaim = useCallback(
    (id: string) => {
      updateClaim(id, { status: "draft", submittedAt: undefined });
    },
    [updateClaim]
  );

  const handleMarkPaid = useCallback(
    (id: string) => {
      updateClaim(id, {
        status: "paid",
        paidAt: new Date().toISOString(),
      });
    },
    [updateClaim]
  );

  const handleAppeal = useCallback(
    (id: string) => {
      updateClaim(id, { status: "under_review", denialReason: undefined });
    },
    [updateClaim]
  );

  const handleNewClaimSubmit = useCallback(() => {
    if (!newTripId.trim() || !newBrokerRef.trim() || !newAmount.trim()) return;

    const claim: Claim = {
      id: generateClaimId(),
      tripId: newTripId.trim(),
      brokerReference: newBrokerRef.trim(),
      status: "submitted",
      amount: parseFloat(newAmount),
      submittedAt: new Date().toISOString(),
    };

    setClaims((prev) => [claim, ...prev]);
    setNewTripId("");
    setNewBrokerRef("");
    setNewAmount("");
    setModalOpen(false);
  }, [newTripId, newBrokerRef, newAmount]);

  // ---------------------------------------------------------------------------
  // Render helpers
  // ---------------------------------------------------------------------------

  function renderActions(claim: Claim) {
    switch (claim.status) {
      case "draft":
        return (
          <Button size="sm" onClick={() => handleSubmitClaim(claim.id)}>
            Submit
          </Button>
        );
      case "submitted":
        return (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleCancelClaim(claim.id)}
          >
            Cancel
          </Button>
        );
      case "under_review":
        return (
          <span className="text-xs text-text-muted italic">Awaiting Review</span>
        );
      case "approved":
        return (
          <Button size="sm" onClick={() => handleMarkPaid(claim.id)}>
            Mark Paid
          </Button>
        );
      case "denied":
        return (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleAppeal(claim.id)}
          >
            Appeal
          </Button>
        );
      case "paid":
        return (
          <span className="text-xs text-text-muted">
            {claim.paidAt ? formatDateShort(claim.paidAt) : "—"}
          </span>
        );
      default:
        return null;
    }
  }

  // ---------------------------------------------------------------------------
  // JSX
  // ---------------------------------------------------------------------------

  return (
    <div>
      {/* Header */}
      <PageHeader
        title="Claims Management"
        description="Submit, track, and reconcile claims with broker partners."
        actions={
          <Button onClick={() => setModalOpen(true)}>Submit New Claim</Button>
        }
      />

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Claims" value={stats.total} icon="📋" />
        <StatCard
          label="Pending"
          value={stats.pending}
          icon="⏳"
          change="draft + submitted + under review"
          changeType="neutral"
        />
        <StatCard
          label="Approved"
          value={stats.approved}
          icon="✅"
          change="approved + paid"
          changeType="positive"
        />
        <StatCard
          label="Total Amount"
          value={formatCurrency(stats.totalAmount)}
          icon="💰"
        />
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-1 mb-4">
        {FILTER_TABS.map((tab) => {
          const isActive = filter === tab.id;
          const count =
            tab.id === "all"
              ? claims.length
              : claims.filter((c) => c.status === tab.id).length;
          return (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-accent text-white"
                  : "bg-surface-muted text-text-secondary hover:bg-surface-muted/80"
              }`}
            >
              {tab.label}
              <span
                className={`ml-1.5 text-xs ${
                  isActive ? "text-white/80" : "text-text-muted"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Claims table */}
      <Card padding="none">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-muted/50">
                <th className="text-left px-4 py-3 font-medium text-text-secondary">
                  Claim ID
                </th>
                <th className="text-left px-4 py-3 font-medium text-text-secondary">
                  Trip ID
                </th>
                <th className="text-left px-4 py-3 font-medium text-text-secondary">
                  Broker Ref
                </th>
                <th className="text-left px-4 py-3 font-medium text-text-secondary">
                  Status
                </th>
                <th className="text-right px-4 py-3 font-medium text-text-secondary">
                  Amount
                </th>
                <th className="text-left px-4 py-3 font-medium text-text-secondary">
                  Submitted
                </th>
                <th className="text-left px-4 py-3 font-medium text-text-secondary">
                  Paid
                </th>
                <th className="text-right px-4 py-3 font-medium text-text-secondary">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredClaims.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-8 text-center text-text-muted"
                  >
                    No claims match this filter.
                  </td>
                </tr>
              ) : (
                filteredClaims.map((claim) => (
                  <tr
                    key={claim.id}
                    className="hover:bg-surface-muted/30 transition-colors"
                  >
                    <td className="px-4 py-3 font-mono text-xs text-text-primary">
                      {claim.id}
                    </td>
                    <td className="px-4 py-3 text-text-primary">
                      {claim.tripId}
                    </td>
                    <td className="px-4 py-3 text-text-secondary">
                      {claim.brokerReference}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={STATUS_BADGE_MAP[claim.status]}>
                        {STATUS_LABEL[claim.status]}
                      </Badge>
                      {claim.status === "denied" && claim.denialReason && (
                        <p className="mt-1 text-xs text-red-600 max-w-[200px]">
                          {claim.denialReason}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-text-primary">
                      {formatCurrency(claim.amount)}
                    </td>
                    <td className="px-4 py-3 text-text-secondary">
                      {claim.submittedAt
                        ? formatDateShort(claim.submittedAt)
                        : "—"}
                    </td>
                    <td className="px-4 py-3 text-text-secondary">
                      {claim.paidAt ? formatDateShort(claim.paidAt) : "—"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {renderActions(claim)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Submit New Claim modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Submit New Claim"
        footer={
          <>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleNewClaimSubmit}
              disabled={
                !newTripId.trim() || !newBrokerRef.trim() || !newAmount.trim()
              }
            >
              Submit Claim
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <FormField label="Trip ID" required>
            <input
              type="text"
              className={inputClassName}
              placeholder="e.g. TRP-5525"
              value={newTripId}
              onChange={(e) => setNewTripId(e.target.value)}
            />
          </FormField>
          <FormField label="Broker Reference" required>
            <input
              type="text"
              className={inputClassName}
              placeholder="e.g. MOD-88500"
              value={newBrokerRef}
              onChange={(e) => setNewBrokerRef(e.target.value)}
            />
          </FormField>
          <FormField label="Amount" required>
            <input
              type="number"
              className={inputClassName}
              placeholder="0.00"
              min="0"
              step="0.01"
              value={newAmount}
              onChange={(e) => setNewAmount(e.target.value)}
            />
          </FormField>
        </div>
      </Modal>
    </div>
  );
}
