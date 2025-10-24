import {
  ModalFormSection,
  ModalFormField,
} from "../../../../../../components/ui/modalform";
import type { ShopOrderWithDetails } from "../../../../../../hooks/hotel-shop/shop-orders/useShopOrders";

interface OrderInfoSectionProps {
  order: ShopOrderWithDetails;
}

export function OrderInfoSection({ order }: OrderInfoSectionProps) {
  return (
    <ModalFormSection title="Order Information">
      <div className="grid grid-cols-2 gap-4">
        <ModalFormField
          label="Order ID"
          value={order.id.substring(0, 8).toUpperCase()}
        />
        <ModalFormField label="Status" value={order.status} />
        <ModalFormField
          label="Guest"
          value={order.guests?.guest_name || "N/A"}
        />
        <ModalFormField
          label="Room"
          value={order.guests?.room_number || "N/A"}
        />
        <ModalFormField
          label="Total Price"
          value={`$${order.total_price?.toFixed(2) || "0.00"}`}
        />
        <ModalFormField
          label="Created At"
          value={
            order.created_at
              ? new Date(order.created_at).toLocaleString()
              : "N/A"
          }
        />
      </div>
    </ModalFormSection>
  );
}
