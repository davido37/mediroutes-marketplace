"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/page-header";
import { Card } from "@/components/common/card";
import { Badge } from "@/components/common/badge";
import { Button } from "@/components/common/button";
import { FormField, inputClassName } from "@/components/common/form-field";
import { Banner } from "@/components/common/banner";

const MOBILITY_TYPES = [
  { value: "ambulatory", label: "Ambulatory" },
  { value: "wheelchair", label: "Wheelchair" },
  { value: "stretcher", label: "Stretcher" },
];

const SPECIAL_NEEDS_MAP: Record<string, string> = {
  oxygen: "Oxygen",
  escort: "Escort Required",
  iv_drip: "IV Drip",
  monitor: "Monitor",
  bariatric: "Bariatric",
};

interface ProfileData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  planName: string;
  memberId: string;
  groupNumber: string;
  mobilityType: string;
  specialNeeds: string[];
  emergencyContactName: string;
  emergencyContactRelationship: string;
  emergencyContactPhone: string;
}

const mockProfile: ProfileData = {
  firstName: "Maria",
  lastName: "Gonzalez",
  phone: "(555) 234-5678",
  email: "maria.gonzalez@email.com",
  street: "1420 Elm Street, Apt 3B",
  city: "Los Angeles",
  state: "CA",
  zip: "90015",
  planName: "Blue Cross PPO",
  memberId: "BCX-992841",
  groupNumber: "GRP-44210",
  mobilityType: "wheelchair",
  specialNeeds: ["escort"],
  emergencyContactName: "Carlos Gonzalez",
  emergencyContactRelationship: "Spouse",
  emergencyContactPhone: "(555) 234-9999",
};

export default function Profile() {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<ProfileData>(mockProfile);
  const [saved, setSaved] = useState(false);

  function updateField(field: keyof ProfileData, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  function handleSave() {
    setEditMode(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 4000);
  }

  return (
    <div className="max-w-md mx-auto">
      <PageHeader
        title="My Profile"
        description="Update your personal information, addresses, and preferences."
        actions={
          <Button
            variant={editMode ? "ghost" : "secondary"}
            size="sm"
            onClick={() => {
              if (editMode) {
                // Cancel edit, revert
                setFormData(mockProfile);
              }
              setEditMode(!editMode);
            }}
          >
            {editMode ? "Cancel" : "Edit"}
          </Button>
        }
      />

      {saved && (
        <div className="mb-4">
          <Banner variant="success">Profile saved successfully.</Banner>
        </div>
      )}

      {/* Personal Info */}
      <Card className="mb-4">
        <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wide mb-3">
          Personal Information
        </h2>
        {editMode ? (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <FormField label="First Name" required>
                <input
                  className={inputClassName}
                  value={formData.firstName}
                  onChange={(e) => updateField("firstName", e.target.value)}
                />
              </FormField>
              <FormField label="Last Name" required>
                <input
                  className={inputClassName}
                  value={formData.lastName}
                  onChange={(e) => updateField("lastName", e.target.value)}
                />
              </FormField>
            </div>
            <FormField label="Phone" required>
              <input
                className={inputClassName}
                type="tel"
                value={formData.phone}
                onChange={(e) => updateField("phone", e.target.value)}
              />
            </FormField>
            <FormField label="Email">
              <input
                className={inputClassName}
                type="email"
                value={formData.email}
                onChange={(e) => updateField("email", e.target.value)}
              />
            </FormField>
            <FormField label="Street">
              <input
                className={inputClassName}
                value={formData.street}
                onChange={(e) => updateField("street", e.target.value)}
              />
            </FormField>
            <div className="grid grid-cols-3 gap-3">
              <FormField label="City">
                <input
                  className={inputClassName}
                  value={formData.city}
                  onChange={(e) => updateField("city", e.target.value)}
                />
              </FormField>
              <FormField label="State">
                <input
                  className={inputClassName}
                  maxLength={2}
                  value={formData.state}
                  onChange={(e) => updateField("state", e.target.value)}
                />
              </FormField>
              <FormField label="ZIP">
                <input
                  className={inputClassName}
                  maxLength={5}
                  value={formData.zip}
                  onChange={(e) => updateField("zip", e.target.value)}
                />
              </FormField>
            </div>
          </div>
        ) : (
          <div className="space-y-2 text-sm">
            <ReadOnlyRow label="Name" value={`${formData.firstName} ${formData.lastName}`} />
            <ReadOnlyRow label="Phone" value={formData.phone} />
            <ReadOnlyRow label="Email" value={formData.email} />
            <ReadOnlyRow
              label="Address"
              value={`${formData.street}, ${formData.city}, ${formData.state} ${formData.zip}`}
            />
          </div>
        )}
      </Card>

      {/* Insurance */}
      <Card className="mb-4">
        <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wide mb-3">
          Insurance
        </h2>
        {editMode ? (
          <div className="space-y-3">
            <FormField label="Plan Name">
              <input
                className={inputClassName}
                value={formData.planName}
                onChange={(e) => updateField("planName", e.target.value)}
              />
            </FormField>
            <FormField label="Member ID">
              <input
                className={inputClassName}
                value={formData.memberId}
                onChange={(e) => updateField("memberId", e.target.value)}
              />
            </FormField>
            <FormField label="Group Number">
              <input
                className={inputClassName}
                value={formData.groupNumber}
                onChange={(e) => updateField("groupNumber", e.target.value)}
              />
            </FormField>
          </div>
        ) : (
          <div className="space-y-2 text-sm">
            <ReadOnlyRow label="Plan" value={formData.planName} />
            <ReadOnlyRow label="Member ID" value={formData.memberId} />
            <ReadOnlyRow label="Group #" value={formData.groupNumber} />
          </div>
        )}

        {/* Mock card placeholders */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="rounded-lg border border-dashed border-border bg-surface-muted flex items-center justify-center h-20">
            <span className="text-xs text-text-muted">Card Front</span>
          </div>
          <div className="rounded-lg border border-dashed border-border bg-surface-muted flex items-center justify-center h-20">
            <span className="text-xs text-text-muted">Card Back</span>
          </div>
        </div>
      </Card>

      {/* Accessibility */}
      <Card className="mb-4">
        <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wide mb-3">
          Accessibility
        </h2>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="brand">
            {MOBILITY_TYPES.find((m) => m.value === formData.mobilityType)?.label}
          </Badge>
          {formData.specialNeeds.map((need) => (
            <Badge key={need} variant="info">
              {SPECIAL_NEEDS_MAP[need] ?? need}
            </Badge>
          ))}
          {formData.specialNeeds.length === 0 && (
            <span className="text-sm text-text-muted">No special needs</span>
          )}
        </div>
      </Card>

      {/* Emergency Contact */}
      <Card className="mb-4">
        <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wide mb-3">
          Emergency Contact
        </h2>
        {editMode ? (
          <div className="space-y-3">
            <FormField label="Contact Name">
              <input
                className={inputClassName}
                value={formData.emergencyContactName}
                onChange={(e) => updateField("emergencyContactName", e.target.value)}
              />
            </FormField>
            <FormField label="Relationship">
              <input
                className={inputClassName}
                value={formData.emergencyContactRelationship}
                onChange={(e) => updateField("emergencyContactRelationship", e.target.value)}
              />
            </FormField>
            <FormField label="Phone">
              <input
                className={inputClassName}
                type="tel"
                value={formData.emergencyContactPhone}
                onChange={(e) => updateField("emergencyContactPhone", e.target.value)}
              />
            </FormField>
          </div>
        ) : (
          <div className="space-y-2 text-sm">
            <ReadOnlyRow label="Name" value={formData.emergencyContactName} />
            <ReadOnlyRow label="Relationship" value={formData.emergencyContactRelationship} />
            <ReadOnlyRow label="Phone" value={formData.emergencyContactPhone} />
          </div>
        )}
      </Card>

      {/* Payment Methods */}
      <Card className="mb-4">
        <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wide mb-3">
          Payment Methods
        </h2>
        <div className="space-y-2">
          <div className="flex items-center justify-between rounded-lg border border-border bg-surface-muted px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-12 items-center justify-center rounded bg-blue-600 text-[10px] font-bold text-white">
                VISA
              </div>
              <div>
                <p className="text-sm font-medium text-text-primary">Visa ending 4242</p>
                <p className="text-xs text-text-muted">Expires 08/27</p>
              </div>
            </div>
            <Badge variant="success">Default</Badge>
          </div>
          <div className="flex items-center justify-between rounded-lg border border-border bg-surface-muted px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-12 items-center justify-center rounded bg-green-700 text-[10px] font-bold text-white">
                HSA
              </div>
              <div>
                <p className="text-sm font-medium text-text-primary">HSA ending 8910</p>
                <p className="text-xs text-text-muted">Health Savings Account</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Save button in edit mode */}
      {editMode && (
        <Button className="w-full mb-6" onClick={handleSave}>
          Save Changes
        </Button>
      )}
    </div>
  );
}

/* Read-only row helper */
function ReadOnlyRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="text-text-muted shrink-0">{label}</span>
      <span className="text-text-primary text-right">{value}</span>
    </div>
  );
}
