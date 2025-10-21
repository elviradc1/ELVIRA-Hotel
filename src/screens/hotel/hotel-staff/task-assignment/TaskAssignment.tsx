import { Button } from "../../../../components/ui";
import { TasksTable } from "./components";

interface TaskAssignmentProps {
  searchValue: string;
}

export function TaskAssignment({ searchValue }: TaskAssignmentProps) {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Task Assignment</h2>
        <Button
          variant="primary"
          onClick={() => console.log("Add task clicked")}
        >
          + Add Task
        </Button>
      </div>
      <p className="text-gray-500">
        Assign and track tasks for hotel staff members.
      </p>

      <TasksTable searchValue={searchValue} />
    </div>
  );
}
