import { useMemo } from "react";
import { type TableColumn, DataTable } from "../../../../../components/ui";
import { useCurrentHotelAbsences } from "../../../../../hooks/hotel-staff";

// Type for the transformed absence data
interface AbsenceRequest extends Record<string, unknown> {
  id: string;
  staffName: string;
  requestType: string;
  startDate: string;
  endDate: string;
  status: string;
  days: number;
}

interface AbsencesTableProps {
  searchValue: string;
}

export function AbsencesTable({ searchValue }: AbsencesTableProps) {
  const { data: absencesData, isLoading, error } = useCurrentHotelAbsences();

  // Define table columns
  const columns: TableColumn<AbsenceRequest>[] = useMemo(
    () => [
      {
        key: "staffName",
        label: "Staff Member",
        sortable: true,
      },
      {
        key: "requestType",
        label: "Type",
        sortable: true,
        render: (value) => {
          const labels: Record<string, string> = {
            vacation: "Vacation",
            sick: "Sick Leave",
            personal: "Personal",
            training: "Training",
            other: "Other",
          };
          return (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
              {labels[String(value)] || String(value)}
            </span>
          );
        },
      },
      {
        key: "startDate",
        label: "Start Date",
        sortable: true,
      },
      {
        key: "endDate",
        label: "End Date",
        sortable: true,
      },
      {
        key: "days",
        label: "Days",
        sortable: true,
      },
      {
        key: "status",
        label: "Status",
        sortable: true,
        render: (value) => {
          const colors: Record<string, string> = {
            pending: "bg-yellow-100 text-yellow-800",
            approved: "bg-green-100 text-green-800",
            rejected: "bg-red-100 text-red-800",
            cancelled: "bg-gray-100 text-gray-800",
          };
          const labels: Record<string, string> = {
            pending: "Pending",
            approved: "Approved",
            rejected: "Rejected",
            cancelled: "Cancelled",
          };
          return (
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                colors[String(value)] || colors.pending
              }`}
            >
              {labels[String(value)] || String(value)}
            </span>
          );
        },
      },
    ],
    []
  );

  // Transform raw data into table format
  const transformData = useMemo(
    () => (data: NonNullable<typeof absencesData>) => {
      if (!data) return [];

      return data.map((absence) => {
        const staff = absence.staff;
        const personalData = staff?.hotel_staff_personal_data;
        const staffName = personalData
          ? `${personalData.first_name || ""} ${
              personalData.last_name || ""
            }`.trim()
          : "Unknown";

        // Calculate days
        const start = new Date(absence.start_date);
        const end = new Date(absence.end_date);
        const days =
          Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) +
          1;

        return {
          id: absence.id,
          staffName,
          requestType: absence.request_type,
          startDate: start.toLocaleDateString(),
          endDate: end.toLocaleDateString(),
          status: absence.status,
          days,
        } as AbsenceRequest;
      });
    },
    []
  );

  return (
    <DataTable
      data={absencesData}
      isLoading={isLoading}
      error={error}
      columns={columns}
      searchValue={searchValue}
      searchFields={["staffName", "requestType"]}
      transformData={transformData}
      emptyMessage="No absence requests found."
      loadingMessage="Loading absence requests..."
      errorTitle="Failed to load absence requests"
      showSummary
      summaryLabel="Total absence requests"
    />
  );
}
