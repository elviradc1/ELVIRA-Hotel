import { ModalFormSection } from "../../../../../../components/ui/modalform";
import type { ShopOrderWithDetails } from "../../../../../../hooks/hotel-shop/shop-orders/useShopOrders";

interface OrderItemsSectionProps {
  order: ShopOrderWithDetails;
}

export function OrderItemsSection({ order }: OrderItemsSectionProps) {
  if (!order.shop_order_items || order.shop_order_items.length === 0) {
    return (
      <ModalFormSection title="Order Items">
        <p className="text-sm text-gray-500">No items in this order.</p>
      </ModalFormSection>
    );
  }

  return (
    <ModalFormSection title="Order Items">
      <div className="space-y-3">
        {order.shop_order_items.map((item, index) => (
          <div
            key={index}
            className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-200"
          >
            <div className="flex-1">
              <p className="font-medium text-gray-900">
                {item.products?.name || "Unknown Product"}
              </p>
              <p className="text-sm text-gray-600">
                Quantity: {item.quantity} × $
                {item.price_at_order?.toFixed(2) || "0.00"}
              </p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-900">
                $
                {((item.quantity || 0) * (item.price_at_order || 0)).toFixed(2)}
              </p>
            </div>
          </div>
        ))}

        {/* Total */}
        <div className="flex justify-between items-center pt-3 border-t border-gray-300">
          <p className="font-semibold text-gray-900">Total</p>
          <p className="font-bold text-lg text-emerald-600">
            ${order.total_price?.toFixed(2) || "0.00"}
          </p>
        </div>
      </div>
    </ModalFormSection>
  );
}
