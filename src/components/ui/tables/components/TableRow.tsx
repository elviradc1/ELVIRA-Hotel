import type { TableColumn, TableAction } from "../types";
import { TableCell } from "./TableCell";
import { TableActions } from "./TableActions";

interface TableRowProps<T = Record<string, unknown>> {
  item: T;
  columns: TableColumn<T>[];
  actions: TableAction<T>[];
}

export function TableRow<T extends Record<string, unknown>>({
  item,
  columns,
  actions,
}: TableRowProps<T>) {
  return (
    <tr className="hover:bg-gray-50">
      {columns.map((column) => (
        <TableCell key={column.key} column={column} item={item} />
      ))}
      {actions.length > 0 && (
        <td className="px-6 py-4 text-right text-sm font-medium">
          <TableActions actions={actions} item={item} />
        </td>
      )}
    </tr>
  );
}
