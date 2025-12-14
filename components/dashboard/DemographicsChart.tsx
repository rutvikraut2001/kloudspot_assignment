"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

interface DemographicsPieProps {
  male: number;
  female: number;
}

interface DemographicsTimeseriesProps {
  data: Array<{ time: string; male: number; female: number }>;
}

export function DemographicsPie({ male, female }: DemographicsPieProps) {
  const pieData = [
    { name: "Males", value: male },
    { name: "Females", value: female },
  ];

  const COLORS = ["#5eb5b5", "#8dd4d4"];

  return (
    <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-200">
      <h3 className="text-base font-medium text-gray-900 mb-4">
        Chart of Demographics
      </h3>

      <div className="flex flex-col items-center">
        <div className="relative">
          <ResponsiveContainer width={200} height={200}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={85}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
                stroke="none"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xs text-gray-500">Total Crowd</span>
            <span className="text-xl font-bold text-gray-900">100%</span>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-[#5eb5b5]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
            <span className="text-sm text-gray-700">{male}% Males</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-[#8dd4d4]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
            <span className="text-sm text-gray-700">{female}% Females</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function DemographicsTimeseries({ data }: DemographicsTimeseriesProps) {
  return (
    <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-medium text-gray-900">
          Demographics Analysis
        </h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-[#5eb5b5] rounded-full"></div>
            <span className="text-xs text-gray-600">Male</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-[#8dd4d4] rounded-full"></div>
            <span className="text-xs text-gray-600">Female</span>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
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
            domain={[0, 330]}
            ticks={[0, 50, 100, 150, 200, 250, 330]}
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
          />
          <Line
            type="monotone"
            dataKey="male"
            stroke="#5eb5b5"
            strokeWidth={2}
            dot={false}
            name="Male"
          />
          <Line
            type="monotone"
            dataKey="female"
            stroke="#8dd4d4"
            strokeWidth={2}
            dot={false}
            name="Female"
          />
        </LineChart>
      </ResponsiveContainer>

      {/* X-axis label */}
      <div className="text-center mt-2">
        <span className="text-xs text-gray-500">Time</span>
      </div>
    </div>
  );
}
