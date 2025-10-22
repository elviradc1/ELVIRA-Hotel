import { useMemo } from "react";
import { Table, type TableColumn } from "../../../../../components/ui";
import { useMenuItems } from "../../../../../hooks/hotel-restaurant/menu-items/useMenuItems";
import { useHotelId } from "../../../../../hooks/useHotelContext";
import type { Database } from "../../../../../types/database";

type MenuItemRow = Database["public"]["Tables"]["menu_items"]["Row"];

interface MenuItem extends Record<string, unknown> {
  id: string;
  status: string;
  item: string;
  category: string;
  restaurant: string;
  price: string;
}

interface MenuItemsTableProps {
  searchValue: string;
}

export function MenuItemsTable({ searchValue }: MenuItemsTableProps) {
  const hotelId = useHotelId();

  // Fetch menu items using the hook
  const {
    data: menuItems,
    isLoading,
    error,
  } = useMenuItems(hotelId || undefined);

  // Define table columns for menu items
  const columns: TableColumn<MenuItem>[] = [
    {
      key: "status",
      label: "Status",
      sortable: true,
    },
    {
      key: "item",
      label: "Item",
      sortable: true,
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
      .map((item: MenuItemRow) => ({
        id: item.id,
        status: item.is_active ? "Active" : "Inactive",
        item: item.name,
        category: item.category,
        restaurant:
          item.restaurant_ids && item.restaurant_ids.length > 0
            ? `${item.restaurant_ids.length} restaurant(s)`
            : "All restaurants",
        price: `$${item.price.toFixed(2)}`,
      }));
  }, [menuItems, searchValue]);

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
          data={menuItemData}
          loading={isLoading}
          emptyMessage="No menu items found. Add new menu items to get started."
        />
      </div>
    </div>
  );
}
