import { useState } from "react";

interface StatusBadgeProps {
  status: "active" | "inactive";
  onToggle: (newStatus: boolean) => Promise<void>;
  disabled?: boolean;
}

export function StatusBadge({
  status,
  onToggle,
  disabled = false,
}: StatusBadgeProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleClick = async () => {
    if (disabled || isUpdating) return;

    setIsUpdating(true);
    try {
      const newStatus = status === "inactive";
      await onToggle(newStatus);
    } catch (error) {
} finally {
      setIsUpdating(false);
    }
  };

  const isActive = status === "active";

  return (
    <button
      onClick={handleClick}
      disabled={disabled || isUpdating}
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors ${
        isActive
          ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
          : "bg-gray-100 text-gray-800 hover:bg-gray-200"
      } ${
        disabled || isUpdating
          ? "opacity-50 cursor-not-allowed"
          : "cursor-pointer"
      }`}
    >
      {isUpdating ? (
        <>
          <svg
            className="animate-spin -ml-0.5 mr-1.5 h-3 w-3"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Updating...
        </>
      ) : (
        <>{isActive ? "Active" : "Inactive"}</>
      )}
    </button>
  );
}
