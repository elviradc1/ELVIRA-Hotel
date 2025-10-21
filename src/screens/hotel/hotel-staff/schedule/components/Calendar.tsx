import { useState } from "react";
import { CalendarHeader } from "./header";
import { CalendarGrid } from "./CalendarGrid";
import type { CalendarView } from "./types";

export type { CalendarView };

interface CalendarProps {
  searchValue: string;
}

export function Calendar({ searchValue }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 9, 21)); // October 21, 2025
  const [view, setView] = useState<CalendarView>("month");
  const [statusFilter, setStatusFilter] = useState("All Statuses");

  const handlePrevious = () => {
    const newDate = new Date(currentDate);
    if (view === "month") {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setDate(newDate.getDate() - 7);
    }
    setCurrentDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    if (view === "month") {
      newDate.setMonth(newDate.getMonth() + 1);
    } else {
      newDate.setDate(newDate.getDate() + 7);
    }
    setCurrentDate(newDate);
  };

  const handleToday = () => {
    setCurrentDate(new Date(2025, 9, 21)); // October 21, 2025
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <CalendarHeader
        currentDate={currentDate}
        view={view}
        onViewChange={setView}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onToday={handleToday}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />
      <CalendarGrid
        currentDate={currentDate}
        view={view}
        searchValue={searchValue}
        statusFilter={statusFilter}
      />
    </div>
  );
}
