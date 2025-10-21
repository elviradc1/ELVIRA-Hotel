import { ShopOrdersTable } from "./components";

interface ShopOrdersProps {
  searchValue: string;
}

export function ShopOrders({ searchValue }: ShopOrdersProps) {
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Shop Orders</h2>
      <p className="text-gray-500">
        Track and manage guest orders from the hotel shop.
      </p>

      <ShopOrdersTable searchValue={searchValue} />
    </div>
  );
}
