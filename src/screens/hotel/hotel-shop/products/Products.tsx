import { useState } from "react";
import { ProductsTable, AddProductModal } from "./components";
import { ManagementPageHeader } from "../../../../components/shared";

interface ProductsProps {
  searchValue: string;
}

export function Products({ searchValue }: ProductsProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <div className="p-6">
      <ManagementPageHeader
        title="Products Management"
        description="Manage hotel shop products, inventory, and pricing."
        buttonLabel="Add Product"
        onButtonClick={() => setIsAddModalOpen(true)}
      />

      <ProductsTable searchValue={searchValue} />

      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
}
