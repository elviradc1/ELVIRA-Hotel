import { ModalFormSection } from "../../../../../../components/ui/modalform";
import {
  OrderField,
  OrderStatusBadge,
} from "../../../../../../components/ui/forms/order-details";
import type { DineInOrderWithDetails } from "../../../../../../hooks/hotel-restaurant/dine-in-orders/useDineInOrders";

interface OrderInfoSectionProps {
  order: DineInOrderWithDetails;
}

export function OrderInfoSection({ order }: OrderInfoSectionProps) {
  return (
    <ModalFormSection title="Order Information">
      <div className="space-y-4">
        <OrderField label="Order ID" value={`#${order.id.slice(0, 8)}`} />

        <OrderField
          label="Order Type"
          value={order.order_type.replace(/_/g, " ")}
        />

        <OrderField
          label="Guest"
          value={order.guests?.guest_name || "Unknown Guest"}
        />

        <OrderField
          label="Room Number"
          value={order.guests?.room_number || "N/A"}
        />

        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">
            Status
          </span>
          <OrderStatusBadge status={order.status} />
        </div>

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
      </div>
    </ModalFormSection>
  );
}
