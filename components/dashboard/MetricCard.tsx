import { getComparisonIcon, getComparisonColor } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: React.ReactNode;
}

export function MetricCard({
  title,
  value,
  change,
  changeLabel,
  icon,
}: MetricCardProps) {
  const hasChange = typeof change === "number";

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        {icon && <div className="text-gray-400">{icon}</div>}
      </div>

      <div className="space-y-2">
        <p className="text-3xl font-bold text-gray-900">{value}</p>

        {hasChange && (
          <div className="flex items-center space-x-1">
            <span className={`text-sm font-medium ${getComparisonColor(change)}`}>
              {getComparisonIcon(change)} {Math.abs(change)}%
            </span>
            <span className="text-sm text-gray-500">
              {changeLabel || "than yesterday"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
