import { Table, type TableColumn } from "../../../../../components/ui";

interface RestaurantOrder extends Record<string, unknown> {
  id: string;
  orderId: string;
  type: string;
  items: string;
  guest: string;
  room: string;
  status: string;
  created: string;
}

interface RestaurantOrdersTableProps {
  searchValue: string;
}

export function RestaurantOrdersTable({
  searchValue,
}: RestaurantOrdersTableProps) {
  // Define table columns for restaurant orders
  const columns: TableColumn<RestaurantOrder>[] = [
    {
      key: "orderId",
      label: "Order ID",
      sortable: true,
    },
    {
      key: "type",
      label: "Type",
      sortable: true,
    },
    {
      key: "items",
      label: "Items",
      sortable: true,
    },
    {
      key: "guest",
      label: "Guest",
      sortable: true,
    },
    {
      key: "room",
      label: "Room",
      sortable: true,
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
    },
    {
      key: "created",
      label: "Created",
      sortable: true,
    },
  ];

  // Empty data array - no mock data
  const orderData: RestaurantOrder[] = [];

  return (
    <div className="mt-6">
      {searchValue && (
        <p className="text-sm text-gray-600 mb-4">
          Searching for: "{searchValue}"
        </p>
      )}

      {/* Restaurant Orders Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        <Table
          columns={columns}
          data={orderData}
          emptyMessage="No restaurant orders found. Orders will appear here once guests place orders."
        />
      </div>
    </div>
  );
}
