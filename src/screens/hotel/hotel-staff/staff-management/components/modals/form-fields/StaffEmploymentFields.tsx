import { Select } from "../../../../../../../components/ui";

interface StaffEmploymentFieldsProps {
  position: string;
  department: string;
  status: string;
  onPositionChange: (value: string) => void;
  onDepartmentChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  errors: {
    position?: string;
    department?: string;
  };
  disabled?: boolean;
  isEditMode?: boolean;
}

const POSITION_OPTIONS = [
  { value: "Hotel Admin", label: "Hotel Admin" },
  { value: "Hotel Staff", label: "Hotel Staff" },
];

const ADMIN_DEPARTMENT_OPTIONS = [{ value: "Manager", label: "Manager" }];

const STAFF_DEPARTMENT_OPTIONS = [
  { value: "Receptionist", label: "Receptionist" },
  { value: "Housekeeping", label: "Housekeeping" },
  { value: "Security", label: "Security" },
  { value: "Kitchen", label: "Kitchen" },
  { value: "Maintenance", label: "Maintenance" },
  { value: "Food & Beverage", label: "Food & Beverage" },
  { value: "Concierge", label: "Concierge" },
  { value: "Guest Services", label: "Guest Services" },
  { value: "Other", label: "Other" },
];

const STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "on_leave", label: "On Leave" },
];

export function StaffEmploymentFields({
  position,
  department,
  status,
  onPositionChange,
  onDepartmentChange,
  onStatusChange,
  errors,
  disabled = false,
  isEditMode = false,
}: StaffEmploymentFieldsProps) {
  // Get department options based on selected position
  const departmentOptions =
    position === "Hotel Admin"
      ? ADMIN_DEPARTMENT_OPTIONS
      : STAFF_DEPARTMENT_OPTIONS;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Position */}
        <Select
          label="Position"
          value={position}
          onChange={(e) => onPositionChange(e.target.value)}
          options={POSITION_OPTIONS}
          placeholder="Select position"
          error={errors.position}
          required
          disabled={disabled}
        />

        {/* Department */}
        <Select
          label="Department"
          value={department}
          onChange={(e) => onDepartmentChange(e.target.value)}
          options={departmentOptions}
          placeholder="Select department"
          error={errors.department}
          required
          disabled={disabled}
        />
      </div>

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
    </>
  );
}
