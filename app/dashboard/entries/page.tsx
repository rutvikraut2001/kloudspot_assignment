"use client";

import { useEffect, useState } from "react";
import { apiService } from "@/services/api";
import { EntryExitRecord } from "@/types";
import { formatTime, formatDwellTime } from "@/lib/utils";

export default function EntriesPage() {
  const [entries, setEntries] = useState<EntryExitRecord[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const PAGE_SIZE = 10;

  useEffect(() => {
    fetchEntries(currentPage);
  }, [currentPage]);

  const fetchEntries = async (page: number) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await apiService.getEntryExit(page, PAGE_SIZE);

      if (response.data && Array.isArray(response.data)) {
        setEntries(response.data);
        setTotalPages(response.pagination?.totalPages || 1);
        setTotalRecords(response.pagination?.total || response.data.length);
      } else {
        // Fallback to mock data
        const mockData = generateMockEntries(page, PAGE_SIZE);
        setEntries(mockData.data);
        setTotalPages(mockData.totalPages);
        setTotalRecords(mockData.total);
      }
    } catch (err: any) {
      console.error("Error fetching entries:", err);
      setError("Failed to load entries");
      // Use mock data on error
      const mockData = generateMockEntries(page, PAGE_SIZE);
      setEntries(mockData.data);
      setTotalPages(mockData.totalPages);
      setTotalRecords(mockData.total);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
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

  if (isLoading && entries.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5eb5b5] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading entries...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Overview</h2>
        <p className="text-gray-600 mt-1">
          Track individual entry and exit records
        </p>
      </div>

      {error && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg">
          {error} - Showing demo data
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Sex
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Entry
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Exit
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Dwell Time
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {entries.map((entry, index) => (
                <tr
                  key={entry.id || index}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-600">
                          {entry.name?.charAt(0) || "?"}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {entry.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {entry.gender}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {formatTime(entry.entryTime)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {entry.exitTime ? formatTime(entry.exitTime) : "--"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {entry.dwellTimeSeconds > 0
                      ? formatDwellTime(entry.dwellTimeSeconds)
                      : "--"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-center space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          {renderPageNumbers().map((page, index) => {
            if (page === "...") {
              return (
                <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-500">
                  ...
                </span>
              );
            }

            return (
              <button
                key={page}
                onClick={() => handlePageChange(page as number)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentPage === page
                    ? "bg-[#5eb5b5] text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {page}
              </button>
            );
          })}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="text-sm text-gray-600 text-center">
        Showing {(currentPage - 1) * PAGE_SIZE + 1} to{" "}
        {Math.min(currentPage * PAGE_SIZE, totalRecords)} of {totalRecords}{" "}
        entries
      </div>
    </div>
  );
}

// Generate mock data for testing
function generateMockEntries(page: number, pageSize: number) {
  const names = [
    "Alice Johnson",
    "Brian Smith",
    "Catherine Lee",
    "David Brown",
    "Eva White",
    "Frank Green",
    "Grace Taylor",
    "Henry Wilson",
    "Isabella Martinez",
    "Jack Thompson",
  ];

  const total = 45;
  const totalPages = Math.ceil(total / pageSize);
  const start = (page - 1) * pageSize;

  const data: EntryExitRecord[] = [];
  for (let i = 0; i < pageSize && start + i < total; i++) {
    const hasExited = Math.random() > 0.3;
    const dwellSeconds = hasExited ? Math.floor(Math.random() * 1200) + 600 : 0;

    data.push({
      id: `${start + i + 1}`,
      name: names[i % names.length],
      gender: i % 2 === 0 ? "Female" : "Male",
      entryTime: new Date(
        Date.now() - Math.random() * 3600000
      ).toISOString(),
      exitTime: hasExited
        ? new Date(Date.now() - Math.random() * 1800000).toISOString()
        : null,
      dwellTimeSeconds: dwellSeconds,
    });
  }

  return {
    data,
    total,
    totalPages,
  };
}
