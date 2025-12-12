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
  Legend,
} from "recharts";

interface DemographicsPieProps {
  male: number;
  female: number;
}

interface DemographicsTimeseriesProps {
  data: Array<{ time: string; male: number; female: number }>;
}

export function DemographicsPie({ male, female }: DemographicsPieProps) {
  const total = male + female;
  const malePercentage = total > 0 ? Math.round((male / total) * 100) : 0;
  const femalePercentage = total > 0 ? Math.round((female / total) * 100) : 0;

  const pieData = [
    { name: "Males", value: male, percentage: malePercentage },
    { name: "Females", value: female, percentage: femalePercentage },
  ];

  const COLORS = ["#5eb5b5", "#7ec9c9"];

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 h-full">
      <h3 className="text-lg font-semibold text-gray-800 mb-6">
        Chart of Demographics
      </h3>

      <div className="flex flex-col items-center">
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              dataKey="value"
              startAngle={90}
              endAngle={-270}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        <div className="text-center mt-4 space-y-3">
          <div>
            <p className="text-sm text-gray-600 font-medium">Total Crowd</p>
            <p className="text-2xl font-bold text-gray-900">100%</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-[#5eb5b5] rounded-full"></div>
              <span className="text-sm text-gray-700">
                {malePercentage}% Males
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-[#7ec9c9] rounded-full"></div>
              <span className="text-sm text-gray-700">
                {femalePercentage}% Females
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function DemographicsTimeseries({ data }: DemographicsTimeseriesProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">
          Demographics Analysis
        </h3>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-[#5eb5b5] rounded-full"></div>
            <span className="text-sm text-gray-600">Male</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-[#7ec9c9] rounded-full"></div>
            <span className="text-sm text-gray-600">Female</span>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="time"
            stroke="#9ca3af"
            style={{ fontSize: "12px" }}
          />
          <YAxis
            stroke="#9ca3af"
            style={{ fontSize: "12px" }}
            label={{ value: "Count", angle: -90, position: "insideLeft" }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
            }}
          />
          <Legend />
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
            stroke="#7ec9c9"
            strokeWidth={2}
            dot={false}
            name="Female"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
