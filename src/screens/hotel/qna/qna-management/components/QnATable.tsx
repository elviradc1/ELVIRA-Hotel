import { useMemo } from "react";
import { Table, type TableColumn } from "../../../../../components/ui";
import { useQARecommendations } from "../../../../../hooks/qna/useQARecommendations";
import { useHotelContext } from "../../../../../hooks/useHotelContext";

interface QnATableData extends Record<string, unknown> {
  id: string;
  status: string;
  category: string;
  question: string;
  answer: string;
  created: string;
  type: string;
}

interface QnATableProps {
  searchValue: string;
}

export function QnATable({ searchValue }: QnATableProps) {
  // Get hotel ID from context
  const { hotelId } = useHotelContext();

  // Fetch Q&A recommendations data
  const {
    data: qnaItems = [],
    isLoading,
    error,
  } = useQARecommendations(hotelId || undefined);

  // Transform and filter Q&A data
  const qnaData = useMemo(() => {
    const transformedData: QnATableData[] = qnaItems.map((item) => ({
      id: item.id,
      status: item.is_active ? "Active" : "Inactive",
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
          data={qnaData}
          loading={isLoading}
          emptyMessage="No Q&A items found. Add new questions and answers to get started."
        />
      </div>
    </div>
  );
}
