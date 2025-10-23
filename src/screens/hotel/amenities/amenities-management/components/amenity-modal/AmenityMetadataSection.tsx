import { ItemMetadataDisplay } from "../../../../../../components/ui/forms";
import type { AmenitySectionProps } from "./types";

/**
 * AmenityMetadataSection - Created/Updated timestamps
 * Only shown in view mode
 */
export function AmenityMetadataSection({ mode, amenity }: AmenitySectionProps) {
  const isViewMode = mode === "view";

  if (!isViewMode || !amenity) {
    return null;
  }

  return (
    <ItemMetadataDisplay
      createdAt={amenity.created_at}
      updatedAt={amenity.updated_at}
    />
  );
}
