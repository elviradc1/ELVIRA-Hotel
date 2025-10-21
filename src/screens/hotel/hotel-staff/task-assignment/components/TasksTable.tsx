import { Table, type TableColumn } from "../../../../../components/ui";

interface Task extends Record<string, unknown> {
  id: string;
  priority: string;
  status: string;
  dueDate: string;
  assignedTo: string;
  task: string;
  description: string;
}

interface TasksTableProps {
  searchValue: string;
}

export function TasksTable({ searchValue }: TasksTableProps) {
  // Define table columns with centered alignment
  const columns: TableColumn<Task>[] = [
    {
      key: "priority",
      label: "Priority",
      sortable: true,
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
    },
    {
      key: "dueDate",
      label: "Due Date",
      sortable: true,
    },
    {
      key: "assignedTo",
      label: "Assigned To",
      sortable: true,
    },
    {
      key: "task",
      label: "Task",
      sortable: true,
    },
    {
      key: "description",
      label: "Description",
    },
  ];

  // Empty data array - no mock data
  const taskData: Task[] = [];

  return (
    <div className="mt-6">
      {searchValue && (
        <p className="text-sm text-gray-600 mb-4">
          Searching for: "{searchValue}"
        </p>
      )}

      {/* Task Assignment Table */}
      <Table
        columns={columns}
        data={taskData}
        emptyMessage="No tasks assigned. Click '+ Add Task' to get started."
      />
    </div>
  );
}
