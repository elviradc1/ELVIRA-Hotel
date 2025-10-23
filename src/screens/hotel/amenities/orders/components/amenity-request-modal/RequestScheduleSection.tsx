import { ModalFormSection } from "../../../../../../components/ui";
import {
  OrderField,
  OrderStatusBadge,
} from "../../../../../../components/ui/forms/order-details";
import type { AmenityRequestSectionProps } from "./types";

/**
 * RequestScheduleSection - Request date, time, and status
 * View-only display
 */
export function RequestScheduleSection({
  request,
}: AmenityRequestSectionProps) {
  // Format date and time
  const formatDateTime = (date: string, time: string | null) => {
    const dateObj = new Date(date);
    const formattedDate = dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    if (time) {
      return `${formattedDate} at ${time}`;
    }
    return formattedDate;
  };

  const requestDate = formatDateTime(
    request.request_date,
    request.request_time
  );

  const createdDate = request.created_at
    ? new Date(request.created_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "N/A";

  return (
    <ModalFormSection title="Schedule & Status">
      <OrderField label="Requested For" value={requestDate} />
      <OrderField label="Created" value={createdDate} />

      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">
          Status
        </span>
        <OrderStatusBadge status={request.status} />
      </div>
    </ModalFormSection>
  );
}
