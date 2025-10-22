import { useMemo, useEffect } from "react";
import { Table, type TableColumn } from "../../../../components/ui";
import { useEmergencyContacts } from "../../../../hooks/emergency-contacts/useEmergencyContacts";
import { useHotelId } from "../../../../hooks/useHotelContext";
import type { Database } from "../../../../types/database";

type EmergencyContactRow =
  Database["public"]["Tables"]["emergency_contacts"]["Row"];

interface EmergencyContact extends Record<string, unknown> {
  id: string;
  status: string;
  contactName: string;
  contactPhone: string;
  created: string;
}

interface EmergencyContactsTableProps {
  searchValue: string;
}

export function EmergencyContactsTable({
  searchValue,
}: EmergencyContactsTableProps) {
  const hotelId = useHotelId();

  console.log("🚨 EmergencyContactsTable - Component Rendered:", {
    hotelId,
    timestamp: new Date().toISOString(),
  });

  // Fetch emergency contacts using the hook
  const {
    data: emergencyContacts,
    isLoading,
    error,
    isFetching,
    dataUpdatedAt,
  } = useEmergencyContacts(hotelId || undefined);

  useEffect(() => {
    console.log("🚨 EmergencyContacts - Data State Changed:", {
      hotelId,
      isLoading,
      isFetching,
      error: error?.message,
      dataCount: emergencyContacts?.length || 0,
      dataUpdatedAt: dataUpdatedAt
        ? new Date(dataUpdatedAt).toISOString()
        : "never",
      rawData: emergencyContacts,
      timestamp: new Date().toISOString(),
    });
  }, [hotelId, isLoading, isFetching, error, emergencyContacts, dataUpdatedAt]);

  // Define table columns for emergency contacts
  const columns: TableColumn<EmergencyContact>[] = [
    {
      key: "status",
      label: "Status",
      sortable: true,
    },
    {
      key: "contactName",
      label: "Contact Name",
      sortable: true,
    },
    {
      key: "contactPhone",
      label: "Contact Phone",
      sortable: true,
    },
    {
      key: "created",
      label: "Created",
      sortable: true,
    },
  ];

  // Transform database data to table format with search filtering
  const contactData: EmergencyContact[] = useMemo(() => {
    if (!emergencyContacts) {
      console.log("🚨 EmergencyContacts - No data to transform");
      return [];
    }

    console.log("🚨 EmergencyContacts - Transforming data:", {
      rawCount: emergencyContacts.length,
      searchValue,
    });

    const transformed = emergencyContacts
      .filter((contact: EmergencyContactRow) => {
        if (!searchValue) return true;

        const search = searchValue.toLowerCase();
        return (
          contact.contact_name.toLowerCase().includes(search) ||
          contact.phone_number.toLowerCase().includes(search)
        );
      })
      .map((contact: EmergencyContactRow) => ({
        id: contact.id,
        status: contact.is_active ? "Active" : "Inactive",
        contactName: contact.contact_name,
        contactPhone: contact.phone_number,
        created: contact.created_at
          ? new Date(contact.created_at).toLocaleDateString()
          : "N/A",
      }));

    console.log("🚨 EmergencyContacts - Transformed data:", {
      transformedCount: transformed.length,
      sample: transformed[0],
    });

    return transformed;
  }, [emergencyContacts, searchValue]);

  // Log any errors
  if (error) {
    console.error("🚨 EmergencyContacts - Error loading data:", error);
  }

  return (
    <div className="mt-6">
      {/* Debug info */}
      {(isLoading || isFetching) && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-800">
          ⏳ {isLoading ? "Loading" : "Refetching"} emergency contacts...
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-800">
          ❌ Error: {error.message}
        </div>
      )}

      {searchValue && (
        <p className="text-sm text-gray-600 mb-4">
          Searching for: "{searchValue}" - Found {contactData.length} result(s)
        </p>
      )}

      {/* Emergency Contacts Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        <Table
          columns={columns}
          data={contactData}
          loading={isLoading}
          emptyMessage={
            searchValue
              ? `No emergency contacts found matching "${searchValue}".`
              : "No emergency contacts found. Add new contacts to get started."
          }
        />
      </div>
    </div>
  );
}
