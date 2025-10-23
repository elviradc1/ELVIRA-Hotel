import { useState } from "react";
import { StaffList } from "./StaffList";
import { StaffConversationView } from "./StaffConversationView";
import { useCurrentHotelStaffList } from "../../../../../hooks/chat-management";

export function StaffCommunication() {
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);
  const { data: staffMembers, isLoading } = useCurrentHotelStaffList();

  console.log("🏠 [StaffCommunication] Component rendered");
  console.log("🏠 Staff members count:", staffMembers?.length || 0);
  console.log("🏠 Selected staff ID:", selectedStaffId);
  console.log("🏠 Is loading:", isLoading);

  const handleStaffSelect = (staffId: string) => {
    console.log(
      "🎯 [StaffCommunication] handleStaffSelect called with:",
      staffId
    );
    setSelectedStaffId(staffId);
    console.log("🎯 [StaffCommunication] State should update to:", staffId);
  };

  return (
    <div className="flex h-[calc(100vh-280px)] bg-white rounded-lg border border-gray-200">
      {/* Left Panel - Staff List */}
      <div className="w-80 border-r border-gray-200 flex flex-col">
        <StaffList
          staffMembers={staffMembers || []}
          selectedStaffId={selectedStaffId}
          onSelectStaff={handleStaffSelect}
          isLoading={isLoading}
        />
      </div>

      {/* Right Panel - Conversation */}
      <div className="flex-1 flex flex-col">
        {selectedStaffId ? (
          <StaffConversationView
            otherStaffId={selectedStaffId}
            staffMembers={staffMembers || []}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <svg
                className="w-16 h-16 mx-auto mb-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <p className="text-sm">Select a staff member to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
