import { Table, type TableColumn } from "../../../../../components/ui";

interface ShopOrder extends Record<string, unknown> {
  id: string;
  orderId: string;
  items: string;
  guest: string;
  room: string;
  status: string;
  createdAt: string;
}

interface ShopOrdersTableProps {
  searchValue: string;
}

export function ShopOrdersTable({ searchValue }: ShopOrdersTableProps) {
  // Define table columns for shop orders
  const columns: TableColumn<ShopOrder>[] = [
    {
      key: "orderId",
      label: "Order ID",
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
      key: "createdAt",
      label: "Created At",
      sortable: true,
    },
  ];

  // Empty data array - no mock data
  const orderData: ShopOrder[] = [];

  return (
    <div className="mt-6">
      {searchValue && (
        <p className="text-sm text-gray-600 mb-4">
          Searching for: "{searchValue}"
        </p>
      )}

      {/* Shop Orders Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        <Table
          columns={columns}
          data={orderData}
          emptyMessage="No shop orders found. Orders will appear here once guests start purchasing items."
        />
      </div>
    </div>
  );
}
