import { ModalFormSection } from "../../../../../../components/ui";
import {
  ItemBasicInfoForm,
  ItemBasicInfoDisplay,
} from "../../../../../../components/ui/forms";
import type { AmenitySectionProps } from "./types";

const AMENITY_CATEGORIES = [
  "Room Service",
  "Spa & Wellness",
  "Fitness",
  "Business Services",
  "Entertainment",
  "Transportation",
  "Concierge",
  "Laundry & Cleaning",
  "Other Services",
];

/**
 * AmenityBasicSection - Name, price, and category
 * Shows form in create/edit mode, display in view mode
 */
export function AmenityBasicSection({
  mode,
  formData,
  amenity,
  onFieldChange,
  errors = {},
  disabled = false,
}: AmenitySectionProps) {
  const isViewMode = mode === "view";

  if (isViewMode && amenity) {
    // View mode: Display basic info
    return (
      <ItemBasicInfoDisplay
        name={amenity.name}
        category={amenity.category}
        hotelRecommended={amenity.recommended}
      />
    );
  }

  // Create/Edit mode: Form inputs
  return (
    <ModalFormSection title="Basic Information">
      <ItemBasicInfoForm
        formData={{
          name: formData?.name || "",
          price: formData?.price || "",
          category: formData?.category || "",
        }}
        errors={{
          name: errors.name,
          price: errors.price,
          category: errors.category,
        }}
        disabled={disabled}
        onChange={(field: string, value: string) =>
          onFieldChange?.(field, value)
        }
        categories={AMENITY_CATEGORIES}
        nameLabel="Amenity Name"
        priceLabel="Price"
        categoryLabel="Category"
      />
    </ModalFormSection>
  );
}
