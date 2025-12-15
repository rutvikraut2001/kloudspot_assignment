'use client';

import { MapPin, Bell, ChevronDown } from 'lucide-react';
import { useState } from 'react';

const locations = [
  'Avenue Mall',
  'City Center',
  'Downtown Plaza',
  'Metro Station',
];

export function Header() {
  const [selectedLocation, setSelectedLocation] = useState('Avenue Mall');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      {/* Left Side */}
      <div className="flex items-center gap-6">
        <h1 className="text-base font-semibold text-gray-800">Crowd Solutions</h1>
        <div className="h-6 w-px bg-gray-300"></div>

        {/* Location Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md bg-white"
          >
            <MapPin size={16} className="text-gray-500" />
            <span className="text-sm">{selectedLocation}</span>
            <ChevronDown size={16} className={`text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {isDropdownOpen && (
            <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg z-50">
              {locations.map((location) => (
                <button
                  key={location}
                  onClick={() => {
                    setSelectedLocation(location);
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                    selectedLocation === location ? 'bg-gray-100 text-gray-800' : 'text-gray-600'
                  }`}
                >
                  {location}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        {/* Language Badge */}
        <div className="flex items-center gap-1">
          <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center text-white text-xs font-semibold">
            En
          </div>
          <span className="text-gray-400 text-sm">ε</span>
        </div>

        {/* Bell Icon */}
        <button className="text-gray-400 hover:text-gray-600 relative">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* User Avatar */}
        <div className="w-9 h-9 rounded-full bg-gray-200 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
            alt="User"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </header>
  );
}
