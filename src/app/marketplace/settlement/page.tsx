"use client";

import { useState, useMemo } from "react";
import { PageHeader } from "@/components/common/page-header";
import { Card } from "@/components/common/card";
import { Badge } from "@/components/common/badge";
import { Button } from "@/components/common/button";
import { StatCard } from "@/components/common/stat-card";
import { MOCK_SETTLEMENTS, type SettlementRecord } from "@/lib/mock-data";

type StatusFilter = "all" | "pending" | "invoiced" | "paid" | "disputed";

const STATUS_BADGE_VARIANT: Record<
  SettlementRecord["status"],
  "warning" | "info" | "success" | "danger"
> = {
  pending: "warning",
  invoiced: "info",
  paid: "success",
  disputed: "danger",
};

function formatCurrency(amount: number): string {
  return `$${amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatDate(iso: string | undefined): string {
  if (!iso) return "\u2014";
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const FILTER_TABS: { id: StatusFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "pending", label: "Pending" },
  { id: "invoiced", label: "Invoiced" },
  { id: "paid", label: "Paid" },
  { id: "disputed", label: "Disputed" },
];

export default function SettlementPage() {
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [settlements, setSettlements] = useState<SettlementRecord[]>(
    () => [...MOCK_SETTLEMENTS]
  );

  // ---- Derived stats ----
  const totalRevenue = useMemo(
    () =>
      settlements
        .filter((s) => s.status === "paid")
        .reduce((sum, s) => sum + s.agreedPrice, 0),
    [settlements]
  );

  const pendingCount = useMemo(
    () => settlements.filter((s) => s.status === "pending").length,
    [settlements]
  );

  const invoicedCount = useMemo(
    () => settlements.filter((s) => s.status === "invoiced").length,
    [settlements]
  );

  const disputedCount = useMemo(
    () => settlements.filter((s) => s.status === "disputed").length,
    [settlements]
  );

  // ---- Filtered rows ----
  const filtered = useMemo(
    () =>
      filter === "all"
        ? settlements
        : settlements.filter((s) => s.status === filter),
    [settlements, filter]
  );

  // ---- Summary calculations ----
  const paidSettlements = useMemo(
    () => settlements.filter((s) => s.status === "paid"),
    [settlements]
  );
  const totalPaidAmount = paidSettlements.reduce(
    (sum, s) => sum + s.agreedPrice,
    0
  );
  const averageSettlement =
    settlements.length > 0
      ? settlements.reduce((sum, s) => sum + s.agreedPrice, 0) /
        settlements.length
      : 0;
  const disputedSettlements = settlements.filter(
    (s) => s.status === "disputed"
  );
  const disputedAmount = disputedSettlements.reduce(
    (sum, s) => sum + s.agreedPrice,
    0
  );

  // ---- Actions ----
  function handleCreateInvoice(id: string) {
    setSettlements((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, status: "invoiced" as const, invoicedAt: new Date().toISOString() }
          : s
      )
    );
  }

  function handleMarkPaid(id: string) {
    setSettlements((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              status: "paid" as const,
              paidAt: new Date().toISOString(),
              paymentMethod: "ACH Transfer",
            }
          : s
      )
    );
  }

  function handleResolve(id: string) {
    setSettlements((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              status: "paid" as const,
              paidAt: new Date().toISOString(),
              paymentMethod: "ACH Transfer",
            }
          : s
      )
    );
  }

  return (
    <div>
      <PageHeader
        title="Settlement & Payments"
        description="Track invoices, payments, and settlement status for marketplace trips."
      />

      {/* ---- Stat cards ---- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Total Revenue"
          value={formatCurrency(totalRevenue)}
          icon="$"
          change={`${paidSettlements.length} paid settlements`}
          changeType="positive"
        />
        <StatCard
          label="Pending"
          value={pendingCount}
          icon="&#9203;"
          change={`${pendingCount} awaiting invoice`}
          changeType="neutral"
        />
        <StatCard
          label="Invoiced"
          value={invoicedCount}
          icon="&#128196;"
          change={`${invoicedCount} awaiting payment`}
          changeType="neutral"
        />
        <StatCard
          label="Disputed"
          value={disputedCount}
          icon="&#9888;"
          change={disputedCount > 0 ? `${disputedCount} need attention` : "None"}
          changeType={disputedCount > 0 ? "negative" : "neutral"}
        />
      </div>

      {/* ---- Filter tabs ---- */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {FILTER_TABS.map((tab) => {
          const isActive = filter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                isActive
                  ? "bg-accent text-white"
                  : "bg-white text-text-secondary border border-border hover:bg-surface-muted"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ---- Settlement table ---- */}
      <Card padding="none" className="mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-muted">
                <th className="text-left px-4 py-3 font-medium text-text-muted">
                  Settlement ID
                </th>
                <th className="text-left px-4 py-3 font-medium text-text-muted">
                  Trip ID
                </th>
                <th className="text-left px-4 py-3 font-medium text-text-muted">
                  Provider
                </th>
                <th className="text-left px-4 py-3 font-medium text-text-muted">
                  LOS
                </th>
                <th className="text-right px-4 py-3 font-medium text-text-muted">
                  Miles
                </th>
                <th className="text-right px-4 py-3 font-medium text-text-muted">
                  Amount
                </th>
                <th className="text-left px-4 py-3 font-medium text-text-muted">
                  Status
                </th>
                <th className="text-left px-4 py-3 font-medium text-text-muted">
                  Trip Date
                </th>
                <th className="text-left px-4 py-3 font-medium text-text-muted">
                  Invoice Date
                </th>
                <th className="text-left px-4 py-3 font-medium text-text-muted">
                  Paid Date
                </th>
                <th className="text-left px-4 py-3 font-medium text-text-muted">
                  Payment Method
                </th>
                <th className="text-left px-4 py-3 font-medium text-text-muted">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={12}
                    className="px-4 py-8 text-center text-text-muted"
                  >
                    No settlements match the selected filter.
                  </td>
                </tr>
              )}
              {filtered.map((s) => (
                <tr
                  key={s.id}
                  className="border-b border-border last:border-b-0 hover:bg-surface-muted/50 transition-colors cursor-pointer"
                >
                  <td className="px-4 py-3 font-mono text-xs text-text-secondary">
                    {s.id}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-text-secondary">
                    {s.tripId}
                  </td>
                  <td className="px-4 py-3 text-text-primary font-medium">
                    {s.providerName}
                  </td>
                  <td className="px-4 py-3 text-text-secondary">{s.levelOfService}</td>
                  <td className="px-4 py-3 text-right text-text-secondary">
                    {s.miles.toFixed(1)}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-text-primary">
                    {formatCurrency(s.agreedPrice)}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={STATUS_BADGE_VARIANT[s.status]}>
                      {s.status.charAt(0).toUpperCase() + s.status.slice(1)}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-text-secondary whitespace-nowrap">
                    {formatDate(s.tripDate)}
                  </td>
                  <td className="px-4 py-3 text-text-secondary whitespace-nowrap">
                    {formatDate(s.invoicedAt)}
                  </td>
                  <td className="px-4 py-3 text-text-secondary whitespace-nowrap">
                    {formatDate(s.paidAt)}
                  </td>
                  <td className="px-4 py-3 text-text-secondary">
                    {s.paymentMethod ?? "\u2014"}
                  </td>
                  <td className="px-4 py-3">
                    {s.status === "pending" && (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCreateInvoice(s.id);
                        }}
                      >
                        Create Invoice
                      </Button>
                    )}
                    {s.status === "invoiced" && (
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMarkPaid(s.id);
                        }}
                      >
                        Mark Paid
                      </Button>
                    )}
                    {s.status === "disputed" && (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleResolve(s.id);
                        }}
                      >
                        Resolve
                      </Button>
                    )}
                    {s.status === "paid" && (
                      <span className="text-xs text-text-muted">
                        {s.paymentMethod ?? "\u2014"}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* ---- Summary card ---- */}
      <Card>
        <h3 className="text-sm font-semibold text-text-primary mb-4">
          Settlement Summary
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <p className="text-xs text-text-muted mb-1">Total Paid</p>
            <p className="text-lg font-bold text-text-primary">
              {formatCurrency(totalPaidAmount)}
            </p>
            <p className="text-xs text-text-muted">
              {paidSettlements.length} settlement
              {paidSettlements.length !== 1 ? "s" : ""}
            </p>
          </div>
          <div>
            <p className="text-xs text-text-muted mb-1">
              Average Settlement Amount
            </p>
            <p className="text-lg font-bold text-text-primary">
              {formatCurrency(averageSettlement)}
            </p>
            <p className="text-xs text-text-muted">
              across {settlements.length} total
            </p>
          </div>
          <div>
            <p className="text-xs text-text-muted mb-1">
              Avg. Days to Payment
            </p>
            <p className="text-lg font-bold text-text-primary">3.2 days</p>
            <p className="text-xs text-text-muted">
              from trip date to payment
            </p>
          </div>
          <div>
            <p className="text-xs text-text-muted mb-1">Disputed Amount</p>
            <p className="text-lg font-bold text-red-700">
              {formatCurrency(disputedAmount)}
            </p>
            <p className="text-xs text-text-muted">
              {disputedSettlements.length} dispute
              {disputedSettlements.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
