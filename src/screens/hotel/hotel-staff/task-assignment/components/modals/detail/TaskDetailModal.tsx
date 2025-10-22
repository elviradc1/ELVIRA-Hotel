import { useState } from "react";
import {
  Modal,
  Button,
  ConfirmationModal,
} from "../../../../../../../components/ui";
import { TaskFormModal } from "../TaskFormModal";
import { useDeleteTask } from "../../../../../../../hooks/hotel-staff";
import type { Database } from "../../../../../../../types/database";

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

interface TaskDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: TaskWithStaff | null;
}

export function TaskDetailModal({
  isOpen,
  onClose,
  task,
}: TaskDetailModalProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const deleteTask = useDeleteTask();

  if (!task) return null;

  const staff = task.assigned_staff;
  const personalData = staff?.hotel_staff_personal_data;
  const assignedName = personalData
    ? `${personalData.first_name || ""} ${personalData.last_name || ""}`.trim()
    : "Unassigned";

  const handleEdit = () => {
    setIsEditModalOpen(true);
  };

  const handleDelete = () => {
    setIsDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteTask.mutateAsync(task.id);
      setIsDeleteConfirmOpen(false);
      onClose();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getTypeBadge = (type: string | null) => {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
        {type || "General"}
      </span>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const colors = {
      High: "bg-red-100 text-red-800",
      Medium: "bg-yellow-100 text-yellow-800",
      Low: "bg-green-100 text-green-800",
    };
    return (
      <span
        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
          colors[priority as keyof typeof colors] || colors.Low
        }`}
      >
        {priority}
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
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
          colors[status as keyof typeof colors] || colors.PENDING
        }`}
      >
        {labels[status as keyof typeof labels] || status}
      </span>
    );
  };

  return (
    <>
      <Modal
        isOpen={isOpen && !isEditModalOpen}
        onClose={onClose}
        title="Task Details"
        size="lg"
      >
        <div className="space-y-6">
          {/* Header Section */}
          <div className="flex items-center justify-between pb-4 border-b">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                {task.title}
              </h3>
              <div className="flex items-center gap-2 mt-2">
                {getTypeBadge(task.type)}
                {getPriorityBadge(task.priority)}
              </div>
            </div>
            {getStatusBadge(task.status)}
          </div>

          {/* Description */}
          {task.description && (
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-gray-900 border-b pb-2">
                Description
              </h4>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">
                {task.description}
              </p>
            </div>
          )}

          {/* Assignment Information */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-900 border-b pb-2">
              Assignment
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Assigned To
                </label>
                <p className="text-sm text-gray-900 mt-1">{assignedName}</p>
              </div>
              {staff?.department && (
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Department
                  </label>
                  <p className="text-sm text-gray-900 mt-1">
                    {staff.department}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Schedule Information */}
          {(task.due_date || task.due_time) && (
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-gray-900 border-b pb-2">
                Schedule
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {task.due_date && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Due Date
                    </label>
                    <p className="text-sm text-gray-900 mt-1">
                      {formatDate(task.due_date)}
                    </p>
                  </div>
                )}
                {task.due_time && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Due Time
                    </label>
                    <p className="text-sm text-gray-900 mt-1">
                      {task.due_time}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-900 border-b pb-2">
              Details
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {task.created_at && (
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Created
                  </label>
                  <p className="text-sm text-gray-900 mt-1">
                    {formatDate(task.created_at)}
                  </p>
                </div>
              )}
              {task.updated_at && (
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Last Updated
                  </label>
                  <p className="text-sm text-gray-900 mt-1">
                    {formatDate(task.updated_at)}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between pt-4 border-t border-gray-200">
            <Button variant="danger" onClick={handleDelete}>
              Delete
            </Button>
            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button variant="primary" onClick={handleEdit}>
                Edit
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Edit Modal */}
      <TaskFormModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        editData={task}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        loading={deleteTask.isPending}
      />
    </>
  );
}
