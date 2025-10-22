import { useMemo } from "react";
import { type TableColumn, DataTable } from "../../../../../components/ui";
import { useCurrentHotelTasks } from "../../../../../hooks/hotel-staff";

// Type for the transformed task data
interface Task extends Record<string, unknown> {
  id: string;
  title: string;
  type: string;
  priority: string;
  status: string;
  assignedTo: string;
  dueDate: string;
}

interface TasksTableProps {
  searchValue: string;
}

export function TasksTable({ searchValue }: TasksTableProps) {
  const { data: tasksData, isLoading, error } = useCurrentHotelTasks();

  // Define table columns
  const columns: TableColumn<Task>[] = useMemo(
    () => [
      {
        key: "title",
        label: "Task",
        sortable: true,
      },
      {
        key: "type",
        label: "Type",
        sortable: true,
        render: (value) => (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
            {String(value || "General")}
          </span>
        ),
      },
      {
        key: "priority",
        label: "Priority",
        sortable: true,
        render: (value) => {
          const colors = {
            High: "bg-red-100 text-red-800",
            Medium: "bg-yellow-100 text-yellow-800",
            Low: "bg-green-100 text-green-800",
          };
          return (
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                colors[value as keyof typeof colors] || colors.Low
              }`}
            >
              {String(value)}
            </span>
          );
        },
      },
      {
        key: "status",
        label: "Status",
        sortable: true,
        render: (value) => {
          const colors = {
            PENDING: "bg-gray-100 text-gray-800",
            IN_PROGRESS: "bg-blue-100 text-blue-800",
            COMPLETED: "bg-green-100 text-green-800",
            CANCELLED: "bg-red-100 text-red-800",
          };
          const labels = {
            PENDING: "Pending",
            IN_PROGRESS: "In Progress",
            COMPLETED: "Completed",
            CANCELLED: "Cancelled",
          };
          return (
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                colors[value as keyof typeof colors] || colors.PENDING
              }`}
            >
              {labels[value as keyof typeof labels] || String(value)}
            </span>
          );
        },
      },
      {
        key: "assignedTo",
        label: "Assigned To",
        sortable: true,
      },
      {
        key: "dueDate",
        label: "Due Date",
        sortable: true,
      },
    ],
    []
  );

  // Transform raw data into table format
  const transformData = useMemo(
    () => (data: NonNullable<typeof tasksData>) => {
      if (!data) return [];

      return data.map((task) => {
        const staff = task.assigned_staff;
        const personalData = staff?.hotel_staff_personal_data;
        const assignedName = personalData
          ? `${personalData.first_name || ""} ${
              personalData.last_name || ""
            }`.trim()
          : "Unassigned";

        return {
          id: task.id,
          title: task.title,
          type: task.type || "General",
          priority: task.priority,
          status: task.status,
          assignedTo: assignedName,
          dueDate: task.due_date
            ? new Date(task.due_date).toLocaleDateString()
            : "No due date",
        } as Task;
      });
    },
    []
  );

  return (
    <DataTable
      data={tasksData}
      isLoading={isLoading}
      error={error}
      columns={columns}
      searchValue={searchValue}
      searchFields={["title", "type", "assignedTo"]}
      transformData={transformData}
      emptyMessage="No tasks found. Click '+ New Task' to create one."
      loadingMessage="Loading tasks..."
      errorTitle="Failed to load tasks"
      showSummary
      summaryLabel="Total tasks"
    />
  );
}
