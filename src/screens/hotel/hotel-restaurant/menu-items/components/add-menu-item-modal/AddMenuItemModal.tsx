import { Modal, Button } from "../../../../../../components/ui";
import {
  ItemImageUpload,
  ItemBasicInfoForm,
  ItemDescriptionForm,
  ItemRecommendedToggle,
  ItemCheckboxGroup,
  ItemMultiSelect,
} from "../../../../../../components/ui/forms";
import { useRestaurants } from "../../../../../../hooks/hotel-restaurant/restaurants/useRestaurants";
import { useHotelContext } from "../../../../../../hooks/useHotelContext";
import { useMenuItemForm } from "../../../../../../hooks/forms";
import type { Database } from "../../../../../../types/database";

type MenuItemRow = Database["public"]["Tables"]["menu_items"]["Row"];

interface AddMenuItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  menuItem?: MenuItemRow | null;
}

const MENU_CATEGORIES = [
  "Appetizers",
  "Main Course",
  "Desserts",
  "Beverages",
  "Breakfast",
  "Lunch",
  "Dinner",
  "Snacks",
];

const SERVICE_TYPE_OPTIONS = [
  { value: "room-service", label: "Room Service" },
  { value: "restaurant", label: "Restaurant" },
];

export function AddMenuItemModal({
  isOpen,
  onClose,
  menuItem,
}: AddMenuItemModalProps) {
  const { hotelId } = useHotelContext();
  const { data: restaurants = [] } = useRestaurants(hotelId || undefined);

  const {
    formData,
    errors,
    isEditMode,
    isPending,
    setFormData,
    handleFieldChange,
    handleSubmit,
    resetForm,
  } = useMenuItemForm(menuItem, onClose);

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEditMode ? "Edit Menu Item" : "Add Menu Item"}
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
            bucketPath="menu-items"
            label="Menu Item Image"
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
            categories={MENU_CATEGORIES}
            nameLabel="Item Name"
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

          {/* Service Type & Hotel Recommended - 2 Columns */}
          <div className="grid grid-cols-2 gap-4">
            {/* Service Type */}
            <ItemCheckboxGroup
              label="Service Type"
              options={SERVICE_TYPE_OPTIONS}
              selectedValues={formData.serviceTypes}
              onChange={(types: string[]) =>
                setFormData((prev) => ({ ...prev, serviceTypes: types }))
              }
              disabled={isPending}
              hint="Optional"
            />

            {/* Hotel Recommended */}
            <ItemRecommendedToggle
              checked={formData.hotelRecommended}
              disabled={isPending}
              onChange={(value: boolean) =>
                setFormData((prev) => ({ ...prev, hotelRecommended: value }))
              }
            />
          </div>

          {/* Available Restaurants */}
          <ItemMultiSelect
            label="Available Restaurants"
            options={restaurants.map((r) => ({
              value: r.id,
              label: r.name,
            }))}
            selectedIds={formData.restaurantIds}
            onChange={(ids: string[]) =>
              setFormData((prev) => ({ ...prev, restaurantIds: ids }))
            }
            disabled={isPending}
            hint="Optional"
            placeholder="Select restaurants"
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
          {isEditMode ? "Save Changes" : "Add Menu Item"}
        </Button>
      </div>
    </Modal>
  );
}
