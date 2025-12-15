"use client";

import { useEffect, useState } from "react";
import { X, MapPin } from "lucide-react";
import { socketService, AlertEvent } from "@/lib/socket";

interface AlertsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  siteId: string;
}

interface AlertItem extends AlertEvent {
  id: string;
  personName: string;
}

export function AlertsPanel({ isOpen, onClose, siteId }: AlertsPanelProps) {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);

  useEffect(() => {
    // Subscribe to alert events
    const unsubscribe = socketService.onAlert((data: AlertEvent) => {
      // Only show alerts for the current site
      if (data.siteId === siteId || !siteId) {
        const newAlert: AlertItem = {
          ...data,
          id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          personName: data.message || "Unknown Person",
        };

        setAlerts((prev) => [newAlert, ...prev].slice(0, 50)); // Keep last 50 alerts
      }
    });

    return () => {
      unsubscribe();
    };
  }, [siteId]);

  // Format timestamp to display format
  const formatDateTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const dateStr = date.toLocaleDateString("en-US", {
      month: "long",
      day: "2-digit",
      year: "numeric",
    });
    const timeStr = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    return { dateStr, timeStr };
  };

  // Get severity badge styles
  const getSeverityStyles = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case "high":
        return "bg-red-500 text-white";
      case "medium":
        return "bg-amber-400 text-gray-800";
      case "low":
        return "bg-green-500 text-white";
      default:
        return "bg-gray-400 text-white";
    }
  };

  // Get action text
  const getActionText = (action: string) => {
    return action === "entry" ? "Entered" : "Exited";
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 z-40"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed top-0 right-0 h-full w-[320px] bg-white shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Alerts</h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
          >
            <X size={20} />
          </button>
        </div>

        {/* Alerts List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {alerts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <p className="text-sm">No alerts yet</p>
              <p className="text-xs mt-1">Alerts will appear here in real-time</p>
            </div>
          ) : (
            alerts.map((alert) => {
              const { dateStr, timeStr } = formatDateTime(alert.timestamp);
              return (
                <div
                  key={alert.id}
                  className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
                >
                  {/* Date & Time */}
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                    <span>{dateStr}</span>
                    <span className="font-semibold text-gray-700">{timeStr}</span>
                  </div>

                  {/* Person & Action */}
                  <p className="font-semibold text-gray-800 mb-2">
                    {alert.personName} {getActionText(alert.action)}
                  </p>

                  {/* Zone & Severity */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-sm text-gray-500">
                      <MapPin size={14} />
                      <span>{alert.zone || "Unknown Zone"}</span>
                    </div>
                    <span
                      className={`px-3 py-1 rounded text-xs font-medium capitalize ${getSeverityStyles(
                        alert.severity
                      )}`}
                    >
                      {alert.severity || "Low"}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}
