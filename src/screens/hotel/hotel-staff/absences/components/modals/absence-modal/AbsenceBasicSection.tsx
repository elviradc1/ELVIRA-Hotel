import { ModalFormSection, Select } from "../../../../../../../components/ui";
import type { AbsenceSectionProps } from "./types";

/**
 * AbsenceBasicSection - Staff selection field
 * Uses form inputs for all modes (create/edit/view)
 */
export function AbsenceBasicSection({
  mode,
  formData,
  onFieldChange,
  errors = {},
  disabled = false,
  staffOptions = [],
  isLoadingStaff = false,
}: AbsenceSectionProps) {
  const isViewMode = mode === "view";
  const isDisabled = disabled || isViewMode;

  return (
    <ModalFormSection title="Staff Information">
      <Select
        label="Staff Member"
        value={formData?.staffId || ""}
        onChange={(e) => onFieldChange?.("staffId", e.target.value)}
        options={staffOptions}
        error={errors.staffId}
        required
        disabled={isDisabled || isLoadingStaff}
      />
    </ModalFormSection>
  );
}
