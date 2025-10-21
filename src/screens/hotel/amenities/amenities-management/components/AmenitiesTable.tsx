import { Table, type TableColumn } from "../../../../../components/ui";

interface Amenity extends Record<string, unknown> {
  id: string;
  status: string;
  amenity: string;
  category: string;
  price: string;
}

interface AmenitiesTableProps {
  searchValue: string;
}

export function AmenitiesTable({ searchValue }: AmenitiesTableProps) {
  // Define table columns for amenities
  const amenityColumns: TableColumn<Amenity>[] = [
    {
      key: "status",
      label: "Status",
      sortable: true,
    },
    {
      key: "amenity",
      label: "Amenity",
      sortable: true,
    },
    {
      key: "category",
      label: "Category",
      sortable: true,
    },
    {
      key: "price",
      label: "Price",
      sortable: true,
    },
  ];

  // Empty data array - no mock data
  const amenityData: Amenity[] = [];

  return (
    <div className="mt-6">
      {searchValue && (
        <p className="text-sm text-gray-600 mb-4">
          Searching for: "{searchValue}"
        </p>
      )}

      {/* Amenities Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        <Table
          columns={amenityColumns}
          data={amenityData}
          emptyMessage="No amenities found. Add new amenities to get started."
        />
      </div>
    </div>
  );
}
