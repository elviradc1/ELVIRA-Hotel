import { useState } from "react";
import { Modal, ModalFooter } from "../../../../../../components/ui";
import {
  ItemImageDisplay,
  ItemBasicInfoDisplay,
  ItemDescriptionDisplay,
  ItemDetailsGrid,
  ItemMetadataDisplay,
} from "../../../../../../components/ui/forms";
import { useUpdateProduct } from "../../../../../../hooks/hotel-shop/products/useProducts";
import type { Database } from "../../../../../../types/database";

type ProductRow = Database["public"]["Tables"]["products"]["Row"];

interface ProductDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: ProductRow | null;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function ProductDetailModal({
  isOpen,
  onClose,
  product,
  onEdit,
  onDelete,
}: ProductDetailModalProps) {
  const updateProduct = useUpdateProduct();
  const [isUpdating, setIsUpdating] = useState(false);

  if (!product) return null;

  const handleStatusToggle = async (newStatus: boolean) => {
    setIsUpdating(true);
    try {
      await updateProduct.mutateAsync({
        id: product.id,
        updates: { is_active: newStatus },
      });
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Product Details" size="md">
      <div className="space-y-3 max-h-[calc(100vh-250px)] overflow-y-auto">
        {/* Image with overlays */}
        <ItemImageDisplay
          imageUrl={product.image_url}
          itemName={product.name}
          price={product.price}
          isActive={product.is_active}
          onStatusToggle={isUpdating ? undefined : handleStatusToggle}
        />

        {/* Basic Info */}
        <ItemBasicInfoDisplay
          name={product.name}
          category={product.category}
          hotelRecommended={product.recommended}
        />

        {/* Description */}
        <ItemDescriptionDisplay description={product.description} />

        {/* Details Grid */}
        <ItemDetailsGrid
          details={[
            {
              label: "Stock",
              value: product.is_unlimited_stock
                ? ["Unlimited Stock"]
                : [`${product.stock_quantity || 0} units`],
            },
            {
              label: "Mini Bar",
              value: product.mini_bar ? ["Available in Mini Bar"] : null,
            },
          ]}
        />

        {/* Metadata */}
        <ItemMetadataDisplay
          createdAt={product.created_at}
          updatedAt={product.updated_at}
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
