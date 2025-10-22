import { useState } from "react";
import { QnATable, AddQAModal } from "./components";
import { Button } from "../../../../components/ui";
import type { Database } from "../../../../types/database";

type QARecommendation =
  Database["public"]["Tables"]["qa_recommendations"]["Row"];

interface QnAManagementProps {
  searchValue: string;
}

export function QnAManagement({ searchValue }: QnAManagementProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editQA, setEditQA] = useState<QARecommendation | null>(null);

  const handleEdit = (qaItem: QARecommendation) => {
    setEditQA(qaItem);
    setIsAddModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setEditQA(null);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Q&A Management
          </h2>
          <p className="text-gray-500">
            Manage frequently asked questions and their answers for guests.
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          onClick={() => setIsAddModalOpen(true)}
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add Q&A
        </Button>
      </div>

      <QnATable searchValue={searchValue} onEdit={handleEdit} />

      {/* Add/Edit Q&A Modal */}
      <AddQAModal
        isOpen={isAddModalOpen}
        onClose={handleCloseModal}
        editData={editQA}
      />
    </div>
  );
}
