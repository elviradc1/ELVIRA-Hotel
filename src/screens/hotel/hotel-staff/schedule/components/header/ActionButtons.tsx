import { Button } from "../../../../../../components/ui";

export function ActionButtons() {
  return (
    <div className="flex items-center space-x-3">
      {/* Send Calendar Button */}
      <Button
        variant="secondary"
        size="sm"
        className="flex items-center space-x-2"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
          />
        </svg>
        <span>Send Calendar</span>
      </Button>

      {/* Create Schedule Button */}
      <Button
        variant="primary"
        size="sm"
        className="flex items-center space-x-2"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
        <span>Create Schedule</span>
      </Button>
    </div>
  );
}
