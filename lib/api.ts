const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://hiring-dev.internal.kloudspot.com";

// ============ Types ============

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user?: {
    id: string;
    email: string;
    name?: string;
  };
}

export interface Site {
  id: string;
  siteId?: string;
  _id?: string;
  name: string;
  siteName?: string;
  title?: string;
  timezone: string;
  timeZone?: string;
  tz?: string;
}

export interface AnalyticsRequest {
  siteId: string;
  fromUtc: number;
  toUtc: number;
}

export interface EntryExitRequest extends AnalyticsRequest {
  pageNumber: number;
  pageSize: number;
}

export interface OccupancyData {
  liveOccupancy: number;
  previousOccupancy?: number;
  percentageChange?: number;
  timeseries?: Array<{
    time: string;
    timestamp?: number;
    occupancy: number;
    count?: number;
  }>;
}

export interface FootfallData {
  totalFootfall: number;
  previousFootfall?: number;
  percentageChange?: number;
}

export interface DwellData {
  averageDwellTime: number;
  averageDwellTimeFormatted?: string;
  previousDwellTime?: number;
  percentageChange?: number;
}

export interface DemographicsData {
  male: number;
  female: number;
  malePercentage?: number;
  femalePercentage?: number;
  timeseries?: Array<{
    time: string;
    timestamp?: number;
    male: number;
    female: number;
  }>;
}

export interface EntryExitRecord {
  id: string;
  name: string;
  sex: "Male" | "Female";
  gender?: "Male" | "Female";
  entry: string;
  entryTime?: string;
  exit: string | null;
  exitTime?: string | null;
  dwellTime: string | null;
  avatar?: string;
  imageUrl?: string;
}

export interface EntryExitResponse {
  data: EntryExitRecord[];
  records?: EntryExitRecord[];
  totalCount: number;
  total?: number;
  pageNumber: number;
  page?: number;
  pageSize: number;
  limit?: number;
  totalPages: number;
}

export interface ApiError {
  message?: string;
  errorMessage?: string;
  error?: string;
  status?: number;
}

// User-friendly error messages based on HTTP status codes
const HTTP_ERROR_MESSAGES: Record<number, string> = {
  400: "Invalid request. Please check your input.",
  401: "Session expired. Please log in again.",
  403: "You don't have permission to access this resource.",
  404: "The requested resource was not found.",
  422: "Invalid data provided. Please check your input.",
  429: "Too many requests. Please wait a moment and try again.",
  500: "Server error. Please try again later.",
  502: "Service temporarily unavailable. Please try again.",
  503: "Service is currently unavailable. Please try again later.",
  504: "Request timed out. Please try again.",
};

// ============ API Client ============

class ApiClient {
  private getToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("auth_token");
    }
    return null;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken();

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    };

    let response: Response;
    try {
      response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });
    } catch {
      // Network error (no internet, DNS failure, CORS, etc.)
      throw new Error("Unable to connect to server. Please check your internet connection.");
    }

    const text = await response.text();
    let data: T;

    try {
      data = JSON.parse(text);
    } catch {
      // Non-JSON response
      if (!response.ok) {
        throw new Error(HTTP_ERROR_MESSAGES[response.status] || `Server error (${response.status})`);
      }
      throw new Error("Received invalid response from server.");
    }

    if (!response.ok) {
      const error = data as unknown as ApiError;
      // Check all possible error message fields from API
      const apiMessage = error.errorMessage || error.message || error.error;

      if (apiMessage) {
        throw new Error(apiMessage);
      }

      // Fall back to user-friendly HTTP status message
      throw new Error(HTTP_ERROR_MESSAGES[response.status] || `Request failed (${response.status})`);
    }

    return data;
  }

  // Auth
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    return this.request<LoginResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  }

  // Sites
  async getSites(): Promise<Site[]> {
    const response = await this.request<Site[] | { data: Site[] }>("/api/sites");
    return Array.isArray(response) ? response : response.data || [];
  }

  // Analytics
  async getOccupancy(params: AnalyticsRequest): Promise<OccupancyData> {
    return this.request<OccupancyData>("/api/analytics/occupancy", {
      method: "POST",
      body: JSON.stringify(params),
    });
  }

  async getFootfall(params: AnalyticsRequest): Promise<FootfallData> {
    return this.request<FootfallData>("/api/analytics/footfall", {
      method: "POST",
      body: JSON.stringify(params),
    });
  }

  async getDwell(params: AnalyticsRequest): Promise<DwellData> {
    return this.request<DwellData>("/api/analytics/dwell", {
      method: "POST",
      body: JSON.stringify(params),
    });
  }

  async getDemographics(params: AnalyticsRequest): Promise<DemographicsData> {
    return this.request<DemographicsData>("/api/analytics/demographics", {
      method: "POST",
      body: JSON.stringify(params),
    });
  }

  async getEntryExit(params: EntryExitRequest): Promise<EntryExitResponse> {
    return this.request<EntryExitResponse>("/api/analytics/entry-exit", {
      method: "POST",
      body: JSON.stringify(params),
    });
  }
}

export const api = new ApiClient();

// ============ Utility Functions ============

/**
 * Get the start and end of day in UTC milliseconds for a given timezone
 * This correctly handles timezone offsets for accurate day boundaries
 */
export function getZonedDayRangeUtcMillis(
  timezone: string,
  anchorDate: Date = new Date()
): { startUtc: number; endUtc: number } {
  // Get the date parts in the target timezone
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(anchorDate);

  const year = parts.find((p) => p.type === "year")?.value || "2024";
  const month = parts.find((p) => p.type === "month")?.value || "01";
  const day = parts.find((p) => p.type === "day")?.value || "01";

  // Start as if it were UTC midnight for that calendar day
  const startGuessUtc = new Date(`${year}-${month}-${day}T00:00:00.000Z`);

  // Find what time that instant is in the timezone, then compute offset
  const tzParts = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(startGuessUtc);

  const hh = +(tzParts.find((p) => p.type === "hour")?.value || "0");
  const mm = +(tzParts.find((p) => p.type === "minute")?.value || "0");
  const ss = +(tzParts.find((p) => p.type === "second")?.value || "0");

  // Calculate offset
  const deltaMs = (hh * 3600 + mm * 60 + ss) * 1000;

  const startUtc = startGuessUtc.getTime() - deltaMs;
  const endUtc = startUtc + 24 * 60 * 60 * 1000 - 1;

  return { startUtc, endUtc };
}

/**
 * Format milliseconds dwell time to readable format
 */
export function formatDwellTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    const remainingMins = minutes % 60;
    return `${hours}h ${remainingMins}m`;
  }

  return `${String(minutes).padStart(2, "0")}min ${String(seconds).padStart(2, "0")}sec`;
}

/**
 * Get site ID from site object (handles different field names)
 */
export function getSiteId(site: Site): string {
  return site.siteId || site.id || site._id || "";
}

/**
 * Get site name from site object (handles different field names)
 */
export function getSiteName(site: Site): string {
  return site.name || site.siteName || site.title || getSiteId(site);
}

/**
 * Get timezone from site object (handles different field names)
 */
export function getSiteTimezone(site: Site): string {
  return site.timezone || site.timeZone || site.tz || "UTC";
}
