"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

interface OccupancyChartProps {
  data: Array<{ time: string; count: number }>;
}

export function OccupancyChart({ data }: OccupancyChartProps) {
  // Find the "current" time index (simulate live - use second to last point)
  const liveIndex = data.length - 2;
  const liveTime = data[liveIndex]?.time || "17:00";

  return (
    <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-medium text-gray-900">Overall Occupancy</h3>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 bg-[#5eb5b5] rounded-full"></div>
          <span className="text-xs text-gray-600">Occupancy</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="occupancyGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#5eb5b5" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#5eb5b5" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
          <XAxis
            dataKey="time"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#6b7280", fontSize: 12 }}
            dy={10}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#6b7280", fontSize: 12 }}
            domain={[0, 250]}
            ticks={[0, 50, 100, 150, 200, 250]}
            label={{
              value: "Count",
              angle: -90,
              position: "insideLeft",
              style: { fill: "#6b7280", fontSize: 12 },
            }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              fontSize: "12px",
            }}
            formatter={(value: number) => [`${value}`, "Occupancy"]}
          />
          <ReferenceLine
            x={liveTime}
            stroke="#ef4444"
            strokeDasharray="5 5"
            strokeWidth={2}
            label={{
              value: "LIVE",
              position: "top",
              fill: "#fff",
              fontSize: 10,
              fontWeight: "bold",
              style: { backgroundColor: "#ef4444" },
            }}
          />
          <Area
            type="monotone"
            dataKey="count"
            stroke="#5eb5b5"
            strokeWidth={2}
            fill="url(#occupancyGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* X-axis label */}
      <div className="text-center mt-2">
        <span className="text-xs text-gray-500">Time</span>
      </div>
    </div>
  );
}
