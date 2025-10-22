import { Select } from "../../../../../../../components/ui";

interface TaskAssignmentFieldsProps {
  staffId: string;
  status: string;
  staffOptions: Array<{ value: string; label: string }>;
  onStaffIdChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  isEditMode: boolean;
  isLoadingStaff: boolean;
  disabled?: boolean;
}

const STATUS_OPTIONS = [
  { value: "PENDING", label: "Pending" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
];

export function TaskAssignmentFields({
  staffId,
  status,
  staffOptions,
  onStaffIdChange,
  onStatusChange,
  isEditMode,
  isLoadingStaff,
  disabled = false,
}: TaskAssignmentFieldsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Assign To */}
      <Select
        label="Assign To"
        value={staffId}
        onChange={(e) => onStaffIdChange(e.target.value)}
        options={staffOptions}
        placeholder="Select staff member (optional)"
        disabled={disabled || isLoadingStaff}
      />

      {/* Status (only show in edit mode) */}
      {isEditMode && (
        <Select
          label="Status"
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          options={STATUS_OPTIONS}
          disabled={disabled}
        />
      )}
    </div>
  );
}
