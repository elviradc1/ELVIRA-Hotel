import type { CalendarView } from "./types";

interface CalendarCellProps {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  searchValue: string;
  statusFilter: string;
  view: CalendarView;
}

export function CalendarCell({
  date,
  isCurrentMonth,
  isToday,
  searchValue,
  statusFilter,
  view,
}: CalendarCellProps) {
  const dayNumber = date.getDate();

  // Cell height differs between month and week view
  const cellHeight = view === "week" ? "h-32" : "h-24";

  // Mock schedule events (in a real app, this would come from props or context)
  const hasEvents = Math.random() > 0.7; // Random events for demo

  // Filter events based on status filter (in real app, this would filter actual events)
  const shouldShowEvents = statusFilter === "All Statuses" || hasEvents;

  return (
    <div
      className={`
        ${cellHeight} border border-gray-200 bg-white rounded-md p-2 cursor-pointer hover:bg-gray-50
        ${!isCurrentMonth ? "bg-gray-50 text-gray-400" : ""}
        ${isToday ? "bg-blue-50 border-blue-300" : ""}
      `}
    >
      {/* Day Number */}
      <div className="flex items-center justify-between mb-1">
        <span
          className={`
            text-sm font-medium
            ${
              isToday
                ? "bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                : ""
            }
            ${!isCurrentMonth ? "text-gray-400" : "text-gray-900"}
          `}
        >
          {dayNumber}
        </span>
      </div>

      {/* Schedule Events */}
      {shouldShowEvents && isCurrentMonth && (
        <div className="space-y-1">
          <div className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded truncate">
            Staff Meeting
          </div>
          {view === "week" && (
            <>
              <div className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded truncate">
                Shift Change
              </div>
              <div className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded truncate">
                Training
              </div>
            </>
          )}
        </div>
      )}

      {/* Show filtered indicator if search is active */}
      {searchValue && shouldShowEvents && (
        <div className="absolute bottom-1 right-1">
          <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
        </div>
      )}
    </div>
  );
}
