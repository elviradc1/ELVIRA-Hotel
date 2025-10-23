import type { Database } from "../../../../../../types/database";

type AmenityRow = Database["public"]["Tables"]["amenities"]["Row"];

export interface AmenityFormData {
  name: string;
  price: string;
  category: string;
  description: string;
  imageUrl: string | null;
  recommended: boolean;
}

export interface AmenityModalProps {
  isOpen: boolean;
  onClose: () => void;
  amenity?: AmenityRow | null;
  mode?: "create" | "edit" | "view";
  onEdit?: () => void;
  onDelete?: () => void;
}

export interface AmenitySectionProps {
  mode: "create" | "edit" | "view";
  formData?: AmenityFormData;
  amenity?: AmenityRow | null;
  onFieldChange?: (field: string, value: string | boolean | null) => void;
  errors?: Record<string, string | undefined>;
  disabled?: boolean;
  onImageChange?: (url: string | null) => void;
  onStatusToggle?: (newStatus: boolean) => Promise<void>;
}

export type { AmenityRow };
