"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Calendar, Loader2, RefreshCw } from "lucide-react";
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
import { useAuth } from "@/context/AuthContext";
import {
  api,
  getZonedDayRangeUtcMillis,
  formatDwellTime,
  OccupancyData,
  FootfallData,
  DwellData,
  DemographicsData,
} from "@/lib/api";
import { socketService, LiveOccupancyEvent } from "@/lib/socket";

interface ChartDataPoint {
  time: string;
  occupancy?: number;
  male?: number;
  female?: number;
}

const CustomLiveLabel = ({ viewBox }: { viewBox?: { x?: number } }) => {
  const x = viewBox?.x ?? 0;
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
  const { selectedSite, getSelectedSiteId, getSelectedSiteTimezone } = useAuth();

  // Date state
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const dateInputRef = useRef<HTMLInputElement>(null);

  // Individual loading states for progressive loading
  const [isLoadingOccupancy, setIsLoadingOccupancy] = useState(true);
  const [isLoadingFootfall, setIsLoadingFootfall] = useState(true);
  const [isLoadingDwell, setIsLoadingDwell] = useState(true);
  const [isLoadingDemographics, setIsLoadingDemographics] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Data states
  const [occupancyData, setOccupancyData] = useState<OccupancyData | null>(null);
  const [footfallData, setFootfallData] = useState<FootfallData | null>(null);
  const [dwellData, setDwellData] = useState<DwellData | null>(null);
  const [demographicsData, setDemographicsData] = useState<DemographicsData | null>(null);

  // Chart data
  const [occupancyChartData, setOccupancyChartData] = useState<ChartDataPoint[]>([]);
  const [demographicsChartData, setDemographicsChartData] = useState<ChartDataPoint[]>([]);

  // Error state
  const [error, setError] = useState<string | null>(null);

  // Check if initial load is complete
  const isInitialLoading = isLoadingOccupancy && isLoadingFootfall && isLoadingDwell && isLoadingDemographics;

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

  // Generate default data for charts when API returns empty
  const generateDefaultOccupancyData = (): ChartDataPoint[] => {
    const hours = ["8:00", "9:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"];
    return hours.map((time) => ({ time, occupancy: 0 }));
  };

  const generateDefaultDemographicsData = (): ChartDataPoint[] => {
    const hours = ["8:00", "9:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"];
    return hours.map((time) => ({ time, male: 0, female: 0 }));
  };

  // Fetch all analytics data with progressive loading
  const fetchAnalyticsData = useCallback(async (showRefresh = false) => {
    const siteId = getSelectedSiteId();
    if (!siteId) {
      setError("Please select a site");
      setIsLoadingOccupancy(false);
      setIsLoadingFootfall(false);
      setIsLoadingDwell(false);
      setIsLoadingDemographics(false);
      return;
    }

    if (showRefresh) {
      setIsRefreshing(true);
    } else {
      // Reset loading states for fresh load
      setIsLoadingOccupancy(true);
      setIsLoadingFootfall(true);
      setIsLoadingDwell(true);
      setIsLoadingDemographics(true);
    }
    setError(null);

    const timezone = getSelectedSiteTimezone();
    const anchorDate = new Date(selectedDate);
    const { startUtc: fromUtc, endUtc: toUtc } = getZonedDayRangeUtcMillis(timezone, anchorDate);
    const params = { siteId, fromUtc, toUtc };

    // Fetch each metric independently - UI updates as each completes
    // Occupancy (also provides chart data)
    api.getOccupancy(params)
      .then((occupancy) => {
        const occRaw = occupancy as unknown as Record<string, unknown>;
        const occBuckets = (occRaw?.buckets ?? []) as Array<{ utc: number; local: string; avg: number }>;
        const latestOccupancy = occBuckets.length > 0
          ? occBuckets.filter(b => b.avg > 0).slice(-1)[0]?.avg ?? 0
          : 0;

        const normalizedOccupancy: OccupancyData = {
          liveOccupancy: Math.round(latestOccupancy),
          percentageChange: 0,
          timeseries: occBuckets.map(b => ({
            time: b.local?.split(" ")[1]?.slice(0, 5) ?? "",
            timestamp: b.utc,
            occupancy: Math.round(b.avg),
            count: Math.round(b.avg),
          })),
        };

        setOccupancyData(normalizedOccupancy);

        // Process chart data
        if (normalizedOccupancy.timeseries && normalizedOccupancy.timeseries.length > 0) {
          setOccupancyChartData(normalizedOccupancy.timeseries.map((item) => ({
            time: item.time || "",
            occupancy: item.occupancy ?? item.count ?? 0,
          })));
        } else {
          setOccupancyChartData(generateDefaultOccupancyData());
        }
      })
      .catch(() => {
        setOccupancyData({ liveOccupancy: 0, percentageChange: 0 });
        setOccupancyChartData(generateDefaultOccupancyData());
      })
      .finally(() => setIsLoadingOccupancy(false));

    // Footfall
    api.getFootfall(params)
      .then((footfall) => {
        const footRaw = footfall as unknown as Record<string, unknown>;
        setFootfallData({
          totalFootfall: (footRaw.footfall ?? footRaw.totalFootfall ?? 0) as number,
          percentageChange: 0,
        });
      })
      .catch(() => setFootfallData({ totalFootfall: 0, percentageChange: 0 }))
      .finally(() => setIsLoadingFootfall(false));

    // Dwell time
    api.getDwell(params)
      .then((dwell) => {
        const dwellRaw = dwell as unknown as Record<string, unknown>;
        const avgDwellMinutes = (dwellRaw?.avgDwellMinutes ?? 0) as number;
        setDwellData({
          averageDwellTime: avgDwellMinutes * 60 * 1000,
          averageDwellTimeFormatted: `${Math.floor(avgDwellMinutes)}min ${Math.round((avgDwellMinutes % 1) * 60)}sec`,
          percentageChange: 0,
        });
      })
      .catch(() => setDwellData({ averageDwellTime: 0, averageDwellTimeFormatted: "0min 0sec", percentageChange: 0 }))
      .finally(() => setIsLoadingDwell(false));

    // Demographics (also provides chart data)
    api.getDemographics(params)
      .then((demographics) => {
        const demoRaw = demographics as unknown as Record<string, unknown>;
        const demoBuckets = (demoRaw?.buckets ?? []) as Array<{ utc: number; local: string; male: number; female: number }>;
        const totalMale = demoBuckets.reduce((sum, b) => sum + (b.male ?? 0), 0);
        const totalFemale = demoBuckets.reduce((sum, b) => sum + (b.female ?? 0), 0);
        const totalGender = totalMale + totalFemale;

        const normalizedDemographics: DemographicsData = {
          male: Math.round(totalMale),
          female: Math.round(totalFemale),
          malePercentage: totalGender > 0 ? Math.round((totalMale / totalGender) * 100) : 50,
          femalePercentage: totalGender > 0 ? Math.round((totalFemale / totalGender) * 100) : 50,
          timeseries: demoBuckets.map(b => ({
            time: b.local?.split(" ")[1]?.slice(0, 5) ?? "",
            timestamp: b.utc,
            male: Math.round(b.male ?? 0),
            female: Math.round(b.female ?? 0),
          })),
        };

        setDemographicsData(normalizedDemographics);

        // Process chart data
        if (normalizedDemographics.timeseries && normalizedDemographics.timeseries.length > 0) {
          setDemographicsChartData(normalizedDemographics.timeseries.map((item) => ({
            time: item.time || "",
            male: item.male ?? 0,
            female: item.female ?? 0,
          })));
        } else {
          setDemographicsChartData(generateDefaultDemographicsData());
        }
      })
      .catch(() => {
        setDemographicsData({ male: 0, female: 0, malePercentage: 50, femalePercentage: 50 });
        setDemographicsChartData(generateDefaultDemographicsData());
      })
      .finally(() => {
        setIsLoadingDemographics(false);
        setIsRefreshing(false);
      });
  }, [selectedDate, getSelectedSiteId, getSelectedSiteTimezone]);

  // Reset data and fetch when site changes
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (selectedSite) {
      // Clear existing data to show loading state immediately
      setOccupancyData(null);
      setFootfallData(null);
      setDwellData(null);
      setDemographicsData(null);
      setOccupancyChartData([]);
      setDemographicsChartData([]);
      fetchAnalyticsData();
    }
  }, [selectedSite, selectedDate, fetchAnalyticsData]);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Subscribe to live occupancy updates via Socket.IO
  useEffect(() => {
    const siteId = getSelectedSiteId();
    if (!siteId) return;

    const unsubscribe = socketService.onLiveOccupancy((data: LiveOccupancyEvent) => {
      // Only update if the event is for the current site
      if (data.siteId === siteId) {
        setOccupancyData((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            liveOccupancy: data.occupancy ?? data.count ?? prev.liveOccupancy,
          };
        });
      }
    });

    return () => {
      unsubscribe();
    };
  }, [getSelectedSiteId]);

  // Calculate gender data for pie chart
  const genderData = [
    {
      name: "Males",
      value: demographicsData?.malePercentage ?? demographicsData?.male ?? 55,
      color: "#0d9488",
    },
    {
      name: "Females",
      value: demographicsData?.femalePercentage ?? demographicsData?.female ?? 45,
      color: "#99f6e4",
    },
  ];

  // Get display values
  const liveOccupancy = occupancyData?.liveOccupancy ?? 0;
  const occupancyChange = occupancyData?.percentageChange ?? 0;
  const totalFootfall = footfallData?.totalFootfall ?? 0;
  const footfallChange = footfallData?.percentageChange ?? 0;
  const avgDwellTime = dwellData?.averageDwellTimeFormatted ??
    (dwellData?.averageDwellTime ? formatDwellTime(dwellData.averageDwellTime) : "00min 00sec");
  const dwellChange = dwellData?.percentageChange ?? 0;

  // Get current time for LIVE reference line
  const currentHour = new Date().getHours();
  const liveTime = `${currentHour}:00`;

  if (isInitialLoading && !occupancyData && !footfallData && !dwellData && !demographicsData) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-teal-500 animate-spin" />
          <p className="text-gray-500 text-sm">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error && !occupancyData) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <p className="text-red-500">{error}</p>
          <button
            onClick={() => fetchAnalyticsData()}
            className="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between flex-shrink-0">
        <h2 className="text-lg font-semibold text-gray-800">Overview</h2>
        <div className="flex items-center gap-2">
          {/* Refresh Button */}
          <button
            onClick={() => fetchAnalyticsData(true)}
            disabled={isRefreshing}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md disabled:opacity-50"
            title="Refresh data"
          >
            <RefreshCw size={18} className={isRefreshing ? "animate-spin" : ""} />
          </button>

          {/* Date Picker */}
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
      </div>

      {/* Occupancy Section */}
      <div className="flex-shrink-0">
        <h3 className="text-base font-semibold text-gray-800 mb-2">Occupancy</h3>
        <div className="grid grid-cols-3 gap-4">
          {/* Live Occupancy */}
          <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
            <p className="text-sm font-medium text-gray-500 mb-1">Live Occupancy</p>
            <p className="text-2xl font-semibold text-gray-800">{liveOccupancy.toLocaleString()}</p>
            <div className="flex flex-col mt-1">
              <svg
                className={`w-4 h-4 ${occupancyChange >= 0 ? "text-teal-500" : "text-red-400"}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={occupancyChange >= 0
                    ? "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    : "M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6"
                  }
                />
              </svg>
              <span className="text-xs text-gray-600">
                {Math.abs(occupancyChange)}% {occupancyChange >= 0 ? "More" : "Less"} than yesterday
              </span>
            </div>
          </div>

          {/* Today's Footfall */}
          <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
            <p className="text-sm font-medium text-gray-500 mb-1">Today&apos;s Footfall</p>
            <p className="text-2xl font-semibold text-gray-800">{totalFootfall.toLocaleString()}</p>
            <div className="flex flex-col mt-1">
              <svg
                className={`w-4 h-4 ${footfallChange >= 0 ? "text-teal-500" : "text-red-400"}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={footfallChange >= 0
                    ? "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    : "M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6"
                  }
                />
              </svg>
              <span className="text-xs text-gray-600">
                {Math.abs(footfallChange)}% {footfallChange >= 0 ? "More" : "Less"} than yesterday
              </span>
            </div>
          </div>

          {/* Avg Dwell Time */}
          <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
            <p className="text-sm font-medium text-gray-500 mb-1">Avg Dwell Time</p>
            <p className="text-2xl font-semibold text-gray-800">{avgDwellTime}</p>
            <div className="flex flex-col mt-1">
              <svg
                className={`w-4 h-4 ${dwellChange >= 0 ? "text-teal-500" : "text-red-400"}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={dwellChange >= 0
                    ? "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    : "M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6"
                  }
                />
              </svg>
              <span className="text-xs text-gray-600">
                {Math.abs(dwellChange)}% {dwellChange >= 0 ? "More" : "Less"} than yesterday
              </span>
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
            <AreaChart data={occupancyChartData} margin={{ top: 25, right: 20, left: 0, bottom: 35 }}>
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
                domain={[0, "auto"]}
                width={55}
                label={{
                  value: "Count",
                  position: "insideLeft",
                  angle: -90,
                  offset: 10,
                  style: { textAnchor: "middle", fill: "#374151", fontSize: 12, fontWeight: 600 },
                }}
              />
              <Tooltip />
              <ReferenceLine
                x={liveTime}
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
                <span className="text-xs text-gray-600">{genderData[0].value}% Males</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-teal-200 rounded-full"></div>
                <span className="text-xs text-gray-600">{genderData[1].value}% Females</span>
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
                <LineChart data={demographicsChartData} margin={{ top: 10, right: 20, left: 0, bottom: 35 }}>
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
                    domain={[0, "auto"]}
                    width={55}
                    label={{
                      value: "Count",
                      position: "insideLeft",
                      angle: -90,
                      offset: 10,
                      style: { textAnchor: "middle", fill: "#374151", fontSize: 12, fontWeight: 600 },
                    }}
                  />
                  <Tooltip />
                  <Line type="monotone" dataKey="male" stroke="#0d9488" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="female" stroke="#99f6e4" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
