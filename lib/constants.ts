// API Configuration
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://hiring-dev.internal.kloudspot.com";
export const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000";

// Pagination
export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 100;

// Chart Colors
export const CHART_COLORS = {
  tealPrimary: "#5eb5b5",
  tealLight: "#7ec9c9",
  tealDark: "#4a9090",
  male: "#5eb5b5",
  female: "#7ec9c9",
  occupancy: "#5eb5b5",
} as const;

// Time Formats
export const TIME_FORMAT = {
  shortTime: "HH:mm",
  longTime: "HH:mm:ss",
  shortDate: "MMM dd",
  longDate: "MMMM dd, yyyy",
  datetime: "MMM dd, HH:mm",
} as const;

// Toast Messages
export const TOAST_MESSAGES = {
  loginSuccess: "Login successful! Redirecting...",
  loginError: "Login failed. Please check your credentials.",
  logoutSuccess: "Logged out successfully",
  fetchError: "Failed to fetch data. Please try again.",
  networkError: "Network error. Please check your connection.",
} as const;

// Routes
export const ROUTES = {
  home: "/",
  login: "/login",
  dashboard: "/dashboard",
  entries: "/dashboard/entries",
} as const;

// Test Credentials
export const TEST_CREDENTIALS = {
  email: "test@test.com",
  password: "1234567890",
} as const;

// Socket Events
export const SOCKET_EVENTS = {
  connect: "connect",
  disconnect: "disconnect",
  alert: "alert",
  liveOccupancy: "live_occupancy",
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  login: "/api/auth/login",
  dwellTime: "/api/analytics/dwell",
  footfall: "/api/analytics/footfall",
  occupancy: "/api/analytics/occupancy",
  demographics: "/api/analytics/demographics",
  entryExit: "/api/analytics/entry-exit",
} as const;
