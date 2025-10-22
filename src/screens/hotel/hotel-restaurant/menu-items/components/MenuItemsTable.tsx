import { useMemo } from "react";
import {
  Table,
  type TableColumn,
  StatusBadge,
  ConfirmationModal,
} from "../../../../../components/ui";
import {
  useMenuItems,
  useUpdateMenuItem,
  useDeleteMenuItem,
} from "../../../../../hooks/hotel-restaurant/menu-items/useMenuItems";
import { useRestaurants } from "../../../../../hooks/hotel-restaurant/restaurants/useRestaurants";
import { useHotelId, usePagination } from "../../../../../hooks";
import { MenuItemDetailModal } from "./menu-item-detail-modal";
import { AddMenuItemModal } from "./add-menu-item-modal";
import { useItemTableModals } from "../../../../../components/shared/tables/useItemTableModals";
import type { Database } from "../../../../../types/database";

type MenuItemRow = Database["public"]["Tables"]["menu_items"]["Row"];

interface MenuItem extends Record<string, unknown> {
  id: string;
  status: string;
  isActive: boolean;
  imageUrl: string | null;
  item: string;
  category: string;
  restaurant: string;
  price: string;
  hotelRecommended: boolean | null;
}

interface MenuItemsTableProps {
  searchValue: string;
}

export function MenuItemsTable({ searchValue }: MenuItemsTableProps) {
  const hotelId = useHotelId();

  // Use shared modal state management hook
  const {
    selectedItem: selectedMenuItem,
    isDetailModalOpen,
    openDetailModal,
    closeDetailModal,
    itemToEdit: menuItemToEdit,
    isEditModalOpen,
    closeEditModal,
    itemToDelete: menuItemToDelete,
    isDeleteConfirmOpen,
    closeDeleteConfirm,
    handleEdit,
    handleDelete,
  } = useItemTableModals<MenuItemRow>();

  // Fetch menu items using the hook
  const {
    data: menuItems,
    isLoading,
    error,
  } = useMenuItems(hotelId || undefined);

  // Fetch restaurants for name mapping
  const { data: restaurants } = useRestaurants(hotelId || undefined);

  // Get the mutations
  const updateMenuItem = useUpdateMenuItem();
  const deleteMenuItem = useDeleteMenuItem();

  // Create a map of restaurant IDs to names
  const restaurantMap = useMemo(() => {
    if (!restaurants) return new Map<string, string>();
    return new Map(restaurants.map((r) => [r.id, r.name]));
  }, [restaurants]);

  // Handle row click
  const handleRowClick = (row: MenuItem) => {
    const fullMenuItem = menuItems?.find((item) => item.id === row.id);
    if (fullMenuItem) {
      openDetailModal(fullMenuItem);
    }
  };

  const handleCloseModal = closeDetailModal;

  // Edit and delete handlers are now provided by the hook

  const confirmDelete = () => {
    if (menuItemToDelete && hotelId) {
      deleteMenuItem.mutate(
        { id: menuItemToDelete.id, hotelId },
        {
          onSuccess: () => {
            closeDeleteConfirm();
          },
        }
      );
    }
  };

  // Define table columns for menu items
  const columns: TableColumn<MenuItem>[] = [
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (_value, row) => (
        <StatusBadge
          status={row.isActive ? "active" : "inactive"}
          onToggle={async (newStatus) => {
            await updateMenuItem.mutateAsync({
              id: row.id,
              updates: { is_active: newStatus },
            });
          }}
        />
      ),
    },
    {
      key: "imageUrl",
      label: "Image",
      sortable: false,
      render: (value) => (
        <div className="flex items-center justify-center">
          {value ? (
            <img
              src={value as string}
              alt="Menu item"
              className="w-12 h-12 object-cover rounded-lg border border-gray-200"
            />
          ) : (
            <div className="w-12 h-12 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}
        </div>
      ),
    },
    {
      key: "item",
      label: "Item",
      sortable: true,
      render: (_value, row) => (
        <div className="flex items-center gap-2">
          <span>{row.item}</span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              updateMenuItem.mutate({
                id: row.id,
                updates: { hotel_recommended: !row.hotelRecommended },
              });
            }}
            className="text-base hover:scale-110 transition-transform cursor-pointer"
            title={
              row.hotelRecommended
                ? "Remove from recommended"
                : "Mark as recommended"
            }
          >
            {row.hotelRecommended ? "⭐" : "☆"}
          </button>
        </div>
      ),
    },
    {
      key: "category",
      label: "Category",
      sortable: true,
    },
    {
      key: "restaurant",
      label: "Restaurant",
      sortable: true,
    },
    {
      key: "price",
      label: "Price",
      sortable: true,
    },
  ];

  // Transform database data to table format with search filtering
  const menuItemData: MenuItem[] = useMemo(() => {
    if (!menuItems) {
      return [];
    }

    return menuItems
      .filter((item: MenuItemRow) => {
        if (!searchValue) return true;

        const search = searchValue.toLowerCase();
        return (
          item.name.toLowerCase().includes(search) ||
          item.category.toLowerCase().includes(search) ||
          item.description?.toLowerCase().includes(search) ||
          false
        );
      })
      .map((item: MenuItemRow) => {
        // Map restaurant IDs to names
        let restaurantDisplay = "All restaurants";
        if (item.restaurant_ids && item.restaurant_ids.length > 0) {
          const restaurantNames = item.restaurant_ids
            .map((id) => restaurantMap.get(id))
            .filter((name): name is string => name !== undefined);

          if (restaurantNames.length > 0) {
            restaurantDisplay = restaurantNames.join(", ");
          }
        }

        return {
          id: item.id,
          status: item.is_active ? "Active" : "Inactive",
          isActive: item.is_active,
          imageUrl: item.image_url,
          item: item.name,
          category: item.category,
          restaurant: restaurantDisplay,
          price: `$${item.price.toFixed(2)}`,
          hotelRecommended: item.hotel_recommended,
        };
      });
  }, [menuItems, searchValue, restaurantMap]);

  // Pagination
  const {
    currentPage,
    totalPages,
    paginatedData,
    itemsPerPage,
    setCurrentPage,
  } = usePagination<MenuItem>({ data: menuItemData, itemsPerPage: 10 });

  if (error) {
    return (
      <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md">
        <p className="text-sm text-red-600">
          Error loading menu items: {error.message}
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6">
      {searchValue && (
        <p className="text-sm text-gray-600 mb-4">
          Searching for: "{searchValue}"
        </p>
      )}

      {/* Menu Items Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        <Table
          columns={columns}
          data={paginatedData}
          loading={isLoading}
          emptyMessage="No menu items found. Add new menu items to get started."
          onRowClick={handleRowClick}
          showPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={menuItemData.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Detail Modal */}
      <MenuItemDetailModal
        isOpen={isDetailModalOpen}
        onClose={handleCloseModal}
        menuItem={selectedMenuItem}
        restaurants={restaurantMap}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Edit Modal */}
      <AddMenuItemModal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        menuItem={menuItemToEdit}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteConfirmOpen}
        onClose={closeDeleteConfirm}
        onConfirm={confirmDelete}
        title="Delete Menu Item"
        message={`Are you sure you want to delete "${menuItemToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
        loading={deleteMenuItem.isPending}
      />
    </div>
  );
}
