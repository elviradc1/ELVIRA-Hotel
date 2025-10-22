import { Input } from "../../../../../../../components/ui";

interface TaskScheduleFieldsProps {
  dueDate: string;
  dueTime: string;
  onDueDateChange: (value: string) => void;
  onDueTimeChange: (value: string) => void;
  disabled?: boolean;
}

export function TaskScheduleFields({
  dueDate,
  dueTime,
  onDueDateChange,
  onDueTimeChange,
  disabled = false,
}: TaskScheduleFieldsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Due Date */}
      <Input
        label="Due Date"
        type="date"
        value={dueDate}
        onChange={(e) => onDueDateChange(e.target.value)}
        disabled={disabled}
        leftIcon={
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        }
      />

      {/* Due Time */}
      <Input
        label="Due Time"
        type="time"
        value={dueTime}
        onChange={(e) => onDueTimeChange(e.target.value)}
        disabled={disabled}
        leftIcon={
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        }
      />
    </div>
  );
}
