import { useGuestAuth } from "../../contexts/guest";

export function GuestDashboard() {
  const { guestSession, signOut } = useGuestAuth();

  if (!guestSession) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
          {/* Icon */}
          <div className="mx-auto h-16 w-16 bg-emerald-500 rounded-full flex items-center justify-center mb-6">
            <svg
              className="h-8 w-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Guest Session
          </h1>

          {/* Guest Info */}
          <div className="mb-6">
            <p className="text-gray-600 text-sm mb-1">Welcome,</p>
            <p className="text-lg font-semibold text-gray-900">
              {guestSession.guestData.guest_name}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Room {guestSession.guestData.room_number}
            </p>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 my-6"></div>

          {/* Hotel Info */}
          <div className="mb-6">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
              Hotel
            </p>
            <p className="text-sm font-medium text-gray-900">
              {guestSession.hotelData.name}
            </p>
            {guestSession.hotelData.city && (
              <p className="text-xs text-gray-500 mt-1">
                {guestSession.hotelData.city}
                {guestSession.hotelData.country &&
                  `, ${guestSession.hotelData.country}`}
              </p>
            )}
          </div>

          {/* Sign Out Button */}
          <button
            onClick={signOut}
            className="w-full py-3 px-4 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
