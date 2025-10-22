import { Select } from "../../../../../../../components/ui";

interface TaskCategoryFieldsProps {
  type: string;
  priority: string;
  onTypeChange: (value: string) => void;
  onPriorityChange: (value: string) => void;
  errors: {
    priority?: string;
  };
  disabled?: boolean;
}

const TASK_TYPE_OPTIONS = [
  { value: "", label: "None" },
  { value: "Cleaning", label: "Cleaning" },
  { value: "Maintenance", label: "Maintenance" },
  { value: "Guest Service", label: "Guest Service" },
  { value: "Administrative", label: "Administrative" },
  { value: "Kitchen", label: "Kitchen" },
  { value: "Front Desk", label: "Front Desk" },
  { value: "Laundry", label: "Laundry" },
  { value: "Security", label: "Security" },
  { value: "Other", label: "Other" },
];

const PRIORITY_OPTIONS = [
  { value: "Low", label: "Low" },
  { value: "Medium", label: "Medium" },
  { value: "High", label: "High" },
];

export function TaskCategoryFields({
  type,
  priority,
  onTypeChange,
  onPriorityChange,
  errors,
  disabled = false,
}: TaskCategoryFieldsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Task Type */}
      <Select
        label="Task Type"
        value={type}
        onChange={(e) => onTypeChange(e.target.value)}
        options={TASK_TYPE_OPTIONS}
        placeholder="Select task type"
        disabled={disabled}
      />

      {/* Priority */}
      <Select
        label="Priority"
        value={priority}
        onChange={(e) => onPriorityChange(e.target.value)}
        options={PRIORITY_OPTIONS}
        placeholder="Select priority"
        error={errors.priority}
        required
        disabled={disabled}
      />
    </div>
  );
}
