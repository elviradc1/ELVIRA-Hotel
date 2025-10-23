import {
  ModalFormSection,
  ModalFormGrid,
  Select,
} from "../../../../../../../components/ui";
import type { AbsenceSectionProps } from "./types";

const REQUEST_TYPE_OPTIONS = [
  { value: "", label: "Select request type" },
  { value: "vacation", label: "Vacation" },
  { value: "sick", label: "Sick Leave" },
  { value: "personal", label: "Personal" },
  { value: "training", label: "Training" },
  { value: "other", label: "Other" },
];

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "cancelled", label: "Cancelled" },
];

/**
 * AbsenceTypeSection - Request type and status fields
 * Uses form inputs for all modes (create/edit/view)
 */
export function AbsenceTypeSection({
  mode,
  formData,
  onFieldChange,
  errors = {},
  disabled = false,
}: AbsenceSectionProps) {
  const isViewMode = mode === "view";
  const isEditMode = mode === "edit";
  const isDisabled = disabled || isViewMode;

  return (
    <ModalFormSection title="Request Type">
      <ModalFormGrid columns={isEditMode ? 2 : 1}>
        <Select
          label="Request Type"
          value={formData?.requestType || ""}
          onChange={(e) => onFieldChange?.("requestType", e.target.value)}
          options={REQUEST_TYPE_OPTIONS}
          error={errors.requestType}
          required
          disabled={isDisabled}
        />

        {isEditMode && (
          <Select
            label="Status"
            value={formData?.status || "pending"}
            onChange={(e) => onFieldChange?.("status", e.target.value)}
            options={STATUS_OPTIONS}
            disabled={isDisabled}
          />
        )}
      </ModalFormGrid>
    </ModalFormSection>
  );
}
