export interface User {
  id: string;
  email: string;
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  token: string;
  user: {
    id: string;
    email: string;
  };
}

export interface OccupancyData {
  current: number;
  percentageChange: number;
  timestamp: string;
}

export interface FootfallData {
  count: number;
  percentageChange: number;
  date: string;
}

export interface DwellTimeData {
  averageSeconds: number;
  percentageChange: number;
  formatted: string;
}

export interface OccupancyTimeseriesPoint {
  time: string;
  count: number;
}

export interface DemographicsData {
  male: number;
  female: number;
  malePercentage: number;
  femalePercentage: number;
}

export interface DemographicsTimeseriesPoint {
  time: string;
  male: number;
  female: number;
}

export interface EntryExitRecord {
  id: string;
  name: string;
  gender: "Male" | "Female";
  entryTime: string;
  exitTime: string | null;
  dwellTimeSeconds: number;
  avatar?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface SocketAlert {
  action: "entry" | "exit";
  zone: string;
  site: string;
  severity: "low" | "medium" | "high";
  timestamp: string;
}

export interface SocketLiveOccupancy {
  zone: string;
  count: number;
  timestamp: string;
}
