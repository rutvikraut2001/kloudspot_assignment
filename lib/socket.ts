import { generateRandomAlert, generateRandomOccupancy } from "./static-data";

export interface AlertEvent {
  action: "entry" | "exit";
  zone: string;
  site: string;
  siteId: string;
  severity: string;
  timestamp: number;
  message?: string;
}

export interface LiveOccupancyEvent {
  siteId: string;
  zone?: string;
  floor?: string;
  occupancy: number;
  count?: number;
  timestamp: number;
}

type AlertCallback = (data: AlertEvent) => void;
type LiveOccupancyCallback = (data: LiveOccupancyEvent) => void;

class SocketService {
  private alertCallbacks: Set<AlertCallback> = new Set();
  private liveOccupancyCallbacks: Set<LiveOccupancyCallback> = new Set();
  private alertInterval: ReturnType<typeof setInterval> | null = null;
  private occupancyInterval: ReturnType<typeof setInterval> | null = null;
  private connected = false;

  /**
   * Start simulated socket events
   */
  connect(): void {
    if (this.connected) return;
    this.connected = true;

    // Simulate alert events every 8-15 seconds
    this.alertInterval = setInterval(() => {
      const alert = generateRandomAlert("site-001", "KloudSpot HQ - Main Building");
      this.alertCallbacks.forEach((cb) => cb(alert as AlertEvent));
    }, 8000 + Math.random() * 7000);

    // Simulate live occupancy updates every 5 seconds
    this.occupancyInterval = setInterval(() => {
      const occupancy = generateRandomOccupancy("site-001", 142);
      this.liveOccupancyCallbacks.forEach((cb) => cb(occupancy as LiveOccupancyEvent));
    }, 5000);
  }

  /**
   * Stop simulated events
   */
  disconnect(): void {
    if (this.alertInterval) {
      clearInterval(this.alertInterval);
      this.alertInterval = null;
    }
    if (this.occupancyInterval) {
      clearInterval(this.occupancyInterval);
      this.occupancyInterval = null;
    }
    this.connected = false;
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.connected;
  }

  /**
   * Subscribe to alert events
   */
  onAlert(callback: AlertCallback): () => void {
    this.alertCallbacks.add(callback);
    return () => {
      this.alertCallbacks.delete(callback);
    };
  }

  /**
   * Subscribe to live occupancy events
   */
  onLiveOccupancy(callback: LiveOccupancyCallback): () => void {
    this.liveOccupancyCallbacks.add(callback);
    return () => {
      this.liveOccupancyCallbacks.delete(callback);
    };
  }

  /**
   * Remove all callbacks
   */
  clearCallbacks(): void {
    this.alertCallbacks.clear();
    this.liveOccupancyCallbacks.clear();
  }
}

// Export singleton instance
export const socketService = new SocketService();
