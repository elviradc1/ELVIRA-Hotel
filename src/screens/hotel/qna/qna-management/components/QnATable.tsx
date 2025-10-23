import { useMemo, useState } from "react";
import {
  Table,
  type TableColumn,
  StatusBadge,
  ConfirmationModal,
} from "../../../../../components/ui";
import {
  useQARecommendations,
  useUpdateQARecommendation,
  useDeleteQARecommendation,
} from "../../../../../hooks/qna/useQARecommendations";
import { useHotelContext, usePagination } from "../../../../../hooks";
import { QADetailModal } from "./QADetailModal";
import type { Database } from "../../../../../types/database";

type QARecommendationRow =
  Database["public"]["Tables"]["qa_recommendations"]["Row"];

interface QnATableData extends Record<string, unknown> {
  id: string;
  status: string;
  isActive: boolean;
  category: string;
  question: string;
  answer: string;
  created: string;
  type: string;
}

interface QnATableProps {
  searchValue: string;
  onEdit: (qaItem: QARecommendationRow) => void;
}

export function QnATable({ searchValue, onEdit }: QnATableProps) {
  // Get hotel ID from context
  const { hotelId } = useHotelContext();

  // State for detail modal
  const [selectedQA, setSelectedQA] = useState<QARecommendationRow | null>(
    null
  );
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [qaToDelete, setQAToDelete] = useState<QARecommendationRow | null>(
    null
  );

  // Fetch Q&A recommendations data
  const {
    data: qnaItems = [],
    isLoading,
    error,
  } = useQARecommendations(hotelId || undefined);

  // Get the mutations
  const updateQARecommendation = useUpdateQARecommendation();
  const deleteQARecommendation = useDeleteQARecommendation();

  // Handler for row click
  const handleRowClick = (row: QnATableData) => {
    const qaItem = qnaItems.find((q) => q.id === row.id);
    if (qaItem) {
      setSelectedQA(qaItem);
      setIsDetailModalOpen(true);
    }
  };

  // Handler for closing modal
  const handleCloseModal = () => {
    setIsDetailModalOpen(false);
    setSelectedQA(null);
  };

  // Handler for edit
  const handleEdit = () => {
    if (selectedQA) {
      onEdit(selectedQA);
    }
  };

  // Handler for delete
  const handleDelete = () => {
    if (selectedQA) {
      setQAToDelete(selectedQA);
      setIsDeleteConfirmOpen(true);
    }
  };

  // Confirm delete
  const confirmDelete = async () => {
    if (!qaToDelete || !hotelId) return;
    try {
      await deleteQARecommendation.mutateAsync({
        id: qaToDelete.id,
        hotelId,
      });
      setIsDeleteConfirmOpen(false);
      setQAToDelete(null);
      setIsDetailModalOpen(false);
      setSelectedQA(null);
    } catch (error) {
}
  };

  // Transform and filter Q&A data
  const qnaData = useMemo(() => {
    const transformedData: QnATableData[] = qnaItems.map((item) => ({
      id: item.id,
      status: item.is_active ? "Active" : "Inactive",
      isActive: item.is_active,
      category: item.category || "N/A",
      type: item.type || "N/A",
      question: item.question || "N/A",
      answer: item.answer || "N/A",
      created: item.created_at
        ? new Date(item.created_at).toLocaleDateString()
        : "N/A",
    }));

    // Apply search filter
    if (!searchValue.trim()) {
      return transformedData;
    }

    const searchLower = searchValue.toLowerCase();
    return transformedData.filter(
      (item) =>
        item.category.toLowerCase().includes(searchLower) ||
        item.question.toLowerCase().includes(searchLower) ||
        item.answer.toLowerCase().includes(searchLower) ||
        item.type.toLowerCase().includes(searchLower)
    );
  }, [qnaItems, searchValue]);

  // Define table columns for Q&A
  const columns: TableColumn<QnATableData>[] = [
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (_value, row) => (
        <StatusBadge
          status={row.isActive ? "active" : "inactive"}
          onToggle={async (newStatus) => {
            await updateQARecommendation.mutateAsync({
              id: row.id,
              updates: { is_active: newStatus },
            });
          }}
        />
      ),
    },
    {
      key: "category",
      label: "Category",
      sortable: true,
    },
    {
      key: "type",
      label: "Type",
      sortable: true,
    },
    {
      key: "question",
      label: "Question",
      sortable: true,
    },
    {
      key: "answer",
      label: "Answer",
      sortable: true,
    },
    {
      key: "created",
      label: "Created",
      sortable: true,
    },
  ];

  // Pagination
  const {
    currentPage,
    totalPages,
    paginatedData,
    itemsPerPage,
    setCurrentPage,
  } = usePagination<QnATableData>({ data: qnaData, itemsPerPage: 10 });

  return (
    <div className="mt-6">
      {searchValue && (
        <p className="text-sm text-gray-600 mb-4">
          Searching for: "{searchValue}"
        </p>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">
            Error loading Q&A items: {error.message}
          </p>
        </div>
      )}

      {/* Q&A Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        <Table
          columns={columns}
          data={paginatedData}
          loading={isLoading}
          emptyMessage="No Q&A items found. Add new questions and answers to get started."
          showPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={qnaData.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onRowClick={handleRowClick}
        />
      </div>

      {/* Detail Modal */}
      <QADetailModal
        qaItem={selectedQA}
        isOpen={isDetailModalOpen}
        onClose={handleCloseModal}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Q&A"
        message="Are you sure you want to delete this Q&A item? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
}
