import { ModalFormSection } from "../../../../../../components/ui";
import {
  ItemImageUpload,
  ItemImageDisplay,
} from "../../../../../../components/ui/forms";
import type { AmenitySectionProps } from "./types";

/**
 * AmenityImageSection - Image upload/display for amenities
 * Shows upload in create/edit mode, display in view mode
 */
export function AmenityImageSection({
  mode,
  formData,
  amenity,
  disabled = false,
  onImageChange,
  onStatusToggle,
}: AmenitySectionProps) {
  const isViewMode = mode === "view";

  if (isViewMode && amenity) {
    // View mode: Display image with status toggle
    return (
      <ItemImageDisplay
        imageUrl={amenity.image_url}
        itemName={amenity.name}
        price={amenity.price}
        isActive={amenity.is_active}
        onStatusToggle={disabled ? undefined : onStatusToggle}
      />
    );
  }

  // Create/Edit mode: Image upload
  return (
    <ModalFormSection title="Amenity Image">
      <ItemImageUpload
        value={formData?.imageUrl || null}
        onChange={(url: string | null) => onImageChange?.(url)}
        disabled={disabled}
        bucketPath="amenities"
        label="Upload Image"
      />
    </ModalFormSection>
  );
}
