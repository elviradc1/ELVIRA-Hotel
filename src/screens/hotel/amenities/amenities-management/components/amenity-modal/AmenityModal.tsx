import { useState, useEffect } from "react";
import { ModalForm, ModalFormActions } from "../../../../../../components/ui";
import { useAmenityForm } from "../../../../../../hooks/forms";
import { useUpdateAmenity } from "../../../../../../hooks/amenities/amenities/useAmenities";
import { AmenityImageSection } from "./AmenityImageSection";
import { AmenityBasicSection } from "./AmenityBasicSection";
import { AmenityDescriptionSection } from "./AmenityDescriptionSection";
import { AmenityRecommendedSection } from "./AmenityRecommendedSection";
import { AmenityMetadataSection } from "./AmenityMetadataSection";
import type { AmenityModalProps } from "./types";

export function AmenityModal({
  isOpen,
  onClose,
  amenity = null,
  mode: initialMode = "create",
  onEdit,
  onDelete,
}: AmenityModalProps) {
  const [internalMode, setInternalMode] = useState(initialMode);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const updateAmenity = useUpdateAmenity();

  const {
    formData,
    errors,
    isPending,
    setFormData,
    handleFieldChange,
    handleSubmit,
    resetForm,
  } = useAmenityForm(
    internalMode === "edit" || internalMode === "view" ? amenity : null,
    () => {
      handleClose();
    }
  );

  // Update internal mode when prop changes
  useEffect(() => {
    setInternalMode(initialMode);
  }, [initialMode]);

  const handleClose = () => {
    resetForm();
    setInternalMode(initialMode);
    onClose();
  };

  const handleEditClick = () => {
    if (onEdit) {
      onEdit();
    } else {
      setInternalMode("edit");
    }
  };

  const handleDeleteClick = () => {
    if (onDelete) {
      onDelete();
    }
  };

  const handleImageChange = (url: string | null) => {
    setFormData((prev) => ({ ...prev, imageUrl: url }));
  };

  const handleFieldChangeWrapper = (
    field: string,
    value: string | boolean | null
  ) => {
    if (typeof value === "string") {
      handleFieldChange(field, value);
    } else {
      // Handle boolean or null values directly
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleStatusToggle = async (newStatus: boolean) => {
    if (!amenity) return;

    setIsUpdatingStatus(true);
    try {
      await updateAmenity.mutateAsync({
        id: amenity.id,
        updates: { is_active: newStatus },
      });
    } catch (error) {
      console.error("Error updating amenity status:", error);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const isDisabled = isPending || isUpdatingStatus;

  const modalTitle =
    internalMode === "view"
      ? "Amenity Details"
      : internalMode === "edit"
      ? "Edit Amenity"
      : "Add Amenity";

  return (
    <ModalForm
      isOpen={isOpen}
      onClose={handleClose}
      title={modalTitle}
      size="lg"
      footer={
        <ModalFormActions
          mode={internalMode}
          onCancel={handleClose}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
          onSubmit={handleSubmit}
          isPending={isDisabled}
          submitLabel={internalMode === "edit" ? "Save Changes" : "Add Amenity"}
        />
      }
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <div className="space-y-4">
          <AmenityImageSection
            mode={internalMode}
            formData={formData}
            amenity={amenity}
            disabled={isDisabled}
            onImageChange={handleImageChange}
            onStatusToggle={handleStatusToggle}
          />

          <AmenityBasicSection
            mode={internalMode}
            formData={formData}
            amenity={amenity}
            onFieldChange={handleFieldChangeWrapper}
            errors={errors as Record<string, string | undefined>}
            disabled={isDisabled}
          />

          <AmenityDescriptionSection
            mode={internalMode}
            formData={formData}
            amenity={amenity}
            onFieldChange={handleFieldChangeWrapper}
            errors={errors as Record<string, string | undefined>}
            disabled={isDisabled}
          />

          <AmenityRecommendedSection
            mode={internalMode}
            formData={formData}
            onFieldChange={handleFieldChangeWrapper}
            disabled={isDisabled}
          />

          <AmenityMetadataSection mode={internalMode} amenity={amenity} />
        </div>
      </form>
    </ModalForm>
  );
}
