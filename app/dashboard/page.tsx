'use client';

import { Calendar } from 'lucide-react';
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
} from 'recharts';

const occupancyData = [
  { time: '8:00', occupancy: 145 },
  { time: '9:00', occupancy: 150 },
  { time: '10:00', occupancy: 148 },
  { time: '11:00', occupancy: 152 },
  { time: '12:00', occupancy: 155 },
  { time: '13:00', occupancy: 150 },
  { time: '14:00', occupancy: 148 },
  { time: '15:00', occupancy: 155 },
  { time: '16:00', occupancy: 195 },
  { time: '17:00', occupancy: 185 },
  { time: '18:00', occupancy: 175 },
];

const demographicsData = [
  { time: '8:00', male: 100, female: 80 },
  { time: '9:00', male: 120, female: 95 },
  { time: '10:00', male: 150, female: 120 },
  { time: '11:00', male: 165, female: 140 },
  { time: '12:00', male: 180, female: 155 },
  { time: '13:00', male: 175, female: 150 },
  { time: '14:00', male: 170, female: 145 },
  { time: '15:00', male: 175, female: 150 },
  { time: '16:00', male: 185, female: 160 },
  { time: '17:00', male: 180, female: 155 },
  { time: '18:00', male: 170, female: 148 },
];

const genderData = [
  { name: 'Males', value: 55, color: '#0d9488' },
  { name: 'Females', value: 45, color: '#99f6e4' },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">Overview</h2>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50 bg-white">
          <Calendar size={16} />
          Today
        </button>
      </div>

      {/* Occupancy Section */}
      <div>
        <h3 className="text-base font-medium text-gray-700 mb-4">Occupancy</h3>
        <div className="grid grid-cols-3 gap-5">
          {/* Live Occupancy */}
          <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500 mb-2">Live Occupancy</p>
            <p className="text-3xl font-bold text-gray-800">734</p>
            <div className="flex items-center gap-1 mt-2 text-sm text-teal-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <span>10% More than yesterday</span>
            </div>
          </div>

          {/* Today's Footfall */}
          <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500 mb-2">Today&apos;s Footfall</p>
            <p className="text-3xl font-bold text-gray-800">2,436</p>
            <div className="flex items-center gap-1 mt-2 text-sm text-red-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6" />
              </svg>
              <span>10% Less than yesterday</span>
            </div>
          </div>

          {/* Avg Dwell Time */}
          <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500 mb-2">Avg Dwell Time</p>
            <p className="text-3xl font-bold text-gray-800">08min 30sec</p>
            <div className="flex items-center gap-1 mt-2 text-sm text-teal-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <span>6% More than yesterday</span>
            </div>
          </div>
        </div>
      </div>

      {/* Overall Occupancy Chart */}
      <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-medium text-gray-700">Overall Occupancy</h3>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <div className="w-3 h-3 bg-teal-500 rounded-full"></div>
            <span>Occupancy</span>
          </div>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={occupancyData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
              <defs>
                <linearGradient id="occupancyGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#14b8a6" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis
                dataKey="time"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#9ca3af' }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#9ca3af' }}
                domain={[50, 250]}
                ticks={[50, 100, 150, 200, 250]}
                label={{ value: 'Count', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#9ca3af', fontSize: 12 } }}
              />
              <Tooltip />
              <ReferenceLine x="16:00" stroke="#ef4444" strokeDasharray="3 3" label={{ value: 'LIVE', fill: '#ef4444', fontSize: 10, position: 'top' }} />
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
        <div className="text-center mt-2">
          <span className="text-sm text-gray-500">Time</span>
        </div>
      </div>

      {/* Demographics Section */}
      <div>
        <h3 className="text-base font-medium text-gray-700 mb-4">Demographics</h3>
        <div className="grid grid-cols-2 gap-5">
          {/* Pie Chart */}
          <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100">
            <h4 className="text-base font-medium text-gray-700 mb-4">Chart of Demographics</h4>
            <div className="relative h-52">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={genderData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    dataKey="value"
                    startAngle={90}
                    endAngle={-270}
                  >
                    {genderData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <p className="text-xs text-gray-400">Total Crowd</p>
                <p className="text-xl font-bold text-gray-800">100%</p>
              </div>
            </div>
            <div className="flex flex-col gap-2 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-teal-600 rounded-sm"></div>
                <span className="text-sm text-gray-600">55% Males</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-teal-200 rounded-sm"></div>
                <span className="text-sm text-gray-600">45% Females</span>
              </div>
            </div>
          </div>

          {/* Demographics Line Chart */}
          <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-base font-medium text-gray-700">Demographics Analysis</h4>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <div className="w-3 h-3 bg-teal-500 rounded-full"></div>
                  <span>Male</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <div className="w-3 h-3 bg-teal-200 rounded-full"></div>
                  <span>Female</span>
                </div>
              </div>
            </div>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={demographicsData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis
                    dataKey="time"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: '#9ca3af' }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: '#9ca3af' }}
                    domain={[0, 330]}
                    ticks={[0, 50, 100, 150, 200, 250, 330]}
                    label={{ value: 'Count', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#9ca3af', fontSize: 12 } }}
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
            <div className="text-center mt-2">
              <span className="text-sm text-gray-500">Time</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
