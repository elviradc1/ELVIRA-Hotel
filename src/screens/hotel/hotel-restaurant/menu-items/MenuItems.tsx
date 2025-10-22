import { useState } from "react";
import { MenuItemsTable, AddMenuItemModal } from "./components";
import { ManagementPageHeader } from "../../../../components/shared";

interface MenuItemsProps {
  searchValue: string;
}

export function MenuItems({ searchValue }: MenuItemsProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <div className="p-6">
      <ManagementPageHeader
        title="Menu Items"
        description="Manage restaurant menu items, prices, and availability."
        buttonLabel="Add Menu Item"
        onButtonClick={() => setIsAddModalOpen(true)}
      />

      <MenuItemsTable searchValue={searchValue} />

      <AddMenuItemModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
}
