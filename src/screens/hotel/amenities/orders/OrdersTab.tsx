import { AmenityOrdersTable } from "./components";

interface AmenityOrdersProps {
  searchValue: string;
}

export function AmenityOrders({ searchValue }: AmenityOrdersProps) {
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Amenity Orders
      </h2>
      <p className="text-gray-500">
        Track and manage guest orders for amenities and services.
      </p>

      <AmenityOrdersTable searchValue={searchValue} />
    </div>
  );
}
