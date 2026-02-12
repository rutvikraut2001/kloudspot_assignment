import {
  STATIC_USER,
  STATIC_LOGIN_RESPONSE,
  STATIC_SITES,
  STATIC_OCCUPANCY,
  STATIC_FOOTFALL,
  STATIC_DWELL,
  STATIC_DEMOGRAPHICS,
  getStaticEntryExitPage,
} from "./static-data";

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

// ============ API Client (Static Data Mode) ============

class ApiClient {
  // Simulate small network delay for realistic UX
  private delay(ms = 300): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Auth - only accepts test@test.com / test@123
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    await this.delay(500);

    if (
      credentials.email === STATIC_USER.email &&
      credentials.password === STATIC_USER.password
    ) {
      return STATIC_LOGIN_RESPONSE;
    }

    throw new Error("Invalid email or password.");
  }

  // Sites
  async getSites(): Promise<Site[]> {
    await this.delay();
    return STATIC_SITES as Site[];
  }

  // Analytics
  async getOccupancy(_params: AnalyticsRequest): Promise<OccupancyData> {
    await this.delay(400);
    return STATIC_OCCUPANCY as unknown as OccupancyData;
  }

  async getFootfall(_params: AnalyticsRequest): Promise<FootfallData> {
    await this.delay(250);
    return STATIC_FOOTFALL as unknown as FootfallData;
  }

  async getDwell(_params: AnalyticsRequest): Promise<DwellData> {
    await this.delay(350);
    return STATIC_DWELL as unknown as DwellData;
  }

  async getDemographics(_params: AnalyticsRequest): Promise<DemographicsData> {
    await this.delay(450);
    return STATIC_DEMOGRAPHICS as unknown as DemographicsData;
  }

  async getEntryExit(params: EntryExitRequest): Promise<EntryExitResponse> {
    await this.delay(400);
    return getStaticEntryExitPage(
      params.pageNumber,
      params.pageSize
    ) as unknown as EntryExitResponse;
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
