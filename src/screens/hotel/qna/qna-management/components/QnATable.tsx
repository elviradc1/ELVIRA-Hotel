import { Table, type TableColumn } from "../../../../../components/ui";

interface QnAItem extends Record<string, unknown> {
  id: string;
  status: string;
  category: string;
  question: string;
  answer: string;
  created: string;
}

interface QnATableProps {
  searchValue: string;
}

export function QnATable({ searchValue }: QnATableProps) {
  // Define table columns for Q&A
  const columns: TableColumn<QnAItem>[] = [
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

  // Empty data array - no mock data
  const qnaData: QnAItem[] = [];

  return (
    <div className="mt-6">
      {searchValue && (
        <p className="text-sm text-gray-600 mb-4">
          Searching for: "{searchValue}"
        </p>
      )}

      {/* Q&A Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        <Table
          columns={columns}
          data={qnaData}
          emptyMessage="No Q&A items found. Add new questions and answers to get started."
        />
      </div>
    </div>
  );
}
