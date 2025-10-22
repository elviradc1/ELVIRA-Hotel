import { useState } from "react";
import { Button } from "../../../../components/ui";
import { TasksTable, TaskFormModal, TaskDetailModal } from "./components";
import type { Database } from "../../../../types/database";

type TaskRow = Database["public"]["Tables"]["tasks"]["Row"];

// Extended type with staff relationship
interface TaskWithStaff extends TaskRow {
  assigned_staff?: {
    id: string;
    position: string;
    department: string;
    hotel_staff_personal_data?: {
      first_name: string;
      last_name: string;
      email: string;
    };
  };
}

interface TaskAssignmentProps {
  searchValue: string;
}

export function TaskAssignment({ searchValue }: TaskAssignmentProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskWithStaff | null>(null);

  const handleAddNew = () => {
    setIsAddModalOpen(true);
  };

  const handleRowClick = (task: TaskWithStaff) => {
    setSelectedTask(task);
    setIsDetailModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedTask(null);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Task Assignment</h2>
        <Button variant="primary" onClick={handleAddNew}>
          + Add Task
        </Button>
      </div>
      <p className="text-gray-500">
        Assign and track tasks for hotel staff members.
      </p>

      <TasksTable searchValue={searchValue} onRowClick={handleRowClick} />

      {/* Add New Task Modal */}
      <TaskFormModal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        editData={null}
      />

      {/* Task Detail Modal */}
      <TaskDetailModal
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
        task={selectedTask}
      />
    </div>
  );
}
