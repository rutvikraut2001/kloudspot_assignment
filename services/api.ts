import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://hiring-dev.internal.kloudspot.com";

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          this.clearToken();
          if (typeof window !== "undefined") {
            window.location.href = "/login";
          }
        }
        return Promise.reject(error);
      }
    );
  }

  private getToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("auth_token");
    }
    return null;
  }

  private clearToken(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user");
    }
  }

  // Auth endpoints
  async login(email: string, password: string) {
    const response = await this.api.post("/api/auth/login", { email, password });
    return response.data;
  }

  async logout() {
    this.clearToken();
  }

  // Analytics endpoints
  async getDwellTime(filters?: any) {
    const response = await this.api.post("/api/analytics/dwell", filters || {});
    return response.data;
  }

  async getFootfall(filters?: any) {
    const response = await this.api.post("/api/analytics/footfall", filters || {});
    return response.data;
  }

  async getOccupancy(filters?: any) {
    const response = await this.api.post("/api/analytics/occupancy", filters || {});
    return response.data;
  }

  async getDemographics(filters?: any) {
    const response = await this.api.post("/api/analytics/demographics", filters || {});
    return response.data;
  }

  async getEntryExit(page: number = 1, limit: number = 10, filters?: any) {
    const response = await this.api.post("/api/analytics/entry-exit", {
      page,
      limit,
      ...filters,
    });
    return response.data;
  }
}

export const apiService = new ApiService();
export default apiService;
