import { Input, Textarea } from "../../../../../../../components/ui";

interface TaskBasicFieldsProps {
  title: string;
  description: string;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  errors: {
    title?: string;
  };
  disabled?: boolean;
}

export function TaskBasicFields({
  title,
  description,
  onTitleChange,
  onDescriptionChange,
  errors,
  disabled = false,
}: TaskBasicFieldsProps) {
  return (
    <>
      {/* Task Title */}
      <Input
        label="Task Title"
        type="text"
        placeholder="Enter task title"
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        error={errors.title}
        required
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
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        }
      />

      {/* Task Description */}
      <Textarea
        label="Description"
        value={description}
        onChange={(e) => onDescriptionChange(e.target.value)}
        placeholder="Enter task description (optional)"
        rows={3}
        disabled={disabled}
      />
    </>
  );
}
