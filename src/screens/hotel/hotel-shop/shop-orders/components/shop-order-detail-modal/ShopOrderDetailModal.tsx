import { Modal, Button } from "../../../../../../components/ui";
import {
  OrderField,
  OrderStatusBadge,
  OrderItemRow,
} from "../../../../../../components/ui/forms/order-details";
import type { ShopOrderWithDetails } from "../../../../../../hooks/hotel-shop/shop-orders/useShopOrders";

interface ShopOrderDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: ShopOrderWithDetails | null;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function ShopOrderDetailModal({
  isOpen,
  onClose,
  order,
  onEdit,
  onDelete,
}: ShopOrderDetailModalProps) {
  if (!order) return null;

  // Format date and time
  const formatDateTime = (date: string | null, time: string | null) => {
    if (!date) return "N/A";
    const dateObj = new Date(date);
    const formattedDate = dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    if (time) {
      return `${formattedDate} at ${time}`;
    }
    return formattedDate;
  };

  const deliveryDate = formatDateTime(order.delivery_date, order.delivery_time);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Shop Order Details"
      size="md"
    >
      {/* Scrollable Content Area */}
      <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
        {/* Order ID */}
        <OrderField label="Order ID" value={`#${order.id.slice(0, 8)}`} />

        {/* Guest Info */}
        {order.guests && (
          <>
            <OrderField label="Guest" value={order.guests.guest_name} />
            <OrderField label="Room" value={order.guests.room_number} />
          </>
        )}

        {/* Delivery Details */}
        <OrderField label="Delivery" value={deliveryDate} />

        {/* Special Instructions */}
        <OrderField
          label="Special Instructions"
          value={order.special_instructions || "No special requirements"}
        />

        {/* Status */}
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">
            Status
          </span>
          <OrderStatusBadge status={order.status} />
        </div>

        {/* Created Date */}
        <OrderField
          label="Created"
          value={
            order.created_at
              ? new Date(order.created_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "N/A"
          }
        />

        {/* Products Section */}
        <div className="pt-4 border-t border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">
            Products
          </h3>
          <div className="space-y-2">
            {order.shop_order_items && order.shop_order_items.length > 0 ? (
              order.shop_order_items.map((item) => (
                <OrderItemRow
                  key={item.id}
                  imageUrl={item.products?.image_url || null}
                  name={item.products?.name || "Unknown Product"}
                  price={item.price_at_order}
                  quantity={item.quantity}
                />
              ))
            ) : (
              <p className="text-sm text-gray-500 italic">No items found</p>
            )}
          </div>
        </div>

        {/* Total */}
        <div className="pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                Total
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                {order.shop_order_items?.length || 0} items
              </p>
            </div>
            <p className="text-2xl font-bold text-emerald-600">
              ${order.total_price.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex justify-between items-center gap-3 pt-4 mt-4 border-t border-gray-200">
        <div className="flex gap-2">
          {onEdit && (
            <Button variant="outline" size="md" onClick={onEdit}>
              Edit
            </Button>
          )}
          {onDelete && (
            <Button variant="outline" size="md" onClick={onDelete}>
              Delete
            </Button>
          )}
        </div>
        <Button variant="primary" size="md" onClick={onClose}>
          Close
        </Button>
      </div>
    </Modal>
  );
}
