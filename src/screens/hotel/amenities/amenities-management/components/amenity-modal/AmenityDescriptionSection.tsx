import { ModalFormSection } from "../../../../../../components/ui";
import {
  ItemDescriptionForm,
  ItemDescriptionDisplay,
} from "../../../../../../components/ui/forms";
import type { AmenitySectionProps } from "./types";

/**
 * AmenityDescriptionSection - Description field
 * Shows form in create/edit mode, display in view mode
 */
export function AmenityDescriptionSection({
  mode,
  formData,
  amenity,
  onFieldChange,
  errors = {},
  disabled = false,
}: AmenitySectionProps) {
  const isViewMode = mode === "view";

  if (isViewMode && amenity) {
    // View mode: Display description
    return <ItemDescriptionDisplay description={amenity.description} />;
  }

  // Create/Edit mode: Form textarea
  return (
    <ModalFormSection title="Description">
      <ItemDescriptionForm
        value={formData?.description || ""}
        error={errors.description}
        disabled={disabled}
        onChange={(value: string) => onFieldChange?.("description", value)}
      />
    </ModalFormSection>
  );
}
