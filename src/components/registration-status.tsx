export function RegistrationStatus({ status }: { status: string }) {
  const config: Record<string, { label: string; classes: string }> = {
    PENDING: {
      label: "Pending Payment",
      classes: "bg-yellow-50 text-yellow-700 ring-yellow-600/20 dark:bg-yellow-900/20 dark:text-yellow-400 dark:ring-yellow-500/20",
    },
    CONFIRMED: {
      label: "Confirmed",
      classes: "bg-green-50 text-green-700 ring-green-600/20 dark:bg-green-900/20 dark:text-green-400 dark:ring-green-500/20",
    },
    CANCELLED: {
      label: "Cancelled",
      classes: "bg-red-50 text-red-700 ring-red-600/20 dark:bg-red-900/20 dark:text-red-400 dark:ring-red-500/20",
    },
  };

  const { label, classes } = config[status] || {
    label: status,
    classes: "bg-gray-50 text-gray-700 ring-gray-600/20 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-600/20",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${classes}`}
    >
      {label}
    </span>
  );
}
