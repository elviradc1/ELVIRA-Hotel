import { Modal, Button } from "../../../../../../components/ui";
import {
  ItemImageUpload,
  ItemBasicInfoForm,
  ItemDescriptionForm,
  ItemRecommendedToggle,
} from "../../../../../../components/ui/forms";
import { useProductForm } from "../../../../../../hooks/forms";
import type { Database } from "../../../../../../types/database";

type ProductRow = Database["public"]["Tables"]["products"]["Row"];

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: ProductRow | null;
}

const PRODUCT_CATEGORIES = [
  "Food & Snacks",
  "Beverages",
  "Personal Care",
  "Health & Wellness",
  "Electronics",
  "Reading Materials",
  "Souvenirs",
  "Other",
];

export function AddProductModal({
  isOpen,
  onClose,
  product,
}: AddProductModalProps) {
  const {
    formData,
    errors,
    isEditMode,
    isPending,
    setFormData,
    handleFieldChange,
    handleSubmit,
    resetForm,
  } = useProductForm(product, onClose);

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEditMode ? "Edit Product" : "Add Product"}
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
            bucketPath="products"
            label="Product Image"
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
            categories={PRODUCT_CATEGORIES}
            nameLabel="Product Name"
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

          {/* Stock Management */}
          <div className="space-y-3">
            <label className="flex items-center text-sm font-medium text-gray-700">
              <input
                type="checkbox"
                checked={formData.isUnlimitedStock}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    isUnlimitedStock: e.target.checked,
                  }))
                }
                disabled={isPending}
                className="mr-2 h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
              />
              Unlimited Stock
            </label>

            {!formData.isUnlimitedStock && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stock Quantity
                </label>
                <input
                  type="number"
                  value={formData.stockQuantity}
                  onChange={(e) =>
                    handleFieldChange("stockQuantity", e.target.value)
                  }
                  disabled={isPending}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Enter stock quantity"
                />
                {errors.stockQuantity && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.stockQuantity}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Product Options - 2 Columns */}
          <div className="grid grid-cols-2 gap-4">
            {/* Mini Bar Toggle */}
            <div className="flex items-center">
              <label className="flex items-center text-sm font-medium text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.miniBar}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      miniBar: e.target.checked,
                    }))
                  }
                  disabled={isPending}
                  className="mr-2 h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                />
                Mini Bar Item
              </label>
            </div>

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
          {isEditMode ? "Save Changes" : "Add Product"}
        </Button>
      </div>
    </Modal>
  );
}
