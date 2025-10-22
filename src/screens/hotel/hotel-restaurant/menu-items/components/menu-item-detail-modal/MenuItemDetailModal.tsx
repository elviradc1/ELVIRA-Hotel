import { useState } from "react";
import { Modal, ModalFooter } from "../../../../../../components/ui";
import {
  ItemImageDisplay,
  ItemBasicInfoDisplay,
  ItemDescriptionDisplay,
  ItemDetailsGrid,
  ItemMetadataDisplay,
} from "../../../../../../components/ui/forms";
import { useUpdateMenuItem } from "../../../../../../hooks/hotel-restaurant/menu-items/useMenuItems";
import type { Database } from "../../../../../../types/database";

type MenuItemRow = Database["public"]["Tables"]["menu_items"]["Row"];

interface MenuItemDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  menuItem: MenuItemRow | null;
  restaurants: Map<string, string>;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function MenuItemDetailModal({
  isOpen,
  onClose,
  menuItem,
  restaurants,
  onEdit,
  onDelete,
}: MenuItemDetailModalProps) {
  const updateMenuItem = useUpdateMenuItem();
  const [isUpdating, setIsUpdating] = useState(false);

  if (!menuItem) return null;

  // Map restaurant IDs to names
  const restaurantNames =
    menuItem.restaurant_ids
      ?.map((id) => restaurants.get(id))
      .filter((name): name is string => name !== undefined) || [];

  const handleStatusToggle = async (newStatus: boolean) => {
    setIsUpdating(true);
    try {
      await updateMenuItem.mutateAsync({
        id: menuItem.id,
        updates: { is_active: newStatus },
      });
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Menu Item Details"
      size="md"
    >
      <div className="space-y-3 max-h-[calc(100vh-250px)] overflow-y-auto">
        {/* Image with overlays */}
        <ItemImageDisplay
          imageUrl={menuItem.image_url}
          itemName={menuItem.name}
          price={menuItem.price}
          isActive={menuItem.is_active}
          onStatusToggle={isUpdating ? undefined : handleStatusToggle}
        />

        {/* Basic Info */}
        <ItemBasicInfoDisplay
          name={menuItem.name}
          category={menuItem.category}
          hotelRecommended={menuItem.hotel_recommended}
        />

        {/* Description */}
        <ItemDescriptionDisplay description={menuItem.description} />

        {/* Details Grid */}
        <ItemDetailsGrid
          details={[
            {
              label: "Service Types",
              value: menuItem.service_type
                ? menuItem.service_type.map((type) =>
                    type === "room-service" ? "Room Service" : "Restaurant"
                  )
                : null,
            },
            {
              label: "Restaurants",
              value: restaurantNames.length > 0 ? restaurantNames : null,
            },
            {
              label: "Special Types",
              value: menuItem.special_type || null,
            },
          ]}
        />

        {/* Metadata */}
        <ItemMetadataDisplay
          createdAt={menuItem.created_at}
          updatedAt={menuItem.updated_at}
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
