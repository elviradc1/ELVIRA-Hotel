import { useState } from "react";
import { Table, type TableColumn, SearchBox } from "../../../components/ui";

interface Guest extends Record<string, unknown> {
  id: string;
  room: string;
  status: string;
  dnd: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  language: string;
}

interface GuestManagementProps {
  searchValue?: string;
}

export function GuestManagement({
  searchValue: externalSearchValue,
}: GuestManagementProps) {
  const [internalSearchValue, setInternalSearchValue] = useState("");

  // Use external search value if provided (for tab-based usage), otherwise use internal state
  const searchValue =
    externalSearchValue !== undefined
      ? externalSearchValue
      : internalSearchValue;
  const setSearchValue =
    externalSearchValue !== undefined ? () => {} : setInternalSearchValue;

  const handleSearchClear = () => {
    setSearchValue("");
  };
  // Define table columns
  const columns: TableColumn<Guest>[] = [
    {
      key: "room",
      label: "Room",
      sortable: true,
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
    },
    {
      key: "dnd",
      label: "DND",
      sortable: true,
    },
    {
      key: "firstName",
      label: "First Name",
      sortable: true,
    },
    {
      key: "lastName",
      label: "Last Name",
      sortable: true,
    },
    {
      key: "email",
      label: "Email",
      sortable: true,
    },
    {
      key: "phone",
      label: "Phone",
      sortable: true,
    },
    {
      key: "country",
      label: "Country",
      sortable: true,
    },
    {
      key: "language",
      label: "Language",
      sortable: true,
    },
  ];

  // Empty data array - no mock data
  const guestData: Guest[] = [];

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <svg
          className="w-6 h-6 text-gray-600 mr-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        <h1 className="text-2xl font-bold text-gray-900">Guest Management</h1>
      </div>

      {/* Guest Management Table */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-500">
            Manage hotel guests, track room assignments, and monitor guest
            preferences and status.
          </p>

          {/* Search Box */}
          <div className="w-80">
            <SearchBox
              value={searchValue}
              onChange={setSearchValue}
              placeholder="Search guests by name, room, or email..."
              onClear={handleSearchClear}
            />
          </div>
        </div>

        {searchValue && (
          <p className="text-sm text-gray-600 mb-4">
            Searching for: "{searchValue}"
          </p>
        )}

        <Table
          columns={columns}
          data={guestData}
          emptyMessage="No guests found. Guest information will appear here once check-ins begin."
        />
      </div>
    </div>
  );
}
