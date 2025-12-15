"use client";

import { MapPin, Bell, ChevronDown, Loader2, Menu } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { getSiteId, getSiteName } from "@/lib/api";
import { socketService, AlertEvent } from "@/lib/socket";
import { AlertsPanel } from "@/components/alerts/AlertsPanel";

const languages = [
  { code: "en", name: "English", flag: "En" },
  { code: "es", name: "Spanish", flag: "Es" },
  { code: "fr", name: "French", flag: "Fr" },
  { code: "de", name: "German", flag: "De" },
];

interface HeaderProps {
  onMobileMenuClick?: () => void;
}

export function Header({ onMobileMenuClick }: HeaderProps) {
  const { sites, selectedSite, selectSite, isLoadingSites, getSelectedSiteId } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [isAlertsPanelOpen, setIsAlertsPanelOpen] = useState(false);
  const [alertCount, setAlertCount] = useState(0);
  const [selectedLang, setSelectedLang] = useState(languages[0]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const langDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
        setIsLangDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Listen for alerts and increment counter
  useEffect(() => {
    const siteId = getSelectedSiteId();

    const unsubscribe = socketService.onAlert((data: AlertEvent) => {
      // Only count alerts for current site
      if (data.siteId === siteId || !siteId) {
        if (!isAlertsPanelOpen) {
          setAlertCount((prev) => prev + 1);
        }
      }
    });

    return () => {
      unsubscribe();
    };
  }, [getSelectedSiteId, isAlertsPanelOpen]);

  // Clear alert count when panel opens
  const handleOpenAlertsPanel = () => {
    setIsAlertsPanelOpen(true);
    setAlertCount(0);
  };

  const selectedSiteName = selectedSite ? getSiteName(selectedSite) : "Select Site";

  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-3 sm:px-6">
      {/* Left Side */}
      <div className="flex items-center gap-2 sm:gap-6">
        {/* Mobile Menu Button */}
        <button
          onClick={onMobileMenuClick}
          className="lg:hidden p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md"
        >
          <Menu size={20} />
        </button>

        <h1 className="text-sm sm:text-base font-semibold text-gray-800 hidden sm:block">Crowd Solutions</h1>
        <div className="h-6 w-px bg-gray-300 hidden sm:block"></div>

        {/* Site Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            disabled={isLoadingSites}
            className="flex items-center gap-2 px-2 sm:px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md bg-white disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px] sm:min-w-[180px]"
          >
            {isLoadingSites ? (
              <>
                <Loader2 size={16} className="text-gray-500 animate-spin" />
                <span className="text-sm">Loading sites...</span>
              </>
            ) : (
              <>
                <MapPin size={16} className="text-gray-500" />
                <span className="text-sm truncate">{selectedSiteName}</span>
                <ChevronDown
                  size={16}
                  className={`text-gray-400 transition-transform ml-auto ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </>
            )}
          </button>

          {isDropdownOpen && sites.length > 0 && (
            <div className="absolute top-full left-0 mt-1 w-full min-w-[220px] bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
              {sites.map((site) => {
                const siteId = getSiteId(site);
                const siteName = getSiteName(site);
                const isSelected = selectedSite && getSiteId(selectedSite) === siteId;

                return (
                  <button
                    key={siteId}
                    onClick={() => {
                      selectSite(site);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 ${
                      isSelected ? "bg-gray-100 text-gray-800 font-medium" : "text-gray-600"
                    }`}
                  >
                    {siteName}
                  </button>
                );
              })}
            </div>
          )}

          {isDropdownOpen && sites.length === 0 && !isLoadingSites && (
            <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg z-50">
              <p className="px-4 py-3 text-sm text-gray-500">No sites available</p>
            </div>
          )}
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Language Selector - hidden on small mobile */}
        <div className="relative hidden sm:block" ref={langDropdownRef}>
          <button
            onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
            className="flex items-center gap-2 px-2 sm:px-3 py-1.5 border border-gray-300 rounded-md bg-white hover:bg-gray-50 transition-colors"
          >
            <div className="w-6 h-6 rounded-full bg-teal-500 flex items-center justify-center text-white text-[10px] font-semibold">
              {selectedLang.flag}
            </div>
            <span className="text-sm text-gray-700 hidden md:inline">{selectedLang.name}</span>
            <ChevronDown
              size={14}
              className={`text-gray-400 transition-transform ${
                isLangDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isLangDropdownOpen && (
            <div className="absolute top-full right-0 mt-1 w-36 bg-white border border-gray-200 rounded-md shadow-lg z-50">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setSelectedLang(lang);
                    setIsLangDropdownOpen(false);
                  }}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 ${
                    selectedLang.code === lang.code
                      ? "bg-gray-100 text-gray-800 font-medium"
                      : "text-gray-600"
                  }`}
                >
                  <div className="w-6 h-6 rounded-full bg-teal-500 flex items-center justify-center text-white text-[10px] font-semibold">
                    {lang.flag}
                  </div>
                  <span>{lang.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Bell Icon */}
        <button
          onClick={handleOpenAlertsPanel}
          className="text-gray-400 hover:text-gray-600 relative"
        >
          <Bell size={20} />
          {alertCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 rounded-full flex items-center justify-center text-[10px] text-white font-semibold px-1">
              {alertCount > 99 ? "99+" : alertCount}
            </span>
          )}
          {alertCount === 0 && (
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          )}
        </button>

        {/* User Avatar */}
        <div className="w-9 h-9 rounded-full bg-gray-200 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
            alt="User"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Alerts Panel */}
      <AlertsPanel
        isOpen={isAlertsPanelOpen}
        onClose={() => setIsAlertsPanelOpen(false)}
        siteId={getSelectedSiteId()}
      />
    </header>
  );
}
