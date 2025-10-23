import type { Database } from "../../../../../../../types/database";

type TaskRow = Database["public"]["Tables"]["tasks"]["Row"];

export interface TaskWithStaff extends TaskRow {
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

export interface TaskFormData {
  title: string;
  description: string;
  type: string;
  priority: string;
  status: string;
  staffId: string;
  dueDate: string;
  dueTime: string;
}

export interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task?: TaskWithStaff | null;
  mode?: "create" | "edit" | "view";
  onEdit?: () => void;
  onDelete?: () => void;
}

export interface TaskSectionProps {
  mode: "create" | "edit" | "view";
  formData?: TaskFormData;
  task?: TaskWithStaff | null;
  onFieldChange?: (field: string, value: string) => void;
  errors?: Record<string, string | undefined>;
  disabled?: boolean;
  staffOptions?: Array<{ value: string; label: string }>;
  isLoadingStaff?: boolean;
}

export type { TaskRow };
