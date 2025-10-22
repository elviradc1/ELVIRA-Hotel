import { useMemo } from "react";
import {
  Table,
  type TableColumn,
  StatusBadge,
} from "../../../../../components/ui";
import {
  useProducts,
  useUpdateProduct,
} from "../../../../../hooks/hotel-shop/products/useProducts";
import { useHotelId } from "../../../../../hooks/useHotelContext";
import type { Database } from "../../../../../types/database";

type ProductRow = Database["public"]["Tables"]["products"]["Row"];

interface Product extends Record<string, unknown> {
  id: string;
  status: string;
  isActive: boolean;
  product: string;
  category: string;
  price: string;
  stock: string;
}

interface ProductsTableProps {
  searchValue: string;
}

export function ProductsTable({ searchValue }: ProductsTableProps) {
  const hotelId = useHotelId();

  // Fetch products using the hook
  const {
    data: products,
    isLoading,
    error,
  } = useProducts(hotelId || undefined);

  // Get the update mutation
  const updateProduct = useUpdateProduct();

  // Define table columns for products
  const columns: TableColumn<Product>[] = [
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (_value, row) => (
        <StatusBadge
          status={row.isActive ? "active" : "inactive"}
          onToggle={async (newStatus) => {
            await updateProduct.mutateAsync({
              id: row.id,
              updates: { is_active: newStatus },
            });
          }}
        />
      ),
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

  // Transform database data to table format with search filtering
  const productData: Product[] = useMemo(() => {
    if (!products) {
      return [];
    }

    return products
      .filter((product: ProductRow) => {
        if (!searchValue) return true;

        const search = searchValue.toLowerCase();
        return (
          product.name.toLowerCase().includes(search) ||
          product.category.toLowerCase().includes(search) ||
          (product.description &&
            product.description.toLowerCase().includes(search))
        );
      })
      .map((product: ProductRow) => ({
        id: product.id,
        status: product.is_active ? "Active" : "Inactive",
        isActive: product.is_active,
        product: product.name,
        category: product.category,
        price: `$${product.price.toFixed(2)}`,
        stock: product.is_unlimited_stock
          ? "Unlimited"
          : product.stock_quantity?.toString() || "0",
      }));
  }, [products, searchValue]);

  if (error) {
    return (
      <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md">
        <p className="text-sm text-red-600">
          Error loading products: {error.message}
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6">
      {searchValue && (
        <p className="text-sm text-gray-600 mb-4">
          Searching for: "{searchValue}" - Found {productData.length} result(s)
        </p>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        <Table
          columns={columns}
          data={productData}
          loading={isLoading}
          emptyMessage={
            searchValue
              ? `No products found matching "${searchValue}".`
              : "No products found. Add new products to get started."
          }
        />
      </div>
    </div>
  );
}
