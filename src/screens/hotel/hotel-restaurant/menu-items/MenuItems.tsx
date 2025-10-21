import { MenuItemsTable } from "./components";

interface MenuItemsProps {
  searchValue: string;
}

export function MenuItems({ searchValue }: MenuItemsProps) {
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Menu Items</h2>
      <p className="text-gray-500">
        Manage restaurant menu items, prices, and availability.
      </p>

      <MenuItemsTable searchValue={searchValue} />
    </div>
  );
}
