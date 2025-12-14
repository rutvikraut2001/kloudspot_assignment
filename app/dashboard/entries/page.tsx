'use client';

import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface CrowdEntry {
  id: number;
  name: string;
  sex: 'Male' | 'Female';
  entry: string;
  exit: string | null;
  dwellTime: string | null;
  avatar: string;
}

const crowdData: CrowdEntry[] = [
  { id: 1, name: 'Alice Johnson', sex: 'Female', entry: '11:05 AM', exit: null, dwellTime: null, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop&crop=face' },
  { id: 2, name: 'Brian Smith', sex: 'Male', entry: '11:03 AM', exit: null, dwellTime: null, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face' },
  { id: 3, name: 'Catherine Lee', sex: 'Female', entry: '11:00 AM', exit: null, dwellTime: null, avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face' },
  { id: 4, name: 'David Brown', sex: 'Male', entry: '10:50 AM', exit: '11:10 AM', dwellTime: '00:20', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face' },
  { id: 5, name: 'Eva White', sex: 'Female', entry: '11:20 AM', exit: '11:30 AM', dwellTime: '00:10', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40&h=40&fit=crop&crop=face' },
  { id: 6, name: 'Frank Green', sex: 'Male', entry: '11:50 AM', exit: '12:10 AM', dwellTime: '00:20', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face' },
  { id: 7, name: 'Grace Taylor', sex: 'Female', entry: '10:50 AM', exit: '11:10 AM', dwellTime: '00:20', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=40&h=40&fit=crop&crop=face' },
  { id: 8, name: 'Henry Wilson', sex: 'Male', entry: '10:50 AM', exit: '11:10 AM', dwellTime: '00:20', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=40&h=40&fit=crop&crop=face' },
  { id: 9, name: 'Isabella Martinez', sex: 'Female', entry: '10:50 AM', exit: '11:10 AM', dwellTime: '00:20', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=40&h=40&fit=crop&crop=face' },
  { id: 10, name: 'Jack Thompson', sex: 'Male', entry: '10:50 AM', exit: '11:10 AM', dwellTime: '00:20', avatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=40&h=40&fit=crop&crop=face' },
  { id: 11, name: 'Katherine Anderson', sex: 'Female', entry: '10:50 AM', exit: '11:10 AM', dwellTime: '00:20', avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=40&h=40&fit=crop&crop=face' },
];

export default function CrowdEntriesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 5;

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

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Name</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Sex</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Entry</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Exit</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Dwell Time</th>
            </tr>
          </thead>
          <tbody>
            {crowdData.map((entry) => (
              <tr key={entry.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3.5 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                      <img
                        src={entry.avatar}
                        alt={entry.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-sm text-gray-700">{entry.name}</span>
                  </div>
                </td>
                <td className="py-3.5 px-6 text-sm text-gray-600">{entry.sex}</td>
                <td className="py-3.5 px-6 text-sm text-gray-600">{entry.entry}</td>
                <td className="py-3.5 px-6 text-sm text-gray-600">{entry.exit || '--'}</td>
                <td className="py-3.5 px-6 text-sm text-gray-600">{entry.dwellTime || '--'}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex items-center justify-center py-4 gap-1 border-t border-gray-100">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            className="p-2 text-gray-400 hover:text-gray-600"
            disabled={currentPage === 1}
          >
            <ChevronLeft size={18} />
          </button>

          {[1, 2, 3].map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-8 h-8 rounded text-sm ${
                currentPage === page
                  ? 'text-teal-600 font-semibold border-b-2 border-teal-500'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {page}
            </button>
          ))}

          <div className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded text-sm text-gray-400">
            ...
          </div>

          <button
            onClick={() => setCurrentPage(5)}
            className={`w-8 h-8 rounded text-sm ${
              currentPage === 5
                ? 'text-teal-600 font-semibold border-b-2 border-teal-500'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            5
          </button>

          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            className="p-2 text-gray-400 hover:text-gray-600"
            disabled={currentPage === totalPages}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
