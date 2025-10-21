import { ProductsTable } from "./components";

interface ProductsProps {
  searchValue: string;
}

export function Products({ searchValue }: ProductsProps) {
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Products Management
      </h2>
      <p className="text-gray-500">
        Manage hotel shop products, inventory, and pricing.
      </p>

      <ProductsTable searchValue={searchValue} />
    </div>
  );
}
