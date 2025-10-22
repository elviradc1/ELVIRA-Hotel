import { Modal, Button } from "../../../../../../components/ui";
import {
  OrderField,
  OrderStatusBadge,
} from "../../../../../../components/ui/forms/order-details";
import type { AmenityRequestWithDetails } from "../../../../../../hooks/amenities/amenity-requests/useAmenityRequests";

interface AmenityRequestDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: AmenityRequestWithDetails | null;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function AmenityRequestDetailModal({
  isOpen,
  onClose,
  request,
  onEdit,
  onDelete,
}: AmenityRequestDetailModalProps) {
  if (!request) return null;

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

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Amenity Request Details"
      size="md"
    >
      {/* Scrollable Content Area */}
      <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
        {/* Request ID */}
        <OrderField label="Request ID" value={`#${request.id.slice(0, 8)}`} />

        {/* Guest Info */}
        {request.guests && (
          <>
            <OrderField label="Guest" value={request.guests.guest_name} />
            <OrderField label="Room" value={request.guests.room_number} />
          </>
        )}

        {/* Amenity Info */}
        {request.amenities && (
          <>
            <OrderField label="Amenity" value={request.amenities.name} />
            <OrderField label="Category" value={request.amenities.category} />
            <OrderField
              label="Price"
              value={`$${request.amenities.price.toFixed(2)}`}
            />
          </>
        )}

        {/* Request Date/Time */}
        <OrderField label="Requested For" value={requestDate} />

        {/* Special Instructions */}
        <OrderField
          label="Special Instructions"
          value={request.special_instructions || "No special requirements"}
        />

        {/* Status */}
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">
            Status
          </span>
          <OrderStatusBadge status={request.status} />
        </div>

        {/* Created Date */}
        <OrderField
          label="Created"
          value={
            request.created_at
              ? new Date(request.created_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "N/A"
          }
        />

        {/* Amenity Image */}
        {request.amenities?.image_url && (
          <div className="pt-4 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">
              Amenity Image
            </h3>
            <img
              src={request.amenities.image_url}
              alt={request.amenities.name}
              className="w-full h-48 object-cover rounded-lg border border-gray-200"
            />
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="flex justify-between items-center gap-3 pt-4 mt-4 border-t border-gray-200">
        <div className="flex gap-2">
          {onEdit && (
            <Button variant="outline" size="md" onClick={onEdit}>
              Edit
            </Button>
          )}
          {onDelete && (
            <Button variant="outline" size="md" onClick={onDelete}>
              Delete
            </Button>
          )}
        </div>
        <Button variant="primary" size="md" onClick={onClose}>
          Close
        </Button>
      </div>
    </Modal>
  );
}
