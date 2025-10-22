import { Modal, Button } from "../../../../../../components/ui";
import {
  OrderField,
  OrderStatusBadge,
  OrderItemRow,
} from "../../../../../../components/ui/forms/order-details";
import type { DineInOrderWithDetails } from "../../../../../../hooks/hotel-restaurant/dine-in-orders/useDineInOrders";

interface DineInOrderDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: DineInOrderWithDetails | null;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function DineInOrderDetailModal({
  isOpen,
  onClose,
  order,
  onEdit,
  onDelete,
}: DineInOrderDetailModalProps) {
  if (!order) return null;

  // Determine if it's room service or restaurant booking
  const isRoomService = order.order_type === "room_service";
  const isRestaurantBooking = order.order_type === "restaurant_booking";

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

  const orderDate = isRoomService
    ? formatDateTime(order.delivery_date, order.delivery_time)
    : formatDateTime(order.reservation_date, order.reservation_time);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isRoomService ? "Dine-In Order Details" : "Dine-In Order Details"}
      size="md"
    >
      {/* Scrollable Content Area */}
      <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
        {/* Order ID */}
        <OrderField label="Order ID" value={`#${order.id.slice(0, 8)}`} />

        {/* Order Type */}
        <OrderField
          label="Order Type"
          value={order.order_type.replace(/_/g, " ")}
        />

        {/* Restaurant (if applicable) */}
        {isRestaurantBooking && order.restaurants && (
          <OrderField label="Restaurant" value={order.restaurants.name} />
        )}

        {/* Details (Date/Time) */}
        <OrderField label="Details" value={orderDate} />

        {/* Number of Guests (for restaurant bookings) */}
        {isRestaurantBooking && order.number_of_guests && (
          <OrderField
            label="Number of Guests"
            value={order.number_of_guests.toString()}
          />
        )}

        {/* Table Preferences (for restaurant bookings) */}
        {isRestaurantBooking && order.table_preferences && (
          <OrderField
            label="Table Preferences"
            value={order.table_preferences}
          />
        )}

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

        {/* Menu Items Section */}
        <div className="pt-4 border-t border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">
            Menu Items
          </h3>
          <div className="space-y-2">
            {order.dine_in_order_items &&
            order.dine_in_order_items.length > 0 ? (
              order.dine_in_order_items.map((item) => (
                <OrderItemRow
                  key={item.id}
                  imageUrl={item.menu_items?.image_url || null}
                  name={item.menu_items?.name || "Unknown Item"}
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
                {order.dine_in_order_items?.length || 0} items
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
