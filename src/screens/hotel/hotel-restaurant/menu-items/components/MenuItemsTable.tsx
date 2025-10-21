import { Table, type TableColumn } from "../../../../../components/ui";

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

  // Empty data array - no mock data
  const menuItemData: MenuItem[] = [];

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
          emptyMessage="No menu items found. Add new menu items to get started."
        />
      </div>
    </div>
  );
}
