import { useMemo } from "react";
import { Table, type TableColumn, LoadingState, ErrorState } from "../index";
import { usePagination } from "../../../hooks";

interface DataTableProps<
  TData extends Record<string, unknown>,
  TRawData = TData
> {
  // Data fetching
  data: TRawData[] | undefined;
  isLoading: boolean;
  error: Error | null;

  // Table configuration
  columns: TableColumn<TData>[];

  // Search
  searchValue?: string;
  searchFields?: (keyof TData)[];
  searchPlaceholder?: string;

  // Transformation
  transformData?: (data: TRawData[]) => TData[];

  // Messages
  emptyMessage?: string;
  loadingMessage?: string;
  errorTitle?: string;

  // Summary
  showSummary?: boolean;
  summaryLabel?: string;

  // Pagination
  showPagination?: boolean;
  itemsPerPage?: number;

  // Row click handler
  onRowClick?: (row: TData) => void;
}
/**
 * Generic data table component that handles:
 * - Loading and error states
 * - Search filtering across multiple fields
 * - Data transformation
 * - Summary display
 */
export function DataTable<
  TData extends Record<string, unknown>,
  TRawData = TData
>({
  data,
  isLoading,
  error,
  columns,
  searchValue = "",
  searchFields = [],
  searchPlaceholder,
  transformData,
  emptyMessage = "No data found.",
  loadingMessage = "Loading data...",
  errorTitle = "Failed to load data",
  showSummary = false,
  summaryLabel = "Total",
  showPagination = false,
  itemsPerPage = 10,
  onRowClick,
}: DataTableProps<TData, TRawData>) {
  // Transform and filter data
  const processedData = useMemo(() => {
    if (!data) return [];

    // Apply custom transformation if provided
    let processed: TData[] = transformData
      ? transformData(data)
      : (data as unknown as TData[]);

    // Apply search filter
    if (searchValue && searchFields.length > 0) {
      const searchLower = searchValue.toLowerCase();
      processed = processed.filter((item) =>
        searchFields.some((field) => {
          const value = item[field];
          if (value == null) return false;
          return String(value).toLowerCase().includes(searchLower);
        })
      );
    }

    return processed;
  }, [data, searchValue, searchFields, transformData]);

  // Apply pagination if enabled
  const pagination = usePagination<TData>({
    data: processedData,
    itemsPerPage,
  });
  const displayData = showPagination ? pagination.paginatedData : processedData;

  // Loading state
  if (isLoading) {
    return (
      <div className="mt-6">
        <LoadingState message={loadingMessage} />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="mt-6">
        <ErrorState
          title={errorTitle}
          message={error.message || "Please try again later."}
        />
      </div>
    );
  }

  return (
    <div className="mt-6">
      {/* Search results info */}
      {searchValue && (
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            {searchPlaceholder && `Searching for: "${searchValue}" • `}
            {processedData.length} result{processedData.length !== 1 ? "s" : ""}
          </p>
        </div>
      )}

      {/* Table */}
      <Table
        columns={columns}
        data={displayData}
        emptyMessage={
          searchValue
            ? `No results found matching "${searchValue}"`
            : emptyMessage
        }
        showPagination={showPagination}
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        totalItems={processedData.length}
        itemsPerPage={pagination.itemsPerPage}
        onPageChange={pagination.setCurrentPage}
        onRowClick={onRowClick}
      />

      {/* Summary */}
      {showSummary && !searchValue && processedData.length > 0 && (
        <div className="mt-4 text-sm text-gray-500">
          {summaryLabel}: {processedData.length} item
          {processedData.length !== 1 ? "s" : ""}
        </div>
      )}
    </div>
  );
}
