import { Table, type TableColumn } from "../../../../../components/ui";

interface Restaurant extends Record<string, unknown> {
  id: string;
  restaurantStatus: string;
  name: string;
  cuisine: string;
  description: string;
}

interface RestaurantsTableProps {
  searchValue: string;
}

export function RestaurantsTable({ searchValue }: RestaurantsTableProps) {
  // Define table columns for restaurants
  const columns: TableColumn<Restaurant>[] = [
    {
      key: "restaurantStatus",
      label: "Restaurant Status",
      sortable: true,
    },
    {
      key: "name",
      label: "Name",
      sortable: true,
    },
    {
      key: "cuisine",
      label: "Cuisine",
      sortable: true,
    },
    {
      key: "description",
      label: "Description",
      sortable: true,
    },
  ];

  // Empty data array - no mock data
  const restaurantData: Restaurant[] = [];

  return (
    <div className="mt-6">
      {searchValue && (
        <p className="text-sm text-gray-600 mb-4">
          Searching for: "{searchValue}"
        </p>
      )}

      {/* Restaurants Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        <Table
          columns={columns}
          data={restaurantData}
          emptyMessage="No restaurants found. Add new restaurants to get started."
        />
      </div>
    </div>
  );
}
