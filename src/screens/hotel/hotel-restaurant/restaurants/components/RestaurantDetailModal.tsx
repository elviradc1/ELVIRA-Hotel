import { useState } from "react";
import { Modal, ModalFooter } from "../../../../../components/ui";
import {
  ItemBasicInfoDisplay,
  ItemDetailsGrid,
  ItemMetadataDisplay,
} from "../../../../../components/ui/forms";
import { useUpdateRestaurant } from "../../../../../hooks/hotel-restaurant/restaurants/useRestaurants";
import type { Database } from "../../../../../types/database";

type Restaurant = Database["public"]["Tables"]["restaurants"]["Row"];

interface RestaurantDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  restaurant: Restaurant | null;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function RestaurantDetailModal({
  isOpen,
  onClose,
  restaurant,
  onEdit,
  onDelete,
}: RestaurantDetailModalProps) {
  const updateRestaurant = useUpdateRestaurant();
  const [isUpdating, setIsUpdating] = useState(false);

  if (!restaurant) return null;

  const handleStatusToggle = async (newStatus: boolean) => {
    setIsUpdating(true);
    try {
      await updateRestaurant.mutateAsync({
        id: restaurant.id,
        updates: { is_active: newStatus },
      });
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  // Prepare details for the grid
  const details = [
    { label: "Cuisine", value: restaurant.cuisine || null },
    {
      label: "Food Types",
      value:
        restaurant.food_types && restaurant.food_types.length > 0
          ? restaurant.food_types
          : null,
    },
    { label: "Description", value: restaurant.description || null },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Restaurant Details"
      size="md"
    >
      <div className="space-y-3 max-h-[calc(100vh-250px)] overflow-y-auto">
        {/* Status Badge */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
          <span className="text-sm font-medium text-gray-700">Status</span>
          <button
            onClick={() => handleStatusToggle(!restaurant.is_active)}
            disabled={isUpdating}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
              restaurant.is_active
                ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            } ${
              isUpdating ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
            }`}
          >
            {restaurant.is_active ? "Active" : "Inactive"}
          </button>
        </div>

        {/* Basic Info */}
        <ItemBasicInfoDisplay
          name={restaurant.name}
          category="Restaurant"
          hotelRecommended={false}
        />

        {/* Details Grid */}
        <ItemDetailsGrid details={details} />

        {/* Metadata */}
        <ItemMetadataDisplay
          createdAt={restaurant.created_at}
          updatedAt={restaurant.updated_at}
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
