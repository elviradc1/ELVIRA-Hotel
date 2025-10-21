import { Table, type TableColumn } from "../../../../../components/ui";

interface AmenityOrder extends Record<string, unknown> {
  id: string;
  requestId: string;
  amenity: string;
  guest: string;
  room: string;
  status: string;
  created: string;
}

interface AmenityOrdersTableProps {
  searchValue: string;
}

export function AmenityOrdersTable({ searchValue }: AmenityOrdersTableProps) {
  // Define table columns for amenity orders
  const orderColumns: TableColumn<AmenityOrder>[] = [
    {
      key: "requestId",
      label: "Request ID",
      sortable: true,
    },
    {
      key: "amenity",
      label: "Amenity",
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
  const orderData: AmenityOrder[] = [];

  return (
    <div className="mt-6">
      {searchValue && (
        <p className="text-sm text-gray-600 mb-4">
          Searching for: "{searchValue}"
        </p>
      )}

      {/* Amenity Orders Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        <Table
          columns={orderColumns}
          data={orderData}
          emptyMessage="No amenity orders found. Orders will appear here once guests start requesting amenities."
        />
      </div>
    </div>
  );
}
