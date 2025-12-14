interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
}

export function MetricCard({
  title,
  value,
  change,
  changeLabel,
}: MetricCardProps) {
  const hasChange = typeof change === "number";
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;

  return (
    <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-200">
      <h3 className="text-xs font-medium text-gray-600 mb-2">{title}</h3>
      <p className="text-2xl font-bold text-gray-900 mb-2">{value}</p>

      {hasChange && (
        <div className="flex items-center gap-1.5">
          {/* Trend indicator */}
          <span className={isPositive ? "text-green-500" : "text-red-500"}>
            {isPositive ? (
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M4 14l4-4 4 4 8-8" />
                <path d="M12 6h8v8" />
              </svg>
            ) : (
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M4 10l4 4 4-4 8 8" />
                <path d="M12 18h8v-8" />
              </svg>
            )}
          </span>
          <span className={`text-xs font-medium ${isPositive ? "text-green-600" : "text-red-600"}`}>
            {Math.abs(change)}%
          </span>
          <span className="text-xs text-gray-500">{changeLabel}</span>
        </div>
      )}
    </div>
  );
}
