import { useMemo, useEffect } from "react";
import { Table, type TableColumn } from "../../../../../components/ui";
import { useProducts } from "../../../../../hooks/hotel-shop/products/useProducts";
import { useHotelId } from "../../../../../hooks/useHotelContext";
import type { Database } from "../../../../../types/database";

type ProductRow = Database["public"]["Tables"]["products"]["Row"];

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
  console.log("🛒🛒🛒 PRODUCTS TABLE COMPONENT LOADED 🛒🛒🛒");

  const hotelId = useHotelId();

  console.log("🛒 ProductsTable - Component Rendered:", {
    hotelId,
    searchValue,
    timestamp: new Date().toISOString(),
  });

  // Fetch products using the hook
  const {
    data: products,
    isLoading,
    error,
    isFetching,
    dataUpdatedAt,
  } = useProducts(hotelId || undefined);

  useEffect(() => {
    console.log("🛒 Products - Data State Changed:", {
      hotelId,
      isLoading,
      isFetching,
      error: error?.message,
      dataCount: products?.length || 0,
      dataUpdatedAt: dataUpdatedAt
        ? new Date(dataUpdatedAt).toISOString()
        : "never",
      rawData: products,
      timestamp: new Date().toISOString(),
    });
  }, [hotelId, isLoading, isFetching, error, products, dataUpdatedAt]);

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

  // Transform database data to table format with search filtering
  const productData: Product[] = useMemo(() => {
    if (!products) {
      console.log("🛒 Products - No data to transform");
      return [];
    }

    console.log("🛒 Products - Transforming data:", {
      rawCount: products.length,
      searchValue,
    });

    const transformed = products
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
        product: product.name,
        category: product.category,
        price: `$${product.price.toFixed(2)}`,
        stock: product.is_unlimited_stock
          ? "Unlimited"
          : product.stock_quantity?.toString() || "0",
      }));

    console.log("🛒 Products - Transformed data:", {
      transformedCount: transformed.length,
      sample: transformed[0],
    });

    return transformed;
  }, [products, searchValue]);

  // Log any errors
  if (error) {
    console.error("🛒 Products - Error loading data:", error);
  }

  return (
    <div className="mt-6">
      {/* Always visible debug banner */}
      <div className="mb-4 p-3 bg-yellow-50 border border-yellow-300 rounded text-sm">
        <div className="font-bold text-yellow-900 mb-2">🛒 Debug Info:</div>
        <div className="text-yellow-800 space-y-1 text-xs">
          <div>Hotel ID: {hotelId || "Not found"}</div>
          <div>Loading: {isLoading ? "Yes" : "No"}</div>
          <div>Fetching: {isFetching ? "Yes" : "No"}</div>
          <div>Data Count: {products?.length || 0}</div>
          <div>Filtered Count: {productData.length}</div>
          <div>Error: {error?.message || "None"}</div>
        </div>
      </div>

      {/* Debug info */}
      {(isLoading || isFetching) && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-800">
          ⏳ {isLoading ? "Loading" : "Refetching"} products...
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-800">
          ❌ Error: {error.message}
        </div>
      )}

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
