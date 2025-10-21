import { CalendarCell } from "./CalendarCell";
import type { CalendarView } from "./types";

interface CalendarGridProps {
  currentDate: Date;
  view: CalendarView;
  searchValue: string;
  statusFilter: string;
}

export function CalendarGrid({
  currentDate,
  view,
  searchValue,
  statusFilter,
}: CalendarGridProps) {
  const today = new Date(2025, 9, 21); // October 21, 2025

  // Get the first day of the month
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );

  // Get the first day of the calendar grid (might be from previous month)
  const firstDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sunday
  const startDate = new Date(firstDayOfMonth);
  startDate.setDate(startDate.getDate() - firstDayOfWeek);

  // Generate calendar days
  const calendarDays: Date[] = [];
  const currentCalendarDate = new Date(startDate);

  // Generate 6 weeks (42 days) for month view
  for (let i = 0; i < 42; i++) {
    calendarDays.push(new Date(currentCalendarDate));
    currentCalendarDate.setDate(currentCalendarDate.getDate() + 1);
  }

  // Day headers
  const dayHeaders = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  if (view === "week") {
    // For week view, show only 7 days starting from the current week
    const startOfWeek = new Date(currentDate);
    const dayOfWeek = startOfWeek.getDay();
    startOfWeek.setDate(startOfWeek.getDate() - dayOfWeek);

    const weekDays: Date[] = [];
    const currentWeekDate = new Date(startOfWeek);

    for (let i = 0; i < 7; i++) {
      weekDays.push(new Date(currentWeekDate));
      currentWeekDate.setDate(currentWeekDate.getDate() + 1);
    }

    return (
      <div className="p-6">
        {/* Week View Header */}
        <div className="grid grid-cols-7 gap-1 mb-4">
          {dayHeaders.map((day) => (
            <div
              key={day}
              className="text-center text-sm font-medium text-gray-500 py-2"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Week View Grid */}
        <div className="grid grid-cols-7 gap-1">
          {weekDays.map((date, index) => (
            <CalendarCell
              key={index}
              date={date}
              isCurrentMonth={true}
              isToday={date.toDateString() === today.toDateString()}
              searchValue={searchValue}
              statusFilter={statusFilter}
              view={view}
            />
          ))}
        </div>
      </div>
    );
  }

  // Month view
  return (
    <div className="p-6">
      {/* Month View Header */}
      <div className="grid grid-cols-7 gap-1 mb-4">
        {dayHeaders.map((day) => (
          <div
            key={day}
            className="text-center text-sm font-medium text-gray-500 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Month View Grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((date, index) => {
          const isCurrentMonth = date.getMonth() === currentDate.getMonth();
          const isToday = date.toDateString() === today.toDateString();

          return (
            <CalendarCell
              key={index}
              date={date}
              isCurrentMonth={isCurrentMonth}
              isToday={isToday}
              searchValue={searchValue}
              statusFilter={statusFilter}
              view={view}
            />
          );
        })}
      </div>
    </div>
  );
}
