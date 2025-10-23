import { useState } from "react";
import { Modal, ModalFooter } from "../../../../../components/ui";
import {
  ItemBasicInfoDisplay,
  ItemDetailsGrid,
  ItemMetadataDisplay,
} from "../../../../../components/ui/forms";
import { useUpdateQARecommendation } from "../../../../../hooks/qna/useQARecommendations";
import type { Database } from "../../../../../types/database";

type QARecommendation =
  Database["public"]["Tables"]["qa_recommendations"]["Row"];

interface QADetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  qaItem: QARecommendation | null;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function QADetailModal({
  isOpen,
  onClose,
  qaItem,
  onEdit,
  onDelete,
}: QADetailModalProps) {
  const updateQARecommendation = useUpdateQARecommendation();
  const [isUpdating, setIsUpdating] = useState(false);

  if (!qaItem) return null;

  const handleStatusToggle = async (newStatus: boolean) => {
    setIsUpdating(true);
    try {
      await updateQARecommendation.mutateAsync({
        id: qaItem.id,
        updates: { is_active: newStatus },
      });
    } catch (error) {
} finally {
      setIsUpdating(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Q&A Details" size="md">
      <div className="space-y-3 max-h-[calc(100vh-250px)] overflow-y-auto">
        {/* Status Badge */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
          <span className="text-sm font-medium text-gray-700">Status</span>
          <button
            onClick={() => handleStatusToggle(!qaItem.is_active)}
            disabled={isUpdating}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
              qaItem.is_active
                ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            } ${
              isUpdating ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
            }`}
          >
            {qaItem.is_active ? "Active" : "Inactive"}
          </button>
        </div>

        {/* Basic Info */}
        <ItemBasicInfoDisplay
          name={qaItem.question || "N/A"}
          category={`${qaItem.category} - ${qaItem.type}`}
          hotelRecommended={false}
          hideRecommendedIcon
        />

        {/* Q&A Details */}
        <ItemDetailsGrid
          details={[
            {
              label: "Question",
              value: qaItem.question ? [qaItem.question] : null,
            },
            {
              label: "Answer",
              value: qaItem.answer ? [qaItem.answer] : null,
            },
          ]}
        />

        {/* Metadata */}
        <ItemMetadataDisplay
          createdAt={qaItem.created_at}
          updatedAt={qaItem.updated_at}
        />
      </div>

      {/* Footer Actions */}
      <ModalFooter
        onClose={onClose}
        onEdit={onEdit}
        onDelete={onDelete}
        showEdit={!!onEdit}
        showDelete={!!onDelete}
        isLoading={isUpdating}
      />
    </Modal>
  );
}
