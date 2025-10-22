import { Modal, Button } from "../../../../../../components/ui";
import {
  ItemImageUpload,
  ItemBasicInfoForm,
  ItemDescriptionForm,
  ItemRecommendedToggle,
} from "../../../../../../components/ui/forms";
import { useAmenityForm } from "../../../../../../hooks/forms";
import type { Database } from "../../../../../../types/database";

type AmenityRow = Database["public"]["Tables"]["amenities"]["Row"];

interface AddAmenityModalProps {
  isOpen: boolean;
  onClose: () => void;
  amenity?: AmenityRow | null;
}

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

export function AddAmenityModal({
  isOpen,
  onClose,
  amenity,
}: AddAmenityModalProps) {
  const {
    formData,
    errors,
    isEditMode,
    isPending,
    setFormData,
    handleFieldChange,
    handleSubmit,
    resetForm,
  } = useAmenityForm(amenity, onClose);

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEditMode ? "Edit Amenity" : "Add Amenity"}
      size="lg"
    >
      {/* Scrollable Content Area */}
      <div className="max-h-[calc(100vh-200px)] overflow-y-auto px-1">
        <div className="space-y-4">
          {/* Image Upload */}
          <ItemImageUpload
            value={formData.imageUrl}
            onChange={(url: string | null) =>
              setFormData((prev) => ({ ...prev, imageUrl: url }))
            }
            disabled={isPending}
            bucketPath="amenities"
            label="Amenity Image"
          />

          {/* Basic Info */}
          <ItemBasicInfoForm
            formData={{
              name: formData.name,
              price: formData.price,
              category: formData.category,
            }}
            errors={{
              name: errors.name,
              price: errors.price,
              category: errors.category,
            }}
            disabled={isPending}
            onChange={handleFieldChange}
            categories={AMENITY_CATEGORIES}
            nameLabel="Amenity Name"
            priceLabel="Price"
            categoryLabel="Category"
          />

          {/* Description */}
          <ItemDescriptionForm
            value={formData.description}
            error={errors.description}
            disabled={isPending}
            onChange={(value: string) =>
              handleFieldChange("description", value)
            }
          />

          {/* Recommended Toggle */}
          <ItemRecommendedToggle
            checked={formData.recommended}
            disabled={isPending}
            onChange={(value: boolean) =>
              setFormData((prev) => ({ ...prev, recommended: value }))
            }
          />
        </div>
      </div>

      {/* Fixed Action Buttons */}
      <div className="flex justify-end gap-3 pt-4 mt-4 border-t border-gray-200">
        <Button variant="outline" onClick={handleClose} disabled={isPending}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          loading={isPending}
          disabled={isPending}
        >
          {isEditMode ? "Save Changes" : "Add Amenity"}
        </Button>
      </div>
    </Modal>
  );
}
