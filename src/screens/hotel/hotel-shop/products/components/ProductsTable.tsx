import { Table, type TableColumn } from "../../../../../components/ui";

interface Product extends Record<string, unknown> {
  id: string;
  status: string;
  product: string;
  category: string;
  price: string;
  stock: string;
}

interface ProductsTableProps {
  searchValue: string;
}

export function ProductsTable({ searchValue }: ProductsTableProps) {
  // Define table columns for products
  const columns: TableColumn<Product>[] = [
    {
      key: "status",
      label: "Status",
      sortable: true,
    },
    {
      key: "product",
      label: "Product",
      sortable: true,
    },
    {
      key: "category",
      label: "Category",
      sortable: true,
    },
    {
      key: "price",
      label: "Price",
      sortable: true,
    },
    {
      key: "stock",
      label: "Stock",
      sortable: true,
    },
  ];

  // Empty data array - no mock data
  const productData: Product[] = [];

  return (
    <div className="mt-6">
      {searchValue && (
        <p className="text-sm text-gray-600 mb-4">
          Searching for: "{searchValue}"
        </p>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        <Table
          columns={columns}
          data={productData}
          emptyMessage="No products found. Add new products to get started."
        />
      </div>
    </div>
  );
}
