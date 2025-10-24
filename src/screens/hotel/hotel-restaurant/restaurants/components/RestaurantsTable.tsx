import { useMemo, useState } from "react";
import {
  Table,
  type TableColumn,
  StatusBadge,
  ConfirmationModal,
} from "../../../../../components/ui";
import {
  useRestaurants,
  useUpdateRestaurant,
  useDeleteRestaurant,
} from "../../../../../hooks/hotel-restaurant/restaurants/useRestaurants";
import { useHotelId } from "../../../../../hooks";
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
  onEdit?: (restaurant: RestaurantRow) => void;
  onView?: (restaurant: RestaurantRow) => void;
  onDelete?: (restaurant: RestaurantRow) => void;
}

export function RestaurantsTable({
  searchValue,
  onView,
}: RestaurantsTableProps) {
  const hotelId = useHotelId();

  // Fetch restaurants using the hook
  const {
    data: restaurants,
    isLoading,
    error,
  } = useRestaurants(hotelId || undefined);

  // Get the update and delete mutations
  const updateRestaurant = useUpdateRestaurant();
  const deleteRestaurant = useDeleteRestaurant();

  // State for delete confirmation
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [restaurantToDelete, setRestaurantToDelete] =
    useState<RestaurantRow | null>(null);

  // Handlers
  const handleRowClick = (restaurant: Restaurant) => {
    const originalRestaurant = restaurants?.find(
      (r: RestaurantRow) => r.id === restaurant.id
    );
    if (originalRestaurant && onView) {
      onView(originalRestaurant);
    }
  };

  const confirmDelete = async () => {
    if (!restaurantToDelete || !hotelId) return;

    try {
      await deleteRestaurant.mutateAsync({
        id: restaurantToDelete.id,
        hotelId,
      });
      setIsDeleteConfirmOpen(false);
      setRestaurantToDelete(null);
    } catch {
      // Error is handled by the mutation
    }
  };

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
          data={restaurantData}
          loading={isLoading}
          emptyMessage={
            searchValue
              ? `No restaurants found matching "${searchValue}".`
              : "No restaurants found. Add new restaurants to get started."
          }
          itemsPerPage={10}
          onRowClick={handleRowClick}
        />
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Restaurant"
        message={`Are you sure you want to delete "${restaurantToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
}
