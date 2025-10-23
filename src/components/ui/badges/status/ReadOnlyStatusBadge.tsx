interface ReadOnlyStatusBadgeProps {
  status: string;
  variant?: "default" | "success" | "warning" | "danger" | "info";
  colorMap?: Record<string, string>;
}

const defaultColors = {
  active: "bg-green-100 text-green-800",
  inactive: "bg-yellow-100 text-yellow-800",
  on_leave: "bg-red-100 text-red-800",
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  cancelled: "bg-gray-100 text-gray-800",
  completed: "bg-blue-100 text-blue-800",
};

export function ReadOnlyStatusBadge({
  status,
  variant,
  colorMap = defaultColors,
}: ReadOnlyStatusBadgeProps) {
  const getColorClass = () => {
    if (variant) {
      const variantColors = {
        default: "bg-gray-100 text-gray-800",
        success: "bg-green-100 text-green-800",
        warning: "bg-yellow-100 text-yellow-800",
        danger: "bg-red-100 text-red-800",
        info: "bg-blue-100 text-blue-800",
      };
      return variantColors[variant];
    }
    
    return colorMap[status] || defaultColors.active;
  };

  const formatStatus = (str: string) => {
    return str
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getColorClass()}`}
    >
      {formatStatus(status)}
    </span>
  );
}
