import { RestaurantOrdersTable } from "./components";

interface RestaurantOrdersProps {
  searchValue: string;
}

export function RestaurantOrders({ searchValue }: RestaurantOrdersProps) {
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Restaurant Orders
      </h2>
      <p className="text-gray-500">
        Track and manage guest restaurant orders and reservations.
      </p>

      <RestaurantOrdersTable searchValue={searchValue} />
    </div>
  );
}
