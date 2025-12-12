"use client";

import { useEffect, useState } from "react";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { OccupancyChart } from "@/components/dashboard/OccupancyChart";
import {
  DemographicsPie,
  DemographicsTimeseries,
} from "@/components/dashboard/DemographicsChart";
import { apiService } from "@/services/api";
import { useSocket } from "@/hooks/useSocket";
import { formatDwellTime } from "@/lib/utils";

export default function DashboardPage() {
  const { liveOccupancy } = useSocket();

  // State for metrics
  const [occupancyData, setOccupancyData] = useState({
    current: 0,
    percentageChange: 0,
  });
  const [footfallData, setFootfallData] = useState({
    count: 0,
    percentageChange: 0,
  });
  const [dwellTimeData, setDwellTimeData] = useState({
    averageSeconds: 0,
    percentageChange: 0,
  });

  // State for charts
  const [occupancyTimeseries, setOccupancyTimeseries] = useState<
    Array<{ time: string; count: number }>
  >([]);
  const [demographicsData, setDemographicsData] = useState({
    male: 0,
    female: 0,
  });
  const [demographicsTimeseries, setDemographicsTimeseries] = useState<
    Array<{ time: string; male: number; female: number }>
  >([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch data in parallel
        const [dwellTime, footfall, occupancy, demographics] =
          await Promise.all([
            apiService.getDwellTime().catch(() => ({
              data: { averageSeconds: 510, percentageChange: 6 },
            })),
            apiService.getFootfall().catch(() => ({
              data: { count: 2436, percentageChange: -10 },
            })),
            apiService.getOccupancy().catch(() => ({
              data: {
                current: 734,
                percentageChange: 10,
                timeseries: generateMockOccupancyData(),
              },
            })),
            apiService.getDemographics().catch(() => ({
              data: {
                male: 55,
                female: 45,
                timeseries: generateMockDemographicsData(),
              },
            })),
          ]);

        // Update states
        setDwellTimeData({
          averageSeconds: dwellTime.data.averageSeconds || 0,
          percentageChange: dwellTime.data.percentageChange || 0,
        });

        setFootfallData({
          count: footfall.data.count || 0,
          percentageChange: footfall.data.percentageChange || 0,
        });

        setOccupancyData({
          current: occupancy.data.current || 0,
          percentageChange: occupancy.data.percentageChange || 0,
        });

        setOccupancyTimeseries(
          occupancy.data.timeseries || generateMockOccupancyData()
        );

        setDemographicsData({
          male: demographics.data.male || 0,
          female: demographics.data.female || 0,
        });

        setDemographicsTimeseries(
          demographics.data.timeseries || generateMockDemographicsData()
        );
      } catch (err: any) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data");
        // Set mock data on error
        setOccupancyData({ current: 734, percentageChange: 10 });
        setFootfallData({ count: 2436, percentageChange: -10 });
        setDwellTimeData({ averageSeconds: 510, percentageChange: 6 });
        setOccupancyTimeseries(generateMockOccupancyData());
        setDemographicsData({ male: 55, female: 45 });
        setDemographicsTimeseries(generateMockDemographicsData());
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Update live occupancy from socket
  useEffect(() => {
    if (liveOccupancy) {
      setOccupancyData((prev) => ({
        ...prev,
        current: liveOccupancy.count,
      }));
    }
  }, [liveOccupancy]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5eb5b5] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Overview</h2>
        <p className="text-gray-600 mt-1">Real-time crowd analytics and insights</p>
      </div>

      {error && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg">
          {error} - Showing demo data
        </div>
      )}

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          title="Live Occupancy"
          value={occupancyData.current.toLocaleString()}
          change={occupancyData.percentageChange}
          changeLabel={
            occupancyData.percentageChange > 0
              ? "More than yesterday"
              : "Less than yesterday"
          }
        />
        <MetricCard
          title="Today's Footfall"
          value={footfallData.count.toLocaleString()}
          change={footfallData.percentageChange}
          changeLabel={
            footfallData.percentageChange > 0
              ? "More than yesterday"
              : "Less than yesterday"
          }
        />
        <MetricCard
          title="Avg Dwell Time"
          value={formatDwellTime(dwellTimeData.averageSeconds)}
          change={dwellTimeData.percentageChange}
          changeLabel="More than yesterday"
        />
      </div>

      {/* Occupancy Chart */}
      <OccupancyChart data={occupancyTimeseries} />

      {/* Demographics Section */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Demographics
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DemographicsPie
            male={demographicsData.male}
            female={demographicsData.female}
          />
          <DemographicsTimeseries data={demographicsTimeseries} />
        </div>
      </div>
    </div>
  );
}

// Helper functions to generate mock data
function generateMockOccupancyData() {
  const hours = [
    "8:00",
    "9:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
  ];
  return hours.map((time) => ({
    time,
    count: Math.floor(Math.random() * 50) + 150,
  }));
}

function generateMockDemographicsData() {
  const hours = [
    "8:00",
    "9:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
  ];
  return hours.map((time) => ({
    time,
    male: Math.floor(Math.random() * 50) + 150,
    female: Math.floor(Math.random() * 40) + 120,
  }));
}
