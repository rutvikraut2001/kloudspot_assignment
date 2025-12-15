import { io, Socket } from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "https://hiring-dev.internal.kloudspot.com";

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
  private socket: Socket | null = null;
  private alertCallbacks: Set<AlertCallback> = new Set();
  private liveOccupancyCallbacks: Set<LiveOccupancyCallback> = new Set();
  private isConnecting = false;

  /**
   * Connect to the Socket.IO server
   */
  connect(): void {
    if (this.socket?.connected || this.isConnecting) {
      return;
    }

    this.isConnecting = true;

    try {
      this.socket = io(SOCKET_URL, {
        transports: ["websocket"],
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      this.socket.on("connect", () => {
        this.isConnecting = false;
      });

      this.socket.on("disconnect", () => {
        // Disconnected from server
      });

      this.socket.on("connect_error", () => {
        this.isConnecting = false;
      });

      // Listen for alert events
      this.socket.on("alert", (data: AlertEvent) => {
        this.alertCallbacks.forEach((callback) => callback(data));
      });

      // Listen for live occupancy events
      this.socket.on("live_occupancy", (data: LiveOccupancyEvent) => {
        this.liveOccupancyCallbacks.forEach((callback) => callback(data));
      });
    } catch {
      this.isConnecting = false;
    }
  }

  /**
   * Disconnect from the Socket.IO server
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.socket?.connected ?? false;
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
