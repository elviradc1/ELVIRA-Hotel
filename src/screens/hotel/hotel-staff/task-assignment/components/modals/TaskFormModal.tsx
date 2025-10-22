import { Modal, Button } from "../../../../../../components/ui";
import { useCurrentHotelStaff } from "../../../../../../hooks/hotel-staff/staff-management";
import {
  useCreateTask,
  useUpdateTask,
} from "../../../../../../hooks/hotel-staff";
import { useTaskForm } from "./hooks";
import {
  TaskBasicFields,
  TaskCategoryFields,
  TaskAssignmentFields,
  TaskScheduleFields,
} from "./form-fields";
import type { Database } from "../../../../../../types/database";

type TaskRow = Database["public"]["Tables"]["tasks"]["Row"];

interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editData?: TaskRow | null;
}

export function TaskFormModal({
  isOpen,
  onClose,
  editData = null,
}: TaskFormModalProps) {
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const { data: staffData, isLoading: isLoadingStaff } = useCurrentHotelStaff();

  const { formData, setFormData, errors, validateForm, resetForm } =
    useTaskForm(editData);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      if (editData) {
        // Update existing task
        await updateTask.mutateAsync({
          taskId: editData.id,
          updates: {
            title: formData.title.trim(),
            description: formData.description.trim() || undefined,
            type: formData.type || undefined,
            priority: formData.priority as "Low" | "Medium" | "High",
            status: formData.status as
              | "PENDING"
              | "IN_PROGRESS"
              | "COMPLETED"
              | "CANCELLED",
            staff_id: formData.staffId || undefined,
            due_date: formData.dueDate || undefined,
            due_time: formData.dueTime || undefined,
          },
        });
      } else {
        // Create new task
        await createTask.mutateAsync({
          title: formData.title.trim(),
          description: formData.description.trim() || undefined,
          type: formData.type || undefined,
          priority: formData.priority as "Low" | "Medium" | "High",
          staff_id: formData.staffId || undefined,
          due_date: formData.dueDate || undefined,
          due_time: formData.dueTime || undefined,
        });
      }

      handleClose();
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Prepare staff options for dropdown
  const staffOptions = [
    { value: "", label: "Unassigned" },
    ...(staffData?.map((staff) => {
      const personalData = staff.hotel_staff_personal_data;
      const name = personalData
        ? `${personalData.first_name || ""} ${
            personalData.last_name || ""
          }`.trim()
        : staff.employee_id;
      const department = staff.department ? ` - ${staff.department}` : "";

      return {
        value: staff.id,
        label: `${name}${department}`,
      };
    }) || []),
  ];

  const isEditMode = !!editData;
  const isPending = createTask.isPending || updateTask.isPending;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEditMode ? "Edit Task" : "Create New Task"}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Basic Fields */}
        <TaskBasicFields
          title={formData.title}
          description={formData.description}
          onTitleChange={(value) => setFormData({ ...formData, title: value })}
          onDescriptionChange={(value) =>
            setFormData({ ...formData, description: value })
          }
          errors={errors}
          disabled={isPending}
        />

        {/* Category Fields */}
        <TaskCategoryFields
          type={formData.type}
          priority={formData.priority}
          onTypeChange={(value) => setFormData({ ...formData, type: value })}
          onPriorityChange={(value) =>
            setFormData({ ...formData, priority: value })
          }
          errors={errors}
          disabled={isPending}
        />

        {/* Assignment Fields */}
        <TaskAssignmentFields
          staffId={formData.staffId}
          status={formData.status}
          staffOptions={staffOptions}
          onStaffIdChange={(value) =>
            setFormData({ ...formData, staffId: value })
          }
          onStatusChange={(value) =>
            setFormData({ ...formData, status: value })
          }
          isEditMode={isEditMode}
          isLoadingStaff={isLoadingStaff}
          disabled={isPending}
        />

        {/* Schedule Fields */}
        <TaskScheduleFields
          dueDate={formData.dueDate}
          dueTime={formData.dueTime}
          onDueDateChange={(value) =>
            setFormData({ ...formData, dueDate: value })
          }
          onDueTimeChange={(value) =>
            setFormData({ ...formData, dueTime: value })
          }
          disabled={isPending}
        />

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={isPending}>
            {isPending ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                {isEditMode ? "Updating..." : "Creating..."}
              </>
            ) : isEditMode ? (
              "Update Task"
            ) : (
              "Create Task"
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
