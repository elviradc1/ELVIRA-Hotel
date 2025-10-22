import { ProductsTable } from "./components";
import { Button } from "../../../../components/ui";

interface ProductsProps {
  searchValue: string;
}

export function Products({ searchValue }: ProductsProps) {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Products Management
          </h2>
          <p className="text-gray-500">
            Manage hotel shop products, inventory, and pricing.
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          onClick={() => {
            // TODO: Open add product modal
            console.log("Add Product clicked");
          }}
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add Product
        </Button>
      </div>

      <ProductsTable searchValue={searchValue} />
    </div>
  );
}
