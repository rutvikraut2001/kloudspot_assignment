import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDwellTime(seconds: number): string {
  if (!seconds) return "--";

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${String(hours).padStart(2, "0")}h ${String(minutes).padStart(2, "0")}m`;
  }
  return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

export function formatTime(dateString: string): string {
  if (!dateString) return "--";
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export function getComparisonIcon(percentage: number) {
  if (percentage > 0) return "↑";
  if (percentage < 0) return "↓";
  return "→";
}

export function getComparisonColor(percentage: number) {
  if (percentage > 0) return "text-green-600";
  if (percentage < 0) return "text-red-600";
  return "text-gray-600";
}
