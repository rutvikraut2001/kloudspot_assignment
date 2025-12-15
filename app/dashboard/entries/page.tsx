"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Calendar, ChevronLeft, ChevronRight, Loader2, RefreshCw } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { api, getZonedDayRangeUtcMillis, EntryExitRecord } from "@/lib/api";

const PAGE_SIZE = 10;

export default function CrowdEntriesPage() {
  const { selectedSite, getSelectedSiteId, getSelectedSiteTimezone } = useAuth();

  // Date state
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const dateInputRef = useRef<HTMLInputElement>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Data state
  const [entries, setEntries] = useState<EntryExitRecord[]>([]);

  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Error state
  const [error, setError] = useState<string | null>(null);

  // Avatar collections for variety
  const maleAvatars = [
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=40&h=40&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=40&h=40&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1463453091185-61582044d556?w=40&h=40&fit=crop&crop=face",
  ];

  const femaleAvatars = [
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=40&h=40&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=40&h=40&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40&h=40&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=40&h=40&fit=crop&crop=face",
  ];

  // Get avatar based on gender with variety using name as seed
  const getDefaultAvatar = (gender?: string, name?: string): string => {
    const avatars = gender === "Female" ? femaleAvatars : maleAvatars;
    // Use name to generate consistent index for same person
    const seed = name ? name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) : 0;
    const index = seed % avatars.length;
    return avatars[index];
  };

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

  // Fetch entry-exit data
  const fetchEntries = useCallback(
    async (page: number, showRefresh = false) => {
      const siteId = getSelectedSiteId();
      if (!siteId) {
        setError("Please select a site");
        setIsLoading(false);
        return;
      }

      if (showRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError(null);

      try {
        const timezone = getSelectedSiteTimezone();
        const anchorDate = new Date(selectedDate);
        const { startUtc: fromUtc, endUtc: toUtc } = getZonedDayRangeUtcMillis(timezone, anchorDate);

        const response = await api.getEntryExit({
          siteId,
          fromUtc,
          toUtc,
          pageNumber: page,
          pageSize: PAGE_SIZE,
        });

        // Cast to flexible type for field access
        const resRaw = response as unknown as Record<string, unknown>;

        // API returns: { records, totalRecords, totalPages, pageNumber, pageSize }
        const records = (resRaw.records ?? resRaw.data ?? []) as Record<string, unknown>[];
        const total = (resRaw.totalRecords ?? resRaw.totalCount ?? resRaw.total ?? records.length) as number;
        const pages = (resRaw.totalPages ?? Math.ceil(total / PAGE_SIZE)) as number;

        // Normalize entry records - API returns:
        // { personId, personName, gender, zoneId, zoneName, severity, entryUtc, entryLocal, exitUtc, exitLocal, dwellMinutes }
        const normalizedEntries: EntryExitRecord[] = records.map((rec, index) => {
          const gender = ((rec.gender as string) || "male").toLowerCase();
          const capitalizedGender = gender === "female" ? "Female" : "Male";
          const dwellMinutes = rec.dwellMinutes as number | null;

          return {
            id: (rec.personId ?? rec.id ?? `entry-${index}`) as string,
            name: (rec.personName ?? rec.name ?? "Unknown") as string,
            sex: capitalizedGender as "Male" | "Female",
            entry: (rec.entryLocal ?? rec.entry ?? "--") as string,
            exit: (rec.exitLocal ?? rec.exit ?? null) as string | null,
            dwellTime: dwellMinutes != null ? `${Math.floor(dwellMinutes)}min` : null,
            avatar: getDefaultAvatar(capitalizedGender, (rec.personName ?? rec.name ?? "Unknown") as string),
          };
        });

        setEntries(normalizedEntries);
        setTotalPages(pages || 1);
      } catch (err) {
        console.error("Failed to fetch entries:", err);
        setError("Failed to load entry records");
        setEntries([]);
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
        setIsInitialLoad(false);
      }
    },
    [selectedDate, getSelectedSiteId, getSelectedSiteTimezone]
  );

  // Format time from "15/12/2025 08:31:10" to "8:31 AM"
  const formatTimeDisplay = (dateTimeStr: string | null): string => {
    if (!dateTimeStr) return "--";

    // Extract time part - handle format "DD/MM/YYYY HH:MM:SS"
    const timePart = dateTimeStr.split(" ")[1];
    if (!timePart) return dateTimeStr;

    const [hours, minutes] = timePart.split(":");
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;

    return `${hour12}:${minutes} ${ampm}`;
  };

  // Fetch data when site, date, or page changes
  useEffect(() => {
    if (selectedSite) {
      // Clear existing data to show loading state immediately
      setEntries([]);
      setIsInitialLoad(true);
      fetchEntries(currentPage);
    }
  }, [selectedSite, selectedDate, currentPage, fetchEntries]);

  // Reset to page 1 when date or site changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedDate, selectedSite]);

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage, "...", totalPages);
      }
    }

    return pages;
  };

  // Only show full-page spinner on very first load
  if (isInitialLoad && isLoading && entries.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-teal-500 animate-spin" />
          <p className="text-gray-500 text-sm">Loading entries...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold text-gray-800">Overview</h2>
        </div>
        <div className="flex items-center gap-2">
          {/* Refresh Button */}
          <button
            onClick={() => fetchEntries(currentPage, true)}
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

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => fetchEntries(currentPage)}
            className="mt-2 px-4 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm"
          >
            Retry
          </button>
        </div>
      )}

      {/* Table */}
      <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden flex flex-col relative">
        {/* Loading overlay for pagination */}
        {isLoading && !isInitialLoad && (
          <div className="absolute inset-0 bg-white/60 z-10 flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-teal-500 animate-spin" />
          </div>
        )}
        <div className="flex-1 overflow-auto">
          <table className="w-full">
            <thead className="sticky top-0 bg-gray-50">
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">
                  Name
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">
                  Sex
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">
                  Entry
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">
                  Exit
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">
                  Dwell Time
                </th>
              </tr>
            </thead>
            <tbody>
              {entries.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-500">
                    No entries found for this date
                  </td>
                </tr>
              ) : (
                entries.map((entry) => (
                  <tr
                    key={entry.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-3.5 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full overflow-hidden bg-gray-200 shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={entry.avatar}
                            alt={entry.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = getDefaultAvatar(entry.sex, entry.name);
                            }}
                          />
                        </div>
                        <span className="text-sm text-gray-700">{entry.name}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-6 text-sm text-gray-600">
                      {entry.sex}
                    </td>
                    <td className="py-3.5 px-6 text-sm text-gray-600">
                      {formatTimeDisplay(entry.entry)}
                    </td>
                    <td className="py-3.5 px-6 text-sm text-gray-600">
                      {formatTimeDisplay(entry.exit)}
                    </td>
                    <td className="py-3.5 px-6 text-sm text-gray-600">
                      {entry.dwellTime || "--"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center py-4 gap-1 border-t border-gray-100">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={currentPage === 1}
            >
              <ChevronLeft size={18} />
            </button>

            {getPageNumbers().map((page, index) =>
              page === "..." ? (
                <div
                  key={`ellipsis-${index}`}
                  className="w-8 h-8 flex items-center justify-center text-sm text-gray-400"
                >
                  ...
                </div>
              ) : (
                <button
                  key={page}
                  onClick={() => handlePageChange(page as number)}
                  className={`w-8 h-8 rounded text-sm transition-colors ${
                    currentPage === page
                      ? "text-teal-600 font-semibold bg-teal-50 border border-teal-200"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              )
            )}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={currentPage === totalPages}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
