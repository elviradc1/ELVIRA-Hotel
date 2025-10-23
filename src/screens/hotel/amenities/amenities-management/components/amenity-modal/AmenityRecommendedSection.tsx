import { ModalFormSection } from "../../../../../../components/ui";
import { ItemRecommendedToggle } from "../../../../../../components/ui/forms";
import type { AmenitySectionProps } from "./types";

/**
 * AmenityRecommendedSection - Hotel recommended toggle
 * Only shown in create/edit mode
 */
export function AmenityRecommendedSection({
  mode,
  formData,
  onFieldChange,
  disabled = false,
}: AmenitySectionProps) {
  const isViewMode = mode === "view";

  if (isViewMode) {
    // Don't show in view mode (already displayed in basic info)
    return null;
  }

  // Create/Edit mode: Toggle
  return (
    <ModalFormSection title="Recommendations">
      <ItemRecommendedToggle
        checked={formData?.recommended || false}
        disabled={disabled}
        onChange={(value: boolean) => onFieldChange?.("recommended", value)}
      />
    </ModalFormSection>
  );
}
