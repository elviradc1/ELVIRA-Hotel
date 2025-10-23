import { useState } from "react";
import { Modal, ModalFooter } from "../../../../../../components/ui";
import {
  ItemImageDisplay,
  ItemBasicInfoDisplay,
  ItemDescriptionDisplay,
  ItemMetadataDisplay,
} from "../../../../../../components/ui/forms";
import { useUpdateAmenity } from "../../../../../../hooks/amenities/amenities/useAmenities";
import type { Database } from "../../../../../../types/database";

type AmenityRow = Database["public"]["Tables"]["amenities"]["Row"];

interface AmenityDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  amenity: AmenityRow | null;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function AmenityDetailModal({
  isOpen,
  onClose,
  amenity,
  onEdit,
  onDelete,
}: AmenityDetailModalProps) {
  const updateAmenity = useUpdateAmenity();
  const [isUpdating, setIsUpdating] = useState(false);

  if (!amenity) return null;

  const handleStatusToggle = async (newStatus: boolean) => {
    setIsUpdating(true);
    try {
      await updateAmenity.mutateAsync({
        id: amenity.id,
        updates: { is_active: newStatus },
      });
    } catch (error) {
} finally {
      setIsUpdating(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Amenity Details" size="md">
      <div className="space-y-3 max-h-[calc(100vh-250px)] overflow-y-auto">
        {/* Image with overlays */}
        <ItemImageDisplay
          imageUrl={amenity.image_url}
          itemName={amenity.name}
          price={amenity.price}
          isActive={amenity.is_active}
          onStatusToggle={isUpdating ? undefined : handleStatusToggle}
        />

        {/* Basic Info */}
        <ItemBasicInfoDisplay
          name={amenity.name}
          category={amenity.category}
          hotelRecommended={amenity.recommended}
        />

        {/* Description */}
        <ItemDescriptionDisplay description={amenity.description} />

        {/* Metadata */}
        <ItemMetadataDisplay
          createdAt={amenity.created_at}
          updatedAt={amenity.updated_at}
        />
      </div>

      {/* Footer Actions */}
      <ModalFooter
        onClose={onClose}
        onEdit={onEdit}
        onDelete={onDelete}
        showEdit={!!onEdit}
        showDelete={!!onDelete}
        isLoading={isUpdating}
      />
    </Modal>
  );
}
