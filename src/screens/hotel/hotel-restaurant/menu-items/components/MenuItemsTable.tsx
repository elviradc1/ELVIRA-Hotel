import { useMemo, useEffect } from "react";
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
  console.log("🍔🍔🍔 MENU ITEMS TABLE COMPONENT LOADED 🍔🍔🍔");

  const hotelId = useHotelId();

  console.log("🍔 MenuItemsTable - Component Rendered:", {
    hotelId,
    searchValue,
    timestamp: new Date().toISOString(),
  });

  // Fetch menu items using the hook
  const {
    data: menuItems,
    isLoading,
    error,
    isFetching,
    dataUpdatedAt,
  } = useMenuItems(hotelId || undefined);

  useEffect(() => {
    console.log("🍔 MenuItems - Data State Changed:", {
      hotelId,
      isLoading,
      isFetching,
      error: error?.message,
      dataCount: menuItems?.length || 0,
      dataUpdatedAt: dataUpdatedAt
        ? new Date(dataUpdatedAt).toISOString()
        : "never",
      rawData: menuItems,
      timestamp: new Date().toISOString(),
    });
  }, [hotelId, isLoading, isFetching, error, menuItems, dataUpdatedAt]);
  useEffect(() => {
    console.log("🍔 MenuItems - Data State Changed:", {
      hotelId,
      isLoading,
      isFetching,
      error: error?.message,
      dataCount: menuItems?.length || 0,
      dataUpdatedAt: dataUpdatedAt
        ? new Date(dataUpdatedAt).toISOString()
        : "never",
      rawData: menuItems,
      timestamp: new Date().toISOString(),
    });
  }, [hotelId, isLoading, isFetching, error, menuItems, dataUpdatedAt]);

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
      console.log("🍔 MenuItems - No data to transform");
      return [];
    }

    console.log("🍔 MenuItems - Transforming data:", {
      rawCount: menuItems.length,
      searchValue,
    });

    const transformed = menuItems
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

    console.log("🍔 MenuItems - Transformed data:", {
      transformedCount: transformed.length,
      sample: transformed[0],
    });

    return transformed;
  }, [menuItems, searchValue]);

  // Debug banner (always visible)
  const debugInfo = (
    <div
      style={{
        padding: "12px",
        marginBottom: "16px",
        backgroundColor: "#fef3c7",
        border: "2px solid #f59e0b",
        borderRadius: "8px",
        fontFamily: "monospace",
        fontSize: "13px",
      }}
    >
      <div
        style={{ fontWeight: "bold", marginBottom: "8px", color: "#92400e" }}
      >
        🍔 MENU ITEMS DEBUG INFO
      </div>
      <div style={{ color: "#78350f" }}>
        <div>
          <strong>Hotel ID:</strong> {hotelId || "Not set"}
        </div>
        <div>
          <strong>Loading:</strong> {isLoading ? "Yes" : "No"}
        </div>
        <div>
          <strong>Fetching:</strong> {isFetching ? "Yes" : "No"}
        </div>
        <div>
          <strong>Error:</strong> {error?.message || "None"}
        </div>
        <div>
          <strong>Raw Menu Items Count:</strong> {menuItems?.length || 0}
        </div>
        <div>
          <strong>Filtered Items Count:</strong> {menuItemData.length}
        </div>
        <div>
          <strong>Search Value:</strong> "{searchValue}"
        </div>
        <div>
          <strong>Last Updated:</strong>{" "}
          {dataUpdatedAt ? new Date(dataUpdatedAt).toLocaleString() : "Never"}
        </div>
      </div>
    </div>
  );

  if (error) {
    console.error("🍔 MenuItems - Error loading items:", error);
    return (
      <>
        {debugInfo}
        <div
          style={{
            padding: "20px",
            backgroundColor: "#fee2e2",
            border: "2px solid #ef4444",
            borderRadius: "8px",
            color: "#991b1b",
          }}
        >
          <strong>Error loading menu items:</strong> {error.message}
        </div>
      </>
    );
  }

  if (isLoading) {
    return (
      <>
        {debugInfo}
        <div
          style={{
            padding: "20px",
            backgroundColor: "#dbeafe",
            border: "2px solid #3b82f6",
            borderRadius: "8px",
            color: "#1e40af",
            textAlign: "center",
          }}
        >
          Loading menu items...
        </div>
      </>
    );
  }

  if (isLoading) {
    return (
      <>
        {debugInfo}
        <div
          style={{
            padding: "20px",
            backgroundColor: "#dbeafe",
            border: "2px solid #3b82f6",
            borderRadius: "8px",
            color: "#1e40af",
            textAlign: "center",
          }}
        >
          Loading menu items...
        </div>
      </>
    );
  }

  return (
    <div className="mt-6">
      {debugInfo}

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
          isLoading={isLoading}
          emptyMessage="No menu items found. Add new menu items to get started."
        />
      </div>
    </div>
  );
}
