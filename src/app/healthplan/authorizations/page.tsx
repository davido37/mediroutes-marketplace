"use client";

import { useState, useMemo } from "react";
import { PageHeader } from "@/components/common/page-header";
import { Card } from "@/components/common/card";
import { Badge } from "@/components/common/badge";
import { Button } from "@/components/common/button";
import { Modal } from "@/components/common/modal";
import { FormField, inputClassName } from "@/components/common/form-field";
import { MOCK_AUTH_RULES, MOCK_HEALTH_PLANS } from "@/lib/mock-data";
import type {
  AuthorizationRule,
  AuthCondition,
  AuthConditionOperator,
  AuthorizationAction,
} from "@/lib/types";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getPlanName(healthPlanId: string): string {
  const plan = MOCK_HEALTH_PLANS.find((p) => p.id === healthPlanId);
  return plan?.name ?? "Unknown Plan";
}

function formatOperator(op: AuthConditionOperator): string {
  switch (op) {
    case "gt":
      return ">";
    case "lt":
      return "<";
    case "eq":
      return "=";
    case "in":
      return "in";
    case "between":
      return "between";
  }
}

function formatConditionValue(
  op: AuthConditionOperator,
  value: AuthCondition["value"]
): string {
  if (op === "in" && Array.isArray(value)) {
    return `[${(value as string[]).join(", ")}]`;
  }
  if (op === "between" && Array.isArray(value)) {
    const [lo, hi] = value as [number, number];
    return `${lo} and ${hi}`;
  }
  return String(value);
}

function formatConditions(conditions: AuthCondition[]): string {
  return conditions
    .map(
      (c) =>
        `${c.field} ${formatOperator(c.operator)} ${formatConditionValue(
          c.operator,
          c.value
        )}`
    )
    .join(" AND ");
}

const ACTION_CONFIG: Record<
  AuthorizationAction,
  { label: string; variant: "success" | "warning" | "danger" }
> = {
  auto_approve: { label: "Auto-Approve", variant: "success" },
  require_review: { label: "Require Review", variant: "warning" },
  deny: { label: "Deny", variant: "danger" },
};

// ---------------------------------------------------------------------------
// New Rule Modal
// ---------------------------------------------------------------------------

interface NewRuleFormState {
  name: string;
  healthPlanId: string;
  action: AuthorizationAction;
  priority: number;
  condField: string;
  condOperator: AuthConditionOperator;
  condValue: string;
}

const INITIAL_FORM: NewRuleFormState = {
  name: "",
  healthPlanId: MOCK_HEALTH_PLANS[0]?.id ?? "",
  action: "auto_approve",
  priority: 1,
  condField: "",
  condOperator: "eq",
  condValue: "",
};

function AddRuleModal({
  open,
  onClose,
  onSave,
  existingCount,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (rule: AuthorizationRule) => void;
  existingCount: number;
}) {
  const [form, setForm] = useState<NewRuleFormState>({
    ...INITIAL_FORM,
    priority: existingCount + 1,
  });

  const update = <K extends keyof NewRuleFormState>(
    key: K,
    value: NewRuleFormState[K]
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  const canSave = form.name.trim() !== "" && form.condField.trim() !== "" && form.condValue.trim() !== "";

  const handleSave = () => {
    const condition: AuthCondition = {
      field: form.condField.trim(),
      operator: form.condOperator,
      value: form.condOperator === "in"
        ? form.condValue.split(",").map((s) => s.trim())
        : isNaN(Number(form.condValue))
        ? form.condValue.trim()
        : Number(form.condValue),
    };

    const newRule: AuthorizationRule = {
      id: `auth-rule-${Date.now()}`,
      name: form.name.trim(),
      healthPlanId: form.healthPlanId,
      conditions: [condition],
      action: form.action,
      priority: form.priority,
      active: true,
    };

    onSave(newRule);
    setForm({ ...INITIAL_FORM, priority: existingCount + 2 });
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add Authorization Rule"
      size="lg"
      footer={
        <>
          <Button variant="secondary" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button size="sm" disabled={!canSave} onClick={handleSave}>
            Save Rule
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        {/* Rule Name */}
        <FormField label="Rule Name" required>
          <input
            className={inputClassName}
            placeholder="e.g. Auto-Approve Routine Dialysis"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
          />
        </FormField>

        {/* Plan & Action row */}
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Health Plan" required>
            <select
              className={inputClassName}
              value={form.healthPlanId}
              onChange={(e) => update("healthPlanId", e.target.value)}
            >
              {MOCK_HEALTH_PLANS.map((hp) => (
                <option key={hp.id} value={hp.id}>
                  {hp.name}
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="Action" required>
            <select
              className={inputClassName}
              value={form.action}
              onChange={(e) =>
                update("action", e.target.value as AuthorizationAction)
              }
            >
              <option value="auto_approve">Auto-Approve</option>
              <option value="require_review">Require Review</option>
              <option value="deny">Deny</option>
            </select>
          </FormField>
        </div>

        {/* Priority */}
        <FormField label="Priority">
          <input
            type="number"
            min={1}
            className={inputClassName}
            value={form.priority}
            onChange={(e) => update("priority", Number(e.target.value))}
          />
        </FormField>

        {/* Condition builder */}
        <div>
          <p className="text-sm font-medium text-text-primary mb-2">
            Condition
          </p>
          <div className="rounded-lg border border-border p-4 bg-surface-muted space-y-3">
            <div className="grid grid-cols-3 gap-3">
              <FormField label="Field">
                <input
                  className={inputClassName}
                  placeholder="e.g. distance"
                  value={form.condField}
                  onChange={(e) => update("condField", e.target.value)}
                />
              </FormField>

              <FormField label="Operator">
                <select
                  className={inputClassName}
                  value={form.condOperator}
                  onChange={(e) =>
                    update(
                      "condOperator",
                      e.target.value as AuthConditionOperator
                    )
                  }
                >
                  <option value="eq">= (equals)</option>
                  <option value="gt">&gt; (greater than)</option>
                  <option value="lt">&lt; (less than)</option>
                  <option value="in">in (list)</option>
                  <option value="between">between</option>
                </select>
              </FormField>

              <FormField label="Value">
                <input
                  className={inputClassName}
                  placeholder={
                    form.condOperator === "in"
                      ? "val1, val2"
                      : form.condOperator === "between"
                      ? "10, 50"
                      : "value"
                  }
                  value={form.condValue}
                  onChange={(e) => update("condValue", e.target.value)}
                />
              </FormField>
            </div>
            <p className="text-xs text-text-muted">
              Common fields: levelOfService, distance, tripsUsed, tripPurpose
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

export default function Authorizations() {
  const [rules, setRules] = useState<AuthorizationRule[]>([...MOCK_AUTH_RULES]);
  const [filterPlanId, setFilterPlanId] = useState<string>("all");
  const [modalOpen, setModalOpen] = useState(false);

  // ---- derived counts ----
  const activeCount = rules.filter((r) => r.active).length;
  const reviewCount = rules.filter(
    (r) => r.active && r.action === "require_review"
  ).length;
  const denyCount = rules.filter(
    (r) => r.active && r.action === "deny"
  ).length;

  // ---- filtered & sorted rules ----
  const visibleRules = useMemo(() => {
    const filtered =
      filterPlanId === "all"
        ? rules
        : rules.filter((r) => r.healthPlanId === filterPlanId);
    return [...filtered].sort((a, b) => a.priority - b.priority);
  }, [rules, filterPlanId]);

  // ---- handlers ----
  const toggleRule = (id: string) => {
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, active: !r.active } : r))
    );
  };

  const addRule = (rule: AuthorizationRule) => {
    setRules((prev) => [...prev, rule]);
  };

  // ---- render ----
  return (
    <div>
      {/* Header */}
      <PageHeader
        title="Authorization Management"
        description="Configure rules that automatically approve, flag for review, or deny trip authorization requests."
        actions={
          <Button size="sm" onClick={() => setModalOpen(true)}>
            + Add Rule
          </Button>
        }
      />

      {/* Summary badges */}
      <div className="flex items-center gap-3 mb-6">
        <Badge variant="success">{activeCount} Active Rules</Badge>
        <Badge variant="warning">{reviewCount} Review Required</Badge>
        <Badge variant="danger">{denyCount} Auto-Deny</Badge>
      </div>

      {/* Plan filter tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <button
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            filterPlanId === "all"
              ? "bg-accent text-white"
              : "bg-surface-muted text-text-secondary hover:bg-gray-200"
          }`}
          onClick={() => setFilterPlanId("all")}
        >
          All Plans
        </button>
        {MOCK_HEALTH_PLANS.map((hp) => (
          <button
            key={hp.id}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              filterPlanId === hp.id
                ? "bg-accent text-white"
                : "bg-surface-muted text-text-secondary hover:bg-gray-200"
            }`}
            onClick={() => setFilterPlanId(hp.id)}
          >
            {hp.name}
          </button>
        ))}
      </div>

      {/* Rules list */}
      {visibleRules.length === 0 ? (
        <Card className="text-center py-12">
          <p className="text-text-muted text-sm">
            No authorization rules match the current filter.
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {visibleRules.map((rule) => {
            const actionCfg = ACTION_CONFIG[rule.action];
            return (
              <Card
                key={rule.id}
                className={`transition-opacity ${
                  !rule.active ? "opacity-50" : ""
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Priority circle */}
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-lightest text-brand text-sm font-bold">
                    {rule.priority}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    {/* Top row: name + badges */}
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="text-sm font-semibold text-text-primary">
                        {rule.name}
                      </h3>
                      <Badge variant={rule.active ? "success" : "muted"}>
                        {rule.active ? "Active" : "Inactive"}
                      </Badge>
                      <Badge variant={actionCfg.variant}>
                        {actionCfg.label}
                      </Badge>
                    </div>

                    {/* Plan name */}
                    <p className="text-xs text-text-muted mb-2">
                      {getPlanName(rule.healthPlanId)}
                    </p>

                    {/* Conditions block */}
                    <p className="text-xs text-text-secondary font-mono bg-surface-muted rounded px-2 py-1 inline-block">
                      IF {formatConditions(rule.conditions)}
                    </p>
                  </div>

                  {/* Actions: toggle + edit */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        rule.active ? "bg-brand" : "bg-gray-300"
                      }`}
                      onClick={() => toggleRule(rule.id)}
                    >
                      <span
                        className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
                          rule.active ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Explanation card */}
      <Card className="mt-6">
        <h3 className="text-sm font-semibold text-text-primary mb-2">
          How Authorization Rules Work
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-text-secondary">
          <div>
            <p className="font-medium text-text-primary mb-1">
              1. Trip Requested
            </p>
            <p>
              When a new trip authorization request arrives, the system evaluates
              it against all active rules in priority order for the
              member&apos;s health plan.
            </p>
          </div>
          <div>
            <p className="font-medium text-text-primary mb-1">
              2. Conditions Evaluated
            </p>
            <p>
              Each rule&apos;s conditions are checked against the trip details.
              The first matching rule determines the authorization outcome.
            </p>
          </div>
          <div>
            <p className="font-medium text-text-primary mb-1">
              3. Action Applied
            </p>
            <p>
              Auto-approved trips proceed immediately, flagged trips go to the
              review queue, and denied trips notify the requesting facility.
            </p>
          </div>
        </div>
      </Card>

      {/* Add Rule Modal */}
      <AddRuleModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={addRule}
        existingCount={rules.length}
      />
    </div>
  );
}
