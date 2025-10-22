import { useMemo } from "react";
import {
  Table,
  type TableColumn,
  StatusBadge,
} from "../../../../../components/ui";
import {
  useRestaurants,
  useUpdateRestaurant,
} from "../../../../../hooks/hotel-restaurant/restaurants/useRestaurants";
import { useHotelId, usePagination } from "../../../../../hooks";
import type { Database } from "../../../../../types/database";

type RestaurantRow = Database["public"]["Tables"]["restaurants"]["Row"];

interface Restaurant extends Record<string, unknown> {
  id: string;
  restaurantStatus: string;
  isActive: boolean;
  name: string;
  cuisine: string;
  description: string;
}

interface RestaurantsTableProps {
  searchValue: string;
}

export function RestaurantsTable({ searchValue }: RestaurantsTableProps) {
  const hotelId = useHotelId();

  // Fetch restaurants using the hook
  const {
    data: restaurants,
    isLoading,
    error,
  } = useRestaurants(hotelId || undefined);

  // Get the update mutation
  const updateRestaurant = useUpdateRestaurant();

  // Define table columns for restaurants
  const columns: TableColumn<Restaurant>[] = [
    {
      key: "restaurantStatus",
      label: "Restaurant Status",
      sortable: true,
      render: (_value, row) => (
        <StatusBadge
          status={row.isActive ? "active" : "inactive"}
          onToggle={async (newStatus) => {
            await updateRestaurant.mutateAsync({
              id: row.id,
              updates: { is_active: newStatus },
            });
          }}
        />
      ),
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

  // Transform database data to table format with search filtering
  const restaurantData: Restaurant[] = useMemo(() => {
    if (!restaurants) {
      return [];
    }

    return restaurants
      .filter((restaurant: RestaurantRow) => {
        if (!searchValue) return true;

        const search = searchValue.toLowerCase();
        return (
          restaurant.name.toLowerCase().includes(search) ||
          restaurant.cuisine.toLowerCase().includes(search) ||
          (restaurant.description &&
            restaurant.description.toLowerCase().includes(search))
        );
      })
      .map((restaurant: RestaurantRow) => ({
        id: restaurant.id,
        restaurantStatus: restaurant.is_active ? "Active" : "Inactive",
        isActive: restaurant.is_active,
        name: restaurant.name,
        cuisine: restaurant.cuisine,
        description: restaurant.description || "N/A",
      }));
  }, [restaurants, searchValue]);

  // Pagination
  const {
    currentPage,
    totalPages,
    paginatedData,
    itemsPerPage,
    setCurrentPage,
  } = usePagination<Restaurant>({ data: restaurantData, itemsPerPage: 10 });

  if (error) {
    return (
      <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md">
        <p className="text-sm text-red-600">
          Error loading restaurants: {error.message}
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6">
      {searchValue && (
        <p className="text-sm text-gray-600 mb-4">
          Searching for: "{searchValue}" - Found {restaurantData.length}{" "}
          result(s)
        </p>
      )}

      {/* Restaurants Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        <Table
          columns={columns}
          data={paginatedData}
          loading={isLoading}
          emptyMessage={
            searchValue
              ? `No restaurants found matching "${searchValue}".`
              : "No restaurants found. Add new restaurants to get started."
          }
          showPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={restaurantData.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
