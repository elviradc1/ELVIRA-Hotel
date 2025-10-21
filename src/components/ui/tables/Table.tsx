import type { TableColumn, TableAction } from "./types";
import { LoadingState } from "../states";
import { TableHeader, TableBody } from "./components";

interface TableProps<T = Record<string, unknown>> {
  columns: TableColumn<T>[];
  data: T[];
  loading?: boolean;
  actions?: TableAction<T>[];
  sortColumn?: string;
  sortDirection?: "asc" | "desc";
  onSort?: (column: string) => void;
  emptyMessage?: string;
  className?: string;
}

export function Table<T extends Record<string, unknown>>({
  columns,
  data,
  loading = false,
  actions = [],
  sortColumn,
  sortDirection,
  onSort,
  emptyMessage = "No data available",
  className = "",
}: TableProps<T>) {
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
          {data.length === 0 ? (
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
            <TableBody data={data} columns={columns} actions={actions} />
          )}
        </table>
      </div>
    </div>
  );
}
