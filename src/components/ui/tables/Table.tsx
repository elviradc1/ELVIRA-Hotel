import type { TableColumn, TableAction } from "./types";
import { LoadingState } from "../states";
import { TableHeader, TableBody } from "./components";
import { Pagination } from "./Pagination";
import { useState, useMemo } from "react";

interface TableProps<T = Record<string, unknown>> {
  columns: TableColumn<T>[];
  data: T[];
  loading?: boolean;
  actions?: TableAction<T>[];
  sortColumn?: string;
  sortDirection?: "asc" | "desc";
  onSort?: (column: string) => void;
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
  className?: string;
  // Pagination props
  itemsPerPage?: number;
  disablePagination?: boolean;
}

export function Table<T extends Record<string, unknown>>({
  columns,
  data,
  loading = false,
  actions = [],
  sortColumn,
  sortDirection,
  onSort,
  onRowClick,
  emptyMessage = "No data available",
  className = "",
  itemsPerPage = 10,
  disablePagination = false,
}: TableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate pagination
  const totalItems = data.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const showPagination = !disablePagination && totalItems > itemsPerPage;

  // Get current page data
  const paginatedData = useMemo(() => {
    if (disablePagination) return data;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  }, [data, currentPage, itemsPerPage, disablePagination]);

  // Reset to page 1 when data changes
  useMemo(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) {
    return <LoadingState message="Loading data..." />;
  }

  return (
    <div
      className={`bg-white rounded-3xl border border-gray-200 overflow-hidden ${className}`}
    >
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <TableHeader
            columns={columns}
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            onSort={onSort}
            hasActions={actions.length > 0}
          />
          {paginatedData.length === 0 ? (
            <tbody className="bg-white">
              <tr>
                <td
                  colSpan={columns.length + (actions.length > 0 ? 1 : 0)}
                  className="px-6 py-12 text-center text-gray-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            </tbody>
          ) : (
            <TableBody
              data={paginatedData}
              columns={columns}
              actions={actions}
              onRowClick={onRowClick}
            />
          )}
        </table>
      </div>

      {/* Automatic Pagination */}
      {showPagination && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
        />
      )}
    </div>
  );
}
