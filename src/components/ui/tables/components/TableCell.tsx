import type { TableColumn } from "../types";

interface TableCellProps<T = Record<string, unknown>> {
  column: TableColumn<T>;
  item: T;
}

export function TableCell<T extends Record<string, unknown>>({
  column,
  item,
}: TableCellProps<T>) {
  return (
    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
      {column.render
        ? column.render(item[column.key], item)
        : String(item[column.key] || "")}
    </td>
  );
}
