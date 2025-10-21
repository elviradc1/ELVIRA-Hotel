import { QnATable } from "./components";

interface QnAManagementProps {
  searchValue: string;
}

export function QnAManagement({ searchValue }: QnAManagementProps) {
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Q&A Management
      </h2>
      <p className="text-gray-500">
        Manage frequently asked questions and their answers for guests.
      </p>

      <QnATable searchValue={searchValue} />
    </div>
  );
}
