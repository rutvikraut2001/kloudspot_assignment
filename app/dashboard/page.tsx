"use client";

import { useState, useRef } from "react";
import { Calendar } from "lucide-react";
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ReferenceLine,
} from "recharts";

const occupancyData = [
  { time: "8:00", occupancy: 145 },
  { time: "9:00", occupancy: 150 },
  { time: "10:00", occupancy: 148 },
  { time: "11:00", occupancy: 152 },
  { time: "12:00", occupancy: 155 },
  { time: "13:00", occupancy: 150 },
  { time: "14:00", occupancy: 148 },
  { time: "15:00", occupancy: 155 },
  { time: "16:00", occupancy: 195 },
  { time: "17:00", occupancy: 185 },
  { time: "18:00", occupancy: 175 },
];

const demographicsData = [
  { time: "8:00", male: 100, female: 80 },
  { time: "9:00", male: 120, female: 95 },
  { time: "10:00", male: 150, female: 120 },
  { time: "11:00", male: 165, female: 140 },
  { time: "12:00", male: 180, female: 155 },
  { time: "13:00", male: 175, female: 150 },
  { time: "14:00", male: 170, female: 145 },
  { time: "15:00", male: 175, female: 150 },
  { time: "16:00", male: 185, female: 160 },
  { time: "17:00", male: 180, female: 155 },
  { time: "18:00", male: 170, female: 148 },
];

const genderData = [
  { name: "Males", value: 55, color: "#0d9488" },
  { name: "Females", value: 45, color: "#99f6e4" },
];

const CustomLiveLabel = ({ viewBox }: any) => {
  const { x } = viewBox;
  return (
    <g>
      <rect x={x - 12} y={5} width={24} height={16} fill="#ef4444" rx={2} />
      <text x={x} y={16} textAnchor="middle" fill="white" fontSize={8} fontWeight="bold">
        LIVE
      </text>
    </g>
  );
};

export default function DashboardPage() {
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const dateInputRef = useRef<HTMLInputElement>(null);

  const formatDisplayDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selected = new Date(dateStr);
    selected.setHours(0, 0, 0, 0);

    if (selected.getTime() === today.getTime()) {
      return "Today";
    }
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="h-full flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between flex-shrink-0">
        <h2 className="text-lg font-semibold text-gray-800">Overview</h2>
        <div className="relative">
          <button
            onClick={() => dateInputRef.current?.showPicker()}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50 bg-white min-w-[120px]"
          >
            <Calendar size={16} />
            {formatDisplayDate(selectedDate)}
          </button>
          <input
            ref={dateInputRef}
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        </div>
      </div>

      {/* Occupancy Section */}
      <div className="flex-shrink-0">
        <h3 className="text-base font-semibold text-gray-800 mb-2">Occupancy</h3>
        <div className="grid grid-cols-3 gap-4">
          {/* Live Occupancy */}
          <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
            <p className="text-sm font-medium text-gray-500 mb-1">Live Occupancy</p>
            <p className="text-2xl font-semibold text-gray-800">734</p>
            <div className="flex flex-col mt-1">
              <svg
                className="w-4 h-4 text-teal-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
              <span className="text-xs text-gray-600">10% More than yesterday</span>
            </div>
          </div>

          {/* Today's Footfall */}
          <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
            <p className="text-sm font-medium text-gray-500 mb-1">Today&apos;s Footfall</p>
            <p className="text-2xl font-semibold text-gray-800">2,436</p>
            <div className="flex flex-col mt-1">
              <svg
                className="w-4 h-4 text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6"
                />
              </svg>
              <span className="text-xs text-gray-600">10% Less than yesterday</span>
            </div>
          </div>

          {/* Avg Dwell Time */}
          <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
            <p className="text-sm font-medium text-gray-500 mb-1">Avg Dwell Time</p>
            <p className="text-2xl font-semibold text-gray-800">08min 30sec</p>
            <div className="flex flex-col mt-1">
              <svg
                className="w-4 h-4 text-teal-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
              <span className="text-xs text-gray-600">6% More than yesterday</span>
            </div>
          </div>
        </div>
      </div>

      {/* Overall Occupancy Chart */}
      <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100 flex-1 min-h-0">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-base font-semibold text-gray-800">Overall Occupancy</h3>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
            <span>Occupancy</span>
          </div>
        </div>
        <div className="h-[calc(100%-40px)]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={occupancyData} margin={{ top: 25, right: 20, left: 0, bottom: 35 }}>
              <defs>
                <linearGradient id="occupancyGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#14b8a6" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis
                dataKey="time"
                axisLine={{ stroke: "#9ca3af" }}
                tickLine={false}
                tick={{ fontSize: 11, fill: "#6b7280" }}
                dy={5}
                label={{
                  value: "Time",
                  position: "bottom",
                  offset: 15,
                  style: { fill: "#374151", fontSize: 12, fontWeight: 600, textAnchor: "middle" },
                }}
              />
              <YAxis
                axisLine={{ stroke: "#9ca3af" }}
                tickLine={false}
                tick={{ fontSize: 11, fill: "#6b7280" }}
                domain={[50, 250]}
                ticks={[50, 100, 150, 200, 250]}
                width={45}
                label={{
                  value: "Count",
                  position: "bottom",
                  angle: -90,
                  dx: -20,
                  style: { textAnchor: "middle", fill: "#374151", fontSize: 12, fontWeight: 600 },
                }}
              />
              <Tooltip />
              <ReferenceLine
                x="16:00"
                stroke="#ef4444"
                strokeDasharray="3 3"
                label={<CustomLiveLabel />}
              />
              <Area
                type="monotone"
                dataKey="occupancy"
                stroke="#14b8a6"
                strokeWidth={2}
                fill="url(#occupancyGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Demographics Section */}
      <div className="flex-1 min-h-0 flex flex-col">
        <h3 className="text-base font-semibold text-gray-800 mb-2 flex-shrink-0">Demographics</h3>
        <div className="flex gap-4 flex-1 min-h-0">
          {/* Pie Chart - 30% */}
          <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100 w-[30%] flex flex-col">
            <h4 className="text-base font-semibold text-gray-800 mb-2 flex-shrink-0">
              Chart of Demographics
            </h4>
            <div className="relative flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={genderData}
                    cx="50%"
                    cy="50%"
                    innerRadius="45%"
                    outerRadius="70%"
                    dataKey="value"
                    startAngle={90}
                    endAngle={-270}
                    paddingAngle={3}
                    cornerRadius={5}
                  >
                    {genderData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <p className="text-[10px] text-gray-400">Total Crowd</p>
                <p className="text-base font-bold text-gray-800">100%</p>
              </div>
            </div>
            <div className="flex flex-col gap-1 mt-2 flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-teal-600 rounded-full"></div>
                <span className="text-xs text-gray-600">55% Males</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-teal-200 rounded-full"></div>
                <span className="text-xs text-gray-600">45% Females</span>
              </div>
            </div>
          </div>

          {/* Demographics Line Chart - 70% */}
          <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100 w-[70%] flex flex-col">
            <div className="flex items-center justify-between mb-2 flex-shrink-0">
              <h4 className="text-base font-semibold text-gray-800">Demographics Analysis</h4>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                  <span>Male</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <div className="w-2 h-2 bg-teal-200 rounded-full"></div>
                  <span>Female</span>
                </div>
              </div>
            </div>
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={demographicsData}
                  margin={{ top: 10, right: 20, left: 0, bottom: 35 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis
                    dataKey="time"
                    axisLine={{ stroke: "#9ca3af" }}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: "#6b7280" }}
                    dy={5}
                    label={{
                      value: "Time",
                      position: "bottom",
                      offset: 15,
                      style: {
                        fill: "#374151",
                        fontSize: 12,
                        fontWeight: 600,
                        textAnchor: "middle",
                      },
                    }}
                  />
                  <YAxis
                    axisLine={{ stroke: "#9ca3af" }}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: "#6b7280" }}
                    domain={[0, 250]}
                    ticks={[0, 50, 100, 150, 200, 250]}
                    width={45}
                    label={{
                      value: "Count",
                      position: "bottom",
                      angle: -90,
                      dx: -20,
                      style: {
                        textAnchor: "middle",
                        fill: "#374151",
                        fontSize: 12,
                        fontWeight: 600,
                      },
                    }}
                  />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="male"
                    stroke="#0d9488"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="female"
                    stroke="#99f6e4"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
