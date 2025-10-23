import { ModalFormSection, Textarea } from "../../../../../../../components/ui";
import type { AbsenceSectionProps } from "./types";

/**
 * AbsenceNotesSection - Notes and consent fields
 * Uses form inputs for all modes (create/edit/view)
 */
export function AbsenceNotesSection({
  mode,
  formData,
  onFieldChange,
  disabled = false,
}: AbsenceSectionProps) {
  const isViewMode = mode === "view";
  const isDisabled = disabled || isViewMode;

  return (
    <ModalFormSection title="Additional Information">
      <Textarea
        label="Notes"
        placeholder="Add any additional notes or details (optional)"
        value={formData?.notes || ""}
        onChange={(e) => onFieldChange?.("notes", e.target.value)}
        disabled={isDisabled}
        rows={3}
      />

      {mode === "create" && (
        <div className="flex items-start">
          <input
            type="checkbox"
            id="dataProcessingConsent"
            checked={formData?.dataProcessingConsent || false}
            onChange={(e) =>
              onFieldChange?.("dataProcessingConsent", e.target.checked)
            }
            disabled={isDisabled}
            className="mt-1 h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
          />
          <label
            htmlFor="dataProcessingConsent"
            className="ml-2 text-sm text-gray-700"
          >
            I consent to the processing of this absence data in accordance with
            GDPR regulations
          </label>
        </div>
      )}
    </ModalFormSection>
  );
}
